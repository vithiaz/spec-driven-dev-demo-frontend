# Pre-Commit Checks

Quality gates and automated checks to run before committing code.

## Pre-Commit Philosophy

**Principles:**

1. **Catch issues early** - Before code review
2. **Automate checks** - Don't rely on memory
3. **Fast feedback** - Quick checks first
4. **Fix, don't skip** - Always resolve issues

## Essential Checks

### 1. No console.log Statements

**Check for debug logging in production code:**

```bash
# Search for console statements
rg 'console\.(log|error|warn|debug|info)' src/ --type ts --type tsx

# Exclude wrapped in NODE_ENV check
rg 'console\.(log|error|warn|debug|info)' src/ --type ts --type tsx | \
  grep -v 'NODE_ENV'
```

**What to look for:**

- ❌ `console.log(...)` in production code
- ❌ `console.error(...)` not using logging library
- ❌ `console.warn(...)` not using logging library
- ✅ Development-only logs (wrapped in `NODE_ENV === 'development'`)
- ✅ Test files (allowed)

**Fix:**

```typescript
// ❌ REMOVE
console.log('User data:', userData);

// ✅ OR WRAP
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// ✅ OR USE LOGGING LIBRARY
logger.error('Failed to fetch', { error });
```

### 2. No Duplicate data-testid

**Check for duplicate test IDs:**

```bash
# Find all data-testid values
rg 'data-testid="([^"]+)"' src/ -or '$1' | sort | uniq -d

# Alternative with grep
grep -roh 'data-testid="[^"]*"' src/ | sort | uniq -d
```

**Should return empty (no duplicates)**

**If duplicates found:**

```typescript
// ❌ BAD - Duplicate IDs
<button data-testid="submit-btn">Save</button>
<button data-testid="submit-btn">Delete</button>

// ✅ GOOD - Unique IDs
<button data-testid="save-announcement-btn">Save</button>
<button data-testid="delete-announcement-btn">Delete</button>
```

### 3. Missing data-testid on Interactive Elements

**Manual check of changed files:**

Look for interactive elements without data-testid:

- Buttons without `data-testid`
- Inputs without `data-testid`
- Links without `data-testid`
- Forms without `data-testid`
- Clickable divs without `data-testid`
- Page without `data-testid`
- Card without `data-testid`

```bash
# Find buttons without data-testid (approximate)
rg '<button(?![^>]*data-testid)' src/ --type tsx

# Find inputs without data-testid (approximate)
rg '<input(?![^>]*data-testid)' src/ --type tsx
```

**Fix:**

```typescript
// ❌ BAD
<button onClick={handleSave}>Save</button>

// ✅ GOOD
<button data-testid="save-announcement-btn" onClick={handleSave}>
  Save
</button>
```

### 4. Linting (ESLint)

**Run linter:**

```bash
# Check for linting errors
npm run lint

# Auto-fix what can be fixed
npm run lint -- --fix
```

**Common issues:**

- Unused variables
- Missing dependencies in useEffect
- Inconsistent formatting
- Import order issues

**Fix or add exceptions:**

```typescript
// If truly needed, add exception
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVar = 'temporary';
```

### 5. Type Checking (TypeScript)

**Run type checker:**

```bash
# Check for type errors
npm run type-check

# Or
tsc --noEmit
```

**Common type errors:**

- Type mismatch
- Missing properties
- Undefined variables
- Wrong function signatures

**Fix:**

```typescript
// ❌ TYPE ERROR
const result: string = 123;

// ✅ FIXED
const result: string = '123';
```

### 6. Formatting (Prettier)

**Check formatting:**

```bash
# Check if files are formatted
npm run format:check

# Auto-format files
npm run format
```

**What it checks:**

- Indentation
- Line length
- Quote style
- Trailing commas

### 7. Tests

**Run test suite:**

```bash
# Run unit tests
npm run test

# Run specific test file
npm run test -- src/components/Announcement.test.tsx

# Run with coverage
npm run test:coverage
```

**What to verify:**

- All tests pass
- New features have tests
- Coverage doesn't decrease

## Quick Pre-Commit Script

**Create `pre-commit.sh`:**

```bash
#!/bin/bash
set -e

echo "🔍 Running pre-commit checks..."

# 1. Check for console.log
echo "1️⃣  Checking for console.log..."
CONSOLE_LOGS=$(rg 'console\.(log|error|warn|debug|info)' src/ --type ts --type tsx | grep -v 'NODE_ENV' || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo "❌ Found console.log statements:"
  echo "$CONSOLE_LOGS"
  exit 1
fi
echo "✅ No console.log found"

# 2. Check for duplicate data-testid
echo "2️⃣  Checking for duplicate data-testid..."
DUPLICATES=$(rg 'data-testid="([^"]+)"' src/ -or '$1' | sort | uniq -d || true)
if [ -n "$DUPLICATES" ]; then
  echo "❌ Found duplicate data-testid:"
  echo "$DUPLICATES"
  exit 1
fi
echo "✅ No duplicate data-testid found"

# 3. Run linter
echo "3️⃣  Running linter..."
npm run lint
echo "✅ Linting passed"

# 4. Run type checker
echo "4️⃣  Running type checker..."
npm run type-check
echo "✅ Type checking passed"

# 5. Run formatter check
echo "5️⃣  Checking formatting..."
npm run format:check
echo "✅ Formatting check passed"

# 6. Run tests
echo "6️⃣  Running tests..."
npm run test -- --passWithNoTests
echo "✅ Tests passed"

echo "🎉 All pre-commit checks passed!"
```

