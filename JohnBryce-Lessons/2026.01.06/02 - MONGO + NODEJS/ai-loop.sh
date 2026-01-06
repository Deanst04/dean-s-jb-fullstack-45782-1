#!/bin/bash

#######################################################################
# AI-Powered UX Evolution Loop
#
# This script orchestrates an autonomous UX improvement cycle:
# 1. Gemini audits the UI via ux-audit.js
# 2. Claude Code applies fixes via ux-fixer.js
# 3. Angular rebuilds the application
# 4. User reviews and approves (or continues loop)
#
# SAFETY:
# - Human approval required before finalizing
# - Backups created before every modification
# - Only UI/UX layers touched, never business logic
# - Maximum iteration limit prevents infinite loops
#
# Usage: ./ai-loop.sh [options]
#   --dry-run       Preview changes without applying
#   --skip-audit    Skip audit phase (use existing report)
#   --skip-serve    Skip serving the app
#   --max-iter N    Override max iterations (default: 10)
#   --verbose       Enable verbose logging
#   --help          Show this help message
#######################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;90m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/ai-loop.config.json"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"
LOG_FILE="${SCRIPT_DIR}/ai-loop.log"

# Defaults (can be overridden by config)
MAX_ITERATIONS=10
PAUSE_BETWEEN_MS=2000
SERVE_PORT=4200
WAIT_FOR_READY_MS=10000

# CLI flags
DRY_RUN=false
SKIP_AUDIT=false
SKIP_SERVE=false
VERBOSE=false
ITERATION=1

# Process ID for background server
SERVER_PID=""

#######################################################################
# Utility Functions
#######################################################################

log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GRAY}[${timestamp}]${NC} $1"
    echo "[${timestamp}] $(echo -e "$1" | sed 's/\x1b\[[0-9;]*m//g')" >> "$LOG_FILE"
}

log_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

log_step() {
    echo -e "${CYAN}▶${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${GRAY}  [DEBUG] $1${NC}"
    fi
}

show_help() {
    cat << EOF
${BOLD}AI-Powered UX Evolution Loop${NC}

${CYAN}USAGE:${NC}
    ./ai-loop.sh [OPTIONS]

${CYAN}OPTIONS:${NC}
    --dry-run       Preview changes without applying them
    --skip-audit    Skip the audit phase (use existing ux_report.md)
    --skip-serve    Skip starting the dev server
    --max-iter N    Override maximum iterations (default: 10)
    --verbose       Enable verbose/debug logging
    --help          Show this help message

${CYAN}WORKFLOW:${NC}
    1. Run UX audit (Gemini analyzes screenshots)
    2. Apply fixes (based on AI recommendations)
    3. Rebuild Angular application
    4. Start dev server for review
    5. Ask for user approval
       - 'y' = Accept and exit
       - 'n' = Continue to next iteration
       - 'q' = Quit without accepting

${CYAN}EXAMPLES:${NC}
    ./ai-loop.sh                    # Run full loop
    ./ai-loop.sh --dry-run          # Preview without changes
    ./ai-loop.sh --skip-audit       # Use existing report
    ./ai-loop.sh --max-iter 5       # Limit to 5 iterations

${CYAN}FILES:${NC}
    ai-loop.config.json     Configuration file
    frontend/ux-audit.js    UX audit script
    frontend/ux-fixer.js    UX fix application script
    ux_report.md            Generated audit report
    frontend/ux_fixes_applied.md  Applied fixes log

EOF
}

#######################################################################
# Configuration Loading
#######################################################################

load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        log_verbose "Loading config from $CONFIG_FILE"

        # Parse JSON config using node (more reliable than jq)
        MAX_ITERATIONS=$(node -e "console.log(require('$CONFIG_FILE').loop?.maxIterations || 10)" 2>/dev/null || echo "10")
        PAUSE_BETWEEN_MS=$(node -e "console.log(require('$CONFIG_FILE').loop?.pauseBetweenIterationsMs || 2000)" 2>/dev/null || echo "2000")
        SERVE_PORT=$(node -e "console.log(require('$CONFIG_FILE').serve?.port || 4200)" 2>/dev/null || echo "4200")
        WAIT_FOR_READY_MS=$(node -e "console.log(require('$CONFIG_FILE').serve?.waitForReadyMs || 10000)" 2>/dev/null || echo "10000")

        log_success "Configuration loaded"
    else
        log_warn "Config file not found, using defaults"
    fi
}

#######################################################################
# Dependency Checks
#######################################################################

