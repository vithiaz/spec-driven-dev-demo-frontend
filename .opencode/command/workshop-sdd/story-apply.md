---
agent: build
description: Implement an approved OpenSpec change and keep tasks in sync (requires completed OpenSpec).
---

The user has requested to implement the following change proposal. Find the change proposal and follow the instructions below. Make decisions based on best practices and project conventions. Only ask for clarification if you encounter a true blocker that prevents implementation.

<UserRequest>
  $ARGUMENTS
</UserRequest>

**PREREQUISITES**

- OpenSpec change package MUST exist in `openspec/changes/<change-id>/`
- Change MUST include: proposal.md, tasks.md, specs/<capability>/spec.md
- Change MUST pass `openspec validate <change-id> --strict`
  <!-- OPENSPEC:START -->
  <!-- STEP 4: REQUIRED READING BEFORE IMPLEMENTATION (CRITICAL) -->

**Guardrails**

- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.

**CRITICAL: Production Code Quality (MANDATORY)**

🚨 **NEVER commit debugging code**

**1. Console Logging (PRODUCTION SAFETY)**

**FORBIDDEN in production code:**

```typescript
// ❌ BAD - Debug logging in production:
console.log("User data:", userData);
console.error("API failed:", error);
console.warn("Deprecated feature");
console.debug("Component rendered");
console.info("Request sent");
```

**ALLOWED logging:**

```typescript
// ✅ GOOD - Production error logging (if project uses logging library):
logger.error("Failed to fetch announcements", { error });
logger.warn("API response delayed", { duration });

// ✅ GOOD - Error boundary logging:
if (error instanceof Error) {
  logError("Component error", error);
}
```

**Check project standards:**

- Read `lookup/best-practice/logging.md` (if exists) for logging conventions
- Read `lookup/architecture/error-handling.md` (if exists) for error logging patterns
- If no standards exist: **Remove ALL console.\* statements from production code**

**2. Code Quality Checklist (PRE-COMMIT)**

**Before marking implementation complete, verify:**

**1. No console.log in production code**

- Use skill(name="search-files") to search for: `console\.(log|error|warn|debug|info)` in `src/`
- Review each match - remove unless it's production logging

**Automated checks (if project has them):**

- Run linter: `npm run lint` or project-specific command (see `lookup/architecture/testing.md`)
- Run formatter: `npm run format` or project-specific command
- Run type checker: `tsc --noEmit` or project-specific command

**Check project standards:**

- Read `lookup/architecture/code-quality.md` (if exists) for quality standards
- Read `lookup/best-practice/pre-commit.md` (if exists) for pre-commit checks

**Why this matters:**

- **console.log**: Exposes sensitive data, clutters browser console, unprofessional
- **Code quality**: Prevents bugs, improves maintainability, follows team standards

**If you find issues during checklist:**

- Fix them before marking tasks complete
- Re-run checks after fixes
- Update tasks.md only when implementation is truly complete

**Steps**
Track these steps as TODOs and complete them one by one.

1. Read `changes/<id>/proposal.md`, `design.md` (if present), and `tasks.md` to confirm scope and acceptance criteria.
2. **Read `lookup/pitfalls/openspec-apply.md` to avoid common implementation mistakes** (especially Case 4 for dialogs, Case 7 for components, Case 8 for server actions).
3. Work through tasks sequentially, keeping edits minimal and focused. Refer to openspec/project.md and lookup/pitfalls/openspec-apply.md for guidance or document new approaches if needed.
4. Confirm completion—verify every task is fully implemented before updating statuses.
5. **MANDATORY: Update `changes/<id>/tasks.md` file** - You MUST use the Edit tool to modify the actual tasks.md file:
   - Mark each completed task with `- [x]` (change `[ ]` to `[x]`)
   - Do NOT just say you will update it - actually edit the file using the Edit tool
   - Verify the file was updated by reading it back after editing
6. Use openspec list or openspec show <item> for additional context.

**⚠️ CRITICAL: tasks.md Update Requirement**

After implementing tasks, you MUST physically update the `tasks.md` file:

```
WRONG (do not do this):
"Now let me update the tasks.md to mark all completed tasks..."
[Does not actually edit the file]

CORRECT (required):
1. Use Edit tool to change `- [ ] 1.1 Task name` to `- [x] 1.1 Task name`
2. Repeat for each completed task
3. Verify by reading the file to confirm changes were saved
```

**Reference**

- Use `openspec show <id> --json --deltas-only` if you need additional context from the proposal while implementing.

**Reference**

- Use `openspec show <id> --json --deltas-only` if you need additional context from the proposal while implementing.

1. Project Guidelines (MANDATORY)
   Review project-specific guidelines to ensure compliance with established standards:

- **Best Practice**: `lookup/best-practice/` - Recommended approaches and patterns
- **Architecture**: `lookup/architecture/` - Project architecture, structure, and design decisions
- **Pitfalls**: `lookup/pitfalls/openspec-apply.md` - **CRITICAL: Common implementation mistakes to avoid**

**Action**: Review relevant guidelines before proceeding with specification

**⚠️ PITFALLS REVIEW (MANDATORY)**

Before implementing, you MUST read `lookup/pitfalls/openspec-apply.md` to avoid common mistakes:

- **Case 1**: Using wrong Button props (`label` vs `buttonLabel`)
- **Case 4**: Creating separate modal components instead of using `useDialogConfirmation` hook
- **Case 7**: Importing PrimeReact components directly instead of wrapper components
- **Case 8**: Using `fetch()` instead of `createInternalApiClient()` in Server Actions

These are the most frequently encountered issues. Reading the full pitfalls document will save significant debugging time.

2. Clarification Document (MANDATORY)

- **Location**: `clarifiers/<module>/<no>-<feature-name>-clarifier.md` (discovered in Step 3)
- **Purpose**: Contains answered clarification questions from product owner
- **Action**: Read ALL questions and answers to understand requirements completely

3. API Documentation (OPTIONAL - Check Clarifiers First)

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

4. Reading Protocol

**Step-by-step process:**

1. **Review project guidelines** - Check `lookup/` folder for relevant best-practices, and conventions
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
1. Read: backstage/stories/settings/organization-list-journey.yaml
2. Read: clarifiers/settings/01-organization-list-clarifier.md
3. Check clarifier: Identify if API integration is needed, check specified API doc path
4. Read: [path-from-clarifier]/organization-rest-api.yaml
5. Verify: Clarification answers match API capabilities and documentation exists
6. Create: OpenSpec document with accurate technical details
   OR Flag: Missing/incomplete API documentation as a blocker
```

**Example Reading Sequence (no API integration):**

```
1. Read: backstage/stories/ui/dashboard-layout-journey.yaml
2. Read: clarifiers/ui/01-dashboard-layout-clarifier.md
3. Check clarifier: No API integration required (frontend-only feature)
4. Create: OpenSpec document with UI/UX specifications only
```

<!-- OPENSPEC:END -->
