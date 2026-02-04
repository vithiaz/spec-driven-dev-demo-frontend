# Form Best Practices

> **Purpose**: Form layout, spacing, validation, and action button standards  
> **When to use**: Creating forms, handling validation, form submissions

## Form Layout

**Default**: Single column with `gap-4` (1rem between fields)

```tsx
<form className="flex flex-col gap-4">
  <FormInputText label="Name" />
  <FormInputText label="Email" />
  <FormDropdown label="Role" options={roles} />
</form>
```

**Multi-column**: Only for related pairs

```tsx
<div className="grid grid-cols-2 gap-4">
  <FormInputText label="First Name" />
  <FormInputText label="Last Name" />
</div>
```

**Guidelines**:

- Two columns: Default
- Two columns/Three columns: Related pairs (First/Last Name) or the large view
- Mobile: Always stack to single column

## Form Spacing

```typescript
fieldGap: 'gap-4'; // 1rem between fields
sectionGap: 'gap-6'; // 1.5rem between sections
labelMargin: 'mb-2'; // Below label
helperMargin: 'mt-1'; // Below field
```

## Validation

**Timing**:

- **On Submit** - Default trigger
- **On Blur** - Complex fields (email, password)
- **On Change** - Real-time (password strength)
- **Debounced** - Async validation (username availability)

**Error Display**:

```tsx
<FormInputText label="Email" error={errors.email?.message} helperText="Enter work email" />
```

**Messages**:

- ✅ "Email must include @ symbol"
- ❌ "Invalid input"

## Required Fields

```tsx
<FormInputText
  label="Email"
  required // Shows red asterisk (*)
/>
```

**Guidelines**:

- Mark with red asterisk (\*)
- Show "\* Required field" legend at top
- Prevent submit until filled
- Highlight empty required on submit

## Form Actions

**Button Placement**: Right-aligned, `gap-2`, `mt-6`

```tsx
<div className="flex gap-2 justify-end mt-6">
  <Button label="Cancel" severity="secondary" outlined />
  <Button label="Save" severity="success" type="submit" loading={isSubmitting} />
</div>
```

**Button Order** (right to left):

1. Primary (Save, Create) - rightmost
2. Secondary (Cancel, Back)
3. Destructive (Delete) - leftmost + confirmation

**Loading State**:

- Disable all inputs during submit
- Show spinner on submit button
- Prevent double submission
