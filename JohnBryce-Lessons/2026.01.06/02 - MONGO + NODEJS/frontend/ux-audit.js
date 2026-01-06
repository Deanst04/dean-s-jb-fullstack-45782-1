#!/usr/bin/env node

/**
 * UX Audit System
 * Captures screenshots and performance metrics from Angular application,
 * then sends them to Gemini for expert analysis.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Configuration
const BASE_URL = 'http://localhost:4200';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const HEADED_MODE = process.argv.includes('--headed');
const SKIP_GEMINI = process.argv.includes('--skip-gemini');

// Routes to audit
const ROUTES = [
  { path: '/', name: 'landing' },
  { path: '/login', name: 'login' },
  { path: '/app/dashboard', name: 'dashboard', requiresAuth: true },
  { path: '/app/products', name: 'products', requiresAuth: true },
  { path: '/app/products/1', name: 'product-detail', requiresAuth: true, dynamicId: true },
];

// Viewport configurations
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 375, height: 812 },
];

// Mock user for authentication
const MOCK_USER = {
  id: 'audit_user_001',
  name: 'Audit User',
  email: 'audit@example.com',
};
const MOCK_TOKEN = 'mock_token_audit_session';

/**
 * Ensure screenshots directory exists
 */
function ensureScreenshotsDir() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`✓ Created screenshots directory: ${SCREENSHOTS_DIR}`);
  }
}

/**
 * Set up authentication in the browser context
 */
async function setupAuthentication(context) {
  await context.addInitScript(() => {
    const mockUser = {
      id: 'audit_user_001',
      name: 'Audit User',
      email: 'audit@example.com',
    };
    localStorage.setItem('auth_token', 'mock_token_audit_session');
    localStorage.setItem('current_user', JSON.stringify(mockUser));
  });
}

/**
 * Collect Web Vitals and performance metrics from a page
 */
async function collectMetrics(page) {
  return await page.evaluate(async () => {
    const metrics = {
      cls: 0,
      lcp: 0,
      fcp: 0,
      ttfb: 0,
      tti: 0,
      domSize: 0,
      jsHeapSize: 0,
      totalJsSize: 0,
    };

    // DOM Size
    metrics.domSize = document.querySelectorAll('*').length;

    // Performance timing metrics
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries.length > 0) {
      const navTiming = perfEntries[0];
      metrics.ttfb = Math.round(navTiming.responseStart - navTiming.requestStart);
    }

    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      metrics.fcp = Math.round(fcpEntry.startTime);
    }

    // Largest Contentful Paint
    try {
      const lcpEntries = await new Promise((resolve) => {
        const entries = [];
        const observer = new PerformanceObserver((list) => {
          entries.push(...list.getEntries());
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(entries);
        }, 500);
      });
      if (lcpEntries.length > 0) {
        metrics.lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
      }
    } catch (e) {
      // LCP may not be available
    }

    // Cumulative Layout Shift
    try {
      const clsEntries = await new Promise((resolve) => {
        const entries = [];
        const observer = new PerformanceObserver((list) => {
          entries.push(...list.getEntries());
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(entries);
        }, 500);
      });
      metrics.cls = clsEntries
        .filter(entry => !entry.hadRecentInput)
        .reduce((sum, entry) => sum + entry.value, 0);
      metrics.cls = Math.round(metrics.cls * 1000) / 1000; // Round to 3 decimals
    } catch (e) {
      // CLS may not be available
    }

    // TTI approximation (time until page is interactive)
    const perfTiming = performance.timing || {};
    if (perfTiming.domInteractive) {
      metrics.tti = Math.round(perfTiming.domInteractive - perfTiming.navigationStart);
    }

    // JS Heap Size (if available)
    if (performance.memory) {
      metrics.jsHeapSize = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100; // MB
    }

    // Total JavaScript bundle size from resources
    const resourceEntries = performance.getEntriesByType('resource');
    const jsResources = resourceEntries.filter(r =>
      r.initiatorType === 'script' || r.name.endsWith('.js')
    );
    metrics.totalJsSize = Math.round(
      jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024
    ); // KB

    return metrics;
  });
}

/**
 * Get the first available product ID from the products page
 */
