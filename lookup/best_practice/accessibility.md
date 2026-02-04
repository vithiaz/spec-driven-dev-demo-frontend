# Accessibility Best Practices

> **Purpose**: ARIA labels, focus management, color contrast, and screen reader support  
> **When to use**: All interactive elements and user-facing content

## ARIA Labels

### Interactive Elements

```tsx
// Buttons without text
<button aria-label="Close dialog" onClick={onClose}>
  <i className="pi pi-times" />
</button>

// Icon-only buttons
<button aria-label="Delete user" onClick={handleDelete}>
  <i className="pi pi-trash" />
</button>

// Search input
<input
  type="search"
  aria-label="Search users"
  placeholder="Search..."
/>
```

## Focus Management

### Modal Focus

```tsx
<Modal
  visible={visible}
  onShow={() => {
    // Focus first input when modal opens
    document.getElementById('first-input')?.focus();
  }}
  onHide={onHide}
>
  <FormInputText id="first-input" label="Name" />
</Modal>
```

### Keyboard Navigation Requirements

- Tab order must be logical
- All interactive elements keyboard accessible
- **Escape** closes modals/dialogs
- **Enter** submits forms
- **Space** toggles checkboxes/switches

## Color Contrast

### Minimum Ratios (WCAG AA)

| Element Type       | Minimum Ratio |
| ------------------ | ------------- |
| Normal text        | 4.5:1         |
| Large text (18pt+) | 3:1           |
| UI components      | 3:1           |

### Text Colors

```css
/* ✅ CORRECT - Sufficient contrast */
.text-primary {
  color: #1e40af; /* Blue 800 on white background */
}

.text-error {
  color: #dc2626; /* Red 600 on white background */
}

/* ❌ WRONG - Insufficient contrast */
.text-light {
  color: #d1d5db; /* Gray 300 on white - too light */
}
```

## Screen Reader Support

### Alt Text Patterns

```tsx
// Meaningful images
<img src="user.jpg" alt="John Doe, Software Engineer" />

// Decorative images
<img src="border.svg" alt="" role="presentation" />

// Icons with meaning
<i className="pi pi-check" aria-label="Completed" />

// Icons for decoration only
<i className="pi pi-star" aria-hidden="true" />
```

### Guidelines

- Provide descriptive `alt` text for meaningful images
- Use empty `alt=""` for decorative images
- Add `aria-label` to icon-only buttons
- Use `aria-hidden="true"` for decorative icons

## Related Documentation

- **Testing**: See `lookup/architecture/testing.md` for accessibility test patterns
- **Components**: See `docs/components.md` for built-in accessibility features
