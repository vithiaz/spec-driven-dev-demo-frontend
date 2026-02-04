# Modal & Dialog Best Practices

> **Purpose**: Modal widths, dialog actions, confirmation patterns  
> **When to use**: Creating modals, dialogs, confirmations

## Modal Widths

| Type        | Width  | Usage                        |
| ----------- | ------ | ---------------------------- |
| Small       | 400px  | Confirmations, simple inputs |
| Medium      | 600px  | Forms, standard dialogs      |
| Large       | 800px  | Detail views, complex forms  |
| Extra Large | 1000px | Multi-step wizards           |
| Full Width  | 90vw   | Tables, data-heavy views     |

**Example**:

```tsx
// Form Dialog (default)
<Modal visible={show} onHide={close} style={{ width: '600px' }}>
  <UserForm onSubmit={handleSubmit} />
</Modal>

// Confirmation (small)
<Modal visible={show} onHide={close} style={{ width: '400px' }}>
  <p>Delete this user?</p>
</Modal>
```

## Dialog Actions

**Layout**: Footer, right-aligned, `gap-2`

```tsx
<Modal
  visible={visible}
  onHide={onHide}
  footer={
    <div className="flex gap-2 justify-end">
      <Button buttonLabel="Cancel" severity="secondary" outlined onClick={onHide} />
      <Button buttonLabel="Confirm" severity="success" onClick={onConfirm} />
    </div>
  }
>
  {content}
</Modal>
```

**Guidelines**:

- Actions in footer (not content)
- Primary action on right
- Always provide cancel/close option

## Confirmation Dialogs

```tsx
<DialogConfirmation
  visible={showConfirm}
  onHide={() => setShowConfirm(false)}
  title="Confirm Deletion"
  description="Delete this item? Cannot be undone."
  submitText="Delete"
  submitSeverity="danger"
  onSubmit={handleDelete}
/>
```

**Destructive Action Pattern**:

1. Show confirmation dialog
2. Explain consequences clearly
3. Use danger severity
4. Require explicit confirmation
5. Show loading state
6. Show success toast

## Related Files

- **Components**: `docs/components.md#overlay-components`
- **Architecture**: `lookup/architecture/component-library.md#overlays`
