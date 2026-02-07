# Course Card Component

A reusable card component designed specifically for displaying course information in an LMS application.

## Features

- **Full-Width Header Image**: Eye-catching course image with category tag overlay
- **Progress Tracking**: Optional progress bar with percentage and remaining time
- **Hierarchy Display**: Show program and learning roadmap structure
- **Metadata**: Creator information with avatar and creation date
- **Flexible Actions**: Customizable Edit/Continue buttons or custom footer
- **Tag Support**: Display course tags and categories
- **Responsive Design**: Works on all screen sizes with hover effects

## Basic Usage

```tsx
import { CourseCard } from '@/components/cards';

<CourseCard
  title="Introduction to React"
  category="Development"
  creator="John Doe"
  createdAt="2024-01-15"
  onContinue={() => handleContinue()}
/>;
```

## With Progress Tracking

```tsx
<CourseCard
  title="JavaScript Masterclass"
  image="/course-image.jpg"
  category="Development"
  // Progress tracking
  showProgress={true}
  progress={75}
  remainingDays={5}
  // Hierarchy
  programTitle="Web Development Bootcamp"
  roadmapTitle="Frontend Track"
  // Actions
  onEdit={() => handleEdit()}
  onContinue={() => handleContinue()}
/>
```

## Props

### Required Props

- `title` (string) - Course title

### Optional Props

#### Content

-
- `image` (string) - Course image URL (default: '/images/default-course.jpg')
- `imageAlt` (string) - Image alt text
- `imageHeight` (number) - Image height in pixels (default: 200)

#### Categorization

- `category` (string) - Course category (shown as tag on image)
- `tags` (string[]) - Array of tags

#### Progress Tracking

- `showProgress` (boolean) - Show/hide progress section (default: false)
- `progress` (number) - Progress percentage 0-100
- `remainingDays` (number) - Days remaining to complete
- `remainingHours` (number) - Hours remaining to complete

#### Hierarchy

- `programTitle` (string) - Parent program name
- `roadmapTitle` (string) - Learning roadmap name

#### Metadata

- `creator` (string) - Course creator name
- `creatorAvatar` (string) - Creator avatar image URL
- `createdAt` (string | Date) - Creation date

#### Actions

- `onEdit` (() => void) - Edit button click handler
- `onContinue` (() => void) - Continue button click handler
- `editLabel` (string) - Edit button label (default: 'Edit')
- `continueLabel` (string) - Continue button label (default: 'Continue')

#### Customization

- `footer` (ReactNode) - Custom footer content
- `actions` (ReactNode) - Custom action buttons
- `className` (string) - Additional CSS classes

## Examples

### Basic Course Card

```tsx
<CourseCard
  title="Introduction to React"
  category="Development"
  creator="John Doe"
  createdAt="2024-01-15"
  onContinue={() => handleContinue()}
/>
```

### With Progress

```tsx
<CourseCard
  title="JavaScript Masterclass"
  showProgress={true}
  progress={75}
  remainingDays={5}
  onContinue={() => handleContinue()}
/>
```

### With Hierarchy

```tsx
<CourseCard
  title="React Fundamentals"
  programTitle="Web Development Bootcamp"
  roadmapTitle="Frontend Track"
  showProgress={true}
  progress={60}
  onEdit={() => handleEdit()}
  onContinue={() => handleContinue()}
/>
```

### Custom Footer

```tsx
<CourseCard
  title="Machine Learning"
  footer={
    <div className="space-y-2 pt-3 border-t">
      <Button label="Take Final Exam" className="w-full" />
      <div className="flex gap-2">
        <Button label="Resources" size="small" className="flex-1" />
        <Button label="Forum" size="small" className="flex-1" />
      </div>
    </div>
  }
/>
```

## Component Structure

```
CourseCard
├── Header (Full-width image)
│   └── Category Tag (overlay)
├── Body
│   ├── Hierarchy Breadcrumb (optional)
│   ├── Title
│   ├── Tags (optional)
│   ├── Progress Section (optional)
│   │   ├── Progress Bar
│   │   └── Remaining Time
│   ├── Metadata (Creator & Date)
│   └── Custom Actions (optional)
└── Footer (Edit/Continue buttons or custom)
```

## Styling

The component uses:

- Tailwind CSS for layout and spacing
- PrimeReact Card component as base
- Custom hover effects and transitions
- Responsive grid layouts
- Dark mode support

## Use Cases

1. **Course Catalog**: Display available courses
2. **My Courses**: Show enrolled courses with progress
3. **Course Dashboard**: Display course hierarchy and progress
4. **Learning Path**: Show courses in a learning roadmap
5. **Admin Panel**: Manage courses with edit capabilities
