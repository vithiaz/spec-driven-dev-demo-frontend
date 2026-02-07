/**
 * pageType: wizard
 * WizardPage Template - Multi-Step Form/Process Pattern
 * 
 * IMPORTANT: This is a LAYOUT PLACEHOLDER ONLY
 * 
 * This template provides the basic structural layout for wizard/multi-step form pages.
 * The actual implementation MUST follow the requirements defined in:
 * 1. Backstage Story YAML (backstage/stories/) - Acceptance criteria, actors, flows
 * 2. OpenSpec spec.md - Detailed requirements and scenarios
 * 3. AGENTS.md - Technical implementation guidelines
 * 
 * DO NOT treat this template as a complete specification.
 * ALWAYS refer to the specific story and spec documents for:
 * - What steps are required
 * - Fields in each step
 * - Validation rules per step
 * - Business logic and flow
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
 * WIZARD USAGE:
 * Wizards should be used for:
 * - Complex multi-step processes
 * - Sequential data collection
 * - Guided onboarding flows
 * - Setup or configuration processes
 * - Processes with dependencies between steps
 * 
 * FORM VALIDATION:
 * This project uses Zod for schema validation with React Hook Form.
 * - Define Zod schema for each step
 * - Validate current step before proceeding to next
 * - Combine all schemas for final submission
 * 
 * COMPONENT SEPARATION:
 * This template shows the LAYOUT STRUCTURE only.
 * Each step SHOULD be extracted to separate component.
 * Follow AGENTS.md Section 2.3 for proper file placement in feature modules.
 * 
 * LAYOUT STRUCTURE (Placeholder):
 * 1. Wizard Header: Progress indicator/stepper showing all steps
 * 2. Wizard Body: Current step content with form fields
 * 3. Wizard Actions: Navigation buttons (Previous, Next, Submit)
 * 
 * REFERENCE: See AGENTS.md sections 2.3, 6.4, 8, 9 for detailed requirements
 */

/**
 * EXAMPLE: Wizard State Management
 * 
 * Track current step and manage step navigation:
 * 
 * const [activeStep, setActiveStep] = useState(0);
 * const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
 * 
 * const steps = [
 *   { label: t('wizard.steps.basicInfo'), key: 'basic-info' },
 *   { label: t('wizard.steps.details'), key: 'details' },
 *   { label: t('wizard.steps.review'), key: 'review' },
 * ];
 * 
 * const isLastStep = activeStep === steps.length - 1;
 * const isFirstStep = activeStep === 0;
 * 
 * const handleNext = async () => {
 *   // Validate current step
 *   const isValid = await trigger(); // React Hook Form trigger validation
 *   if (!isValid) return;
 *   
 *   // Mark step as completed
 *   setCompletedSteps(prev => new Set(prev).add(activeStep));
 *   
 *   // Move to next step
 *   setActiveStep(prev => prev + 1);
 * };
 * 
 * const handlePrevious = () => {
 *   setActiveStep(prev => prev - 1);
 * };
 * 
 * const handleStepClick = (stepIndex: number) => {
 *   // Allow navigation to completed steps only
 *   if (completedSteps.has(stepIndex) || stepIndex < activeStep) {
 *     setActiveStep(stepIndex);
 *   }
 * };
 */

/**
 * EXAMPLE: Multi-Step Zod Validation
 * 
 * Define separate schemas for each step:
 * 
 * const step1Schema = z.object({
 *   name: z.string().min(1, 'Name is required'),
 *   email: z.string().email('Invalid email'),
 * });
 * 
 * const step2Schema = z.object({
 *   description: z.string().min(10, 'Description must be at least 10 characters'),
 *   category: z.string().min(1, 'Category is required'),
 *   level: z.enum(['beginner', 'intermediate', 'advanced']),
 * });
 * 
 * const step3Schema = z.object({
 *   startDate: z.date({ required_error: 'Start date is required' }),
 *   endDate: z.date({ required_error: 'End date is required' }),
 *   capacity: z.number().min(1, 'Capacity must be at least 1'),
 * });
 * 
 * // Combined schema for final validation
 * const wizardSchema = step1Schema.merge(step2Schema).merge(step3Schema);
 * 
 * type WizardFormValues = z.infer<typeof wizardSchema>;
 * 
 * // Use in React Hook Form
 * const form = useForm<WizardFormValues>({
 *   resolver: zodResolver(wizardSchema),
 *   mode: 'onChange', // Validate on change for better UX
 * });
 */

