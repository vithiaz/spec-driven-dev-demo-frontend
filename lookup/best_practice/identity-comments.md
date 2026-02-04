# Identity Comments

Format and placement of identity comments in code files.

## What are Identity Comments?

Identity comments link code files to OpenSpec requirements and scenarios. They enable:

- **Traceability**: Track which code implements which requirements
- **Coverage**: Verify all requirements have implementation
- **Change Impact**: Identify affected code when requirements change
- **Test Mapping**: Link tests to requirements

## Format

```typescript
/**
 *  requirements: [requirement-id-1, requirement-id-2]
 *  scenarios: [scenario-id-1, scenario-id-2]
 **/
```

**Rules:**

- Always use array format `[]`, even for single IDs
- Use kebab-case for IDs
- Include ALL relevant requirement and scenario IDs
- Place at top of file (before imports)

## Placement

### TypeScript/JavaScript Files

```typescript
/**
 *  requirements: [ac-0001-announcement-list]
 *  scenarios: [scenario-view-list, scenario-search]
 **/

import { useState } from 'react';
import { useAnnouncements } from './hooks';

export function AnnouncementList() {
  // Component implementation
}
```

### E2E Test Files

```typescript
/**
 *  requirements: [ac-0001-announcement-list, ac-0002-announcement-create]
 *  scenarios: [scenario-view-list, scenario-search, scenario-create]
 **/

import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Requirement: ac-0001-announcement-list', () => {
  // Test implementation
});
```

### React Component Files

```typescript
/**
 *  requirements: [ac-0003-announcement-delete]
 *  scenarios: [scenario-delete-confirmation, scenario-delete-success]
 **/

import React from 'react';

export function DeleteAnnouncementButton({ id }: Props) {
  // Component implementation
}
```

## Multiple Requirements

When a file implements multiple requirements:

```typescript
/**
 *  requirements: [
 *    ac-0001-announcement-list,
 *    ac-0002-announcement-create,
 *    ac-0003-announcement-delete
 *  ]
 *  scenarios: [
 *    scenario-view-list,
 *    scenario-search,
 *    scenario-create,
 *    scenario-delete
 *  ]
 **/
```

## Requirement ID Format

**Full format:** `ac-NNNN-full-story-id-from-spec`

**Example:** `ac-0003-lms-frontend-announcement-delete-journey`

**Where to get:**

- From `<!-- requirementId: ... -->` in OpenSpec spec files
- From Backstage story `spec.acceptanceCriteria[].id` field

**NOT acceptable:**

- `ac-003-delete-announcement` (incomplete, missing leading zeros)
- `ac-0003-delete` (truncated)
- `ac-3-announcement` (wrong format)

## Scenario ID Format

**Format:** Kebab-case descriptive name

**Examples:**

- `scenario-view-list`
- `scenario-search-announcements`
- `scenario-create-success`
- `scenario-delete-confirmation`

**NOT acceptable:**

- `Scenario 1` (not kebab-case)
- `scenarioViewList` (camelCase)
- `scenario_view_list` (snake_case)

## Examples by File Type

### Page Component

```typescript
/**
 *  requirements: [ac-0001-announcement-list]
 *  scenarios: [scenario-view-list]
 **/

export default function AnnouncementsPage() {
  return <AnnouncementList />;
}
```

### Hook

```typescript
/**
 *  requirements: [ac-0001-announcement-list]
 *  scenarios: [scenario-view-list, scenario-search]
 **/

export function useAnnouncements(searchTerm: string) {
  // Hook implementation
}
```

### API Route

```typescript
/**
 *  requirements: [ac-0002-announcement-create]
 *  scenarios: [scenario-create-success]
 **/

export async function POST(request: Request) {
  // API implementation
}
```

### Utility Function

```typescript
/**
 *  requirements: [ac-0003-announcement-delete]
 *  scenarios: [scenario-delete-success]
 **/

export function deleteAnnouncement(id: string) {
  // Utility implementation
}
```

## Verification

Check identity comments exist:

```bash
# Search for files with identity comments
grep -r "requirements:" src/

# Search for specific requirement
grep -r "ac-0001-announcement-list" src/
```

## Benefits

### Traceability

- Know which code implements which requirement
- Track requirement coverage
- Impact analysis for changes

### Coverage

- Verify all requirements have implementation
- Find missing implementations
- Ensure complete feature coverage

### Maintenance

- Identify affected code when requirements change
- Find all files related to a feature
- Refactor with confidence

## Checklist

- [ ] Add identity comments to ALL created/modified files
- [ ] Place at top of file (before imports)
- [ ] Use array format for requirements
- [ ] Use array format for scenarios
- [ ] Use full requirement IDs (ac-NNNN-full-id)
- [ ] Use kebab-case for scenario IDs
- [ ] Include ALL relevant IDs

## See Also

- **E2E Overview**: `lookup/e2e/overview.md`
- **E2E Templates**: `lookup/e2e/templates.md`
