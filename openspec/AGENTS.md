# OpenSpec Instructions

Instructions for AI coding assistants using OpenSpec for spec-driven development.

## Page Type Templates Reference (MUST BE FOLLOW FOR REFERENCE)

When implementing pages, reference the appropriate layout template based on `spec.pageType` in Backstage story:

| pageType    | Description                                      | Template File                             | Use Case                                     |
| ----------- | ------------------------------------------------ | ----------------------------------------- | -------------------------------------------- |
| `list`      | List/table views with search, filter, pagination | `src/components/templates/TablePage.tsx`  | Organization list, User list, Course catalog |
| `card`      | Card-based grid layouts                          | `src/components/templates/CardPage.tsx`   | Dashboard cards, Product gallery             |
| `detail`    | Single item detail/view pages                    | `src/components/templates/DetailPage.tsx` | User profile, Course details, Order details  |
| `form`      | Create/edit forms                                | `src/components/templates/FormPage.tsx`   | Create user, Edit organization, Settings     |
| `dashboard` | Dashboard/summary pages with metrics             | `src/components/templates/ChartPage.tsx`  | Analytics, Reports summary, Overview         |
| `wizard`    | Multi-step forms/processes                       | `src/components/templates/WizardPage.tsx` | Course creation wizard, Onboarding flow      |
| `modal`     | Modal-based interactions                         | `src/components/templates/ModalPage.tsx`  | Quick actions, Confirmation dialogs          |
| `other`     | Pages that don't fit standard patterns           | _(custom implementation)_                 | Unique page layouts                          |

**Important:** Templates provide LAYOUT STRUCTURE ONLY. Actual implementation must follow Backstage story and OpenSpec spec.md requirements.

## TL;DR Quick Checklist

- Search existing work: `openspec spec list --long`, `openspec list` (use `rg` only for full-text search)
- Decide scope: new capability vs modify existing capability
- Pick a unique `change-id`: kebab-case, verb-led (`add-`, `update-`, `remove-`, `refactor-`)
- Scaffold: `proposal.md`, `tasks.md`, `design.md`, and delta specs per affected capability
- Write deltas: use `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`; include at least one `#### Scenario:` per requirement
- Validate: `openspec validate [change-id] --strict` and fix issues
- Request approval: Do not start implementation until proposal is approved

## Three-Stage Workflow

### Stage 1: Creating Changes

Create proposal when you need to:

- Add features or functionality
- Make breaking changes (API, schema)
- Change architecture or patterns
- Optimize performance (changes behavior)
- Update security patterns

Triggers (examples):

- "Help me create a change proposal"
- "Help me plan a change"
- "Help me create a proposal"
- "I want to create a spec proposal"
- "I want to create a spec"

Loose matching guidance:

- Contains one of: `proposal`, `change`, `spec`
- With one of: `create`, `plan`, `make`, `start`, `help`

Skip proposal for:

- Bug fixes (restore intended behavior)
- Typos, formatting, comments
- Dependency updates (non-breaking)
- Configuration changes
- Tests for existing behavior

**Workflow**

1. Review `openspec/project.md`, `openspec list`, and `openspec list --specs` to understand current context.
2. **Read related Backstage story/screen YAML** in `backstage/stories/` or `backstage/screen/` to understand acceptance criteria.
3. **Check pageType and reference appropriate layout template:**
   - Verify story has `spec.pageType` field (list/card/detail/form/dashboard/wizard/modal/other)
   - **Reference the matching template** from the Page Type Templates Reference table at the top of this document
   - Example: `pageType: list` → Use `src/components/templates/TablePage.tsx` as layout guide
   - Template shows layout pattern only - actual components, data, filters determined by story/spec requirements
4. **Verify requirement count alignment:**
   - Count scenarios in `spec.acceptanceCriteria` of the Backstage story
   - Number of `### Requirement:` blocks must EQUAL this count (1:1 mapping)
   - Each requirement can have multiple `#### Scenario:` blocks (not limited)
   - If you need MORE requirements than acceptance criteria exist, STOP and update Backstage story YAML first
   - Add missing acceptance criteria with proper `scenario` and `id` fields to the story
5. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks.md`, optional `design.md`, and spec deltas under `openspec/changes/<id>/`.
6. Draft spec deltas using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement.
7. **Ensure requirementId matches acceptance criteria scenario id** - use exact `id` field from story YAML.
8. **Add identity comments to all code files** using `requirements: [...]` and `scenarios: [...]` array format.
9. Run `openspec validate <id> --strict` and resolve any issues before sharing the proposal.

### Stage 2: Implementing Changes

Track these steps as TODOs and complete them one by one.

1. **Read proposal.md** - Understand what's being built
2. **Read design.md** (if exists) - Review technical decisions
3. **Read tasks.md** - Get implementation checklist
4. **Implement tasks sequentially** - Complete in order
5. **Confirm completion** - Ensure every item in `tasks.md` is finished before updating statuses
6. **Update checklist** - After all work is done, set every task to `- [x]` so the list reflects reality
7. **Approval gate** - Do not start implementation until the proposal is reviewed and approved

### Stage 3: Archiving Changes

After deployment, create separate PR to:

- Move `changes/[modules]/[no]-[name]/` → `changes/archive/[modules]/YYYY-MM-DD-[name]/`
- Update `specs/` if capabilities changed
- Use `openspec archive <change-id> --skip-specs --yes` for tooling-only changes (always pass the change ID explicitly)
- Run `openspec validate --strict` to confirm the archived change passes checks

## Before Any Task

**Context Checklist:**

- [ ] Read relevant specs in `specs/[capability]/spec.md`
- [ ] Check pending changes in `changes/` for conflicts
- [ ] Read `openspec/project.md` for conventions
- [ ] Run `openspec list` to see active changes
- [ ] Run `openspec list --specs` to see existing capabilities

**Before Creating Specs:**

- Always check if capability already exists
- Prefer modifying existing specs over creating duplicates
- Use `openspec show [spec]` to review current state
- **MANDATORY: Read the related Backstage story BEFORE creating spec.md**
  - Locate story in `backstage/stories/<modules>/`
  - Review `spec.acceptanceCriteria` field for Gherkin scenarios
  - **Check `spec.pageType` field** to determine layout template reference:
    - `pageType: list` → Reference `src/components/templates/TablePage.tsx` for LAYOUT ONLY
    - Other pageTypes → Reference appropriate templates (to be added)
    - **Important:** Templates show structure only, NOT complete implementation
  - **Count the number of acceptance criteria scenarios** - this determines the EXACT number of requirements
  - **CRITICAL: Number of `### Requirement:` blocks MUST EQUAL number of acceptance criteria scenarios in Backstage story (1:1 mapping)**
  - Each requirement can have multiple `#### Scenario:` blocks (flexible, not limited to 1)
  - requirementId must match the scenario `id` field from acceptance criteria
  - If you need MORE requirements than acceptance criteria exist, **UPDATE the Backstage story YAML** to add missing acceptance criteria first
  - Never create spec requirements without corresponding acceptance criteria in the story
- If request is ambiguous, ask 1–2 clarifying questions before scaffolding
  - Each acceptance criteria scenario should map to at least one requirement
  - If planning more requirements than scenarios exist, **UPDATE the Backstage story YAML** to add missing scenarios first
  - Never create spec requirements without corresponding acceptance criteria in the story
- If request is ambiguous, ask 1–2 clarifying questions before scaffolding

### Search Guidance

- Enumerate specs: `openspec spec list --long` (or `--json` for scripts)
- Enumerate changes: `openspec list` (or `openspec change list --json` - deprecated but available)
- Show details:
  - Spec: `openspec show <spec-id> --type spec` (use `--json` for filters)
  - Change: `openspec show <change-id> --json --deltas-only`
- Full-text search (use ripgrep): `rg -n "Requirement:|Scenario:" openspec/specs`

## Quick Start

### CLI Commands

