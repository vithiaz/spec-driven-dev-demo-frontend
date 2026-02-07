---
agent: build
description: Convert structured product stories into a validated OpenSpec specification with strict schema enforcement.
---

<!-- STEP 1: Check if Story path is provided -->
<StoryPathCheck>
  $ARGUMENTS
</StoryPathCheck>

<!-- If no Story path is provided, ask the user for it -->
If the above arguments do not contain a file path to a Story YAML file (e.g., stories/auth/login-journey.yaml), then:
1. Ask the user: "Please provide the path to the Story YAML file (e.g., stories/auth/login-journey.yaml)"
2. Stop and wait for the user to provide the Story path
3. Do not proceed with any other steps

<!-- STEP 2: Validate Story file exists -->
Once you have the Story path:
1. Check if the Story file exists at the provided path
2. If the file does NOT exist, inform the user: "Story file not found at [path]. Please provide a valid Story file path."
3. Stop if the Story file does not exist

<!-- STEP 3: Derive and validate Clarifier file -->
The Story file name and clarifier file name have a specific relationship:
- Story path pattern: `stories/<module>/<feature-name>.yaml`
- Clarifier path pattern: `clarifiers/<module>/<no>-<feature-name>-clarifier.md`

Example:
- Story: `stories/auth/login-journey.yaml`
- Clarifier: `clarifiers/auth/01-login-journey-clarifier.md`

Steps:
1. Extract the module and feature name from the Story path
2. Search for a clarifier file matching the pattern: `clarifiers/<module>/*-<feature-name>-clarifier.md`
3. If NO clarifier file is found:
   - Inform the user: "No clarifier found for this Story. Please run: /clarifier <story-path>"
   - Stop and do not proceed with the proposal
4. If a clarifier file IS found, note its path for use in the next steps

<!-- STEP 4: REQUIRED READING BEFORE IMPLEMENTATION (CRITICAL) -->
**Before creating any OpenSpec or implementation, you MUST read:**

### 4.1 Project Guidelines (MANDATORY)
Review project-specific guidelines to ensure compliance with established standards:

- **Pitfalls**: `lookup/pitfalls/` - Common mistakes and anti-patterns to avoid
- **Best Practice**: `lookup/best-practice/` - Recommended approaches and patterns
- **Architecture**: `lookup/architecture/` - Project architecture, structure, and design decisions

**Action**: Review relevant guidelines before proceeding with specification

### 4.2 Clarification Document (MANDATORY)
- **Location**: `clarifiers/<module>/<no>-<feature-name>-clarifier.md` (discovered in Step 3)
- **Purpose**: Contains answered clarification questions from product owner
- **Action**: Read ALL questions and answers to understand requirements completely

### 4.3 API Documentation (OPTIONAL - Check Clarifiers First)
- **When Required**: Only if the feature requires API integration (check clarifier for API references)
- **Location**: Varies by project - check clarifier document for API documentation paths
- **Purpose**: Contains OpenAPI/Swagger specifications for backend endpoints, third-party APIs, or external services
- **If API integration is needed**:
  - Check clarifier document for API endpoint specifications and documentation locations
  - Review API documentation files at the path specified in clarifier
  - Confirm endpoint availability, parameters, and response formats
  - If external API: You are **APPROVED to access and read** external API documentation
  - If missing: Flag this as a blocker in the proposal
- **If no API integration needed**: Skip this step and proceed with frontend-only or standalone features

### 4.4 Reading Protocol

**Step-by-step process:**
1. **Review project guidelines** - Check `lookup/` folder for relevant pitfalls, best-practices, and conventions
2. **Read Story YAML file** - Get all user scenarios and requirements
3. **Read clarification file** - Get all answered questions and check for API integration requirements
4. **Determine API needs** - Check if feature requires API integration (look for API references in clarifier)
5. **If API integration needed**:
   - Locate API documentation path from clarifier
   - Read API documentation - Understand available endpoints, parameters, responses, error codes
   - Cross-reference - Ensure clarifications align with API capabilities
   - Document gaps - Note any mismatches or missing API documentation