/**
 * EXAMPLE: Step Component Structure
 * 
 * Extract each step to separate component:
 * 
 * File: @/modules/<feature>/components/Step1BasicInfo.tsx
 * 
 * interface Step1Props {
 *   control: Control<WizardFormValues>;
 *   errors: FieldErrors<WizardFormValues>;
 *   register: UseFormRegister<WizardFormValues>;
 *   isSubmitting: boolean;
 * }
 * 
 * export function Step1BasicInfo({ control, errors, register, isSubmitting }: Step1Props) {
 *   return (
 *     <div className="flex flex-col gap-4">
 *       <div className="flex flex-col gap-2">
 *         <label htmlFor="name">{t('fields.name')} *</label>
 *         <InputText id="name" {...register('name')} invalid={!!errors.name} />
 *         {errors.name && <small className="p-error">{errors.name.message}</small>}
 *       </div>
 *       // More fields...
 *     </div>
 *   );
 * }
 */

const WizardPage = () => {
    return (
        <div className="flex flex-col gap-6 px-4 py-4">
            {/* 
                WIZARD HEADER: Progress Indicator
                
                Display progress through wizard steps:
                - Show all steps with labels
                - Highlight current step
                - Show completed steps (checkmark or different color)
                - Allow navigation to completed steps
                - Disable future steps
                
                Component options:
                - Use Steps component from @/components/misc
                - Or create custom stepper with icons and lines
                
                Must include:
                - Step labels with i18n
                - Current step indicator (active state)
                - Completed step indicator (checkmark)
                - Clickable completed steps (if spec allows)
                - Disabled future steps
                - data-testid attributes
                - Responsive layout (vertical on mobile, horizontal on desktop)
                
                Example using Steps component:
                <Steps 
                    model={steps}
                    activeIndex={activeStep}
                    onSelect={(e) => handleStepClick(e.index)}
                    readOnly={false}
                />
            */}
            <div className="mb-4">
                {/* Implement stepper/progress indicator per spec.md requirements */}
                {/* Example: Steps component showing Step 1, Step 2, Step 3 with progress */}
            </div>

            {/* 
                WIZARD BODY: Current Step Content
                
                Display content for current step:
                - Show only fields for active step
                - Hide other steps content
                - Use conditional rendering based on activeStep
                - Connect to React Hook Form
                - Follow AGENTS.md Section 6.4 for form requirements
                
                STEP CONTENT STRUCTURE:
                
                Each step should contain:
                - Step title and description (optional)
                - Form fields specific to this step
                - Field validation errors
                - Instructions or help text
                
                COMPONENT SEPARATION (MANDATORY for wizard):
                - Extract EACH step to separate component file
                - Step 1: @/modules/<feature>/components/<Feature>Step1.tsx
                - Step 2: @/modules/<feature>/components/<Feature>Step2.tsx
                - Step 3: @/modules/<feature>/components/<Feature>Step3.tsx
                - Pass form control, errors, register, isSubmitting as props
                
                CONDITIONAL RENDERING PATTERN:
                
                {activeStep === 0 && (
                  <Step1BasicInfo 
                    control={control}
                    errors={errors}
                    register={register}
                    isSubmitting={isSubmitting}
                  />
                )}
                
                {activeStep === 1 && (
                  <Step2Details 
                    control={control}
                    errors={errors}
                    register={register}
                    isSubmitting={isSubmitting}
                  />
                )}
                
                {activeStep === 2 && (
                  <Step3Review 
                    control={control}
                    watch={watch}
                    isSubmitting={isSubmitting}
                  />
                )}
                
                REVIEW STEP (Usually last step):
                Display summary of all entered data:
                - Show all values from previous steps
                - Group by step or category
                - Allow editing (navigate back to specific step)
                - Format dates, numbers, selections properly
                - Show "Edit" button for each section
                
                Must include for each step:
                - Visible labels with htmlFor attribute
                - Required field indicators
                - Error messages below fields
                - Proper i18n labels
                - data-testid attributes
                - Invalid state styling
                - Disabled state during submission
                - Help text or instructions where needed
                - Field dependencies (show/hide based on other fields)
            */}
            <div className="card p-4">
                {/* 
                    STEP TITLE AND DESCRIPTION
                */}
                {/* <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-xl font-semibold">{steps[activeStep].label}</h3>
                    <p className="text-muted">{steps[activeStep].description}</p>
                </div> */}

                {/* 
                    STEP CONTENT
                    Render current step component based on activeStep
                */}
                <form>
                    {/* Step 1: Basic Information */}
                    {/* {activeStep === 0 && (
                        <Step1BasicInfo 
                            control={control}
                            errors={errors}
                            register={register}
                            isSubmitting={isSubmitting}
                        />
                    )} */}

                    {/* Step 2: Detailed Information */}
                    {/* {activeStep === 1 && (
                        <Step2Details 
                            control={control}
                            errors={errors}
                            register={register}
                            isSubmitting={isSubmitting}
                        />
                    )} */}

                    {/* Step 3: Review and Confirmation */}
                    {/* {activeStep === 2 && (
                        <Step3Review 
                            data={watch()}
                            onEdit={handleStepClick}
                            isSubmitting={isSubmitting}
                        />
                    )} */}
                </form>
            </div>

            {/* 
                WIZARD ACTIONS: Navigation Buttons
                
                Control wizard navigation:
                - Previous button: Go to previous step (hidden on first step)
                - Next button: Go to next step (validate current step first)
                - Submit button: Final submission (shown on last step)
                - Cancel button: Cancel wizard (optional, shows confirmation)
                
                Button behavior:
                - Previous: Enabled on all steps except first
                - Next: Enabled if current step is valid
                - Submit: Enabled on last step, shows loading state
                - All buttons: Disabled during submission
                
                Validation flow:
                - Next button: Trigger validation for current step only
                - If valid: Mark step complete, move to next step
                - If invalid: Show errors, stay on current step
                - Submit button: Validate all steps, then submit
                
                Must include:
                - Proper i18n labels
                - data-testid attributes
                - Loading indicator on submit
                - Disabled states
                - Proper button severity
                - Click handlers for navigation
                - Confirmation dialog for cancel (optional)
                
                Layout:
                - Left side: Cancel button (optional) + Previous button
                - Right side: Next button / Submit button
                - Use space-between for alignment
            */}
            <div className="flex justify-content-between gap-2 pt-4 border-top-1 surface-border">
                {/* LEFT SIDE: Previous Button */}
                <div className="flex gap-2">
                    {/* Cancel button (optional) */}
                    {/* <Button 
                        label={t('actions.cancel')}
                        severity="secondary"
                        outlined
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        data-testid="wizard-cancel-button"
                    /> */}
                    
                    {/* Previous button (hidden on first step) */}
                    {/* {!isFirstStep && (
                        <Button 
                            label={t('actions.previous')}
                            severity="secondary"
                            onClick={handlePrevious}
                            disabled={isSubmitting}
                            icon="pi pi-arrow-left"
                            data-testid="wizard-previous-button"
                        />
                    )} */}
                </div>

                {/* RIGHT SIDE: Next or Submit Button */}
                <div className="flex gap-2">
                    {/* Next button (shown on all steps except last) */}
                    {/* {!isLastStep && (
                        <Button 
                            label={t('actions.next')}
                            severity="primary"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            data-testid="wizard-next-button"
                        />
                    )} */}
                    
                    {/* Submit button (shown on last step only) */}
                    {/* {isLastStep && (
                        <Button 
                            label={t('actions.submit')}
                            severity="primary"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                            icon="pi pi-check"
                            data-testid="wizard-submit-button"
                        />
                    )} */}
                </div>
            </div>

            {/* 
                OPTIONAL: Step Navigation Dots/Pills
                
                Alternative or additional progress indicator:
                - Small dots or pills at bottom
                - Show number of steps
                - Highlight current step
                - Show completed steps
                
                Useful for mobile or minimal UI
            */}
            {/* <div className="flex justify-content-center gap-2 mt-4">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className={classNames(
                            'w-2 h-2 border-round',
                            {
                                'bg-primary': index === activeStep,
                                'bg-green-500': completedSteps.has(index),
                                'bg-gray-300': index !== activeStep && !completedSteps.has(index),
                            }
                        )}
                    />
                ))}
            </div> */}
        </div>
    );
};

export default WizardPage;
