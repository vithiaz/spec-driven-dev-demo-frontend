---
agent: build
description: Automatically answer all clarification questions from clarifier documents by analyzing the original story, project documentation, best practices, and architecture decisions.
---

## STEP 0: PROVIDE CLARIFIER PATH (REQUIRED)

<!-- STEP 0: Check if Clarifier path is provided -->
<ClarifierPathCheck>
  $ARGUMENTS
</ClarifierPathCheck>

<!-- If no Clarifier path is provided, check uncommitted files -->
If the above arguments do not contain a file path to a Clarifier file (e.g., clarifiers/auth/01-login-journey-clarifier.md), then:
1. Run `git status --short` to find uncommitted files in the `clarifiers/` directory
2. Filter for files matching the pattern `clarifiers/**/*-clarifier.md`
3. If NO uncommitted clarifier files are found:
   - Ask the user: "Please provide the path to the Clarifier file (e.g., clarifiers/auth/01-login-journey-clarifier.md)"
   - Stop and wait for the user to provide the Clarifier path
4. If exactly ONE uncommitted clarifier file is found:
   - Use that file automatically and proceed
5. If MORE THAN ONE uncommitted clarifier file is found:
   - Show the list of uncommitted clarifier files to the user
   - Ask the user to choose which one to use
   - Stop and wait for the user's choice
6. Do not proceed with other steps until a clarifier file is selected

<!-- STEP 0: Validate Clarifier file exists -->
Once you have the Clarifier path:
1. Check if the Clarifier file exists at the provided path
2. If the file does NOT exist, inform the user: "Clarifier file not found at [path]. Please provide a valid Clarifier file path."
3. Stop if the Clarifier file does not exist
4. If the Clarifier file IS found, read it and proceed with answering clarifications

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

**Before answering clarification questions, you MUST read `lookup/pitfalls/clarifier.md`** to avoid providing answers that contradict project conventions.

**Common answer patterns documented in pitfalls (examples):**

- **Case 1**: Route paths - Use RESTful conventions per `lookup/architecture/routing.md`
- **Case 2**: File structure - Follow patterns in `lookup/architecture/folder-structure.md`
- **Case 3**: Pagination defaults - Standard values in `lookup/best-practice/list-patterns.md`
- **Case 4**: Error handling - Patterns from `lookup/architecture/error-handling.md`
- **Case 5**: Form validation - Standard rules in `lookup/best-practice/form-patterns.md`

**These are the most frequently encountered patterns. Reading the full pitfalls document ensures consistent answers across all clarifications.**

**Why this matters:** Reading the pitfalls document ensures your answers align with project standards and prevents suggesting approaches that have known issues.

**📝 CONTRIBUTING TO PITFALLS DOCUMENT**

When you encounter a new common question-answer pattern that should be documented:
1. **Identify the pattern**: If a question type appears repeatedly with the same standard answer
2. **Add to pitfalls**: Update `lookup/pitfalls/clarifier.md` with the new case
3. **Format**: Follow the existing case format (Case N: Question pattern, Standard answer, Source reference)
4. **Purpose**: Help future answer sessions provide consistent, project-aligned responses

---

## STEP 1: READ THE ORIGINAL STORY

**IMPORTANT**: Before answering questions, you MUST read the original story file:

1. **Locate the Story File**: 
   - The clarifier frontmatter contains `storyName` field
   - The story is typically located at `backstage/stories/<module>/<story-name>.yaml`
   - If the story path cannot be determined, ask the user for the story file location

2. **Read the Story**: 
   - Read the entire story YAML file
   - Understand the objective, business flow, and acceptance criteria
   - This is the PRIMARY source for answering questions

3. **Read Referenced API Documentation** (if applicable):
   - Check if the story references API nodes (e.g., `api:default/bff-lms-backend-master-jobs-rest-api`)
   - Locate and read the corresponding API documentation (e.g., `backstage/api/<module>/swagger.yaml`)
   - This provides technical details for API-related questions

---

## STEP 2: ANSWER ALL QUESTIONS AUTOMATICALLY

**GOAL**: You MUST answer ALL questions in the Clarifier file. Do NOT just detect unanswered questions.

**Process**:

1. **Identify ALL unanswered questions**:
   - Look for questions where `- **Answer**:` is empty, contains "[Product owner fills]", "TBD", "TODO", or similar placeholders
   - Count the total number of unanswered questions