```bash
# Essential commands
openspec list                  # List active changes
openspec list --specs          # List specifications
openspec show [item]           # Display change or spec
openspec validate [item]       # Validate changes or specs
openspec archive <change-id> [--yes|-y]   # Archive after deployment (add --yes for non-interactive runs)

# Project management
openspec init [path]           # Initialize OpenSpec
openspec update [path]         # Update instruction files

# Interactive mode
openspec show                  # Prompts for selection
openspec validate              # Bulk validation mode

# Debugging
openspec show [change] --json --deltas-only
openspec validate [change] --strict
```

### Command Flags

- `--json` - Machine-readable output
- `--type change|spec` - Disambiguate items
- `--strict` - Comprehensive validation
- `--no-interactive` - Disable prompts
- `--skip-specs` - Archive without spec updates
- `--yes`/`-y` - Skip confirmation prompts (non-interactive archive)

## Directory Structure

```
openspec/
├── project.md              # Project conventions
├── specs/                  # Current truth - what IS built
│   └── [capability]/       # Single focused capability
│       ├── spec.md         # Requirements and scenarios
│       └── design.md       # Technical patterns
├── changes/                # Proposals - what SHOULD change
│   ├── [module-name]/
│   |   ├── [change-name]/
│   │   |   ├── proposal.md     # Why, what, impact
│   │   |   ├── tasks.md        # Implementation checklist
│   │   |   ├──design.md       # Technical decisions (optional; see criteria)
│   │   └── ├──specs/          # Delta changes
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # Completed changes
```

## Creating Change Proposals

### Decision Tree

```
New request?
├─ Bug fix restoring spec behavior? → Fix directly
├─ Typo/format/comment? → Fix directly
├─ New feature/capability? → Create proposal
├─ Breaking change? → Create proposal
├─ Architecture change? → Create proposal
└─ Unclear? → Create proposal (safer)
```

### Proposal Structure

1. **Create directory:** `changes/[change-id]/` (kebab-case, verb-led, unique)

2. **Write proposal.md:**

```markdown
---
id: lms-feature-design-id
storyName: lms-frontend-feature-story-name
clarifierId: lms-feature-clarifier-id
componentName: lms-frontend-component-name
---

# Change: [Brief description of change]

## Why

[1-2 sentences on problem/opportunity]

## What Changes

- [Bullet list of changes]
- [Mark breaking changes with **BREAKING**]

## Impact

- Affected specs: [list capabilities]
- Affected code: [key files/systems]
```

3. **Create spec deltas:** `specs/[capability]/spec.md`

```markdown
---
id: lms-feature-capability-id
storyName: lms-frontend-feature-story-name
clarifierId: lms-feature-clarifier-id
componentName: lms-frontend-component-name
---

## ADDED Requirements

### Requirement: New Feature

<!-- requirementId: lms-feature-new-feature -->

The system SHALL provide...

#### Scenario: Success case

<!-- scenarioId: new-feature-success -->

- **WHEN** user performs action
- **THEN** expected result

## MODIFIED Requirements

### Requirement: Existing Feature

<!-- requirementId: lms-feature-existing-feature -->

[Complete modified requirement]

#### Scenario: Updated behavior

<!-- scenarioId: existing-feature-updated -->

- **WHEN** condition
- **THEN** result

## REMOVED Requirements

### Requirement: Old Feature

<!-- requirementId: lms-feature-old-feature -->

**Reason**: [Why removing]
**Migration**: [How to handle]
```

If multiple capabilities are affected, create multiple delta files under `changes/[change-id]/specs/<capability>/spec.md`—one per capability.

4. **Create tasks.md:**

```markdown
---
id: lms-feature-design-id
storyName: lms-frontend-feature-story-name
clarifierId: lms-feature-clarifier-id
componentName: lms-frontend-component-name
---

## 1. Implementation

- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component
- [ ] 1.4 Write tests
```

5. **Create design.md**
   Create `design.md`:

