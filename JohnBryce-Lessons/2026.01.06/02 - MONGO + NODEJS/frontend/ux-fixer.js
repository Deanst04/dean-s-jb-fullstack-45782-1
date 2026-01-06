#!/usr/bin/env node

/**
 * UX Fixer System
 * Reads UX audit reports and applies fixes using AI-recommended changes.
 * Part of the autonomous UX evolution loop.
 *
 * SAFETY: Creates backups before any modifications.
 * SCOPE: Only touches UI/UX layers, never business logic.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(PROJECT_ROOT, 'ai-loop.config.json');
const DEFAULT_REPORT_PATH = path.join(PROJECT_ROOT, 'ux_report.md');
const DEFAULT_FIXES_OUTPUT = path.join(__dirname, 'ux_fixes_applied.md');
const BACKUP_DIR = path.join(__dirname, '.ux-backups');

// Load configuration
let config = {};
try {
  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
} catch (e) {
  console.warn('Warning: Could not load config, using defaults');
}

// CLI Arguments
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const SKIP_BACKUP = process.argv.includes('--skip-backup');
const REPORT_PATH = getArgValue('--report') || DEFAULT_REPORT_PATH;
const OUTPUT_PATH = getArgValue('--output') || DEFAULT_FIXES_OUTPUT;

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return null;
}

// Logging utilities
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logStep(msg) {
  console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`);
}

function logSuccess(msg) {
  console.log(`${colors.green}[OK]${colors.reset} ${msg}`);
}

function logWarn(msg) {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`);
}

function logError(msg) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`);
}

function logVerbose(msg) {
  if (VERBOSE) {
    console.log(`${colors.gray}[DEBUG]${colors.reset} ${msg}`);
  }
}

/**
 * Ensure backup directory exists
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logVerbose(`Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Create a backup of a file before modification
 */
function createBackup(filePath) {
  if (SKIP_BACKUP) {
    logVerbose(`Skipping backup for: ${filePath}`);
    return null;
  }

  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${timestamp}_${fileName}`);

  try {
    fs.copyFileSync(filePath, backupPath);
    logVerbose(`Backup created: ${backupPath}`);
    return backupPath;
  } catch (e) {
    logWarn(`Could not create backup for ${filePath}: ${e.message}`);
    return null;
  }
}

/**
 * Check if a path is allowed to be modified
 */
function isPathAllowed(filePath) {
  const allowedPaths = config.allowedPaths || {};
  const excluded = allowedPaths.excluded || [];

  // Normalize path for comparison
  const normalizedPath = filePath.replace(PROJECT_ROOT, '').replace(/^\//, '');

  // Check exclusions first
  for (const pattern of excluded) {
    if (matchGlob(normalizedPath, pattern)) {
      logVerbose(`Path excluded by config: ${normalizedPath}`);
      return false;
    }
  }

  // Check allowed patterns
  const allAllowed = [
    ...(allowedPaths.components || []),
    ...(allowedPaths.styles || []),
    ...(allowedPaths.templates || []),
  ];

  if (allAllowed.length === 0) {
    return true; // No restrictions if not configured
  }

  for (const pattern of allAllowed) {
    if (matchGlob(normalizedPath, pattern)) {
      return true;
    }
  }

  logVerbose(`Path not in allowed list: ${normalizedPath}`);
  return false;
}

/**
 * Simple glob pattern matching
 */
function matchGlob(filePath, pattern) {
  const regexPattern = pattern
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{GLOBSTAR}}/g, '.*')
    .replace(/\//g, '\\/');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

/**
 * Parse the UX report and extract issues with recommendations
 */
function parseUxReport(reportPath) {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`UX report not found: ${reportPath}`);
  }

  const content = fs.readFileSync(reportPath, 'utf-8');
  const issues = [];

  // Extract metrics table for analysis
  const metricsMatch = content.match(/\| Page \| Viewport \|([\s\S]*?)\n\n/);
  const metrics = [];
  if (metricsMatch) {
    const rows = metricsMatch[1].trim().split('\n').slice(1); // Skip header separator
    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(c => c);
      if (cols.length >= 6) {
        metrics.push({
          page: cols[0],
          viewport: cols[1],
          domSize: parseInt(cols[2]) || 0,
          lcp: parseInt(cols[3]) || 0,
          fcp: parseInt(cols[4]) || 0,
          cls: parseFloat(cols[5]) || 0,
          tti: parseInt(cols[6]) || 0,
          jsSize: parseInt(cols[7]) || 0,
        });
      }
    }
  }

  // Parse issue sections
  const issueBlocks = content.split(/## \d+\. /);
  for (let i = 1; i < issueBlocks.length; i++) {
    const block = issueBlocks[i];
    const lines = block.split('\n');

    // Extract severity
    let severity = 'Medium';
    const severityMatch = block.match(/\*\*(Critical|High|Medium|Low)\*\*/i);
    if (severityMatch) {
      severity = severityMatch[1];
    }

    // Extract title
    const title = lines[0].replace(/:/g, '').trim();

    // Extract affected page/component
    let affectedPage = '';
    const pageMatch = block.match(/\*\*Page\*\*:\s*`?([^`\n]+)`?/);
    if (pageMatch) {
      affectedPage = pageMatch[1].trim();
    }

    // Extract code blocks for fixes
    const codeBlocks = [];
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let codeMatch;
    while ((codeMatch = codeRegex.exec(block)) !== null) {
      codeBlocks.push({
        language: codeMatch[1] || 'unknown',
        code: codeMatch[2].trim(),
      });
    }

    // Determine fix type
    let fixType = determineFixType(title, block);

    issues.push({
      title,
      severity,
      affectedPage,
      codeBlocks,
      fixType,
      rawContent: block,
    });
  }

  return { issues, metrics };
}

