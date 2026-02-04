# Architecture

## Layered Architecture Overview

The project follows a **feature-based modular architecture** combined with a **layered architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│   (Pages, Feature Modules, Components, Hooks, Local State)   │
├─────────────────────────────────────────────────────────────┤
│                   STATE MANAGEMENT LAYER                     │
│              (Zustand Stores + TanStack Query)               │
├─────────────────────────────────────────────────────────────┤
│                      SERVICE LAYER                           │
│    (Server Actions → Internal API Routes → Mappers)          │
├─────────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                         │
│                   (Supabase Client)                          │
├─────────────────────────────────────────────────────────────┤
│                     INFRASTRUCTURE                           │
│          (Supabase: Database, Auth, Storage)                 │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer

**Location**: `src/app/`, `src/modules/`, `src/components/`

Responsible for:

- Rendering UI components
- Handling user interactions
- Managing local component state
- Form validation and submission

Key locations:

- `src/app/<modules>/<feature>/<page>/page.tsx` - Page component (orchestration)
- `src/modules/<feature>/` - Feature-specific components and hooks
- `src/components/` - Shared UI components (PrimeReact wrappers)

### 2. State Management Layer

**Location**: `src/state/`

Responsible for:

- Global application state (Zustand)
- Server state caching (TanStack Query / React Query v5)
- Cross-component data sharing
- State persistence (localStorage)
- User session data

Implementation: Zustand with persist middleware + TanStack Query

### 3. Service Layer

**Location**: `src/actions/<modules>/<feature>.ts`

Responsible for:

- Server-side data operations via Server Actions (`'use server'`)
- Calling internal API routes
- Providing type-safe server-side functions
- Error handling and translation

**Internal API Routes**: `src/app/api/<modules>/route.ts` (Next.js Route Handlers)

### 4. Mapper Layer

**Location**: `src/mappers/<modules>/<feature>Mapper.ts`

Responsible for:

- Transforming API responses to view models
- Data shape normalization
- Decoupling API contracts from UI expectations

### 5. Data Access Layer

**Location**: `src/lib/supabase/`

Responsible for:

- Database connections
- CRUD operations
- Authentication operations
- File storage operations
- SSR support via `@supabase/ssr`

Implementation: Supabase JavaScript Client

Key files:

- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/lib/supabase/types.ts` - Type definitions

## Data Flow

```
User Action
    │
    ▼
┌─────────────────┐
│     Page        │ ◄─── Orchestration (src/app/<modules>/<feature>/page.tsx)
│   (page.tsx)    │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│  Feature Hook   │ ◄─── Business Logic (src/modules/<feature>/hooks/)
│   (hooks.ts)    │      + Global State (Zustand from src/state/)
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  Server Action  │ ◄─── src/actions/<modules>/<feature>.ts
│   ('use server')│
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  Internal API   │ ◄─── src/app/api/<modules>/route.ts
│   (Route Handler)│
└────────┬────────┘
         │ transforms via
         ▼
┌─────────────────┐
│     Mapper      │ ◄─── src/mappers/<modules>/<feature>Mapper.ts
│   (Mapper.ts)   │
└────────┬────────┘
         │ returns
         ▼
┌─────────────────┐
│   ViewModel     │ ◄─── Typed response for UI consumption
└────────┬────────┘
         │ renders
         ▼
┌─────────────────┐
│       UI        │
└─────────────────┘
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── <modules>/                # Module grouping
│   │   └── <feature>/            # Feature pages
│   │       └── <page>/
│   │           └── page.tsx      # Page component
│   └── api/                      # Internal API routes
│       └── <modules>/
│           └── route.ts          # Route handlers
│
├── actions/                      # Server Actions
│   └── <modules>/
│       └── <feature>.ts          # Server action functions
│
├── modules/                      # Feature modules
│   └── <feature>/
│       ├── components/           # Feature-specific components
│       └── hooks/                # Feature-specific hooks
│
├── mappers/                      # Data transformation
│   └── <modules>/
│       └── <feature>Mapper.ts
│
├── components/                   # Shared UI components
│                                 # (PrimeReact wrappers only)
│
├── hooks/                        # Shared hooks
│
├── state/                        # Global state (Zustand stores)
│
├── utils/                        # Utility functions
│
├── types/                        # Shared TypeScript types
│
└── lib/                          # Integration clients
    └── supabase/                 # Supabase client setup
        ├── client.ts
        ├── server.ts
        └── types.ts
```

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MIDDLEWARE                            │
│     (src/middleware.ts - runs on every request)              │
├─────────────────────────────────────────────────────────────┤
│  • Checks authentication state via Supabase                  │
│  • Redirects unauthenticated users to /auth/login            │
│  • Redirects authenticated users away from /auth/*           │
│  • Handles subdomain-based routing                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROTECTED ROUTES                          │
│                    (/cms/*)                                  │
├─────────────────────────────────────────────────────────────┤
│  • CMS Layout checks user metadata                           │
│  • Role-based menu filtering                                 │
│  • Company-specific data scoping                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Client Components for Pages

All page components use `'use client'` directive because they:

- Rely heavily on React hooks (useState, useEffect)
- Handle interactive UI elements
- Use browser APIs

### 2. Server Actions for Data

Server Actions (`'use server'`) in `src/actions/` to:

- Keep database credentials secure
- Reduce client bundle size
- Enable server-side caching
- Provide type-safe API calls

### 3. Internal API Routes

Route Handlers in `src/app/api/` to:

- Define REST endpoints for internal use
- Decouple server actions from direct database access
- Enable reusable API endpoints

### 4. Feature-Based Organization

Code is organized by feature:

- Feature modules in `src/modules/<feature>/`
- Related pages in `src/app/<modules>/<feature>/`
- Reduces cognitive load when working on a feature
- Makes it easy to delete/refactor features

### 5. PrimeReact Wrapper Components

**Important**: No direct imports from `primereact` allowed.

- All UI components must come from `src/components/`
- Wrapper components provide consistent styling and behavior
- Enables project-wide UI changes in one place

### 6. Barrel Exports

Index files (`index.ts`) aggregate exports:

- Cleaner imports (`@/actions` vs `@/actions/auth/login`)
- Single point of change for module structure
- Better encapsulation

### 7. Soft Deletes

Database records use `deleted_at` timestamp:

- Data can be recovered
- Audit trail maintained
- Referential integrity preserved