**Make executable:**

```bash
chmod +x pre-commit.sh
```

**Run before commit:**

```bash
./pre-commit.sh
```

## Git Hook Setup

**Install husky (if not already):**

```bash
npm install --save-dev husky
npx husky init
```

**Create pre-commit hook:**

```bash
# .husky/pre-commit
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Lint staged files
npm run lint-staged

# Type check
npm run type-check

# Run tests
npm run test -- --passWithNoTests

echo "✅ Pre-commit checks passed!"
```

**Configure lint-staged in package.json:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Manual Checklist

**Before running git commit:**

### Code Quality

- [ ] No console.log statements (or wrapped in NODE_ENV check)
- [ ] No duplicate data-testid values
- [ ] All interactive elements have data-testid
- [ ] No unused variables or imports
- [ ] No commented-out code blocks
- [ ] No TODO comments for temporary debugging

### Testing

- [ ] All tests pass
- [ ] New features have tests
- [ ] Changed code has updated tests
- [ ] E2E tests pass (if applicable)

### Type Safety

- [ ] No type errors
- [ ] No `any` types (unless necessary)
- [ ] Proper type annotations

### Documentation

- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc comments
- [ ] README updated (if needed)

### Security

- [ ] No hardcoded secrets
- [ ] No sensitive data in logs
- [ ] User input sanitized

### Performance

- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization
- [ ] Images optimized

## Fast Pre-Commit (Staged Files Only)

**Check only staged files:**

```bash
#!/bin/bash
# pre-commit-fast.sh

# Get staged files
STAGED_TS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)

if [ -z "$STAGED_TS_FILES" ]; then
  echo "No TypeScript files staged, skipping checks"
  exit 0
fi

echo "🔍 Checking staged files..."

# Check console.log in staged files
for file in $STAGED_TS_FILES; do
  if grep -q 'console\.\(log\|error\|warn\)' "$file" && ! grep -q 'NODE_ENV' "$file"; then
    echo "❌ Found console.log in $file"
    exit 1
  fi
done

# Lint staged files
echo "$STAGED_TS_FILES" | xargs npx eslint

# Format staged files
echo "$STAGED_TS_FILES" | xargs npx prettier --check

echo "✅ Staged files check passed!"
```

## Common Issues and Fixes

### Issue 1: Too Many console.log Found

```bash
# Find all console.log
rg 'console\.log' src/ -l

# Remove all (CAREFUL - review first!)
sd 'console\.log\([^)]*\);?\n?' '' src/**/*.{ts,tsx}

# Or manually review each file
```

### Issue 2: Duplicate data-testid After Merge

```bash
# Find duplicates
rg 'data-testid="([^"]+)"' src/ -or '$1' | sort | uniq -d

# Review each duplicate and make unique
# Example: save-btn → save-announcement-btn
```

### Issue 3: Type Errors After Dependency Update

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run type check again
npm run type-check
```

### Issue 4: Linting Errors After Merge

```bash
# Auto-fix what can be fixed
npm run lint -- --fix

# Review remaining errors manually
```

## CI/CD Integration

**Example GitHub Actions:**

```yaml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Format check
        run: npm run format:check

      - name: Test
        run: npm run test:ci

      - name: Build
        run: npm run build

      - name: Check for console.log
        run: |
          if rg 'console\.(log|error|warn)' src/ --type ts --type tsx | grep -v 'NODE_ENV'; then
            echo "❌ Found console.log statements"
            exit 1
          fi

      - name: Check for duplicate data-testid
        run: |
          DUPLICATES=$(rg 'data-testid="([^"]+)"' src/ -or '$1' | sort | uniq -d || true)
          if [ -n "$DUPLICATES" ]; then
            echo "❌ Found duplicate data-testid: $DUPLICATES"
            exit 1
          fi
```

## Performance Tips

**Speed up checks:**

1. **Run checks in parallel:**

   ```bash
   npm run lint & \
   npm run type-check & \
   npm run test & \
   wait
   ```

2. **Cache dependencies:**

   ```bash
   # CI/CD cache node_modules
   ```

3. **Skip tests for docs changes:**
   ```bash
   # Only run tests if source code changed
   if git diff --name-only HEAD~1 | grep -q '^src/'; then
     npm run test
   fi
   ```

## Summary

### Must-Run Checks (Before Every Commit)

1. ✅ No console.log in production code
2. ✅ No duplicate data-testid
3. ✅ Linting passes
4. ✅ Type checking passes
5. ✅ Formatting is correct

### Should-Run Checks (Before Push)

6. ✅ All tests pass
7. ✅ Build succeeds
8. ✅ No missing data-testid on interactive elements

### Commands Summary

```bash
# Quick check (fast)
npm run lint && npm run type-check

# Full check (thorough)
npm run lint && \
npm run type-check && \
npm run test && \
npm run format:check

# Auto-fix what can be fixed
npm run lint -- --fix && npm run format
```

## See Also

- **Code Quality**: `lookup/architecture/code-quality.md`
- **Logging**: `lookup/best-practice/logging.md`
- **Test Selectors**: `lookup/e2e/locator.md`
- **Duplicate Test IDs**: `lookup/pitfalls/duplicate-testid.md`
- **Testing**: `lookup/architecture/testing.md`
- **TypeScript Pitfalls**: `lookup/pitfalls/typescript.md`