/**
 * Determine the type of fix based on issue content
 */
function determineFixType(title, content) {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  if (titleLower.includes('virtual') || contentLower.includes('cdk-virtual-scroll')) {
    return 'virtualScroll';
  }
  if (titleLower.includes('cls') || contentLower.includes('layout shift')) {
    return 'clsStabilization';
  }
  if (titleLower.includes('skeleton') || contentLower.includes('loading state')) {
    return 'skeletonLoader';
  }
  if (titleLower.includes('glassmorphism') || contentLower.includes('backdrop-blur')) {
    return 'glassmorphism';
  }
  if (titleLower.includes('touch') || contentLower.includes('44px')) {
    return 'touchTargets';
  }
  if (titleLower.includes('animation') || contentLower.includes('transition')) {
    return 'animations';
  }
  if (titleLower.includes('performance') || titleLower.includes('onpush')) {
    return 'performance';
  }
  if (titleLower.includes('contrast') || titleLower.includes('accessibility')) {
    return 'accessibility';
  }
  if (titleLower.includes('responsive') || titleLower.includes('mobile')) {
    return 'responsive';
  }

  return 'general';
}

/**
 * Apply fixes based on parsed issues
 */
async function applyFixes(issues, metrics) {
  const appliedFixes = [];
  const fixesConfig = config.fixes || {};

  for (const issue of issues) {
    logStep(`Processing: ${issue.title} (${issue.severity})`);

    // Check if this fix type is enabled
    const fixTypeConfig = fixesConfig[issue.fixType];
    if (fixTypeConfig && fixTypeConfig.enabled === false) {
      logWarn(`Fix type '${issue.fixType}' is disabled in config, skipping`);
      continue;
    }

    try {
      let result;
      switch (issue.fixType) {
        case 'virtualScroll':
          result = await applyVirtualScrollFix(issue, metrics);
          break;
        case 'clsStabilization':
          result = await applyClsFix(issue);
          break;
        case 'skeletonLoader':
          result = await applySkeletonLoaderFix(issue);
          break;
        case 'glassmorphism':
          result = await applyGlassmorphismFix(issue);
          break;
        case 'touchTargets':
          result = await applyTouchTargetFix(issue);
          break;
        case 'animations':
          result = await applyAnimationFix(issue);
          break;
        case 'performance':
          result = await applyPerformanceFix(issue);
          break;
        default:
          result = await applyGeneralFix(issue);
      }

      if (result && result.applied) {
        appliedFixes.push({
          ...issue,
          ...result,
        });
        logSuccess(`Applied: ${issue.title}`);
      } else {
        logWarn(`Could not apply: ${issue.title} - ${result?.reason || 'Unknown reason'}`);
      }
    } catch (e) {
      logError(`Failed to apply ${issue.title}: ${e.message}`);
      logVerbose(e.stack);
    }
  }

  return appliedFixes;
}

