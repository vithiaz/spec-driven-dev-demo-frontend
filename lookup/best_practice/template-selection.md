# Template Selection Guide

## Overview

This guide explains how to select and use the appropriate page template based on the `Page Type` specified in the clarifier document or Backstage story.

## Template Location

All page templates are located in: `src/components/templates/`

Available templates:

- `TablePage.tsx` - List/table views
- `CardPage.tsx` - Card-based grid layouts
- `DetailPage.tsx` - Detail/view pages
- `FormPage.tsx` - Create/edit forms
- `ChartPage.tsx` - Dashboard/analytics pages
- `WizardPage.tsx` - Multi-step forms/wizards
- `ModalPage.tsx` - Modal-based interactions

## How to Determine Which Template to Use

### Step 1: Find the Page Type in Clarifier

Look for the `Page Type` field in the clarifier document at:

```
clarifiers/<module>/<no>-<feature-name>-clarifier.md
```

The Page Type is typically specified in the Story Information section or in the clarification answers.

### Step 2: Map Page Type to Template

Use this mapping table to select the appropriate template:

| Page Type   | Template File                             | Description                                      | Use Cases                                    |
| ----------- | ----------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| `list`      | `src/components/templates/TablePage.tsx`  | List/table views with search, filter, pagination | Organization list, User list, Course catalog |
| `card`      | `src/components/templates/CardPage.tsx`   | Card-based grid layouts                          | Dashboard cards, Product gallery             |
| `detail`    | `src/components/templates/DetailPage.tsx` | Single item detail/view pages                    | User profile, Course details, Order details  |
| `form`      | `src/components/templates/FormPage.tsx`   | Create/edit forms                                | Create user, Edit organization, Settings     |
| `dashboard` | `src/components/templates/ChartPage.tsx`  | Dashboard/summary pages with metrics             | Analytics, Reports summary, Overview         |
| `wizard`    | `src/components/templates/WizardPage.tsx` | Multi-step forms/processes                       | Course creation wizard, Onboarding flow      |
| `modal`     | `src/components/templates/ModalPage.tsx`  | Modal-based interactions                         | Quick actions, Confirmation dialogs          |
| `other`     | _(custom implementation)_                 | Pages that don't fit standard patterns           | Unique page layouts                          |

### Step 3: Combination Page Types

**For pages that require multiple templates** (e.g., `Page Type: "form+modal"` or `Page Type: "list+detail"`):

1. **Identify all components** - Break down the Page Type into individual types
   - Example: `"list+detail"` = List view + Detail view
   - Example: `"form+modal"` = Form + Modal interaction

2. **Use multiple templates** - Combine templates as needed:

   ```tsx
   // Example: List page with modal form
   import TablePage from '@/components/templates/TablePage';
   import ModalPage from '@/components/templates/ModalPage';
   import FormPage from '@/components/templates/FormPage';

   // Use TablePage for main layout
   // Use ModalPage + FormPage for create/edit modal
   ```

3. **Follow the primary Page Type** for the main layout:
   - For `"list+modal"` - Use TablePage as main layout, ModalPage for interactions
   - For `"detail+form"` - Use DetailPage for view mode, FormPage for edit mode
   - For `"dashboard+list"` - Use ChartPage as main layout, embed TablePage components

## Important Notes

### Templates Provide LAYOUT STRUCTURE ONLY

- **DO NOT** copy template code blindly
- Templates show the **structural pattern** and **composition approach**
- **Actual implementation must follow**:
  - Backstage story requirements
  - OpenSpec spec.md requirements
  - Clarifier answers
  - API documentation

### What to Take from Templates

**CORRECT - Use templates for:**

- Overall page structure/layout pattern
- Component composition approach
- Section arrangement (header, filters, content, footer)
- Responsive layout patterns

**WRONG - DO NOT use templates for:**

- Specific data fields or columns
- Business logic or validation rules
- API endpoints or data fetching
- Filter options or search criteria

### Example: List Page Implementation

**Given:**

- Clarifier specifies `Page Type: list`
- Feature: User management list

**Approach:**

1. Reference `src/components/templates/TablePage.tsx` for layout structure
2. Read clarifier for actual requirements (columns, filters, actions)
3. Read API documentation for available endpoints
4. Implement using actual requirements, NOT template data

```tsx
// CORRECT: Use template structure, own requirements
<DataTable
  columns={userListColumns}        // From clarifier/spec
  filters={userListFilters}        // From clarifier/spec
  searchPlaceholder="Search users" // From i18n messages
/>

// WRONG: Copying template data directly
<DataTable
  columns={templateColumns}  // Don't use template's columns
  filters={templateFilters}  // Don't use template's filters
/>
```

## Validation Checklist

Before finalizing implementation, verify:

- [ ] Page Type identified from clarifier or Backstage story
- [ ] Correct template(s) selected from mapping table
- [ ] Template used for LAYOUT STRUCTURE only
- [ ] All actual requirements from clarifier/spec implemented
- [ ] API documentation verified for data structure
- [ ] Combined templates properly if Page Type is combination
- [ ] Responsive layout follows template pattern
- [ ] Accessibility patterns from template applied
- [ ] i18n messages added for all user-facing text
