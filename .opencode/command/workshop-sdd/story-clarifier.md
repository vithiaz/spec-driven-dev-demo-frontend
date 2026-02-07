---
agent: build
description: Prompt for generating structured clarification questions from user stories. Creates clarification documents with standardized format, identity tracking, and comprehensive question categories to ensure complete requirement understanding before OpenSpec generation.
---

## Project-Specific Documentation & Best Practices

**IMPORTANT**: For AI-specific projects or when clarifying implementation approaches, you MUST read relevant documentation:

1. **Best Practices**: When questions involve implementation patterns, coding standards, or recommended approaches:
   - **READ**: `lookup/best-practice/` directory
   - Examples: Component structure, state management patterns, testing approaches, code organization

2. **Architecture Decisions**: When questions involve system design, module structure, or architectural patterns:
   - **READ**: `lookup/architecture/` directory
   - Examples: Folder structure, dependency management, API layer design, data flow

3. **Common Pitfalls**: When questions involve error handling, edge cases, or known issues:
   - **READ**: `lookup/pitfalls/clarifier.md` file
   - Examples: Performance issues, security concerns, common bugs, anti-patterns

**When to Apply:**
- Reference these docs when formulating clarification questions about technical approaches
- Include relevant documentation references in the "Context" field of questions
- Ensure clarifications align with established project patterns and avoid known pitfalls

**Example Question with Documentation Reference:**
```markdown
**[FILE_STRUCTURE] - Component Organization**
- **Question**: Should the organization list use the standard list component pattern?
- **Context**: According to `lookup/best-practice/component-patterns.md`, list components should follow the container/presenter pattern. Need confirmation for this feature.
- **Impact**: Determines component structure and affects maintainability
- **Answer**: [Product owner fills]
```
---

## ⚠️ PITFALLS REVIEW (MANDATORY)

**Before generating clarification questions, you MUST read `lookup/pitfalls/clarifier.md`** to avoid asking unnecessary questions that are already covered by project conventions.

**Common unnecessary questions to avoid (examples):**

- **Case 1**: Asking about route paths when project follows RESTful conventions documented in `lookup/architecture/routing.md`
- **Case 2**: Asking about file structure when project has established patterns in `lookup/architecture/folder-structure.md`
- **Case 3**: Asking about pagination defaults when standard is documented in `lookup/best-practice/list-patterns.md`
- **Case 4**: Asking about error handling when patterns exist in `lookup/architecture/error-handling.md`
- **Case 5**: Asking about form validation when standard rules are in `lookup/best-practice/form-patterns.md`

**These are the most frequently encountered unnecessary questions. Reading the full pitfalls document will save significant clarification cycles.**

**Why this matters:** Reading the pitfalls document will prevent generating redundant questions that waste product owner time and delay the development process.

**📝 CONTRIBUTING TO PITFALLS DOCUMENT**

