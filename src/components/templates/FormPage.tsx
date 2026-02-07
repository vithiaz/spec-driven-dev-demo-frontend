/**
 * pageType: form
 * FormPage Template - Form Layout Pattern
 * 
 * IMPORTANT: This is a LAYOUT PLACEHOLDER ONLY
 * 
 * This template provides the basic structural layout for create/edit form pages.
 * The actual implementation MUST follow the requirements defined in:
 * 1. Backstage Story YAML (backstage/stories/) - Acceptance criteria, actors, flows
 * 2. OpenSpec spec.md - Detailed requirements and scenarios
 * 3. AGENTS.md - Technical implementation guidelines
 * 
 * DO NOT treat this template as a complete specification.
 * ALWAYS refer to the specific story and spec documents for:
 * - What fields are required
 * - Validation rules
 * - Field types and options
 * - Business logic and transformations
 * - Specific UI/UX requirements
 * - API endpoints to use
 * - State management approach
 * 
 * PAGE HEADER & BREADCRUMB:
 * This layout does NOT include header/breadcrumb.
 * If the page requires header, breadcrumb, or page title:
 * - Implement usePageHeaderConfig hook in the actual page file (page.tsx)
 * - Import from: @/hooks/usePageHeaderConfig
 * - Configure breadcrumb, title, actions in the page component
 * - Follow AGENTS.md Section 7.3 for header configuration
 * 
 * This template ONLY provides the content area layout structure.
 * 
 * FORM VALIDATION:
 * This project uses Zod for schema validation with React Hook Form.
 * - Define Zod schema for validation rules
 * - Use zodResolver to integrate with React Hook Form
 * - Follow type-safe patterns
 * 
 * COMPONENT SEPARATION:
 * This template shows the LAYOUT STRUCTURE only.
 * Complex form sections MUST be extracted to separate files.
 * Follow AGENTS.md Section 2.3 for proper file placement in feature modules.
 * 
 * LAYOUT STRUCTURE (Placeholder):
 * 1. Form Header (optional): Title, subtitle, or instructions
 * 2. Form Fields Section: Input fields organized in sections/panels
 * 3. Form Actions: Submit, Cancel, and other action buttons
 * 
 * REFERENCE: See AGENTS.md sections 2.3, 6.4, 8, 9 for detailed requirements
 */

/**
 * EXAMPLE: Zod Schema Validation
 * 
 * Define validation schema using Zod:
 * Import: import { z } from 'zod';
 * 
 * const formSchema = z.object({
 *   // Required string field
 *   name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
 *   
 *   // Required email field
 *   email: z.string().email('Invalid email format'),
 *   
 *   // Optional string field
 *   description: z.string().optional(),
 *   
 *   // Number field with range
 *   age: z.number().min(18, 'Must be at least 18').max(100, 'Must be less than 100'),
 *   
 *   // Enum/select field
 *   status: z.enum(['active', 'inactive'], { required_error: 'Status is required' }),
 *   
 *   // Date field
 *   startDate: z.date({ required_error: 'Start date is required' }),
 *   
 *   // Boolean field
 *   isActive: z.boolean().default(false),
 *   
 *   // Array field
 *   tags: z.array(z.string()).min(1, 'At least one tag is required'),
 *   
 *   // Nested object
 *   address: z.object({
 *     street: z.string().min(1, 'Street is required'),
 *     city: z.string().min(1, 'City is required'),
 *     zipCode: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
 *   }),
 *   
 *   // Conditional validation
 *   password: z.string().min(8, 'Password must be at least 8 characters'),
 *   confirmPassword: z.string(),
 * }).refine((data) => data.password === data.confirmPassword, {
 *   message: "Passwords don't match",
 *   path: ["confirmPassword"],
 * });
 * 
 * type FormValues = z.infer<typeof formSchema>;
 */