async function getFirstProductId(page) {
  try {
    await page.goto(`${BASE_URL}/app/products`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Try to find product links
    const productLink = await page.$('a[href*="/app/products/"]');
    if (productLink) {
      const href = await productLink.getAttribute('href');
      const match = href.match(/\/app\/products\/(.+)/);
      if (match) {
        return match[1];
      }
    }
  } catch (e) {
    console.log('⚠ Could not find product ID, using default "1"');
  }
  return '1';
}

/**
 * Capture screenshot and metrics for a single route/viewport combination
 */
async function captureRouteViewport(page, route, viewport, productId) {
  const routePath = route.dynamicId
    ? route.path.replace('/1', `/${productId}`)
    : route.path;

  const screenshotName = `${route.name}-${viewport.name}.png`;
  const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);

  // Set viewport
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  // Navigate to route
  const fullUrl = `${BASE_URL}${routePath}`;
  console.log(`  → Capturing ${route.name} (${viewport.name}): ${fullUrl}`);

  try {
    await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for Angular to stabilize
    await page.waitForTimeout(1500);

    // Scroll to trigger lazy loading if any
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // Capture screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
      animations: 'disabled'
    });

    // Collect metrics
    const metrics = await collectMetrics(page);

    console.log(`    ✓ Screenshot saved: ${screenshotName}`);
    console.log(`    ✓ Metrics: DOM=${metrics.domSize}, LCP=${metrics.lcp}ms, CLS=${metrics.cls}`);

    return {
      route: routePath,
      viewport: viewport.name,
      screenshot: screenshotName,
      metrics,
    };
  } catch (error) {
    console.log(`    ✗ Error capturing ${screenshotName}: ${error.message}`);
    return {
      route: routePath,
      viewport: viewport.name,
      screenshot: null,
      error: error.message,
      metrics: null,
    };
  }
}

/**
 * Generate the Gemini prompt file
 */
function generateGeminiPrompt(metricsData) {
  const metricsJson = JSON.stringify(metricsData, null, 2);

  const prompt = `You are a senior FAANG UX engineer conducting a rigorous UI/UX and performance audit.

Analyze the attached screenshots and metrics for a modern Angular e-commerce application.

Metrics collected:
${metricsJson}

Provide a RANKED list of improvements (highest impact first) with:
1. Issue severity (Critical/High/Medium/Low)
2. Specific page and component affected
3. Current problem description
4. Concrete code-level fix (Tailwind classes, Angular component changes)
5. Expected improvement

Focus areas:
- Visual hierarchy and typography
- Spacing and alignment consistency
- Color contrast and accessibility (WCAG AA)
- Mobile responsiveness issues
- Loading states and skeleton screens
- Micro-interactions and animations
- Performance bottlenecks (large DOM, layout shifts)
- Glassmorphism and modern design consistency
- Call-to-action visibility
- Form UX patterns

Format as Markdown with clear sections per issue.`;

  const promptPath = path.join(SCREENSHOTS_DIR, 'gemini-prompt.txt');
  fs.writeFileSync(promptPath, prompt);
  console.log(`✓ Generated Gemini prompt: ${promptPath}`);

  return promptPath;
}

/**
 * Execute Gemini CLI and get analysis
 */