- Cross-cutting change (multiple services/modules) or a new architectural pattern
- New external dependency or significant data model changes
- Security, performance, or migration complexity
- Ambiguity that benefits from technical decisions before coding

Minimal `design.md` skeleton (with required frontmatter):

```markdown
---
id: lms-feature-design-id
storyName: lms-frontend-feature-story-name
clarifierId: lms-feature-clarifier-id
componentName: lms-frontend-component-name
---

## Context

[Background, constraints, stakeholders]

## Goals / Non-Goals

- Goals: [...]
- Non-Goals: [...]

## Decisions

- Decision: [What and why]
- Alternatives considered: [Options + rationale]

## Risks / Trade-offs

- [Risk] → Mitigation

## Migration Plan

[Steps, rollback]

## Open Questions

- [...]
```

## Spec File Format

### Required: Frontmatter Identity and IDs

**One story per spec file.** Each spec file (in `specs/`, `changes/*/specs/`, and `archive/*/specs/`) represents exactly one user story.

**ALL** spec (proposal.md, design.md, proposal.md, tasks.md) files MUST begin containing identity metadata:

```markdown
---
id: lms-organization-management-list
storyName: lms-frontend-setting-view-list-organization-journey
clarifierId: lms-setting-organization-list
componentName: lms-frontend-setting-page
---

## Requirements

### Requirement: Organization List Page

<!-- requirementId: lms-organization-list-page -->

#### Scenario: User views organization list with data

<!-- scenarioId: view-organization-list -->
```

**Required frontmatter fields:**

- `id` - Unique identifier for this spec (kebab-case)
- `storyName` - Associated user story/journey name
- `clarifierId` - Related clarification/requirement ID
- `componentName` - Component or page this spec belongs to

**Required inline IDs:**

- Each `### Requirement:` MUST have an HTML comment immediately after with `<!-- requirementId: ... -->` and before description requirement
  - **requirementId MUST match a scenario id from Backstage story `spec.acceptanceCriteria`**
  - Format: Use the exact scenario `id` field from the story YAML
  - This creates direct traceability from story acceptance criteria to spec requirements
- Each `#### Scenario:` MUST have an HTML comment immediately after with `<!-- scenarioId: ... -->`
- IDs should be kebab-case and unique within the spec
- **Scenario IDs MUST align with the related story/journey** defined in the frontmatter's `storyName` field
  - Example: If `storyName: lms-frontend-setting-view-list-organization-journey`, scenario IDs should reflect this context (e.g., `view-organization-list`, `search-organization-list`)
- **Requirements and Scenarios MUST align with acceptance criteria** from the related Backstage story
  - Before creating spec.md, read the corresponding story in `backstage/stories/`
  - Each requirement should minimum map to acceptance criteria defined in the story's `spec.acceptanceCriteria` field
    **Example validation:**

```yaml
# backstage/stories/announcement/lo-view-announcement-journey.yaml
spec:
  acceptanceCriteria:
    - scenario: Display announcement summary
      id: display-announcement-summary-by-status # Use this as requirementId
    - scenario: Display list
      id: display-announcement-list # Use this as requirementId
    - scenario: Search announcement
      id: search-announcement-by-title # Use this as requirementId
    - scenario: Apply filters
      id: filter-announcement-by-criteria # Use this as requirementId
    # Total: 4 acceptance criteria scenarios → Need EXACTLY 4 requirements (### Requirement:) in spec.md
    # But can have many #### Scenario: blocks under each requirement
```

Maps to spec.md:

```markdown
### Requirement: Display Announcement Summary

<!-- requirementId: display-announcement-summary-by-status -->

The system SHALL display summary of announcements by status.

#### Scenario: User views announcement summary with data

<!-- scenarioId: view-summary-with-data -->

- **WHEN** user navigates to announcement page
- **THEN** system displays summary cards with published and scheduled counts

#### Scenario: User views announcement summary with no data

<!-- scenarioId: view-summary-empty-state -->

- **WHEN** no announcements exist
- **THEN** system displays summary cards with zero counts

---

### Requirement: Display Announcement List

<!-- requirementId: display-announcement-list -->

The system SHALL display paginated list of announcements.

#### Scenario: User views announcement list with data

<!-- scenarioId: view-list-with-data -->

- **WHEN** announcements exist in system
- **THEN** system displays table with all announcement data

#### Scenario: User views empty announcement list

<!-- scenarioId: view-list-empty-state -->

- **WHEN** no announcements exist
- **THEN** system displays empty state message
```