check_dependencies() {
    log_step "Checking dependencies..."

    local missing=()

    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing+=("node")
    else
        log_verbose "Node.js: $(node --version)"
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        missing+=("npm")
    fi

    # Check Angular CLI
    if ! command -v ng &> /dev/null; then
        # Try via npx
        if ! npx ng version &> /dev/null; then
            missing+=("@angular/cli")
        fi
    fi

    # Check if frontend directory exists
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi

    # Check required scripts
    if [ ! -f "${FRONTEND_DIR}/ux-audit.js" ]; then
        log_error "UX audit script not found: ${FRONTEND_DIR}/ux-audit.js"
        exit 1
    fi

    if [ ! -f "${FRONTEND_DIR}/ux-fixer.js" ]; then
        log_error "UX fixer script not found: ${FRONTEND_DIR}/ux-fixer.js"
        exit 1
    fi

    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing[*]}"
        echo ""
        echo "Please install missing dependencies:"
        for dep in "${missing[@]}"; do
            echo "  npm install -g $dep"
        done
        exit 1
    fi

    log_success "All dependencies available"
}

#######################################################################
# Server Management
#######################################################################

start_server() {
    if [ "$SKIP_SERVE" = true ]; then
        log_info "Skipping server start (--skip-serve)"
        return 0
    fi

    log_step "Starting Angular dev server on port $SERVE_PORT..."

    # Kill any existing process on the port
    kill_server_on_port

    # Start ng serve in background
    cd "$FRONTEND_DIR"
    npm run start -- --port "$SERVE_PORT" &> "${SCRIPT_DIR}/ng-serve.log" &
    SERVER_PID=$!
    cd "$SCRIPT_DIR"

    log_verbose "Server started with PID: $SERVER_PID"

    # Wait for server to be ready
    local wait_seconds=$((WAIT_FOR_READY_MS / 1000))
    log_info "Waiting up to ${wait_seconds}s for server to be ready..."

    local elapsed=0
    while [ $elapsed -lt $wait_seconds ]; do
        if curl -s "http://localhost:$SERVE_PORT" > /dev/null 2>&1; then
            log_success "Server is ready at http://localhost:$SERVE_PORT"
            return 0
        fi
        sleep 1
        elapsed=$((elapsed + 1))

        # Check if process died
        if ! kill -0 $SERVER_PID 2>/dev/null; then
            log_error "Server process died unexpectedly"
            cat "${SCRIPT_DIR}/ng-serve.log" | tail -20
            return 1
        fi
    done

    log_warn "Server may not be fully ready, but continuing..."
    return 0
}

kill_server_on_port() {
    local pid=$(lsof -ti:$SERVE_PORT 2>/dev/null || true)
    if [ -n "$pid" ]; then
        log_verbose "Killing existing process on port $SERVE_PORT (PID: $pid)"
        kill $pid 2>/dev/null || true
        sleep 1
    fi
}

stop_server() {
    if [ -n "$SERVER_PID" ]; then
        log_step "Stopping dev server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        SERVER_PID=""
    fi
    kill_server_on_port
}

#######################################################################
# Main Loop Functions
#######################################################################

run_audit() {
    if [ "$SKIP_AUDIT" = true ]; then
        log_info "Skipping audit (--skip-audit)"

        if [ ! -f "${SCRIPT_DIR}/ux_report.md" ]; then
            log_error "No existing ux_report.md found. Remove --skip-audit flag."
            return 1
        fi

        return 0
    fi

    log_step "Running UX audit (Gemini analysis)..."

    cd "$FRONTEND_DIR"

    local audit_args=""
    if [ "$VERBOSE" = true ]; then
        audit_args="$audit_args --headed"
    fi

    if node ux-audit.js $audit_args; then
        log_success "UX audit completed"
        cd "$SCRIPT_DIR"
        return 0
    else
        log_error "UX audit failed"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

run_fixer() {
    log_step "Applying UX fixes..."

    cd "$FRONTEND_DIR"

    local fixer_args="--report ${SCRIPT_DIR}/ux_report.md"

    if [ "$DRY_RUN" = true ]; then
        fixer_args="$fixer_args --dry-run"
    fi

    if [ "$VERBOSE" = true ]; then
        fixer_args="$fixer_args --verbose"
    fi

    if node ux-fixer.js $fixer_args; then
        log_success "UX fixes applied"
        cd "$SCRIPT_DIR"
        return 0
    else
        log_error "UX fixer encountered errors"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

run_build() {
    if [ "$DRY_RUN" = true ]; then
        log_info "Skipping build (--dry-run mode)"
        return 0
    fi

    log_step "Building Angular application..."

    cd "$FRONTEND_DIR"

    if npm run build; then
        log_success "Build succeeded"
        cd "$SCRIPT_DIR"
        return 0
    else
        log_error "Build failed"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

display_report_summary() {
    log_header "ITERATION $ITERATION SUMMARY"

    # Display fixes applied summary
    if [ -f "${FRONTEND_DIR}/ux_fixes_applied.md" ]; then
        echo -e "${CYAN}Fixes Applied:${NC}"
        # Extract summary stats
        grep -E "^\*\*(Critical|High|Medium|Low|Total)" "${FRONTEND_DIR}/ux_fixes_applied.md" 2>/dev/null | head -10 || true
        echo ""
    fi

    # Display metrics from report if available
    if [ -f "${SCRIPT_DIR}/ux_report.md" ]; then
        echo -e "${CYAN}Current Metrics:${NC}"
        grep -A 15 "Performance Metrics Summary" "${SCRIPT_DIR}/ux_report.md" 2>/dev/null | grep -E "^\|" | head -5 || true
        echo ""
    fi
}

ask_user_approval() {
    echo ""
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}  REVIEW REQUIRED${NC}"
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Application is running at: ${CYAN}http://localhost:$SERVE_PORT${NC}"
    echo ""
    echo -e "  ${GREEN}[y]${NC} Accept changes and exit"
    echo -e "  ${YELLOW}[n]${NC} Reject and continue to next iteration"
    echo -e "  ${RED}[q]${NC} Quit without accepting"
    echo ""

    while true; do
        read -p "  Your choice (y/n/q): " choice
        case $choice in
            [Yy]* )
                return 0  # Approved
                ;;
            [Nn]* )
                return 1  # Continue loop
                ;;
            [Qq]* )
                return 2  # Quit
                ;;
            * )
                echo "  Please enter y, n, or q"
                ;;
        esac
    done
}

