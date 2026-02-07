# Overlay Components

Reusable overlay components that wrap PrimeReact overlay components (Tooltip, Dialog, Sidebar) with simplified and consistent APIs.

## Components

### Tooltip

A wrapper around PrimeReact's Tooltip component for displaying contextual information.

**Basic Usage:**

```tsx
import { Tooltip } from '@/components/overlay';

<>
  <button className="my-button" data-pr-tooltip="This is a tooltip">
    Hover me
  </button>
  <Tooltip target=".my-button" position="top" />
</>;
```

**With custom content:**

```tsx
<Tooltip
  target=".info-icon"
  content="Detailed information here"
  position="right"
  mouseTrack
/>
```

**Props:**

- `target` - CSS selector for the target element
- `content` - Tooltip content (ReactNode)
- `position` - Position relative to target: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
- `mouseTrack` - Follow mouse cursor
- `showDelay` - Delay in milliseconds before showing
- `hideDelay` - Delay in milliseconds before hiding
- `autoHide` - Auto hide tooltip
- `className` - Custom CSS class for tooltip
- `containerClassName` - Custom CSS class for container

### Drawer

A wrapper around PrimeReact's Sidebar component for sliding panels from any edge of the screen.

**Basic Usage:**

```tsx
import { Drawer } from '@/components/overlay';
import { useState } from 'react';

const [visible, setVisible] = useState(false);

<>
  <button onClick={() => setVisible(true)}>Open Drawer</button>
  <Drawer
    visible={visible}
    onHide={() => setVisible(false)}
    position="right"
    title="Drawer Title"
  >
    <p>Drawer content goes here</p>
  </Drawer>
</>;
```

**With footer and custom position:**

```tsx
<Drawer
  visible={visible}
  onHide={() => setVisible(false)}
  position="left"
  title="Settings"
  footer={
    <div className="flex gap-2">
      <button onClick={() => setVisible(false)}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </div>
  }
>
  <div className="space-y-4">{/* Drawer content */}</div>
</Drawer>
```

**All positions:**

```tsx
// From right (default)
<Drawer visible={visible} onHide={onHide} position="right" />

// From left
<Drawer visible={visible} onHide={onHide} position="left" />

// From top
<Drawer visible={visible} onHide={onHide} position="top" />

// From bottom
<Drawer visible={visible} onHide={onHide} position="bottom" />
```

**Props:**

- `visible` - Controls drawer visibility (required)
- `onHide` - Callback when drawer should close (required)
- `position` - Drawer position: 'top' | 'right' | 'bottom' | 'left' (default: 'right')
- `title` - Drawer title in header
- `showCloseIcon` - Show close icon button (default: true)
- `footer` - Footer content (ReactNode)
- `children` - Main drawer content (required)
- `className` - Custom CSS class for drawer
- `containerClassName` - Custom CSS class for container
- `headerClassName` - Custom CSS class for header
- `contentClassName` - Custom CSS class for content area
- `footerClassName` - Custom CSS class for footer

### Modal

A wrapper around PrimeReact's Dialog component for modal dialogs.

**Basic Usage:**

```tsx
import { Modal } from '@/components/overlay';
import { useState } from 'react';

const [visible, setVisible] = useState(false);

<>
  <button onClick={() => setVisible(true)}>Open Modal</button>
  <Modal visible={visible} onHide={() => setVisible(false)} title="Modal Title">
    <p>Modal content goes here</p>
  </Modal>
</>;
```

**With footer and actions:**

```tsx
<Modal
  visible={visible}
  onHide={() => setVisible(false)}
  title="Confirm Action"
  footer={
    <div className="flex gap-2 justify-end">
      <button onClick={() => setVisible(false)}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

**With custom styling:**

```tsx
<Modal
  visible={visible}
  onHide={() => setVisible(false)}
  title="Custom Styled Modal"
  className="w-[600px]"
  contentClassName="p-6"
  headerClassName="bg-primary-50"
  maximizable
  draggable
>
  <div className="space-y-4">{/* Modal content */}</div>
</Modal>
```

**Props:**

- `visible` - Controls modal visibility (required)
- `onHide` - Callback when modal should close (required)
- `title` - Modal title in header
- `showCloseIcon` - Show close icon button (default: true)
- `footer` - Footer content (ReactNode)
- `children` - Main modal content (required)
- `modal` - Enable modal behavior (blocks interaction outside, default: true)
- `dismissableMask` - Close on backdrop click
- `draggable` - Allow dragging the modal
- `resizable` - Allow resizing the modal
- `maximizable` - Show maximize button
- `position` - Modal position on screen
- `className` - Custom CSS class for modal
- `containerClassName` - Custom CSS class for container
- `headerClassName` - Custom CSS class for header
- `contentClassName` - Custom CSS class for content area
- `footerClassName` - Custom CSS class for footer

## Common Patterns

### Confirmation Modal

```tsx
<Modal
  visible={showConfirm}
  onHide={() => setShowConfirm(false)}
  title="Confirm Delete"
  footer={
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => setShowConfirm(false)}
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

### Form in Drawer

```tsx
<Drawer
  visible={visible}
  onHide={() => setVisible(false)}
  position="right"
  title="Add New Item"
  footer={
    <div className="flex gap-2 justify-end">
      <button onClick={() => setVisible(false)}>Cancel</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  }
>
  <form className="space-y-4">
    <FormInputText label="Name" required />
    <FormInputText label="Email" required />
    <FormDropdown label="Category" options={categories} />
  </form>
</Drawer>
```

### Loading Modal

```tsx
<Modal visible={loading} onHide={() => {}} showCloseIcon={false} modal>
  <div className="flex items-center gap-4">
    <i className="pi pi-spin pi-spinner text-2xl" />
    <p>Loading...</p>
  </div>
</Modal>
```

## Integration with Form Components

All overlay components work seamlessly with form components:

```tsx
import { Modal, Drawer } from '@/components/overlay';
import { FormInputText, FormDropdown } from '@/components/form';

<Drawer visible={visible} onHide={onHide} title="Edit User">
  <div className="space-y-4">
    <FormInputText label="Name" required />
    <FormInputText label="Email" required />
    <FormDropdown label="Role" options={roles} />
  </div>
</Drawer>;
```

## TypeScript

All components are fully typed with TypeScript:

```tsx
import type {
  ModalProps,
  DrawerProps,
  TooltipProps,
} from '@/components/overlay';

const modalProps: ModalProps = {
  visible: true,
  onHide: () => {},
  title: 'My Modal',
  children: <div>Content</div>,
};
```

## Styling

Components inherit the application's theme and support custom styling through className props:

- `className` - Styles the main component
- `containerClassName` - Styles the outer container
- `headerClassName` - Styles the header section
- `contentClassName` - Styles the content area
- `footerClassName` - Styles the footer section

## Accessibility

All components maintain PrimeReact's accessibility features:

- Proper ARIA attributes
- Keyboard navigation (ESC to close)
- Focus management
- Screen reader support
