# Project Context

## Purpose

This is a demo project to showcase Spec-Driven Development using AI assistants.
The project will implement a complete authentication flow with user registration, login, password reset, and profile management.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **UI Libraries:** React 19, PrimeReact 10.8, Tailwind CSS, PrimeFlex
- **State Management:** Zustand + TanStack Query (React Query v5)
- **Backend Integration:** Supabase (with SSR support)
- **Forms & Validation:** Zod
- **Data Visualization:** Chart.js with react-chartjs-2
- **Internationalization:** next-intl
- **Testing:** Jest + React Testing Library
- **Linting/Formatting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Commit Conventions:** Commitlint with conventional commits

## Project Conventions

### Code Style

- **TypeScript strict mode** everywhere - no implicit `any`
- **File naming:**
  - React components: PascalCase (e.g., `OrganizationListTable.tsx`)
  - Hooks: camelCase starting with `use` (e.g., `useOrganizationList.ts`)
  - Server actions: kebab-case (e.g., `organization-api.ts`)
  - API routes: `route.ts` (Next.js convention)
  - Other files: kebab-case
- **Import paths:** Use aliases (`@/`, `@/actions/*`, `@/modules/*`, etc.) instead of relative paths
- **Formatting:** Prettier with 2-space indentation
- **data-testid format:** `<feature>-<page>-<element-type>-<name>`
- **Supabase tables:** dash-case (e.g., `master-organizations`)
- **Component exports:** Export types and all public functions
- **No direct imports from `primereact`** - use wrapper components from `src/components` only

### Architecture Patterns

- **Next.js 16 App Router structure:**
  - Routes: `src/app/<modules>/<feature>/<page>/page.tsx`
  - Internal API routes: `src/app/api/<modules>/route.ts` (Next.js Route Handlers)
  - No legacy `pages/` folder usage
- **Server Actions:** `src/actions/<modules>/<feature>.ts` - call internal API routes, provide type-safe server-side functions
- **Feature modules:** `src/modules/<feature>/` containing components and hooks
- **Mappers:** `src/mappers/<modules>/<feature>Mapper.ts` transform API responses to view models
- **Data flow:** Server Action → Internal API Route → Mapper → ViewModel → UI
- **Page structure:** Page orchestration → Feature hooks → Feature components
- **Shared resources organized by type:**
  - UI components: `src/components`
  - Hooks: `src/hooks`
  - State: `src/state`
  - Utils: `src/utils`
  - Types: `src/types`
  - Integration clients: `src/lib`

### Testing Strategy

- **Location:** `__tests__/<modules>/<feature>/<Page>.test.tsx`
- **Stack:** Jest with React Testing Library in jsdom environment
- **Coverage requirements for list pages:**
  - Column rendering, pagination, sorting, search with debounce
  - Filters and reset filters behavior
  - API integration (load, search, sort, paginate, error handling)
  - Row-level actions (details, edit, delete)
  - All UI states (loading, empty, error-with-retry)
  - Accessibility (labels, keyboard nav, ARIA attributes)
  - Required data-testid attributes
- **Query strategy:** Prefer semantic queries (`getByRole`, `getByLabelText`)
- **Run commands:** `yarn test` or `yarn test:watch`

### Git Workflow

- **Branching strategy:**
  - `dev` branch for day-to-day development
  - `main` branch for production releases
- **Commit conventions:** Conventional commits enforced by commitlint
- **Pre-commit hooks:** lint-staged runs linting and type-checking
- **Deployment:** Push semantic version tags (e.g., `v1.0.0`) from `main` branch
- **PR requirements:**
  - Pass `yarn lint`, `yarn test`, `yarn tsc --noEmit`, `yarn build`
  - Reference Backstage stories and check off acceptance criteria

## Domain Context

This LMS (Learning Management System) serves enterprise learning and training management needs with the following key domains:

- **User Management:** Organizations, departments, roles, and user profiles
- **Course Management:** Course creation, content, categories, and metadata
- **Learning Roadmap:** Structured learning paths and progression tracking
- **Learning Enrollment:** Course registration and enrollment management
- **Learning Assessment:** Quizzes, tests, and evaluation mechanisms
- **Learning Session:** Scheduled training sessions and attendance
- **Reports & Completion:** Progress tracking, certificates, and analytics
- **Announcements & Notifications:** Communication system for learners
- **Profile Management:** User settings, avatars, and preferences

**Backstage specs** in `backstage/` folder serve as the source of truth for:

- User stories and acceptance criteria
- API specifications (REST endpoints)
- Actor/role definitions
- Relationships between features
- Screen definitions and navigation flows

## Important Constraints

1. **No placeholders in production code** - no TODO comments, example values, or mock data in final output
2. **Mandatory clarification before implementation** - must restate task understanding and get approval
3. **One story per spec file** - OpenSpec specs must align to single user stories
4. **Required frontmatter and IDs** - all spec files need id, storyName, clarifierId, componentName
5. **Accessibility is non-negotiable** - semantic HTML, ARIA attributes, keyboard navigation required
6. **No new architectural patterns** - reuse existing folder structure and patterns
7. **UI component restrictions** - only use components from `src/components`, never direct PrimeReact imports
8. **Production-ready only** - all code must compile, pass tests, and be deployment-ready

## External Dependencies

- **Supabase:** Database and authentication backend (Supabase-compatible Raiden backend)
  - Client setup: `src/lib/supabase`
  - SSR support via `@supabase/ssr`
  - Type definitions: `src/lib/supabase/types.ts`
- **Backstage:** Source of truth for domain modeling and specifications
  - Location: `backstage/` folder
  - Contains: stories, screens, API specs, relationships
- **Environment variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Cookie domain settings
  - Raiden base URL per environment
- **CI/CD:** Deployment triggered by semantic version tags from `main` branch
