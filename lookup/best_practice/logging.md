# Logging

Production logging standards and debugging guidelines.

## Console Logging Rules

### ❌ FORBIDDEN in Production Code

**Never commit these to production code:**

```typescript
// ❌ BAD - Debug logging
console.log('User data:', userData);
console.log('Component rendered', props);
console.log('API response:', response);

// ❌ BAD - Error logging with console
console.error('API failed:', error);
console.error('Validation error:', validationError);

// ❌ BAD - Warning logging with console
console.warn('Deprecated feature used');
console.warn('API response slow', duration);

// ❌ BAD - Other console methods
console.debug('Debug info:', data);
console.info('Request sent to API');
console.trace('Call stack');
console.table(data);
```

**Why forbidden:**

- 🔒 **Security**: Exposes sensitive data (user info, tokens, internal state)
- 📊 **Performance**: Console operations are slow in production
- 🎨 **Professionalism**: Clutters browser console for users
- 🐛 **Debugging**: Makes real errors hard to find in console
- 📈 **Monitoring**: Not captured in error tracking systems

### ✅ ALLOWED Logging

**1. Development-only logging (with environment check):**

```typescript
// ✅ GOOD - Only logs in development
if (process.env.NODE_ENV === 'development') {
  console.log('Component rendered:', props);
  console.log('API response:', response);
}

// ✅ GOOD - Using custom debug utility
import { debugLog } from '@/lib/debug';

debugLog('User data:', userData); // Only logs in dev mode
```

**2. Production error logging (if using logging library):**

```typescript
// ✅ GOOD - Production error tracking
import { logger } from '@/lib/logger';

try {
  await fetchAnnouncements();
} catch (error) {
  logger.error('Failed to fetch announcements', {
    error,
    context: { userId, timestamp },
  });
}

// ✅ GOOD - Warning with context
logger.warn('API response delayed', {
  duration,
  endpoint: '/api/announcements',
});
```

**3. Error boundary logging:**

```typescript
// ✅ GOOD - Error boundary with proper logging
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Production error tracking
    logError('Component error', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }
}
```

## Production Logging Library

**Check if project uses a logging library:**

1. **Look for logging configuration:**

   ```bash
   # Check package.json for logging libraries
   grep -E "winston|pino|bunyan|loglevel" package.json

   # Check for custom logger
   find src -name "logger.ts" -o -name "logger.js"
   ```

2. **Common logging libraries:**
   - `winston` - Structured logging with transports
   - `pino` - Fast JSON logging
   - `loglevel` - Minimal logging with levels
   - Custom logger in `src/lib/logger.ts`

3. **If logging library exists, use it:**

   ```typescript
   import { logger } from '@/lib/logger';

   // Log levels
   logger.error('Error message', { context }); // Production errors
   logger.warn('Warning message', { context }); // Production warnings
   logger.info('Info message', { context }); // Important events
   logger.debug('Debug message', { context }); // Development only
   ```

4. **If NO logging library:**
   - **Remove ALL console.\* statements**
   - Create custom logger if needed for error tracking
   - Use error boundaries for component errors

## Development Debugging

**For local debugging only (NEVER commit):**

```typescript
// 🟡 TEMPORARY - Remove before commit
console.log('Debugging user flow:', userData);
console.log('Component state:', state);

// Add comment to remind yourself
// TODO: Remove debug logging before commit
console.log('API response:', response);
```

**Better debugging alternatives:**

1. **Browser DevTools:**
   - Use breakpoints instead of console.log
   - Use debugger statement (remove before commit)
   - Use React DevTools for component inspection

2. **Debug utility (development only):**
   ```typescript
   // src/lib/debug.ts
   export const debugLog = (...args: any[]) => {
     if (process.env.NODE_ENV === 'development') {
       console.log('[DEBUG]', ...args);
     }
   };
   ```

## Error Logging Patterns

### Pattern 1: API Error Logging

```typescript
// ✅ GOOD - Structured error logging
async function fetchAnnouncements() {
  try {
    const response = await fetch('/api/announcements');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Log with context for debugging
    logger.error('Failed to fetch announcements', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Re-throw or handle
    throw error;
  }
}
```

### Pattern 2: Form Validation Logging