**Key points:**

- 4 acceptance criteria scenarios → 4 requirements (### Requirement:)
- Each requirement has multiple scenarios (#### Scenario:) for different cases
- requirementId matches Backstage story scenario.id
- scenarioId is unique per test case, does NOT need to match story

If planning 6 requirements but only 4 scenarios exist in story:

1. STOP creating spec
2. Update Backstage story YAML to add 2 more scenarios with unique `id` fields
3. Then proceed with spec creation using those IDs as requirementId

**Code Identity Requirements:**

- **ALL implemented code files MUST include identity comments at the top**
- Use array format for `requirements` and `scenarios`, even for single IDs
- Format: `/* requirements: [...], scenarios: [...] */`
- Example: `/* requirements: [lms-org-list-page], scenarios: [view-org-list, search-org] */`

**Placement:**

- Frontmatter must be at the very top of every spec.md file
- Requirement IDs directly after requirement headers
- Applies to both main specs and delta specs in changes
- Must be preserved when archiving

### Critical: Scenario Formatting

**CORRECT** (use #### headers with scenario IDs aligned to story):

````markdown
#### Scenario: User login success

**Important:** The `scenarioId` must align with the story context. For example:

- Story: `lms-frontend-auth-login-journey` → Scenario IDs: `user-login-success`, `invalid-credentials-rejected`
- Story: `lms-frontend-setting-view-list-organization-journey` → Scenario IDs: `view-organization-list`, `search-organization-list`

**Critical: Alignment with Backstage Acceptance Criteria**

Before writing scenarios, locate and read the related Backstage story YAML file:

1. Find story in `backstage/stories/<modules>/`
2. Review the `spec.acceptanceCriteria`
3. scenarioId must be match with related stories in `backstage/stories/`

Example alignment:

```yaml
# backstage/stories/auth/login.yaml
- scenario: Aplikasi menampilkan ringkasan jumlah data announcement berdasarkan status
  id: display-announcement-summary-by-status
```
````

Maps to spec.md:

```markdown
#### Scenario: Valid login

<!-- scenarioId: user-login-success -->

- **WHEN** valid credentials submitted
- **THEN** user is authenticated and redirected to dashboard
```

- **THEN** return JWT token

````

**Important:** The `scenarioId` must align with the story/journey context. For example:

- Story: `lms-frontend-auth-login-journey` → Scenario IDs: `user-login-success`, `invalid-credentials-rejected`
- Story: `lms-frontend-setting-view-list-organization-journey` → Scenario IDs: `view-organization-list`, `search-organization-list`

**WRONG** (don't use bullets or bold):

```markdown
- **Scenario: User login** ❌
  **Scenario**: User login ❌

### Scenario: User login ❌

#### Scenario: User login (missing scenarioId comment) ❌
````

Every requirement MUST have at least one scenario. Every scenario MUST have a `scenarioId` comment.

**WRONG** (don't use bullets or bold):

```markdown
- **Scenario: User login** ❌
  **Scenario**: User login ❌

### Scenario: User login ❌
```

Every requirement MUST have at least one scenario.

### Requirement Wording

<!-- requirementId: display-announcement-list -->

- Use SHALL/MUST for normative requirements (avoid should/may unless intentionally non-normative)

### Delta Operations

- `## ADDED Requirements` - New capabilities
- `## MODIFIED Requirements` - Changed behavior
- `## REMOVED Requirements` - Deprecated features
- `## RENAMED Requirements` - Name changes

Headers matched with `trim(header)` - whitespace ignored.

#### When to use ADDED vs MODIFIED

- ADDED: Introduces a new capability or sub-capability that can stand alone as a requirement. Prefer ADDED when the change is orthogonal (e.g., adding "Slash Command Configuration") rather than altering the semantics of an existing requirement.
- MODIFIED: Changes the behavior, scope, or acceptance criteria of an existing requirement. Always paste the full, updated requirement content (header + all scenarios). The archiver will replace the entire requirement with what you provide here; partial deltas will drop previous details.
- RENAMED: Use when only the name changes. If you also change behavior, use RENAMED (name) plus MODIFIED (content) referencing the new name.

Common pitfall: Using MODIFIED to add a new concern without including the previous text. This causes loss of detail at archive time. If you aren’t explicitly changing the existing requirement, add a new requirement under ADDED instead.

Authoring a MODIFIED requirement correctly:

1. Locate the existing requirement in `openspec/specs/<capability>/spec.md`.
2. Copy the entire requirement block (from `### Requirement: ...` through its scenarios).
3. Paste it under `## MODIFIED Requirements` and edit to reflect the new behavior.
4. Ensure the header text matches exactly (whitespace-insensitive) and keep at least one `#### Scenario:`.

Example for RENAMED:

```markdown
## RENAMED Requirements

- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## Troubleshooting

### Common Errors

**"Change must have at least one delta"**

- Check `changes/[name]/specs/` exists with .md files
- Verify files have operation prefixes (## ADDED Requirements)

**"Requirement must have at least one scenario"**

- Check scenarios use `#### Scenario:` format (4 hashtags)
- Don't use bullet points or bold for scenario headers

**Silent scenario parsing failures**

- Exact format required: `#### Scenario: Name`
- Debug with: `openspec show [change] --json --deltas-only`

### Validation Tips

```bash
# Always use strict mode for comprehensive checks
openspec validate [change] --strict

# Debug delta parsing
openspec show [change] --json | jq '.deltas'

# Check specific requirement
openspec show [spec] --json -r 1
```

## Happy Path Script

````bash
# 1) Explore current state
openspec spec list --long
openspec list
# Optional full-text search:
# 3) Add deltas (example)
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
---
id: lms-auth-two-factor
storyName: lms-frontend-auth-two-factor-journey
clarifierId: lms-auth-2fa-requirement
componentName: lms-frontend-auth-module
---

## ADDED Requirements
### Requirement: Two-Factor Authentication
<!-- requirementId: lms-auth-2fa-requirement -->

Users MUST provide a second factor during login.

#### Scenario: OTP required
<!-- scenarioId: otp-required -->
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required

#### Scenario: Invalid OTP rejected
<!-- scenarioId: invalid-otp-rejected -->

- **WHEN** incorrect OTP is provided
- **THEN** access is denied with error message
EOF*WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOFADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.
auth/spec.md
```markdown
---
id: lms-auth-two-factor
storyName: lms-frontend-auth-two-factor-journey
clarifierId: lms-auth-2fa-requirement
componentName: lms-frontend-auth-module
---

## ADDED Requirements
### Requirement: Two-Factor Authentication
<!-- requirementId: lms-auth-2fa-requirement -->

...

#### Scenario: OTP required
<!-- scenarioId: otp-required -->
...
````

notifications/spec.md

````markdown
---
id: lms-notifications-otp-email
storyName: lms-frontend-notifications-otp-journey
clarifierId: lms-notifications-otp-requirement
componentName: lms-frontend-notifications-module
---

## ADDED Requirements

### Requirement: OTP Email Notification

<!-- requirementId: lms-notifications-otp-email-requirement -->

...

#### Scenario: OTP email sent successfully

<!-- scenarioId: otp-email-sent -->

...

```lms-notifications-otp-email
storyName: lms-frontend-notifications-otp-journey
clarifierId: lms-notifications-otp-requirement
componentName: lms-frontend-notifications-module
---

## ADDED Requirements
### Requirement: OTP Email Notification
...
```
````

auth/spec.md

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication

...
```

notifications/spec.md

```markdown
## ADDED Requirements

### Requirement: OTP Email Notification

...
```

## Best Practices

### Code Identity in Implementation

**When implementing specs, ALL code files MUST include identity comments:**

```typescript
/**
 *  requirements: [requirement-id-1, requirement-id-2]
 *  scenarios: [scenario-id-1, scenario-id-2, scenario-id-3]
 */
```

**Rules:**

- Always use array format, even for single IDs: `requirements: [single-id]`
- Place at the top of every created/modified file
- Include all relevant requirement and scenario IDs that the file implements
- Use kebab-case for IDs

**Examples by file type:**

```typescript
// Page file
/**
 *  requirements: [lms-organization-list-page]
 *  scenarios: [view-organization-list]
 **/
export default function OrganizationListPage() {}

// Component with multiple scenarios
/**
 *  requirements: [lms-organization-list-page]
 *  scenarios: [view-organization-list, search-organization, filter-organization]
 **/
export function OrganizationTable() {}

// Hook with multiple requirements
/**
 *  requirements: [lms-organization-list-page, lms-organization-filter]
 *  scenarios: [view-organization-list, filter-organization-by-status]
 **/
export function useOrganizationList() {}

// Test file covering multiple scenarios
/**
 *  requirements: [lms-organization-list-page]
 *  scenarios: [view-organization-list, search-organization, filter-organization, sort-organization]
 **/
describe('OrganizationListPage', () => {});
```

**Verification checklist:**

- [ ] All code files have identity comments
- [ ] Using array format for requirements and scenarios
- [ ] IDs match those defined in spec.md
- [ ] IDs traceable back to Backstage acceptance criteria

### Simplicity First

- Default to <100 lines of new code
- Single-file implementations until proven insufficient
- Avoid frameworks without clear justification
- Choose boring, proven patterns

### Complexity Triggers

Only add complexity with:

- Performance data showing current solution too slow
- Concrete scale requirements (>1000 users, >100MB data)
- Multiple proven use cases requiring abstraction

### Clear References

- Use `file.ts:42` format for code locations
- Reference specs as `specs/auth/spec.md`
- Link related changes and PRs

### Capability Naming

- Use verb-noun: `user-auth`, `payment-capture`
- Single purpose per capability
- 10-minute understandability rule
- Split if description needs "AND"

### Change ID Naming

- Use kebab-case, short and descriptive: `add-two-factor-auth`
- Prefer verb-led prefixes: `add-`, `update-`, `remove-`, `refactor-`
- Ensure uniqueness; if taken, append `-2`, `-3`, etc.

## Tool Selection Guide

| Task                  | Tool | Why                      |
| --------------------- | ---- | ------------------------ |
| Find files by pattern | Glob | Fast pattern matching    |
| Search code content   | Grep | Optimized regex search   |
| Read specific files   | Read | Direct file access       |
| Explore unknown scope | Task | Multi-step investigation |

## Error Recovery

### Change Conflicts

1. Run `openspec list` to see active changes
2. Check for overlapping specs
3. Coordinate with change owners
4. Consider combining proposals

### Validation Failures

1. Run with `--strict` flag
2. Check JSON output for details
3. Verify spec file format
4. Ensure scenarios properly formatted

### Missing Context

1. Read project.md first
2. Check related specs
3. Review recent archives
4. Ask for clarification

## Quick Reference

### Stage Indicators

- `changes/` - Proposed, not yet built
- `specs/` - Built and deployed
- `archive/` - Completed changes

### File Purposes

- `proposal.md` - Why and what
- `tasks.md` - Implementation steps
- `design.md` - Technical decisions
- `spec.md` - Requirements and behavior

### CLI Essentials

```bash
openspec list              # What's in progress?
openspec show [item]       # View details
openspec validate --strict # Is it correct?
openspec archive <change-id> [--yes|-y]  # Mark complete (add --yes for automation)
```

Remember: Specs are truth. Changes are proposals. Keep them in sync.