function executeGemini(promptPath) {
  console.log('\n🤖 Executing Gemini analysis...');

  // Check if Gemini CLI is available
  try {
    const versionResult = spawnSync('gemini', ['--version'], { encoding: 'utf-8' });
    if (versionResult.error) {
      throw new Error('Gemini CLI not found');
    }
    console.log(`✓ Gemini CLI version: ${versionResult.stdout.trim()}`);
  } catch (e) {
    console.log('\n⚠ Gemini CLI is not installed or not in PATH.');
    console.log('\nTo install Gemini CLI:');
    console.log('  npm install -g @anthropic-ai/claude-code');
    console.log('  # or');
    console.log('  npm install -g gemini-cli');
    console.log('\nAlternatively, you can manually analyze the screenshots in:');
    console.log(`  ${SCREENSHOTS_DIR}`);
    return null;
  }

  // Get all screenshot files
  const screenshotFiles = fs.readdirSync(SCREENSHOTS_DIR)
    .filter(f => f.endsWith('.png'))
    .map(f => path.basename(f));

  if (screenshotFiles.length === 0) {
    console.log('⚠ No screenshots found for analysis');
    return null;
  }

  // Read prompt content
  const promptContent = fs.readFileSync(promptPath, 'utf-8');

  try {
    // Gemini CLI is an agentic CLI that can read files from the working directory
    // Use positional prompt with yolo mode for non-interactive execution
    // Output in JSON format for easier parsing

    console.log(`  → Analyzing ${screenshotFiles.length} screenshots...`);

    // Create the analysis prompt referencing local files
    const fileList = screenshotFiles.join(', ');
    const combinedPrompt = `Read and analyze all PNG screenshot files in the current directory (${fileList}). These are UX screenshots of an Angular e-commerce application. ${promptContent}`;

    // Run gemini with yolo mode (auto-approve) and JSON output
    const result = spawnSync('gemini', [
      '--yolo',
      '--output-format', 'text',
      combinedPrompt
    ], {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      timeout: 300000, // 5 minute timeout for thorough analysis
      cwd: SCREENSHOTS_DIR, // Run from screenshots directory so it can access the files
    });

    if (result.error) {
      throw result.error;
    }

    // Check for any stderr output
    if (result.stderr) {
      const stderrLines = result.stderr.trim().split('\n').filter(l => l.trim());
      if (stderrLines.length > 0 && result.status !== 0) {
        console.log(`⚠ Gemini stderr: ${stderrLines[0]}`);
      }
    }

    const output = result.stdout || '';
    if (output.trim()) {
      console.log('✓ Gemini analysis complete');
      return output;
    } else {
      console.log('⚠ Gemini returned empty response');
      console.log('\n📋 To manually run Gemini analysis, execute:');
      console.log(`   cd "${SCREENSHOTS_DIR}"`);
      console.log(`   gemini "Read all PNG files and analyze them as UX screenshots. ${promptContent.split('\n')[0]}..."`);
      return null;
    }
  } catch (e) {
    console.log(`✗ Gemini execution failed: ${e.message}`);
    console.log('\n📋 To manually run Gemini analysis, execute:');
    console.log(`   cd "${SCREENSHOTS_DIR}"`);
    console.log('   gemini --yolo "Read and analyze all PNG screenshot files for UX improvements"');
    return null;
  }
}

/**
 * Generate the final UX report
 */
function generateReport(metricsData, geminiAnalysis) {
  const timestamp = new Date().toISOString();

  // Build metrics summary table
  let metricsTable = '| Page | Viewport | DOM Size | LCP (ms) | FCP (ms) | CLS | TTI (ms) | JS Size (KB) |\n';
  metricsTable += '|------|----------|----------|----------|----------|-----|----------|-------------|\n';

  for (const result of metricsData.results) {
    if (result.metrics) {
      const m = result.metrics;
      metricsTable += `| ${result.route} | ${result.viewport} | ${m.domSize} | ${m.lcp} | ${m.fcp} | ${m.cls} | ${m.tti} | ${m.totalJsSize} |\n`;
    }
  }

  // Count issues by severity (if Gemini analysis available)
  let severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  let topIssues = [];

  if (geminiAnalysis) {
    // Parse severity counts from Gemini response
    const criticalMatches = geminiAnalysis.match(/\*\*Critical\*\*|\bCritical\b/gi);
    const highMatches = geminiAnalysis.match(/\*\*High\*\*|\bHigh\b/gi);
    const mediumMatches = geminiAnalysis.match(/\*\*Medium\*\*|\bMedium\b/gi);
    const lowMatches = geminiAnalysis.match(/\*\*Low\*\*|\bLow\b/gi);

    severityCounts.Critical = criticalMatches ? Math.floor(criticalMatches.length / 2) : 0;
    severityCounts.High = highMatches ? Math.floor(highMatches.length / 2) : 0;
    severityCounts.Medium = mediumMatches ? Math.floor(mediumMatches.length / 2) : 0;
    severityCounts.Low = lowMatches ? Math.floor(lowMatches.length / 2) : 0;

    // Extract top 3 critical issues (rough extraction)
    const issueBlocks = geminiAnalysis.split(/#{2,3}\s+/);
    topIssues = issueBlocks
      .filter(block => block.toLowerCase().includes('critical'))
      .slice(0, 3)
      .map(block => block.split('\n')[0].trim());
  }

  const report = `# UX Audit Report
Generated: ${timestamp}
Application: Angular Frontend (localhost:4200)

## Executive Summary

This audit analyzed ${metricsData.results.length} page/viewport combinations across the Angular e-commerce application.

### Issues by Severity
- **Critical**: ${severityCounts.Critical}
- **High**: ${severityCounts.High}
- **Medium**: ${severityCounts.Medium}
- **Low**: ${severityCounts.Low}

${topIssues.length > 0 ? `### Top Critical Issues
${topIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}
` : ''}

## Performance Metrics Summary

${metricsTable}

### Metrics Legend
- **DOM Size**: Total number of DOM elements (aim for < 1500)
- **LCP**: Largest Contentful Paint (aim for < 2500ms)
- **FCP**: First Contentful Paint (aim for < 1800ms)
- **CLS**: Cumulative Layout Shift (aim for < 0.1)
- **TTI**: Time to Interactive approximation
- **JS Size**: Total JavaScript transferred

## Screenshots Captured

${metricsData.results.map(r => r.screenshot ? `- \`${r.screenshot}\` - ${r.route} (${r.viewport})` : '').filter(Boolean).join('\n')}

