# Responsive Design Best Practices

> **Purpose**: Breakpoints, mobile-first patterns, touch targets, and responsive tables  
> **When to use**: All UI layouts and interactive elements

## Tailwind Breakpoints

| Breakpoint | Width  | Device Type      |
| ---------- | ------ | ---------------- |
| `sm`       | 640px  | Mobile landscape |
| `md`       | 768px  | Tablet           |
| `lg`       | 1024px | Desktop          |
| `xl`       | 1280px | Large desktop    |
| `2xl`      | 1536px | Extra large      |

## Mobile-First Approach

```tsx
// CORRECT - Mobile-first classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// WRONG - Desktop-first (harder to understand)
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
  {/* Avoid this pattern */}
</div>
```

### Guidelines

- Start with mobile (no prefix)
- Add larger breakpoints as needed (`md:`, `lg:`, `xl:`)
- Avoid desktop-first patterns

## Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Page Title
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Body text that scales with screen size
</p>
```

## Touch Targets

**Minimum Size: 44x44px**

```tsx
// CORRECT - Adequate touch target
<button className="p-3 min-h-[44px] min-w-[44px]">
  <i className="pi pi-times" />
</button>

// WRONG - Too small for touch
<button className="p-1">
  <i className="pi pi-times text-xs" />
</button>
```

### Guidelines

- All interactive elements: 44x44px minimum
- Include adequate padding for tap areas
- Test on actual mobile devices

## Responsive Tables

### Strategy 1: Horizontal Scroll (Default)

```tsx
<div className="overflow-x-auto">
  <DataTable columns={columns} data={data} />
</div>
```

### Strategy 2: Card View (Alternative)

```tsx
<div className="hidden md:block">
  <DataTable columns={columns} data={data} />
</div>
<div className="md:hidden">
  <UserCards users={data} />
</div>
```

### Guidelines

- Default to horizontal scroll for tables
- Use card view for better mobile UX when appropriate
- Hide non-essential columns on mobile
