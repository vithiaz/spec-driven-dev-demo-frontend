# User Feedback Best Practices

> **Purpose**: Standard patterns for toast notifications, messages, and progress indicators  
> **When to use**: Providing feedback after user actions or system events

## Toast Notifications

**Required Import**:

```tsx
import { useToast } from '@/lib/providers/ToastProvider';
```

### Default Durations

| Severity | Duration  | When to Use                  |
| -------- | --------- | ---------------------------- |
| Success  | 3 seconds | Completed actions            |
| Error    | 5 seconds | Failures requiring attention |
| Warning  | 4 seconds | Potential issues             |
| Info     | 3 seconds | Non-critical updates         |

**Position**: Always `top-right`

### Usage Pattern

```tsx
import { useToast } from '@/lib/providers/ToastProvider';

const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('User created successfully', 'User Created');
  };

  const handleError = () => {
    toast.error('Failed to save changes. Please try again.', 'Save Failed');
  };

  const handleWarning = () => {
    toast.warn('Your changes may not be saved', 'Warning');
  };

  const handleInfo = () => {
    toast.info('Processing your request', 'Information');
  };

  // ...
};
```

### Guidelines

- Keep messages under 100 characters
- Use action-specific summaries ("User Created", not "Success")
- **Success**: Completed actions
- **Error**: Failures requiring user attention
- **Warning**: Potential issues
- **Info**: Non-critical updates

## Confirmation Dialogs

**Required Import**:

```tsx
import { useDialogConfirmation } from '@/hooks/useDialogConfirmation';
```

### Usage Pattern

```tsx
import { useDialogConfirmation } from '@/hooks/useDialogConfirmation';

const MyComponent = () => {
  const deleteConfirmation = useDialogConfirmation({
    onConfirm: async (data) => {
      const userId = data as string;
      await deleteUser(userId);
    },
  });

  const handleDelete = (userId: string) => {
    deleteConfirmation.open('delete', userId);
  };

  // Can also manually confirm or cancel
  const handleManualConfirm = () => {
    deleteConfirmation.confirm();
  };

  const handleManualCancel = () => {
    deleteConfirmation.cancel();
  };

  // ...
};
```

### Configuration Options

```tsx
const confirmation = useDialogConfirmation({
  onConfirm: async (data) => {
    // Handle confirmation with data
  },
  title: 'Delete User', // Optional: default title
  message: 'Are you sure you want to delete this user?', // Optional: default message
  confirmLabel: 'Delete', // Optional: default confirm button label
  cancelLabel: 'Cancel', // Optional: default cancel button label
});

// Open with action type and data
confirmation.open('delete', userId);
```

### Guidelines

- Use for destructive actions (delete, remove, archive)
- Clear, specific messages describing the action
- Mention if action is irreversible
- Use action verbs in confirm button ("Delete", "Remove", not "Yes")

## Inline Messages

**When to Use**:

- Form-level errors (validation summary)
- Persistent warnings (account status)
- Informational hints (password requirements)

```tsx
<Message severity="warn" text="Your trial ends in 3 days. Upgrade to continue." closable />
```

## Progress Indicators

**Show for operations > 2 seconds**

```tsx
// Determinate progress
<ProgressBar value={progress} showValue className="mb-4" />

// Indeterminate (unknown duration)
<ProgressBar mode="indeterminate" />
```

### Guidelines

- Update progress every 1 second minimum
- Show time estimate when available
- Allow cancellation if possible

## Related Documentation

- **Components**: See `docs/components.md` for Message, Toast, ProgressBar props
- **Messages Module**: `src/components/messages/` for wrappers
