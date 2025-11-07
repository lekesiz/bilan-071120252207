#!/bin/bash

# BilanCompetence.AI - Deployment Readiness Check
# Run this before deploying to production

set -e

echo "🔍 BilanCompetence.AI - Deployment Readiness Check"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check functions
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# 1. Check Node version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    check_pass "Node.js version: $(node -v)"
else
    check_fail "Node.js version must be >= 18 (current: $(node -v))"
fi
echo ""

# 2. Check dependencies
echo "2️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    check_pass "node_modules exists"
else
    check_fail "node_modules missing - run: npm install"
fi
echo ""

# 3. Check environment file
echo "3️⃣  Checking environment configuration..."
if [ -f ".env.local" ] || [ -f ".env" ]; then
    check_pass "Environment file found"

    # Check critical variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env* 2>/dev/null; then
        check_pass "Supabase URL configured"
    else
        check_fail "NEXT_PUBLIC_SUPABASE_URL missing"
    fi

    if grep -q "NEXTAUTH_SECRET" .env* 2>/dev/null; then
        check_pass "NextAuth secret configured"
    else
        check_fail "NEXTAUTH_SECRET missing"
    fi

    if grep -q "STRIPE_SECRET_KEY" .env* 2>/dev/null; then
        check_pass "Stripe configured"
    else
        check_warn "Stripe not configured (optional for testing)"
    fi
else
    check_fail "No environment file found (.env.local or .env)"
    echo "   → Copy .env.example to .env.local and configure"
fi
echo ""

# 4. TypeScript check
echo "4️⃣  Running TypeScript type check..."
if npm run type-check &> /dev/null; then
    check_pass "TypeScript type check passed"
else
    check_fail "TypeScript type check failed - run: npm run type-check"
fi
echo ""

# 5. Linting
echo "5️⃣  Running ESLint..."
if npm run lint &> /dev/null; then
    check_pass "Linting passed"
else
    check_warn "Linting issues found - run: npm run lint"
fi
echo ""

# 6. Tests
echo "6️⃣  Running tests..."
if npm run test -- --passWithNoTests &> /dev/null; then
    check_pass "Tests passed"
else
    check_warn "Tests failed or not configured"
fi
echo ""

# 7. Build check
echo "7️⃣  Running production build..."
if npm run build &> /dev/null; then
    check_pass "Production build successful"
    # Clean up build
    rm -rf .next
else
    check_fail "Production build failed - run: npm run build"
fi
echo ""

# 8. Check critical files
echo "8️⃣  Checking critical files..."
CRITICAL_FILES=(
    "package.json"
    "next.config.js"
    "tailwind.config.js"
    "tsconfig.json"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/lib/supabase/client.ts"
    "src/store/index.ts"
    "supabase/migrations/20250101000001_create_tables.sql"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Found: $file"
    else
        check_fail "Missing: $file"
    fi
done
echo ""

# 9. Git status
echo "9️⃣  Checking git status..."
if [ -d ".git" ]; then
    check_pass "Git repository initialized"

    if [ -z "$(git status --porcelain)" ]; then
        check_pass "Working directory clean"
    else
        check_warn "Uncommitted changes found"
        echo "   → Commit changes before deploying"
    fi
else
    check_warn "Not a git repository"
fi
echo ""

# 10. Security check
echo "🔟  Running security audit..."
if npm audit --production --audit-level=high &> /dev/null; then
    check_pass "No high-severity vulnerabilities"
else
    check_warn "Security vulnerabilities found - run: npm audit"
fi
echo ""

# Summary
echo "=================================================="
echo "📊 Summary:"
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
fi
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Failed: $FAILED${NC}"
fi
echo ""

# Final verdict
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Deploy to Vercel: vercel --prod"
    echo "3. Run Supabase migrations"
    echo "4. Configure Stripe webhooks"
    echo ""
    exit 0
else
    echo -e "${RED}🚫 Not ready for deployment${NC}"
    echo ""
    echo "Fix the failed checks above before deploying."
    echo ""
    exit 1
fi
