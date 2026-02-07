# Layout Components

This directory contains reusable layout components built on top of PrimeReact layout components. These components provide a consistent API and simplify the usage of common layout patterns throughout the application.

## Components

### FormAccordion

Collapsible panels for organizing content in expandable sections.

**Props:**

- `tabs: FormAccordionTabProps[]` - Array of accordion panels with header and children
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact Accordion props

**Usage:**

```tsx
import { FormAccordion } from '@/components/layout';

<FormAccordion
  tabs={[
    {
      header: 'Section 1',
      children: <div>Content for section 1</div>,
    },
    {
      header: 'Section 2',
      children: <div>Content for section 2</div>,
    },
  ]}
/>;
```

### FormCard

Container component for displaying content in a card layout with optional header and footer.

**Props:**

- `title?: string` - Card title
- `subtitle?: string` - Card subtitle
- `header?: ReactNode` - Custom header content
- `footer?: ReactNode` - Custom footer content
- `children: ReactNode` - Card content
- `className?: string` - Additional CSS classes for the card
- `containerClassName?: string` - Additional CSS classes for the container

**Usage:**

```tsx
import { FormCard } from '@/components/layout';

<FormCard
  title="User Profile"
  subtitle="Personal information"
  footer={<Button label="Save" />}
>
  <p>Card content goes here</p>
</FormCard>;
```

### FormDivider

Visual separator with optional label text.

**Props:**

- `label?: string` - Text to display in the divider
- `className?: string` - Additional CSS classes for the divider
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact Divider props

**Usage:**

```tsx
import { FormDivider } from '@/components/layout';

<FormDivider label="Section Title" />;
```

### FormPanel

Collapsible panel with header for grouping related content.

**Props:**

- `header?: string` - Panel header text
- `headerTemplate?: ReactNode` - Custom header template
- `footerTemplate?: ReactNode` - Custom footer template
- `children: ReactNode` - Panel content
- `className?: string` - Additional CSS classes for the panel
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact Panel props (including `toggleable`, `collapsed`, etc.)

**Usage:**

```tsx
import { FormPanel } from '@/components/layout';

<FormPanel header="Settings" toggleable>
  <p>Panel content goes here</p>
</FormPanel>;
```

### FormScrollPanel

Container with custom scrollbars for overflow content.

**Props:**

- `children: ReactNode` - Scrollable content
- `className?: string` - Additional CSS classes for the scroll panel
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact ScrollPanel props

**Usage:**

```tsx
import { FormScrollPanel } from '@/components/layout';

<FormScrollPanel style={{ width: '100%', height: '300px' }}>
  <div>Long scrollable content...</div>
</FormScrollPanel>;
```

### FormStepper

Multi-step process component with navigation.

**Props:**

- `steps: FormStepperPanelProps[]` - Array of stepper panels with header and children
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact Stepper props (including `activeStep`, `onChangeStep`, etc.)

**Usage:**

```tsx
import { FormStepper } from '@/components/layout';
import { useState } from 'react';

const [activeStep, setActiveStep] = useState(0);

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

### FormTab

Tabbed interface for organizing content in multiple views.

**Props:**

- `tabs: FormTabPanelProps[]` - Array of tab panels with header, optional icons, and children
- `containerClassName?: string` - Additional CSS classes for the container
- All PrimeReact TabView props

**Usage:**

```tsx
import { FormTab } from '@/components/layout';

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

## Common Features

All layout components support:

- ✅ Custom className for styling
- ✅ Container className for wrapper styling
- ✅ Full TypeScript support
- ✅ All underlying PrimeReact component props
- ✅ Dark mode compatibility

## Integration Examples

### Combining Layout Components

```tsx
<FormCard title="User Registration">
  <FormTab
    tabs={[
      {
        header: 'Personal Info',
        children: (
          <FormAccordion
            tabs={[
              {
                header: 'Basic Details',
                children: <FormInputText label="Name" />,
              },
              {
                header: 'Contact Info',
                children: <FormInputText label="Email" />,
              },
            ]}
          />
        ),
      },
      {
        header: 'Review',
        children: <div>Review your information</div>,
      },
    ]}
  />
</FormCard>
```

### With Form Components

```tsx
import { FormInputText, FormDropdown } from '@/components/form';
import { FormPanel, FormDivider } from '@/components/layout';

<FormPanel header="User Details" toggleable>
  <FormInputText label="Full Name" />
  <FormDivider />
  <FormDropdown label="Country" options={countries} />
</FormPanel>;
```

## Styling

All components inherit the PrimeReact theme configured in the application. You can customize them using:

1. **Custom Classes:**

```tsx
<FormCard className="shadow-lg" containerClassName="p-4">
  Content
</FormCard>
```

2. **PrimeReact Theme:**
   Styles are defined in `src/styles/theme/components.css`

## Best Practices

1. **Use appropriate components** - Choose the right layout component for your use case
2. **Keep nesting reasonable** - Don't over-nest layout components
3. **Provide meaningful headers** - Use clear, descriptive header text
4. **Consider mobile** - Test responsive behavior on different screen sizes
5. **Maintain consistency** - Use similar patterns across your application

## Related Documentation

- [Form Components](../form/README.md) - Reusable form components
- [PrimeReact Components Styling](../../docs/primereact-components-styling.md) - Theme customization
- [PrimeReact Documentation](https://primereact.org/) - Official component documentation

## Examples

See working examples in `/src/components/examples/PrimeReactFormExample.tsx`