2. **Answer EACH question** by consulting these sources in order:
   
   **a) Original Story (PRIMARY SOURCE)**:
   - Check the story objective, business flow, and acceptance criteria
   - Most answers should come directly from the story content
   - If the story explicitly mentions a detail, use that as the answer
   
   **b) Referenced API Documentation**:
   - For API-related questions, reference the API spec files (Swagger/OpenAPI)
   - Quote exact endpoint paths, parameters, and response structures
   - Use this for questions about endpoints, request/response formats, error codes
   
   **c) Project Documentation**:
   - Read `lookup/best-practice/` for implementation patterns and coding standards
   - Read `lookup/architecture/` for structural and design decisions
   - Read `lookup/pitfalls/clarifier.md` for known issues and anti-patterns
   - Apply these when answering questions about HOW to implement features
   
   **d) Reasonable Defaults**:
   - If a detail is not specified anywhere, provide a reasonable default based on common practices
   - Clearly indicate when you're providing a default: "Default: [your answer] (not specified in story)"

3. **Write answers that are**:
   - **Specific**: Provide concrete values, paths, endpoint names, validation rules
   - **Actionable**: Answers should enable immediate implementation
   - **Referenced**: Cite the source (story line, API doc, best practice doc) when possible
   - **Complete**: No placeholders or "TBD" - every answer must be filled

4. **Update the Clarifier file**:
   - Replace ALL placeholder answers with actual answers
   - Keep the question format intact
   - Maintain the category labels and structure
   - Save the updated clarifier file

---

## STEP 3: ANSWER FORMAT GUIDELINES

**For each question category, follow these guidelines**:

### [ROUTING] Questions
- Answer with exact route paths (e.g., `/settings/organizations`, `/profile/edit`)
- Reference existing routing patterns from `lookup/architecture/routing.md` if available
- If not specified in story, use RESTful conventions

### [FILE_STRUCTURE] Questions
- Provide exact file paths following project conventions
- Reference `lookup/architecture/folder-structure.md` for naming patterns
- Example: `src/pages/settings/organizations/OrganizationListPage.tsx`

### [API] Questions
- Quote exact endpoints from API documentation
- Specify HTTP methods, parameters, and response structures
- Example: `GET /api/v1/organizations?page=1&limit=20`
- Include error handling requirements (4xx, 5xx)

### [UI_LAYOUT] Questions
- Specify component type (list, form, detail, dashboard)
- Reference UI patterns from `lookup/best-practice/component-patterns.md`
- Describe layout structure (single column, grid, tabs)

### [LIST_BEHAVIOR] Questions
- Specify columns, sorting, filtering, pagination details
- Provide concrete values (e.g., "Page size: 20 items", "Default sort: name ascending")
- Reference search behavior (server-side/client-side, debounce timing)

### [FORM_BEHAVIOR] Questions
- List all fields with types and validation rules
- Specify required fields, min/max lengths, regex patterns
- Define submit/cancel/delete behaviors

### [IMPLICIT_BEHAVIOR] Questions
- Define loading states, error states, retry logic
- Specify optimistic updates if applicable
- Reference error handling patterns from `lookup/pitfalls/`

---

## STEP 4: VALIDATION

After answering all questions, validate:

1. **Every `- **Answer**:` field has content**
2. **No placeholders remain** ("[Product owner fills]", "TBD", "TODO")
3. **Answers are specific and actionable**
4. **Sources are cited** when possible (e.g., "From story line 45", "As per API spec")

**If you cannot answer a question** because critical information is truly missing:
- State: "UNABLE TO ANSWER: [reason]"
- Explain what information is needed
- Suggest where to find the information (e.g., "Needs product owner input on business rule")

---

## EXAMPLE: Before and After

### BEFORE (Unanswered):
```markdown
**[ROUTING] - Route Path**
- **Question**: What is the exact route path for the organization list page?
- **Context**: Story mentions "organization list" without specifying URL
- **Impact**: Required for routing configuration
- **Answer**: [Product owner fills]
```

### AFTER (Answered):
```markdown
**[ROUTING] - Route Path**
- **Question**: What is the exact route path for the organization list page?
- **Context**: Story mentions "organization list" without specifying URL
- **Impact**: Required for routing configuration
- **Answer**: `/settings/organizations` (Following RESTful conventions and existing settings module structure per `lookup/architecture/routing.md`)
```

---

## FINAL OUTPUT

After completing all answers:

1. **Update the clarifier file** with all answers filled in
2. **Report summary** to user:
   - "✅ Answered [X] questions in [clarifier-file-path]"
   - List any questions that could not be answered with reasons
3. **Next step**: The clarifier is now ready for OpenSpec generation

---