---
agent: build
description: Create a revision document with a tracked revision number and validate strictly.
---
The user has requested the following revision. Use the OpenSpec instructions to create their revision package.

<RevisionRequest>
  $ARGUMENTS
</RevisionRequest>

<!-- OPENSPEC-REVISION:START -->
**Guardrails**
- Every revision MUST include a `revision-number` at the top of the generated content.
- Treat revisions as diffs against an existing approved change proposal, not as new proposals.
- Keep edits tightly scoped to what the user requests; do not introduce unrelated modifications.
- Follow the same OpenSpec conventions as proposals (`openspec/AGENTS.md`, project scaffolding, validation rules).
- Identify ambiguity and ask clarifying questions before altering any revision documents.
- Revisions MUST NOT introduce new implementations; only document updates to specs, design, tasks, or rationale.

**Steps**
1. Inspect the existing change using `openspec show <change-id>` and gather relevant context.
2. **Bug Weight Classification (MANDATORY)**
   - Analyze the revision request and determine if this is a **major bug** or **minor bug**.
   - Consider factors such as:
     - **Major bug**: Security issues, data loss, breaking changes, core functionality failures, blocking issues
     - **Minor bug**: UI/UX inconsistencies, typos, non-critical edge cases, cosmetic issues, minor inconveniences
   - Present your suggestion to the user with reasoning.
   - **CRITICAL: You MUST ask the user to confirm whether this is a major or minor bug.**
   - **DO NOT proceed to the next step until the user explicitly answers with "major" or "minor".**
   - If the user's response is unclear or does not specify major/minor, ask again.
3. Determine the next sequential `revision-number` (e.g., `rev1`, `rev2`, …) based on existing revisions under `openspec/changes/<id>/revisions/`.
4. Scaffold a new folder:  
   `openspec/changes/<id>/revisions/<revision-number>/`
5. Create the following documents:
   - `revision.md` — includes:
     - the `revision-number` at the top
     - **bug-weight**: `major` or `minor` (as confirmed by user)
     - a summary of the requested edits
     - justification for the changes
     - list of modified spec deltas
   - `spec-deltas/` — contains updated requirement deltas (`## MODIFIED|REMOVED|ADDED Requirements`)
     with at least one `#### Scenario:` for each requirement changed.
6. Ensure all revisions reference the original proposal and clearly describe what changed and why.
7. Validate with:  
   `openspec validate <change-id> --strict`  
   and fix all issues.
8. Return the revision content, including the visible `revision-number` and `bug-weight` at the top.

**Reference**
- Use `openspec show <id> --json --deltas-only` to inspect the prior state.
- Search existing requirements with:  
  `rg -n "Requirement:|Scenario:" openspec/specs`
- Explore the change history with `ls openspec/changes/<id>` to determine correct sequencing.
<!-- OPENSPEC-REVISION:END -->