/**
 * EXAMPLE: React Hook Form Integration
 * 
 * Import required hooks:
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * 
 * Setup form in component:
 * const {
 *   register,
 *   handleSubmit,
 *   formState: { errors, isSubmitting },
 *   reset,
 *   setValue,
 *   watch,
 * } = useForm<FormValues>({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     name: '',
 *     email: '',
 *     status: 'active',
 *     isActive: false,
 *   },
 * });
 * 
 * Submit handler:
 * const onSubmit = async (data: FormValues) => {
 *   try {
 *     await apiCall(data);
 *     toast.success(t('messages.saveSuccess'));
 *     router.push('/list');
 *   } catch (error) {
 *     toast.error(t('messages.saveError'));
 *   }
 * };
 */

const FormPage = () => {
    return (
        <div className="flex flex-col gap-6 px-4 py-4">
            {/* 
                FORM HEADER SECTION (OPTIONAL)
                
                If spec requires form header with title and instructions:
                - Display form title (Create New, Edit Item, etc.)
                - Show subtitle or instructions
                - Display required field indicator legend
                - Use simple text or panel header
                
                Must include:
                - Proper i18n labels
                - data-testid attributes
                - Clear indication of required fields
                
                Example: "Create New Course" title with "* Required fields" subtitle
            */}
            {/* <div className="flex flex-col gap-2">
                <h2>{t('form.title')}</h2>
                <p className="text-muted">{t('form.subtitle')}</p>
                <span className="text-sm text-muted">* {t('form.requiredFields')}</span>
            </div> */}

            {/* 
                FORM FIELDS SECTION
                
                Configure based on story/spec requirements:
                - Organize fields in logical sections using Panel components
                - Use form components from @/components/form
                - Connect to React Hook Form with register() or Controller
                - Follow AGENTS.md Section 6.4 for form requirements
                
                FORM STRUCTURE OPTIONS:
                
                Option A - Single Panel (simple forms with few fields):
                  All fields in one panel, no sections
                  
                Option B - Multiple Panels (complex forms with many fields):
                  Group related fields in separate panels
                  Example: Basic Info, Contact Details, Settings, etc.
                  
                Option C - Accordion (collapsible sections):
                  Use for very long forms with many sections
                  User can expand/collapse sections
                
                FIELD TYPES FROM @/components/form:
                - InputText: Text input fields
                - InputNumber: Number input fields
                - InputTextarea: Multi-line text input
                - Dropdown: Select dropdown (single selection)
                - MultiSelect: Multiple selection dropdown
                - Calendar: Date picker
                - InputSwitch: Toggle switch (boolean)
                - Checkbox: Checkbox input
                - RadioButton: Radio button group
                - FileUpload: File upload component
                
                FIELD REGISTRATION PATTERNS:
                
                Simple text input:
                  <InputText
                    id="name"
                    {...register('name')}
                    invalid={!!errors.name}
                    aria-describedby="name-error"
                    data-testid="form-name-input"
                  />
                  {errors.name && (
                    <small id="name-error" className="p-error">
                      {errors.name.message}
                    </small>
                  )}
                
                Controlled component (Dropdown, Calendar, etc.):
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        id="status"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={statusOptions}
                        invalid={!!errors.status}
                        data-testid="form-status-dropdown"
                      />
                    )}
                  />
                  {errors.status && (
                    <small className="p-error">{errors.status.message}</small>
                  )}
                
                Number input:
                  <InputNumber
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    invalid={!!errors.age}
                    data-testid="form-age-input"
                  />
                
                Checkbox/Switch:
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <InputSwitch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        data-testid="form-active-switch"
                      />
                    )}
                  />
                
                FIELD LAYOUT PATTERNS:
                
                Full width field:
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">{t('fields.name')} *</label>
                    <InputText id="name" {...register('name')} />
                    {errors.name && <small className="p-error">{errors.name.message}</small>}
                  </div>
                
                Two fields side by side:
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="firstName">{t('fields.firstName')} *</label>
                      <InputText id="firstName" {...register('firstName')} />
                      {errors.firstName && <small className="p-error">{errors.firstName.message}</small>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="lastName">{t('fields.lastName')} *</label>
                      <InputText id="lastName" {...register('lastName')} />
                      {errors.lastName && <small className="p-error">{errors.lastName.message}</small>}
                    </div>
                  </div>
                
                COMPONENT SEPARATION:
                - Simple forms (less than 10 fields): Implement inline
                - Complex forms (more than 10 fields): Extract sections to separate components
                  Example: @/modules/<feature>/components/<Feature>BasicInfoSection.tsx
                  Example: @/modules/<feature>/components/<Feature>ContactSection.tsx
                
                Must include:
                - Visible labels with htmlFor attribute
                - Required field indicators (asterisk)
                - Error messages below each field
                - Proper i18n labels for all text
                - data-testid attributes for all inputs
                - Invalid state styling (red border)
                - aria-describedby linking errors
                - Disabled state while submitting
                - Proper field types (email, tel, url, etc.)
            */}
            <form>
                {/* 
                    BASIC INFORMATION PANEL
                    Group related fields in a panel
                */}
                {/* <Panel header={t('sections.basicInfo')}>
                    <div className="flex flex-col gap-4">
                        Full width field
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">{t('fields.name')} *</label>
                            <InputText 
                                id="name" 
                                {...register('name')} 
                                invalid={!!errors.name}
                                disabled={isSubmitting}
                                data-testid="form-name-input"
                            />
                            {errors.name && (
                                <small className="p-error">{errors.name.message}</small>
                            )}
                        </div>
                        
                        Two fields side by side
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">{t('fields.email')} *</label>
                                <InputText 
                                    id="email" 
                                    type="email"
                                    {...register('email')} 
                                    invalid={!!errors.email}
                                    disabled={isSubmitting}
                                    data-testid="form-email-input"
                                />
                                {errors.email && (
                                    <small className="p-error">{errors.email.message}</small>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label htmlFor="status">{t('fields.status')} *</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            id="status"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={statusOptions}
                                            invalid={!!errors.status}
                                            disabled={isSubmitting}
                                            data-testid="form-status-dropdown"
                                        />
                                    )}
                                />
                                {errors.status && (
                                    <small className="p-error">{errors.status.message}</small>
                                )}
                            </div>
                        </div>
                        
                        Textarea field
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description">{t('fields.description')}</label>
                            <InputTextarea 
                                id="description" 
                                {...register('description')} 
                                rows={4}
                                disabled={isSubmitting}
                                data-testid="form-description-textarea"
                            />
                        </div>
                    </div>
                </Panel> */}
                
                {/* 
                    ADDITIONAL SECTIONS
                    Add more panels for other field groups
                */}
                {/* <Panel header={t('sections.additionalInfo')}>
                    Additional fields here
                </Panel> */}
            </form>

            {/* 
                FORM ACTIONS SECTION
                
                Action buttons for form submission:
                - Place at BOTTOM of form
                - Primary action: Save/Submit button (right)
                - Secondary action: Cancel button (left)
                - Optional actions: Reset, Save as Draft, etc.
                
                Button states:
                - Submit button: Loading state during submission
                - Cancel button: Navigate back or reset form
                - All buttons: Disabled during submission
                
                Must include:
                - Proper i18n labels
                - data-testid attributes
                - Loading indicator on submit button
                - Disabled state during submission
                - Proper button severity (primary, secondary)
                - Click handlers connected to form logic
                
                Common patterns:
                - Cancel + Submit
                - Cancel + Save as Draft + Submit
                - Reset + Cancel + Submit
            */}
            <div className="flex justify-content-end gap-2 pt-4 border-top-1 surface-border">
                {/* Cancel button - navigate back or reset */}
                {/* <Button 
                    label={t('actions.cancel')}
                    severity="secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    data-testid="form-cancel-button"
                /> */}
                
                {/* Submit button - save form data */}
                {/* <Button 
                    label={t('actions.save')}
                    severity="primary"
                    onClick={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                    data-testid="form-submit-button"
                /> */}
            </div>
        </div>
    );
};

export default FormPage;