6. **If no API needed** - Proceed with frontend-only or standalone implementation
7. **Proceed with spec** - Only after completing above steps (or flagging blockers if required API docs don't exist)

**Example Reading Sequence (with API integration):**
```
1. Review: lookup/pitfalls/, lookup/best-practice/, lookup/architecture/
2. Read: stories/settings/organization-list-journey.yaml
3. Read: clarifiers/settings/01-organization-list-clarifier.md
4. Check clarifier: Identifies API integration needed, specifies API doc path
5. Read: [path-from-clarifier]/organization-rest-api.yaml
6. Verify: Clarification answers match API capabilities and documentation exists
7. Create: OpenSpec document with accurate technical details
   OR Flag: Missing/incomplete API documentation as a blocker
```

**Example Reading Sequence (no API integration):**
```
1. Review: lookup/pitfalls/, lookup/best-practice/, lookup/architecture/
2. Read: stories/ui/dashboard-layout-journey.yaml
3. Read: clarifiers/ui/01-dashboard-layout-clarifier.md
4. Check clarifier: No API integration required (frontend-only feature)
5. Create: OpenSpec document with UI/UX specifications only
```

<UserRequest>
  $ARGUMENTS
</UserRequest>
<!-- OPENSPEC:START -->

## OPENSPEC DOCUMENT IDENTITY & STRUCTURE (MANDATORY)

### File Identity Rule (ALL NEW FILES)

**CRITICAL: Every new file created by this process MUST have an identifier section at the very top of the file.**

This applies to ALL files created during the OpenSpec process:
- `proposal.md` - Must have frontmatter with change-id, storyName, date
- `tasks.md` - Must have frontmatter with change-id, storyName
- `design.md` - Must have frontmatter with change-id, storyName
- `spec.md` - Must have full identity frontmatter (see below)

**Why this matters:**
- Enables traceability from any file back to its source story
- Allows quick identification of file purpose and origin
- Supports automated tooling and validation
- Prevents orphaned files with unclear purpose

### Spec Document Identity

**Every OpenSpec document MUST start with a unique identifier section at the very top.**

**Format:**

```yaml
---
id: [unique-spec-id]
storyName: [original-story-identifier]
clarifierId: [clarification-document-id]
componentName: [target-component-name]
---
```

### Other Document Identity Formats

**proposal.md:**
```yaml
---
changeId: [unique-change-id]
storyName: [original-story-identifier]
clarifierId: [clarification-document-id]
createdDate: [YYYY-MM-DD]
---
```

**tasks.md:**
```yaml
---
changeId: [unique-change-id]
storyName: [original-story-identifier]
specId: [spec-document-id]
---
```

**design.md:**
```yaml
---
changeId: [unique-change-id]
storyName: [original-story-identifier]
createdDate: [YYYY-MM-DD]
---
```

---

## WIREFRAME REQUIREMENT (MANDATORY FOR FRONTEND FEATURES)

**For any frontend feature, the `proposal.md` or `design.md` MUST include a wireframe section using markdown-style ASCII art.**

### When to Include Wireframes

- **REQUIRED**: Any feature that involves UI components, pages, forms, lists, modals, or user interactions
- **OPTIONAL**: Backend-only features, API-only changes, or infrastructure updates

### Wireframe Location

- **Simple UI changes**: Include wireframe in `proposal.md` under a `## Wireframe` section
- **Complex UI with multiple views**: Include wireframes in `design.md` under a `## Wireframes` section

### Wireframe Format (Markdown ASCII Style)

Use markdown code blocks with ASCII characters to represent UI layouts:

**Basic Elements:**
```
┌─────────────────────────────────────┐  <- Container/Card border
│                                     │
│  [Button]                           │  <- Button
│  [ Input Field          ]           │  <- Input/Text field
│  [x] Checkbox label                 │  <- Checkbox
│  ( ) Radio option                   │  <- Radio button
│  ▼ Dropdown                         │  <- Dropdown/Select
│                                     │
│  +---------------------------+      │  <- Table/List
│  | Column 1 | Column 2      |      │
│  +---------------------------+      │
│  | Data 1   | Data 2        |      │
│  | Data 3   | Data 4        |      │
│  +---------------------------+      │
│                                     │
└─────────────────────────────────────┘
```

### Wireframe Example (List Page)

```markdown
## Wireframe

### Organization List Page

┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🏢 Organization Management                    [+ Add New] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🔍 [ Search organizations...              ]  [Filter ▼] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Name            │ Status   │ Members │ Actions          │    │
│  ├─────────────────┼──────────┼─────────┼──────────────────┤    │
│  │ Acme Corp       │ ● Active │ 25      │ [Edit] [Delete]  │    │
│  │ Beta Inc        │ ○ Inactive│ 10     │ [Edit] [Delete]  │    │
│  │ Gamma LLC       │ ● Active │ 42      │ [Edit] [Delete]  │    │
│  └─────────────────┴──────────┴─────────┴──────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ < Prev  │ Page 1 of 5 │  Next >      │ Showing 1-10 of 50│   │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Wireframe Example (Form/Modal)

```markdown
### Create Organization Modal

┌─────────────────────────────────────────────────┐
│  Create New Organization                    [X] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Organization Name *                            │
│  [ Enter organization name...        ]          │
│                                                 │
│  Description                                    │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │ Enter description...                    │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Status                                         │
│  ( ) Active  (•) Inactive                       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ [Cancel]                      [Create]  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Wireframe Guidelines

1. **Show all interactive elements**: Buttons, inputs, dropdowns, checkboxes, etc.
2. **Indicate states**: Show active/inactive, selected/unselected states
3. **Label clearly**: Every element should have a clear label or placeholder
4. **Show hierarchy**: Use nesting and borders to show component relationships
5. **Include actions**: Show where action buttons are located
6. **Represent data**: Use sample data to show how real content will appear
7. **Multiple states**: For complex components, show different states (empty, loading, error, populated)

### Wireframe Verification Checklist

- [ ] Wireframe included for all UI components
- [ ] All interactive elements are represented
- [ ] Layout matches the requirements from clarifier
- [ ] Actions and navigation are clearly shown
- [ ] Form fields match the spec requirements
- [ ] Table columns match the data model

---

### Identity Fields

1. **id** - Unique spec identifier:
   - Format: `[project]-[module]-[feature]-[action]`
   - Example: `lms-organization-management-list`
   - Must be lowercase with hyphens
   - Must match the filename pattern

2. **storyName** - Original story reference:
   - Must match the story identifier from the source
   - Example: `lms-frontend-setting-view-list-organization-journey`

3. **clarifierId** - Reference to clarification document:
   - Must match the clarifier document's `id` field
   - Example: `lms-setting-organization-list-clarifier`
   - Links this spec back to the clarification phase

4. **componentName** - Target component/module:
   - Identifies which component this spec applies to
   - Example: `lms-frontend-setting-page`
   - Format: `[project]-[layer]-[module]-[type]`

### Requirement & Scenario Identity

**Each requirement and scenario MUST have a unique identifier.**

**CRITICAL: The `requirementId` in spec.md MUST use the SAME ID as the `scenarioId` from the user story file.**

**Format:**

```markdown
### Requirement: [Requirement Title]
<!-- requirementId: [unique-requirement-id] -->

#### Scenario: [Scenario Description]
<!-- scenarioId: [unique-scenario-id] -->
```

**⚠️ IMPORTANT: The `requirementId` value MUST match the corresponding scenario `id` from the original user story YAML file.**

### ID Naming Conventions

- **Requirement IDs**: `[spec-id]-[requirement-name]` (e.g., `lms-organization-list-page`)
- **Scenario IDs**: `[short-action-description]` (e.g., `view-organization-list`, `create-new-organization`)
- Use kebab-case for all IDs
- Must be unique and descriptive

### Code Identity Tracking (FOR IMPLEMENTATION PHASE - NOT PROPOSAL)

**Note: This section applies during the `openspec apply` phase, not during proposal creation.**

When implementing code from OpenSpec, ALL created or modified files MUST include identity comments.

**CRITICAL: Source of Truth for Implementation**

- **requirements array**: Get IDs from `### Requirement:` blocks in `spec.md` (use requirementId values)
- **scenarios array**: Get IDs from `#### Scenario:` blocks in `spec.md` (use scenarioId values)
- **DO NOT use scenario ID from Backstage story YAML** - those are for requirement mapping only
- The spec.md is the implementation source, Backstage story is the requirements source

**Identity Comments Format**: See `lookup/best-practice/identity-comments.md` for complete format and examples.

### Identity Verification Checklist

Before finalizing the proposal:

- [ ] **All created files have identity frontmatter at the top**
- [ ] proposal.md has changeId, storyName, clarifierId, createdDate, status
- [ ] tasks.md has changeId, storyName, specId
- [ ] design.md has changeId, storyName, createdDate
- [ ] **Wireframe included in proposal.md or design.md (for frontend features)**
- [ ] Spec file has complete YAML frontmatter with all 4 identity fields (id, storyName, clarifierId, componentName)
- [ ] All requirements have `requirementId` in spec.md
- [ ] All scenarios have `scenarioId` in spec.md
- [ ] Requirement IDs match the corresponding scenario IDs from story YAML
- [ ] IDs use kebab-case format
- [ ] All IDs are unique and descriptive

### Traceability Benefits

This identity system enables:

1. **Forward traceability**: Story → Clarification → Spec → Code
2. **Backward traceability**: Code → Spec → Clarification → Story
3. **Impact analysis**: Which code is affected when a requirement changes
4. **Coverage tracking**: Which scenarios have been implemented
5. **Testing alignment**: Map tests to specific scenarios
6. **Code review efficiency**: Reviewers can verify implementation against spec
7. **Maintenance clarity**: Future developers understand why code exists

---

## OPENSPEC GUARDRAILS & WORKFLOW

**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.
- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.
- **Do not write any code during the proposal stage.** Only create design documents (proposal.md, tasks.md, design.md, and spec deltas). Implementation happens in the apply stage after approval.
- **If anything is unclear, incomplete, contradictory, or requires interpretation, do not guess.** Ask for clarification.

**Steps**
1. Review `openspec/project.md`, run `openspec list` and `openspec list --specs`, and inspect related code or docs (e.g., via `rg`/`ls`) to ground the proposal in current behaviour; note any gaps that require clarification.
2. Choose a unique verb-led `change-id` and scaffold `proposal.md`, `tasks.md`, and `design.md` under `openspec/changes/<id>/`.
3. Map the change into concrete capabilities or requirements, breaking multi-scope efforts into distinct spec deltas with clear relationships and sequencing.
4. Capture architectural reasoning in `design.md`, introduces new patterns, or demands trade-off discussion before committing to specs.
5. Draft spec deltas in `changes/<id>/specs/<capability>/spec.md` (one folder per capability) using `## ADDED|MODIFIED|REMOVED Requirements` with at least one `#### Scenario:` per requirement and cross-reference related capabilities when relevant.
6. Ensure all spec deltas include proper identity frontmatter (id, storyName, clarifierId, componentName).
7. Ensure all requirements and scenarios have unique IDs in HTML comments (requirementId, scenarioId).
8. Map scenario IDs from the Story YAML to requirement IDs in the spec.
9. Draft `tasks.md` as an ordered list of small, verifiable work items that deliver user-visible progress, include validation (tests, tooling), and highlight dependencies or parallelizable work.
10. Validate with `openspec validate <id> --strict` and resolve every issue before sharing the proposal.

**Reference**
- Use `openspec show <id> --json --deltas-only` or `openspec show <spec> --type spec` to inspect details when validation fails.
- Search existing requirements with `rg -n "Requirement:|Scenario:" openspec/specs` before writing new ones.
- Explore the codebase with `rg <keyword>`, `ls`, or direct file reads so proposals align with current implementation realities.
- Cross-reference Story YAML scenarios with spec requirements to ensure traceability.

<!-- OPENSPEC:END -->

