# Loading & Error States Best Practices

> **Purpose**: Spinners, error handling, retry patterns  
> **When to use**: Loading data, handling errors, implementing retry logic

## Loading Indicators

**Component Loading**:

```tsx
{
  isLoading ? (
    <div className="flex justify-center items-center py-12">
      <Spinner style={{ width: '50px', height: '50px' }} />
    </div>
  ) : (
    <DataDisplay data={data} />
  );
}
```

**Button Loading**:

```tsx
<Button label="Submit" loading={isSubmitting} onClick={handleSubmit} />
```

**Guidelines**:

- Use spinners for all data loading
- Show immediately (no delay)
- Minimum display: 300ms (prevent flicker)
- Center spinner in container

## Error States

**Error Display**:

```tsx
{
  error && (
    <div className="flex flex-col items-center py-12 text-center">
      <i className="pi pi-exclamation-triangle text-5xl text-red-400 mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button label="Try Again" icon="pi pi-refresh" onClick={retry} />
    </div>
  );
}
```

**Error Retry**:

- **Preserve state**: Keep filters/search/pagination
- **Auto-retry**: Network errors (max 3 attempts)
- **Manual retry**: Show "Try Again" button
- **Error logging**: Log to monitoring service

## Optimistic Updates

**Default**: Disabled (wait for server confirmation)

**When to Use**:

- High-confidence mutations
- Instant feedback needed (like/favorite)
- Must implement rollback on error

**Pattern**:

```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ['user', newUser.id] });
    const previous = queryClient.getQueryData(['user', newUser.id]);
    queryClient.setQueryData(['user', newUser.id], newUser);
    return { previous };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(['user', newUser.id], context?.previous);
  },
});
```
