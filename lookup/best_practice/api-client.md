# API Client Best Practices

> **Purpose**: Guidelines for using HTTP clients in the application
>
> **When to use**: Making API calls from server actions, API routes, or components

---

## Available Clients

### 1. InternalApiClient

For calling **internal Next.js API routes** (`/api/*`).

```typescript
import { createInternalApiClient } from '@/lib/axios';

// In server action
export async function getUsers(params: { status?: string }) {
  const api = createInternalApiClient();
  return api.get<User[]>('/api/users', params);
}
```

### 2. HttpClient (Server-side)

For calling **external APIs** (Supabase REST API, third-party services).

```typescript
import { createServerHttpClient } from '@/lib/axios/server-client';

// In API route
export async function GET() {
  const httpClient = await createServerHttpClient();
  const data = await httpClient.get('/rest/v1/profiles');
  return Response.json(data);
}
```

---

## Decision Matrix

| Scenario                        | Client              | Import Path                 |
| ------------------------------- | ------------------- | --------------------------- |
| Server Action → Internal API    | `InternalApiClient` | `@/lib/axios`               |
| API Route → Supabase REST       | `HttpClient`        | `@/lib/axios/server-client` |
| API Route → Third-party API     | `HttpClient`        | `@/lib/axios/server-client` |
| Server Component → Internal API | `InternalApiClient` | `@/lib/axios`               |

---

## Common Patterns

### Server Action Calling Internal API

```typescript
// src/actions/cms/users.ts
'use server';

import { createInternalApiClient } from '@/lib/axios';

export async function getUsers(params?: { status?: string }) {
  const api = createInternalApiClient();
  return api.get<User[]>('/api/cms/users', params);
}

export async function createUser(data: CreateUserInput) {
  const api = createInternalApiClient();
  return api.post<User>('/api/cms/users', data);
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const api = createInternalApiClient();
  return api.patch<User>(`/api/cms/users/${id}`, data);
}

export async function deleteUser(id: string) {
  const api = createInternalApiClient();
  return api.delete(`/api/cms/users/${id}`);
}
```

### API Route Calling Supabase

```typescript
// src/app/api/cms/users/route.ts
import { createServerHttpClient } from '@/lib/axios/server-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const httpClient = await createServerHttpClient();
  const data = await httpClient.get('/rest/v1/users', {
    status: status || undefined,
  });

  return NextResponse.json(data);
}
```

### File Upload with FormData

```typescript
// Server action
export async function uploadFile(formData: FormData) {
  const api = createInternalApiClient();
  // FormData is automatically handled with multipart/form-data
  return api.post<{ url: string }>('/api/files/upload', formData);
}
```

---

## Error Handling

### Using try-catch

```typescript
import { createInternalApiClient, AxiosError } from '@/lib/axios';

export async function getUser(id: string) {
  const api = createInternalApiClient();

  try {
    return await api.get<User>(`/api/users/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw error;
  }
}
```

### With Response Typing

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ApiError {
  error: string;
  code: string;
}

export async function getUsers() {
  const api = createInternalApiClient();
  return api.get<ApiResponse<User[]>>('/api/users');
}
```

---

## Key Features

### InternalApiClient

- **Automatic cookie forwarding**: Session cookies are forwarded in server context
- **Base URL handling**: Uses `window.location.origin` (client) or `NEXT_PUBLIC_APP_URL` (server)
- **30s timeout**: Default timeout prevents hanging requests
- **FormData support**: Automatically sets `multipart/form-data` header

### HttpClient (via createServerHttpClient)

- **Token injection**: Automatically adds Bearer token from Supabase session
- **Token refresh**: Automatically refreshes token on 401 errors
- **API key header**: Adds `apikey` header for Supabase authentication
- **FormData support**: Handles file uploads correctly

---

## Anti-patterns

### DON'T: Use fetch() directly

```typescript
// Bad - no cookie forwarding, no error handling
const res = await fetch('/api/users');
const data = await res.json();
```

### DO: Use the appropriate client

```typescript
// Good - automatic cookie forwarding, typed response
const api = createInternalApiClient();
const data = await api.get<User[]>('/api/users');
```

### DON'T: Import HttpClient directly for internal routes

```typescript
// Bad - HttpClient is for external APIs
import HttpClient from '@/lib/axios';
const client = new HttpClient();
await client.get('/api/users'); // Wrong base URL!
```

### DO: Use InternalApiClient for internal routes

```typescript
// Good - correct base URL, cookie forwarding
import { createInternalApiClient } from '@/lib/axios';
const api = createInternalApiClient();
await api.get('/api/users');
```
