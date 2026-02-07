# Form Components

Reusable form components that wrap PrimeReact components with built-in labels, error messages, helper text, and icon support.

## Why?

PrimeReact components are great, but they only provide the input element. In real applications, you need:

- Labels
- Error messages
- Helper text
- Required indicators
- Consistent layout

These components solve that problem, eliminating repetitive boilerplate code.

## Available Components

- `FormInputText` - Text input
- `FormInputTextarea` - Multi-line text
- `FormInputNumber` - Numeric input with buttons
- `FormInputMask` - Masked input (phone, SSN, etc)
- `FormDropdown` - Single select dropdown
- `FormMultiSelect` - Multi-select dropdown
- `FormCalendar` - Date picker
- `FormCheckbox` - Checkbox with label
- `FormRadioButton` - Radio button group
- `FormInputSwitch` - Toggle switch
- `FormChips` - Tags/chips input
- `FormPassword` - Password with strength meter
- `FormEditor` - Rich text editor

## Related Components

For button and panel components, see:

- Button components: `src/components/button/` ([README](../button/README.md))
  - FormSelectButton - Toggle button group
  - FormSplitButton - Split button with dropdown
- Panel components: `src/components/panel/` ([README](../panel/README.md))
  - FormAccordion, FormCard, FormPanel, FormTab, etc.

## Quick Example

```tsx
import { FormInputText, FormDropdown, FormCalendar } from '@/components/form';

function MyForm() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(null);

  return (
    <div className="space-y-4">
      <FormInputText
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        helperText="Enter your first and last name"
      />

      <FormDropdown
        label="City"
        value={city}
        onChange={(e) => setCity(e.value)}
        options={cities}
        placeholder="Select a city"
      />

      <FormCalendar
        label="Birth Date"
        value={date}
        onChange={(e) => setDate(e.value)}
        showIcon
        required
      />
    </div>
  );
}
```

## Common Props

All components share these props:

- `label?: string` - Field label
- `helperText?: string` - Helper text below the field
- `error?: string` - Error message (replaces helperText)
- `required?: boolean` - Shows asterisk (\*) next to label
- `disabled?: boolean` - Disables the field
- `className?: string` - Additional CSS classes for input
- `containerClassName?: string` - Additional CSS classes for wrapper
- `labelClassName?: string` - Additional CSS classes for label

## Icon Support

Some components support icons (left or right positioned):

```tsx
<FormInputText
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={<i className="pi pi-envelope" />}
  iconPosition="left"
/>
```

Components with icon support:

- `FormInputText`
- `FormInputNumber`
- `FormInputMask`

## Documentation

- [Quick Start Guide](../../docs/FORM_COMPONENTS_QUICKSTART.md)
- [Full Documentation](../../docs/form-components.md)
- [Working Examples](../examples/FormComponentsExample.tsx)

## TypeScript

All components are fully typed with TypeScript. Import types:

```tsx
import type { FormInputTextProps, RadioOption } from '@/components/form';
```

## Integration

Works with popular form libraries:

- React Hook Form
- Formik
- Custom validation

See [Full Documentation](../../docs/form-components.md) for integration examples.