#######################################################################
# Main Execution
#######################################################################

main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-audit)
                SKIP_AUDIT=true
                shift
                ;;
            --skip-serve)
                SKIP_SERVE=true
                shift
                ;;
            --max-iter)
                MAX_ITERATIONS="$2"
                shift 2
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    # Initialize log file
    echo "AI Loop started at $(date)" > "$LOG_FILE"

    # Display header
    log_header "AI-POWERED UX EVOLUTION LOOP"
    echo -e "  ${GRAY}Mode:${NC}           $([ "$DRY_RUN" = true ] && echo "${YELLOW}DRY RUN${NC}" || echo "${GREEN}LIVE${NC}")"
    echo -e "  ${GRAY}Max Iterations:${NC} $MAX_ITERATIONS"
    echo -e "  ${GRAY}Server Port:${NC}    $SERVE_PORT"
    echo -e "  ${GRAY}Verbose:${NC}        $VERBOSE"
    echo ""

    # Load configuration
    load_config

    # Check dependencies
    check_dependencies

    # Set up trap to clean up on exit
    trap 'stop_server; exit' INT TERM EXIT

    # Main loop
    while [ $ITERATION -le $MAX_ITERATIONS ]; do
        log_header "ITERATION $ITERATION / $MAX_ITERATIONS"

        # Step 1: Run audit
        if ! run_audit; then
            log_error "Audit failed, stopping loop"
            break
        fi

        # Step 2: Apply fixes
        if ! run_fixer; then
            log_warn "Fixer had issues, continuing..."
        fi

        # Step 3: Build
        if ! run_build; then
            log_error "Build failed, stopping loop"
            break
        fi

        # Step 4: Start/restart server
        stop_server
        if ! start_server; then
            log_warn "Server start had issues"
        fi

        # Step 5: Display summary
        display_report_summary

        # Step 6: Ask for approval
        ask_user_approval
        approval_result=$?

        if [ $approval_result -eq 0 ]; then
            # Approved
            log_header "CHANGES APPROVED"
            log_success "UX evolution complete after $ITERATION iteration(s)"
            echo ""
            echo -e "  ${GREEN}Summary:${NC}"
            echo "  - All changes have been applied and built"
            echo "  - Review ${FRONTEND_DIR}/ux_fixes_applied.md for details"
            echo "  - Review ${SCRIPT_DIR}/ux_report.md for audit results"
            echo ""
            stop_server
            exit 0

        elif [ $approval_result -eq 2 ]; then
            # Quit
            log_header "LOOP TERMINATED"
            log_warn "Exiting without accepting changes"
            echo ""
            echo -e "  ${YELLOW}Note:${NC} Changes from this session are still applied."
            echo "  You may want to:"
            echo "  - Review ${FRONTEND_DIR}/.ux-backups/ for file backups"
            echo "  - Manually revert changes if needed"
            echo ""
            stop_server
            exit 0
        fi

        # Continue to next iteration
        log_info "Continuing to iteration $((ITERATION + 1))..."

        # Pause between iterations
        if [ $PAUSE_BETWEEN_MS -gt 0 ]; then
            sleep $((PAUSE_BETWEEN_MS / 1000))
        fi

        ITERATION=$((ITERATION + 1))

        # For next iteration, don't skip audit
        SKIP_AUDIT=false
    done

    # Reached max iterations
    log_header "MAX ITERATIONS REACHED"
    log_warn "Completed $MAX_ITERATIONS iterations without approval"
    echo ""
    echo "  Options:"
    echo "  - Run again with --max-iter to allow more iterations"
    echo "  - Review changes manually"
    echo ""

    stop_server
}

# Run main
main "$@"
