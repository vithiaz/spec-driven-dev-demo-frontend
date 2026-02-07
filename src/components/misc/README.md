# Misc Components

A collection of miscellaneous UI components for displaying various types of information and status indicators.

## Components

### Avatar

Display user profile images or initials.

### Badge

Small numerical indicator typically overlaid on other UI elements.

### Chip

Compact elements that represent an input, attribute, or action.

### ProgressBar

Visual indicator showing the completion status of a task.

### Spinner

Loading indicator for asynchronous operations.

### Tag

Small label for categorizing or marking items.

## Usage

```tsx
import {
  Avatar,
  Badge,
  Chip,
  ProgressBar,
  Spinner,
  Tag
} from '@/components/misc';

// Avatar
<Avatar label="JD" shape="circle" />
<Avatar image="/user.jpg" />

// Badge
<Badge value="2" severity="danger" />

// Chip
<Chip label="Apple" icon="pi pi-apple" />

// ProgressBar
<ProgressBar value={50} />

// Spinner
<Spinner />

// Tag
<Tag value="New" severity="success" />
```

## Features

- All components wrap PrimeReact components
- Support for `containerClassName` for custom styling
- Full TypeScript support
- Dark mode compatible
- Access to all underlying PrimeReact props