```typescript
// ✅ GOOD - Warning for validation issues
function validateForm(data: FormData) {
  const errors: Record<string, string> = {};

  if (!data.title) {
    errors.title = 'Title is required';
  }

  if (Object.keys(errors).length > 0) {
    // Log validation failures for monitoring
    logger.warn('Form validation failed', {
      errors,
      formType: 'announcement',
      timestamp: new Date().toISOString(),
    });
  }

  return errors;
}
```

### Pattern 3: Performance Logging

```typescript
// ✅ GOOD - Performance monitoring (development only)
function measurePerformance<T>(fn: () => T, label: string): T {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
  }

  const result = fn();

  if (process.env.NODE_ENV === 'development') {
    console.timeEnd(label);
  }

  return result;
}

// Usage
const data = measurePerformance(() => processLargeDataset(items), 'Process dataset');
```

## Pre-Commit Checklist

**Before committing code, verify:**

```bash
# 1. Search for console.log/error/warn/debug/info
rg 'console\.(log|error|warn|debug|info)' src/

# 2. Review each match:
# - Is it wrapped in NODE_ENV check? ✅ OK
# - Is it in a test file? ✅ OK
# - Is it production code? ❌ REMOVE

# 3. Search for TODO comments about logging
rg 'TODO.*console|TODO.*debug|TODO.*log' src/
```

**Clean up commands:**

```bash
# Remove all console.log in src/ (use with caution!)
sd 'console\.log\([^)]*\);?\n?' '' src/**/*.{ts,tsx}

# Or manually review and remove each one
```

## Common Mistakes

### Mistake 1: Logging Sensitive Data

```typescript
// ❌ BAD - Exposes password in console
console.log('User login:', { email, password });

// ✅ GOOD - Don't log sensitive data
logger.info('User login', { email }); // Password omitted
```

### Mistake 2: Logging in Loops

```typescript
// ❌ BAD - Floods console
items.forEach((item) => {
  console.log('Processing item:', item);
});

// ✅ GOOD - Log summary instead
logger.debug('Processing items', { count: items.length });
items.forEach((item) => {
  processItem(item);
});
logger.debug('Processing complete', { count: items.length });
```

### Mistake 3: Leaving Debug Logging

```typescript
// ❌ BAD - Forgot to remove debug logging
console.log('Component mounted');
console.log('Props:', props);
console.log('State:', state);

// ✅ GOOD - Use debugger or DevTools instead
// (No console statements in production code)
```

## When to Use Each Log Level

| Level   | When to Use                                      | Example                                                   |
| ------- | ------------------------------------------------ | --------------------------------------------------------- |
| `error` | Production errors requiring attention            | API failures, database errors, critical bugs              |
| `warn`  | Production issues that don't break functionality | Deprecated features, slow operations, validation failures |
| `info`  | Important production events                      | User login, important actions, feature flags              |
| `debug` | Development debugging only                       | Component renders, prop changes, local state              |

## Testing and Logging

**In test files, console.log is acceptable:**

```typescript
// ✅ OK in test files
test('should create announcement', async () => {
  console.log('Test started');

  const result = await createAnnouncement(data);

  console.log('Test result:', result);
  expect(result).toBeDefined();
});
```

**But prefer test framework logging:**

```typescript
// ✅ BETTER - Use test framework logging
test('should create announcement', async ({ page }, testInfo) => {
  // Playwright test logging
  await testInfo.attach('debug-info', {
    body: JSON.stringify(data),
    contentType: 'application/json',
  });

  const result = await createAnnouncement(data);
  expect(result).toBeDefined();
});
```

## Summary

### Quick Rules

1. ❌ **NEVER** use `console.log/error/warn/debug/info` in production code
2. ✅ **USE** logging library if project has one (`logger.error`, `logger.warn`)
3. ✅ **WRAP** debug logs in `NODE_ENV === 'development'` check
4. ✅ **REMOVE** all debug logging before commit
5. ✅ **LOG** errors with context (not just error message)
6. ✅ **TEST** files can use console.log

### Pre-Commit Command

```bash
# Check for console statements in production code
rg 'console\.(log|error|warn|debug|info)' src/ --type ts --type tsx | \
  grep -v 'NODE_ENV'
```

