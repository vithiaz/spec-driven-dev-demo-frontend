# Panel Components

Reusable panel and layout components that wrap PrimeReact layout components with built-in labels, consistent styling, and simplified APIs.

## Available Components

- `FormAccordion` - Collapsible accordion panels
- `FormCard` - Card container with header and footer
- `FormDivider` - Section divider with optional label
- `FormPanel` - Collapsible panel with header
- `FormScrollPanel` - Scrollable content panel
- `FormStepper` - Multi-step wizard interface
- `FormTab` - Tabbed navigation interface

## Quick Examples

### Accordion

```tsx
import { FormAccordion } from '@/components/panel';

<FormAccordion
  tabs={[
    {
      header: 'Personal Information',
      children: <div>Your form fields here</div>,
    },
    {
      header: 'Address Details',
      children: <div>Address fields here</div>,
    },
  ]}
/>;
```

### Card

```tsx
import { FormCard } from '@/components/panel';

<FormCard
  title="User Profile"
  subtitle="Edit your profile information"
  footer={<Button label="Save" />}
>
  <p>Card content here</p>
</FormCard>;
```

### Panel

```tsx
import { FormPanel } from '@/components/panel';

<FormPanel header="Settings" toggleable>
  <p>Panel content here</p>
</FormPanel>;
```

### Tabs

```tsx
import { FormTab } from '@/components/panel';

<FormTab
  tabs={[
    {
      header: 'Profile',
      leftIcon: 'pi pi-user',
      children: <div>Profile content</div>,
    },
    {
      header: 'Settings',
      leftIcon: 'pi pi-cog',
      children: <div>Settings content</div>,
    },
  ]}
/>;
```

### Stepper

```tsx
import { FormStepper } from '@/components/panel';

<FormStepper
  steps={[
    {
      header: 'Step 1',
      children: <div>Step 1 content</div>,
    },
    {
      header: 'Step 2',
      children: <div>Step 2 content</div>,
    },
  ]}
  activeStep={activeStep}
  onChangeStep={(e) => setActiveStep(e.index)}
/>;
```

## Common Props

Most components support:

- `containerClassName?: string` - Additional CSS classes for wrapper
- `children: ReactNode` - Content to display

## Documentation

- [Layout Components Documentation](../../docs/layout-components.md)
- [Working Examples](../examples/PrimeReactFormExample.tsx)

## TypeScript

All components are fully typed:

```tsx
import type {
  FormAccordionProps,
  FormCardProps,
  FormDividerProps,
  FormPanelProps,
  FormScrollPanelProps,
  FormStepperProps,
  FormTabProps,
} from '@/components/panel';
```