When you encounter a new common question pattern that should be documented:
1. **Identify the pattern**: If a question type keeps appearing across multiple stories with the same standard answer
2. **Add to pitfalls**: Update `lookup/pitfalls/clarifier.md` with the new case
3. **Format**: Follow the existing case format (Case N: Description, Why it's unnecessary, Standard answer)
4. **Purpose**: Help future clarification sessions avoid the same redundant questions

---

## STEP 0: PROVIDE USER STORY (REQUIRED)

<!-- STEP 0: Check if Story path is provided -->
<StoryPathCheck>
  $ARGUMENTS
</StoryPathCheck>

<!-- If no Story path is provided, ask the user for it -->
If the above arguments do not contain a file path to a Story YAML file (e.g., stories/auth/login-story.yaml), then:
1. Ask the user: "Please provide the path to the Story YAML file (e.g., stories/auth/login-story.yaml)"
2. Stop and wait for the user to provide the Story path
3. Do not proceed with any other steps

<!-- STEP 0: Validate Story file exists -->
Once you have the Story path:
1. If the path is relative (doesn't start with `/`), resolve it relative to the current working directory using `pwd`
2. Check if the Story file exists at the resolved path
3. If the file does NOT exist, inform the user: "Story file not found at [path]. Please provide a valid Story file path."
4. Stop if the Story file does not exist
5. If the file exists, read it and proceed to STEP 0.1

---

## STEP 0.1: DETECT AND READ API DOCUMENTATION (AUTOMATIC)

**Instructions:**
1. **Detect API Documentation**: After reading the story file, search for any nodes with prefix "api:" (e.g., `api:default/bff-lms-backend-master-jobs-rest-api`)
2. **If API nodes detected**:
   - Extract the API name from the "api:" prefix (format: `api:<namespace>/<api-name>`)
   - Parse the API name to get the folder name: remove the "bff-lms-backend-" prefix to get the folder
   - Example: `api:default/bff-lms-backend-master-jobs-rest-api` → folder is `master-jobs`
   - Construct the API documentation path: `api/<folder>/swagger.yaml`
   - Example: `api:default/bff-lms-backend-master-jobs-rest-api` → `api/master-jobs/swagger.yaml`
   - Read the `swagger.yaml` file from the constructed path (this contains the OpenAPI specification)
3. **If no API nodes detected**: Skip API documentation reading and proceed with clarification generation
4. The API documentation helps generate accurate API-related clarification questions

**Once story is read (and API doc if applicable), proceed with the instructions below.**

---

## 1. Clarification Document Identity (MANDATORY)

**Every clarification document MUST start with a unique identifier section at the very top:**

```yaml
---
id: [unique-clarifier-id]
storyName: [original-story-name-or-identifier]
clarifiedDate: [YYYY-MM-DD]
---
```

### File Location Convention

**ALL clarification documents MUST be created in:**

```
clarifiers/<module>/<no>-<feature-name>-clarifier.md
```

**Format Rules:**
- `<module>`: The module/area name (e.g., `settings`, `course-management`, `user-profile`)
- `<no>`: Sequential number (01, 02, 03, etc.) - **MUST check existing clarifiers in the module folder and use the next available number**
- `<feature-name>`: Descriptive feature name in kebab-case
- Always ends with `-clarifier.md`

**Examples:**
- `clarifiers/settings/01-organization-list-clarifier.md`
- `clarifiers/course-management/02-course-creation-wizard-clarifier.md`
- `clarifiers/user-profile/01-profile-view-clarifier.md`

**IMPORTANT**: These are example file paths only. The actual file naming, module name, and location MUST be determined based on the specific user story being clarified. Extract the appropriate module and feature name from the story context.

### Identity Rules:

1. **id** - Must be unique and follow naming convention:
   - Format: `[project]-[module]-[feature]-clarifier`
   - Example: `lms-setting-organization-list-clarifier`
   - Must be lowercase with hyphens
   - Should match the filename (without number prefix)

2. **storyName** - Original story identifier or name:
   - Should match the source story reference
   - Example: `lms-frontend-setting-view-list-organization-story`

3. **clarifiedDate** - Date when clarification was created:
   - Format: YYYY-MM-DD
   - Example: `2025-12-04`
---

## 2. Clarification Process (MANDATORY)
**NOTE**: This is an illustrative example. Actual values (file path, id, storyName, title) must be derived from the user story being clarified.

```markdown
File: clarifiers/settings/01-organization-list-clarifier.md

---
id: lms-setting-organization-list-clarifier
storyName: lms-frontend-setting-view-list-organization-story
clarifiedDate: 2025-12-04
---

# Organization List Management - Clarifications

## ⚠️ CLARIFICATIONS REQUIRED

[Questions follow here...]
```

---

## 2. Clarification Process (MANDATORY)

**GOAL**: Generate **clarification questions** for any unclear or missing requirements from the story to ensure accurate OpenSpec implementation planning.

**Core Rules**:
- Derive questions **ONLY from explicitly written content** (objective, business flow, acceptance criteria)
- **Never invent or assume** new requirements
- Always ask for concrete, specific answers

### A. Determine Page Type (ALWAYS FIRST)

**MUST ask this question before any other clarifications:**

```markdown
**[UI_LAYOUT] - Page Type Determination**
- **Question**: What type of page/component should be used for this story?
- **Context**: Determines applicable clarification sections and template layout
- **Impact**: Defines which patterns to clarify (LIST/FORM/DETAIL/VISUALIZATION)
- **Answer**: [Product owner fills this]
```
---

## 3. Universal Clarification Sections (Apply to ALL Stories)

### B. Routing & Navigation
- Route path (new or existing page to modify)
- Entry point (which page navigates here)
- Back-navigation behavior

### C. File Structure & Naming
- Affected file paths: pages, modules, hooks, components, mappers
- Naming conventions: folders, files, hooks, functions

### D. API Integration
- Endpoint names and parameters
- Response structure (reference Swagger/backstage)
- Error handling: 4xx and 5xx behaviors

**IMPORTANT**: When asking API-related clarifications:
1. **Always check** API path that already provided for existing API documentation
2. **Reference specific API spec files** in questions (e.g., `api/organization-management/organization-rest-api.yaml`)
3. **Quote exact endpoint definitions** from the documentation when available
4. **Ask for missing details** only if not documented in backstage API specs
5. **Verify response structures** match what's defined in OpenAPI/Swagger specs
6. **External API Documentation**: When API documentation is in an external file (third-party APIs, external services), you are **APPROVED to access and read** those external API documentation files

**Example Question with API Reference:**
```markdown
**[API] - Organization List Endpoint**
- **Question**: The API spec at `api/organization-management/organization-rest-api.yaml` shows `GET /api/v1/organizations` but doesn't specify the pagination parameters. What are the expected query parameters?
- **Context**: Story requires paginated list but API spec is incomplete
- **Impact**: Cannot implement data fetching without parameter specification
- **Answer**: [Product owner fills]
```

## 4. Pattern-Specific Clarification Sections

### E. List/Table Behavior (for `list` or `card` page types)
- Columns: which to display, which are sortable, default sort
- Search: server-side or client-side, debounce timing
- Filters: static or dynamic, data sources
- Pagination: page size, server-side or client-side
- Hierarchy: parent-child relationships, expand/collapse (if applicable)

### F. Detail/View Behavior (for `detail` page type)
- Fields to display and their states (read-only/editable)
- Layout grouping (sections, cards, tabs)
- Empty state and error state behaviors
- Related data display (child entities, references)

### G. Form Behavior (for `form` or `wizard` page types)
- Fields: list, types, validation rules (required, min/max, regex)
- Default/prefilled values
- Layout: single/multi column, sections, tabs
- Submit: button placement, disabled state, success/failure behaviors
- Cancel: confirmation if dirty
- Delete: confirmation modal, soft/hard delete

### H. Visualization Behavior (for `dashboard` page type)
- Chart types (bar, line, pie, area, stacked)
- Data aggregation and time range selectors
- Tooltip, empty state, refresh behaviors
- API endpoints for chart data

### J. Implicit Behaviors (ALL page types)
- Loading, disabled, retry, optimistic update states
- Any behavior mentioned in flow but not in acceptance criteria

---

---

## 5. Blocking Rule

**If ANY required item cannot be determined from the story:**
1. Generate a clarification question
2. Stop and wait for answers before proceeding to OpenSpec  

---

## 6. Output Format

### Question Placement
Place all questions at the top of the story document:

```markdown
# [Story Title]

---
## ⚠️ CLARIFICATIONS REQUIRED

[Questions here]
---
```

### Question Format
```markdown
**[CATEGORY] - [Subsection]**
- **Question**: [Specific question]
- **Context**: [What triggered this question]
- **Impact**: [Why needed for implementation]
- **Answer**: [Product owner fills]
```
---

### Category Labels
Use exact labels: `[ROUTING]`, `[FILE_STRUCTURE]`, `[API]`, `[UI_LAYOUT]`, `[LIST_BEHAVIOR]`, `[DETAIL_VIEW]`, `[FORM_BEHAVIOR]`, `[VISUALIZATION]`, `[IMPLICIT_BEHAVIOR]`

### Formatting Rules
1. **Group by category** - Keep same-section questions together
2. **No assumptions** - Ask rather than guess
3. **Be specific** - Questions must enable definitive answers
4. **Add priority** (optional): `[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, `[LOW]`

### Example Output

**NOTE**: This is an illustrative example. Generate questions based on the actual user story content, not these examples.

```markdown
# User Profile Management
---
## ⚠️ CLARIFICATIONS REQUIRED

**[ROUTING] - Route Path**
- **Question**: What is the exact route path?
- **Context**: Story mentions "profile page" without URL
- **Impact**: Required for routing configuration
- **Answer**: 

[CRITICAL] **[API] - Endpoint**
- **Question**: What endpoint fetches user data?
- **Context**: "Display user data" mentioned, endpoint not specified
- **Impact**: Blocks data fetching implementation
- **Answer**: 
---
```

---

## 7. Final Checklist

Before submitting clarifications:
- [ ] Clarification file created in `clarifiers/<module>/<no>-<feature-name>-clarifier.md`
- [ ] YAML frontmatter with id, storyName, clarifiedDate at top of file
- [ ] Page type question asked first
- [ ] Questions placed at top of story document (within clarifier file)
- [ ] All questions follow required format with category labels
- [ ] Context and impact provided for each
- [ ] Questions grouped by category
- [ ] No assumptions made - only questions derived from story
- [ ] Priority levels added where applicable

**OUTPUT**: Single clarification file in `clarifiers/<module>/` folder with formatted question list.

**SCOPE**: This prompt ONLY creates the clarification document. DO NOT create:
- ❌ OpenSpec documents (spec.md)
- ❌ Task documents (task.md)
- ❌ Design documents (design.md)
- ❌ Implementation code
- ❌ Any other files

**NEXT STEP**: After clarifications are answered by product owner, the answers feed into the OpenSpec generation phase.

**RULE**: NO ASSUMPTIONS ALLOWED.