**If any matches found → Remove them before committing**

## Backend Error Logging (For AI Debugging)

When debugging API errors that originate from the backend, AI assistants can read backend logs to understand the root cause.

### Running Backend with Log Capture

**Start backend with log output to file:**

```bash
# In lms-backend directory
yarn dev > dev.log 2>&1
```

**What this command does:**

- `yarn dev` - Starts the backend development server
- `> dev.log` - Redirects stdout to dev.log file
- `2>&1` - Redirects stderr to the same file as stdout

### Reading Backend Logs

**AI assistants should use Read tool to inspect logs:**

```bash
# Read the entire log file
Read: ../lms-backend/dev.log

# Or read the last portion for recent errors
Read: ../lms-backend/dev.log (with offset for last 200 lines)
```

### Common Backend Error Patterns

| Error Pattern               | Meaning                      | Action                     |
| --------------------------- | ---------------------------- | -------------------------- |
| `ECONNREFUSED`              | Database/service not running | Start required services    |
| `401 Unauthorized`          | Auth token invalid/expired   | Check token generation     |
| `500 Internal Server Error` | Backend code error           | Read stack trace in log    |
| `ValidationError`           | Invalid request payload      | Check request body format  |
| `ENOTFOUND`                 | DNS/network issue            | Check service URLs         |
| `TypeError`                 | Backend code bug             | Check line number in stack |

### AI Debugging Workflow

**Step 1: Identify the failing API call**

```typescript
// Frontend shows error like:
// "Failed to fetch: /api/announcements returned 500"
```

**Step 2: Ask user to run backend with logging**

```
Please run the backend with logging enabled:
cd ../lms-backend && yarn dev > dev.log 2>&1

Then reproduce the error in the frontend.
```

**Step 3: Read the backend log**

```typescript
// AI reads the log file
Read: ../lms-backend/dev.log
```

**Step 4: Analyze the error**

Look for:

- Stack traces (lines starting with `at`)
- Error messages (lines containing `Error:` or `error:`)
- Failed queries (lines containing `SELECT`, `INSERT`, etc.)
- HTTP status codes (400, 401, 403, 404, 500)

### Log File Management

**Clear old logs before debugging:**

```bash
# Clear the log file
> ../lms-backend/dev.log

# Or remove and recreate
rm ../lms-backend/dev.log && touch ../lms-backend/dev.log
```

**Watch logs in real-time (for manual debugging):**

```bash
# In a separate terminal
tail -f ../lms-backend/dev.log
```

### Example: Debugging API Error

**1. Frontend error:**

```
Error: POST /api/announcements failed with status 500
```

**2. Backend log shows:**

```
[2024-01-15 10:30:45] POST /api/announcements
[2024-01-15 10:30:45] Error: Cannot read property 'id' of undefined
    at AnnouncementService.create (src/services/announcement.ts:45:23)
    at AnnouncementController.create (src/controllers/announcement.ts:12:31)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

**3. AI analysis:**

- Error: `Cannot read property 'id' of undefined`
- Location: `src/services/announcement.ts:45`
- Cause: Missing or undefined object when accessing `.id`
- Fix: Add null check or ensure object is passed correctly

### Tips for Effective Log Reading

1. **Search for timestamps** - Find errors that match when you reproduced the issue
2. **Look for stack traces** - They show exact file and line numbers
3. **Check request payloads** - Backend may log incoming request data
4. **Note the order** - Errors may cascade; find the first one
5. **Grep for keywords** - Use Grep tool to find specific error patterns

### When to Use Backend Logs

| Situation                   | Use Backend Logs?            |
| --------------------------- | ---------------------------- |
| Frontend rendering issue    | No                           |
| API returns 500 error       | Yes                          |
| API returns unexpected data | Yes                          |
| Authentication failures     | Yes                          |
| Network timeout             | Maybe (check backend health) |
| Form validation error       | No (frontend validates)      |
| Database query fails        | Yes                          |

## See Also

- **Error Handling**: `lookup/architecture/error-handling.md`
- **Code Quality**: `lookup/architecture/code-quality.md`
- **Pre-Commit Checks**: `lookup/best-practice/pre-commit.md`
