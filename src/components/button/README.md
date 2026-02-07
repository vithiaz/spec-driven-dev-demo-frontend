# Button Components

Reusable button components that wrap PrimeReact button components with built-in labels, error messages, helper text, and consistent styling.

## Available Components

- `FormSelectButton` - Toggle button group for single selection
- `FormSplitButton` - Button with dropdown menu

## Quick Example

```tsx
import { FormSelectButton, FormSplitButton } from '@/components/button';
import { MenuItem } from 'primereact/menuitem';

// SelectButton - Single selection
const paymentOptions = [
  { label: 'Credit Card', value: 'credit' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Bank Transfer', value: 'bank' },
];

<FormSelectButton
  label="Payment Method"
  value={payment}
  onChange={(e) => setPayment(e.value)}
  options={paymentOptions}
  required
/>;

// SplitButton - Action with menu
const menuItems: MenuItem[] = [
  { label: 'Update', icon: 'pi pi-refresh', command: () => handleUpdate() },
  { label: 'Delete', icon: 'pi pi-trash', command: () => handleDelete() },
];

<FormSplitButton
  label="Actions"
  buttonLabel="Save"
  icon="pi pi-check"
  model={menuItems}
  onClick={handleSave}
/>;
```

## Common Props

All components share these props:

- `label?: string` - Field label
- `helperText?: string` - Helper text below the field
- `error?: string` - Error message (replaces helperText)
- `required?: boolean` - Shows asterisk (\*) next to label
- `disabled?: boolean` - Disables the button
- `className?: string` - Additional CSS classes
- `containerClassName?: string` - Additional CSS classes for wrapper
- `labelClassName?: string` - Additional CSS classes for label

## Documentation

- [Quick Reference](../../SELECTBUTTON_SPLITBUTTON_QUICKREF.md)
- [Full Implementation Guide](../../SELECTBUTTON_SPLITBUTTON_IMPLEMENTATION.md)
- [Form Components Documentation](../../docs/form-components.md)
- [Working Examples](../examples/PrimeReactFormExample.tsx)

## TypeScript

All components are fully typed:

```tsx
import type {
  FormSelectButtonProps,
  FormSplitButtonProps,
} from '@/components/button';
```