## Ranked Improvements

${geminiAnalysis || '*Gemini analysis not available. Install Gemini CLI to enable AI-powered recommendations.*'}

---

*Report generated by UX Audit System*
`;

  const reportPath = path.join(__dirname, '..', 'ux_report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n✓ Full report saved to: ${reportPath}`);

  return { report, severityCounts, topIssues, reportPath };
}

/**
 * Print summary to console
 */
function printSummary(severityCounts, topIssues, reportPath) {
  console.log('\n' + '='.repeat(60));
  console.log('UX AUDIT SUMMARY');
  console.log('='.repeat(60));

  console.log('\n📊 Issues Found by Severity:');
  console.log(`   🔴 Critical: ${severityCounts.Critical}`);
  console.log(`   🟠 High: ${severityCounts.High}`);
  console.log(`   🟡 Medium: ${severityCounts.Medium}`);
  console.log(`   🟢 Low: ${severityCounts.Low}`);

  if (topIssues.length > 0) {
    console.log('\n🚨 Top 3 Critical Issues:');
    topIssues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue.substring(0, 60)}${issue.length > 60 ? '...' : ''}`);
    });
  }

  console.log(`\n📄 Full report: ${reportPath}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log('\n🔍 Starting UX Audit...\n');
  console.log(`Mode: ${HEADED_MODE ? 'Headed (debugging)' : 'Headless (automation)'}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  // Ensure screenshots directory exists
  ensureScreenshotsDir();

  // Launch browser
  const browser = await chromium.launch({
    headless: !HEADED_MODE,
  });

  // Create context with authentication
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  // Set up authentication for protected routes
  await setupAuthentication(context);

  const page = await context.newPage();

  // First, get a valid product ID
  console.log('🔎 Finding available product ID...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Set auth in localStorage directly
  await page.evaluate(() => {
    const mockUser = {
      id: 'audit_user_001',
      name: 'Audit User',
      email: 'audit@example.com',
    };
    localStorage.setItem('auth_token', 'mock_token_audit_session');
    localStorage.setItem('current_user', JSON.stringify(mockUser));
  });

  const productId = await getFirstProductId(page);
  console.log(`✓ Using product ID: ${productId}\n`);

  // Capture all routes and viewports
  const results = [];

  for (const route of ROUTES) {
    console.log(`\n📸 Capturing: ${route.name}`);

    for (const viewport of VIEWPORTS) {
      const result = await captureRouteViewport(page, route, viewport, productId);
      results.push(result);
    }
  }

  // Close browser
  await browser.close();

  // Compile metrics data
  const metricsData = {
    timestamp: new Date().toISOString(),
    pages: {},
    results,
  };

  // Organize by page
  for (const result of results) {
    if (result.metrics) {
      if (!metricsData.pages[result.route]) {
        metricsData.pages[result.route] = {};
      }
      metricsData.pages[result.route][result.viewport] = result.metrics;
    }
  }

  // Save metrics.json
  const metricsPath = path.join(SCREENSHOTS_DIR, 'metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify(metricsData, null, 2));
  console.log(`\n✓ Metrics saved to: ${metricsPath}`);

  // Generate Gemini prompt
  const promptPath = generateGeminiPrompt(metricsData);

  // Execute Gemini analysis (unless skipped)
  let geminiAnalysis = null;
  if (!SKIP_GEMINI) {
    geminiAnalysis = executeGemini(promptPath);
  } else {
    console.log('\n⏭ Skipping Gemini analysis (--skip-gemini flag)');
  }

  // Generate final report
  const { severityCounts, topIssues, reportPath } = generateReport(metricsData, geminiAnalysis);

  // Print summary
  printSummary(severityCounts, topIssues, reportPath);

  console.log('✅ UX Audit complete!\n');
}

// Run the audit
runAudit().catch((error) => {
  console.error('\n❌ Audit failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