/**
 * Apply virtual scroll fix for large DOM issues
 */
async function applyVirtualScrollFix(issue, metrics) {
  // Find pages with high DOM count
  const highDomPages = metrics.filter(m => m.domSize > (config.thresholds?.maxDomNodes || 1500));

  if (highDomPages.length === 0) {
    return { applied: false, reason: 'No pages exceed DOM threshold' };
  }

  // Target the product list component for virtual scroll
  const productListPath = path.join(__dirname, 'src/app/features/products/product-list/product-list.component.ts');

  if (!fs.existsSync(productListPath)) {
    return { applied: false, reason: 'Product list component not found' };
  }

  if (!isPathAllowed(productListPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(productListPath, 'utf-8');

  // Check if already using virtual scroll
  if (content.includes('cdk-virtual-scroll-viewport') || content.includes('ScrollingModule')) {
    return { applied: false, reason: 'Virtual scroll already implemented' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: productListPath, changes: ['Would add virtual scroll'] };
  }

  createBackup(productListPath);

  // Apply virtual scroll modifications
  let modifiedContent = content;

  // Add ScrollingModule import if not present
  if (!modifiedContent.includes('ScrollingModule')) {
    modifiedContent = modifiedContent.replace(
      /(import.*from\s+['"]@angular\/core['"];?)/,
      `$1\nimport { ScrollingModule } from '@angular/cdk/scrolling';`
    );
  }

  // Add to imports array
  if (!modifiedContent.includes('ScrollingModule') || !modifiedContent.match(/imports:\s*\[[\s\S]*ScrollingModule/)) {
    modifiedContent = modifiedContent.replace(
      /imports:\s*\[/,
      'imports: [\n    ScrollingModule,'
    );
  }

  // Add trackBy function if not present
  if (!modifiedContent.includes('trackByProductId')) {
    const trackByFunc = `
  trackByProductId(index: number, product: any): string {
    return product._id || product.id || index.toString();
  }`;

    // Insert before the last closing brace of the class
    const lastBraceIdx = modifiedContent.lastIndexOf('}');
    modifiedContent = modifiedContent.slice(0, lastBraceIdx) + trackByFunc + '\n' + modifiedContent.slice(lastBraceIdx);
  }

  // Add OnPush change detection
  if (!modifiedContent.includes('ChangeDetectionStrategy.OnPush')) {
    modifiedContent = modifiedContent.replace(
      /changeDetection:\s*ChangeDetectionStrategy\.\w+/,
      'changeDetection: ChangeDetectionStrategy.OnPush'
    );
    if (!modifiedContent.includes('changeDetection:')) {
      modifiedContent = modifiedContent.replace(
        /@Component\(\{/,
        '@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,'
      );
    }
  }

  fs.writeFileSync(productListPath, modifiedContent);

  return {
    applied: true,
    file: productListPath,
    changes: [
      'Added ScrollingModule import',
      'Added trackByProductId function',
      'Enabled OnPush change detection',
    ],
  };
}

/**
 * Apply CLS stabilization fixes
 */
async function applyClsFix(issue) {
  // Add min-height utilities to prevent layout shifts
  const stylesPath = path.join(__dirname, 'src/styles.css');

  if (!fs.existsSync(stylesPath)) {
    return { applied: false, reason: 'Global styles file not found' };
  }

  if (!isPathAllowed(stylesPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(stylesPath, 'utf-8');

  // Check if CLS utilities already exist
  if (content.includes('.cls-stable')) {
    return { applied: false, reason: 'CLS utilities already exist' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: stylesPath, changes: ['Would add CLS stabilization utilities'] };
  }

  createBackup(stylesPath);

  const clsUtilities = `
/* CLS Stabilization Utilities */
.cls-stable-header { @apply min-h-[72px]; }
.cls-stable-card { @apply min-h-[280px]; }
.cls-stable-button { @apply min-h-[44px]; }
.cls-stable-input { @apply min-h-[44px]; }
.cls-stable-text { @apply min-h-[24px]; }
.cls-stable-image { @apply aspect-[4/3]; }
.cls-stable-icon { @apply aspect-square w-10 h-10; }

/* Reserved space for async content */
.cls-reserve-sm { @apply min-h-[100px]; }
.cls-reserve-md { @apply min-h-[200px]; }
.cls-reserve-lg { @apply min-h-[400px]; }

`;

  const modifiedContent = content + clsUtilities;
  fs.writeFileSync(stylesPath, modifiedContent);

  return {
    applied: true,
    file: stylesPath,
    changes: ['Added CLS stabilization utility classes'],
  };
}

/**
 * Apply skeleton loader utilities
 */
async function applySkeletonLoaderFix(issue) {
  const stylesPath = path.join(__dirname, 'src/styles.css');

  if (!fs.existsSync(stylesPath)) {
    return { applied: false, reason: 'Global styles file not found' };
  }

  if (!isPathAllowed(stylesPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(stylesPath, 'utf-8');

  if (content.includes('.skeleton-base')) {
    return { applied: false, reason: 'Skeleton utilities already exist' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: stylesPath, changes: ['Would add skeleton loader utilities'] };
  }

  createBackup(stylesPath);

  const skeletonUtilities = `
/* Skeleton Loader Utilities */
.skeleton-base {
  @apply animate-pulse bg-slate-300/20 rounded;
}
.skeleton-text { @apply skeleton-base h-4 w-3/4; }
.skeleton-text-sm { @apply skeleton-base h-3 w-1/2; }
.skeleton-title { @apply skeleton-base h-6 w-2/3; }
.skeleton-image { @apply skeleton-base w-full aspect-[4/3]; }
.skeleton-avatar { @apply skeleton-base w-10 h-10 rounded-full; }
.skeleton-button { @apply skeleton-base h-10 w-24; }
.skeleton-card {
  @apply glass-card p-6;
}
.skeleton-card-content {
  @apply space-y-3;
}

`;

  const modifiedContent = content + skeletonUtilities;
  fs.writeFileSync(stylesPath, modifiedContent);

  return {
    applied: true,
    file: stylesPath,
    changes: ['Added skeleton loader utility classes'],
  };
}

/**
 * Apply glassmorphism normalization
 */
async function applyGlassmorphismFix(issue) {
  const stylesPath = path.join(__dirname, 'src/styles.css');

  if (!fs.existsSync(stylesPath)) {
    return { applied: false, reason: 'Global styles file not found' };
  }

  if (!isPathAllowed(stylesPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(stylesPath, 'utf-8');

  // Check for existing glass utilities (basic check)
  const hasGlassCard = content.includes('.glass-card');
  const hasGlassInput = content.includes('.glass-input');
  const hasGlassButton = content.includes('.glass-button');

  if (hasGlassCard && hasGlassInput && hasGlassButton) {
    return { applied: false, reason: 'Glassmorphism utilities already exist' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: stylesPath, changes: ['Would add glassmorphism utilities'] };
  }

  createBackup(stylesPath);

  const glassUtilities = `
/* Glassmorphism Standardized Utilities */
.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}
.glass-dark {
  @apply bg-black/20 backdrop-blur-md border border-white/10;
}
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl;
  @apply transition-all duration-300 ease-out;
}
.glass-card-hover {
  @apply glass-card hover:bg-white/20 hover:border-white/30;
  @apply hover:shadow-lg hover:shadow-purple-500/10;
  @apply hover:-translate-y-1;
}
.glass-button {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-lg;
  @apply min-h-[44px] px-4 py-2;
  @apply transition-all duration-200;
  @apply hover:bg-white/20 active:scale-95;
  @apply touch-manipulation;
}
.glass-input {
  @apply bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg;
  @apply min-h-[44px] px-4 py-2;
  @apply focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20;
  @apply transition-all duration-200;
}

`;

  // Append only missing utilities
  let newUtilities = '';
  if (!hasGlassCard) newUtilities += glassUtilities;

  if (newUtilities) {
    fs.writeFileSync(stylesPath, content + newUtilities);
  }

  return {
    applied: true,
    file: stylesPath,
    changes: ['Added standardized glassmorphism utilities'],
  };
}

/**
 * Apply touch target normalization (44px minimum)
 */
async function applyTouchTargetFix(issue) {
  const stylesPath = path.join(__dirname, 'src/styles.css');

  if (!fs.existsSync(stylesPath)) {
    return { applied: false, reason: 'Global styles file not found' };
  }

  if (!isPathAllowed(stylesPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(stylesPath, 'utf-8');

  if (content.includes('.touch-target')) {
    return { applied: false, reason: 'Touch target utilities already exist' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: stylesPath, changes: ['Would add touch target utilities'] };
  }

  createBackup(stylesPath);

  const touchUtilities = `
/* Touch Target Utilities (WCAG 2.5.5 compliant - 44px minimum) */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
  @apply touch-manipulation;
}
.touch-target-sm {
  @apply min-h-[44px] min-w-[44px];
}
.touch-target-md {
  @apply min-h-[48px] min-w-[48px];
}
.touch-target-lg {
  @apply min-h-[56px] min-w-[56px];
}

/* Interactive element base */
.interactive {
  @apply touch-target cursor-pointer;
  @apply transition-all duration-200;
  @apply active:scale-95;
}

`;

  const modifiedContent = content + touchUtilities;
  fs.writeFileSync(stylesPath, modifiedContent);

  return {
    applied: true,
    file: stylesPath,
    changes: ['Added touch target utility classes (44px minimum)'],
  };
}

/**
 * Apply animation utilities
 */
async function applyAnimationFix(issue) {
  const stylesPath = path.join(__dirname, 'src/styles.css');

  if (!fs.existsSync(stylesPath)) {
    return { applied: false, reason: 'Global styles file not found' };
  }

  if (!isPathAllowed(stylesPath)) {
    return { applied: false, reason: 'Path not allowed by config' };
  }

  const content = fs.readFileSync(stylesPath, 'utf-8');

  if (content.includes('@keyframes fadeInUp')) {
    return { applied: false, reason: 'Animation utilities already exist' };
  }

  if (DRY_RUN) {
    return { applied: true, dryRun: true, file: stylesPath, changes: ['Would add animation utilities'] };
  }

  createBackup(stylesPath);

  const animationUtilities = `
/* Animation Keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Animation Utility Classes */
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
.animate-fade-in-down { animation: fadeInDown 0.4s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Stagger Animation Delays */
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-400 { animation-delay: 400ms; }
.animate-delay-500 { animation-delay: 500ms; }

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-in-up,
  .animate-fade-in-down,
  .animate-scale-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

`;

  const modifiedContent = content + animationUtilities;
  fs.writeFileSync(stylesPath, modifiedContent);

  return {
    applied: true,
    file: stylesPath,
    changes: ['Added animation keyframes and utility classes'],
  };
}

/**
 * Apply performance optimizations (trackBy, OnPush)
 */
async function applyPerformanceFix(issue) {
  const changes = [];

  // Find components that might need OnPush
  const componentPaths = [
    'src/app/features/products/product-card/product-card.component.ts',
    'src/app/pages/dashboard/dashboard.component.ts',
  ];

  for (const relativePath of componentPaths) {
    const fullPath = path.join(__dirname, relativePath);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    if (!isPathAllowed(fullPath)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    if (content.includes('ChangeDetectionStrategy.OnPush')) {
      continue; // Already has OnPush
    }

    if (DRY_RUN) {
      changes.push(`Would add OnPush to ${relativePath}`);
      continue;
    }

    createBackup(fullPath);

    let modifiedContent = content;

    // Add ChangeDetectionStrategy import if needed
    if (!modifiedContent.includes('ChangeDetectionStrategy')) {
      modifiedContent = modifiedContent.replace(
        /from\s+['"]@angular\/core['"]/,
        `from '@angular/core'`
      );
      modifiedContent = modifiedContent.replace(
        /import\s*\{([^}]+)\}\s*from\s+['"]@angular\/core['"]/,
        (match, imports) => {
          if (!imports.includes('ChangeDetectionStrategy')) {
            return `import { ${imports.trim()}, ChangeDetectionStrategy } from '@angular/core'`;
          }
          return match;
        }
      );
    }

    // Add changeDetection to @Component decorator
    modifiedContent = modifiedContent.replace(
      /@Component\(\{([^}]*?)(\n\s*}\))/s,
      (match, content, closing) => {
        if (!content.includes('changeDetection')) {
          return `@Component({${content},\n  changeDetection: ChangeDetectionStrategy.OnPush${closing}`;
        }
        return match;
      }
    );

    fs.writeFileSync(fullPath, modifiedContent);
    changes.push(`Added OnPush to ${relativePath}`);
  }

  if (changes.length === 0) {
    return { applied: false, reason: 'No components need OnPush optimization' };
  }

  return {
    applied: true,
    files: componentPaths,
    changes,
  };
}

/**
 * Apply general fixes using AI-provided code blocks
 */
async function applyGeneralFix(issue) {
  // For general fixes, we rely on the code blocks from the AI analysis
  if (issue.codeBlocks.length === 0) {
    return { applied: false, reason: 'No code blocks found for general fix' };
  }

  // Log the recommendation for manual review
  logWarn(`General fix requires manual review: ${issue.title}`);
  logVerbose(`Code blocks available: ${issue.codeBlocks.length}`);

  return {
    applied: false,
    reason: 'General fixes require manual implementation',
    codeBlocks: issue.codeBlocks,
  };
}

/**
 * Generate the fixes applied report
 */
function generateFixesReport(appliedFixes, startTime) {
  const endTime = new Date();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Count by severity
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const fix of appliedFixes) {
    if (severityCounts.hasOwnProperty(fix.severity)) {
      severityCounts[fix.severity]++;
    }
  }

  // Get unique files modified
  const filesModified = new Set();
  for (const fix of appliedFixes) {
    if (fix.file) filesModified.add(fix.file);
    if (fix.files) fix.files.forEach(f => filesModified.add(f));
  }

  let report = `# UX Fixes Applied
Generated: ${endTime.toISOString()}
Duration: ${duration}s
Mode: ${DRY_RUN ? 'DRY RUN (no changes made)' : 'LIVE'}

## Summary Statistics
- **Critical issues fixed**: ${severityCounts.Critical}
- **High issues fixed**: ${severityCounts.High}
- **Medium issues fixed**: ${severityCounts.Medium}
- **Low issues fixed**: ${severityCounts.Low}
- **Total fixes applied**: ${appliedFixes.length}
- **Files modified**: ${filesModified.size}

## Applied Fixes

`;

  for (let i = 0; i < appliedFixes.length; i++) {
    const fix = appliedFixes[i];
    report += `### ${i + 1}. ${fix.title}
**Severity**: ${fix.severity}
**Type**: ${fix.fixType}
${fix.file ? `**File**: \`${path.relative(PROJECT_ROOT, fix.file)}\`` : ''}
${fix.dryRun ? '**Status**: Would be applied (dry run)' : '**Status**: Applied'}

**Changes**:
${fix.changes ? fix.changes.map(c => `- ${c}`).join('\n') : '- Applied fix'}

---

`;
  }

  report += `## Files Modified

| File | Status |
|------|--------|
${Array.from(filesModified).map(f => `| \`${path.relative(PROJECT_ROOT, f)}\` | Modified |`).join('\n')}

---

*Report generated by UX Fixer System*
*${DRY_RUN ? 'This was a dry run - no files were actually modified' : 'All fixes applied successfully'}*
`;

  return report;
}

/**
 * Verify build succeeds after fixes
 */
function verifyBuild() {
  logStep('Verifying build...');

  const buildConfig = config.build || {};
  const buildCmd = buildConfig.command || 'npm run build';
  const workingDir = path.join(PROJECT_ROOT, buildConfig.workingDir || 'frontend');

  try {
    const result = spawnSync('npm', ['run', 'build'], {
      cwd: workingDir,
      encoding: 'utf-8',
      timeout: buildConfig.timeout || 120000,
      shell: true,
    });

    if (result.status === 0) {
      logSuccess('Build succeeded');
      return { success: true };
    } else {
      logError('Build failed');
      logVerbose(result.stderr || result.stdout);
      return { success: false, error: result.stderr || result.stdout };
    }
  } catch (e) {
    logError(`Build error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Main execution
 */
async function main() {
  const startTime = new Date();

  console.log('\n' + '='.repeat(60));
  console.log(' UX FIXER SYSTEM');
  console.log('='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Report: ${REPORT_PATH}`);
  console.log(`Verbose: ${VERBOSE}`);
  console.log('='.repeat(60) + '\n');

  try {
    // Parse the UX report
    logStep('Parsing UX report...');
    const { issues, metrics } = parseUxReport(REPORT_PATH);
    logSuccess(`Found ${issues.length} issues to process`);

    // Log metrics summary
    if (VERBOSE && metrics.length > 0) {
      console.log('\nMetrics Summary:');
      for (const m of metrics) {
        console.log(`  ${m.page} (${m.viewport}): DOM=${m.domSize}, CLS=${m.cls}`);
      }
      console.log('');
    }

    // Apply fixes
    logStep('Applying fixes...');
    const appliedFixes = await applyFixes(issues, metrics);

    // Generate report
    logStep('Generating fixes report...');
    const report = generateFixesReport(appliedFixes, startTime);

    if (!DRY_RUN) {
      fs.writeFileSync(OUTPUT_PATH, report);
      logSuccess(`Report saved to: ${OUTPUT_PATH}`);
    } else {
      console.log('\n--- DRY RUN REPORT ---\n');
      console.log(report);
    }

    // Verify build (unless dry run)
    if (!DRY_RUN && appliedFixes.length > 0) {
      const buildResult = verifyBuild();
      if (!buildResult.success) {
        logError('Build verification failed. Check the errors above.');
        process.exit(1);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(' SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total issues processed: ${issues.length}`);
    console.log(`Fixes applied: ${appliedFixes.length}`);
    console.log(`Duration: ${((new Date() - startTime) / 1000).toFixed(2)}s`);
    console.log('='.repeat(60) + '\n');

    if (appliedFixes.length > 0) {
      logSuccess('UX fixes applied successfully!');
    } else {
      logWarn('No fixes were applied (all may already be in place)');
    }

  } catch (e) {
    logError(`Fatal error: ${e.message}`);
    logVerbose(e.stack);
    process.exit(1);
  }
}

// Run
main();
