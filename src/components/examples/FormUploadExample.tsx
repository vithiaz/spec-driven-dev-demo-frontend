'use client';

import { useState } from 'react';
import { FormUpload } from '@/components/form';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export function FormUploadExample() {
  const toast = useRef<Toast>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Example 1: Simple upload with common file types
  const handleSimpleUpload = async (files: File[]) => {
    console.log('Uploading files:', files);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);

    toast.current?.show({
      severity: 'success',
      summary: 'Upload Successful',
      detail: `${files.length} file(s) uploaded successfully`,
      life: 3000,
    });
  };

  // Example 2: Image-only upload
  const handleImageUpload = async (files: File[]) => {
    console.log('Uploading images:', files);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.current?.show({
      severity: 'success',
      summary: 'Images Uploaded',
      detail: `${files.length} image(s) uploaded successfully`,
      life: 3000,
    });
  };

  // Example 3: Document upload with strict size limit
  const handleDocumentUpload = async (files: File[]) => {
    console.log('Uploading documents:', files);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.current?.show({
      severity: 'success',
      summary: 'Documents Uploaded',
      detail: `${files.length} document(s) uploaded successfully`,
      life: 3000,
    });
  };

  // Example 4: Single file upload
  const handleSingleFileUpload = async (files: File[]) => {
    console.log('Uploading single file:', files[0]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.current?.show({
      severity: 'success',
      summary: 'File Uploaded',
      detail: `${files[0].name} uploaded successfully`,
      life: 3000,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <Toast ref={toast} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          FormUpload Component Examples
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A comprehensive file upload component with drag & drop, validation,
          and progress tracking.
        </p>
      </div>

      {/* Example 1: Basic Upload with Multiple Files */}
      <Card title="1. Basic Multiple File Upload" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Files"
            helperText="You can upload multiple files (max 10 files, 5MB each)"
            onUpload={handleSimpleUpload}
            maxFiles={10}
            maxFileSize={5 * 1024 * 1024} // 5MB
            enableDragDrop={true}
            required
            onFileRemove={(file) => {
              console.log('File removed:', file.name);
              toast.current?.show({
                severity: 'warn',
                summary: 'File Removed',
                detail: `${file.name} removed`,
                life: 2000,
              });
            }}
          />
        </div>
      </Card>

      {/* Example 2: Image Upload Only */}
      <Card title="2. Image Upload Only" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Images"
            helperText="Only image files are accepted (JPG, PNG, GIF, WebP)"
            onUpload={handleImageUpload}
            acceptedExtensions={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
            maxFiles={5}
            maxFileSize={10 * 1024 * 1024} // 10MB
            chooseButtonLabel="Choose Images"
            dragDropLabel="Drag and drop images here"
            required
          />
        </div>
      </Card>

      {/* Example 3: Document Upload with Strict Limits */}
      <Card title="3. Document Upload (PDF, DOCX)" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Documents"
            helperText="PDF and Word documents only, max 2MB per file"
            onUpload={handleDocumentUpload}
            acceptedExtensions={['.pdf', '.doc', '.docx']}
            maxFiles={3}
            maxFileSize={2 * 1024 * 1024} // 2MB
            chooseButtonLabel="Choose Documents"
          />
        </div>
      </Card>

      {/* Example 4: Single File Upload */}
      <Card title="4. Single File Upload" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Single File"
            helperText="Upload only one file at a time"
            onUpload={handleSingleFileUpload}
            maxFiles={1}
            maxFileSize={10 * 1024 * 1024} // 10MB
            chooseButtonLabel="Choose File"
          />
        </div>
      </Card>

      {/* Example 5: No Drag and Drop */}
      <Card title="5. Upload Without Drag & Drop" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Click to Upload"
            helperText="Drag and drop is disabled for this upload"
            onUpload={handleSimpleUpload}
            enableDragDrop={false}
            maxFiles={5}
            chooseButtonLabel="Browse Files"
          />
        </div>
      </Card>

      {/* Example 6: With Error State */}
      <Card title="6. Upload with Error" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Files"
            error="Please upload at least one file to continue"
            onUpload={handleSimpleUpload}
            maxFiles={5}
            required
          />
        </div>
      </Card>

      {/* Example 7: Disabled State */}
      <Card title="7. Disabled Upload" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Files"
            helperText="This upload field is currently disabled"
            onUpload={handleSimpleUpload}
            disabled={true}
            maxFiles={5}
          />
        </div>
      </Card>

      {/* Example 8: Custom Labels */}
      <Card title="8. Custom Labels and Styling" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Your Resume"
            helperText="Accepted formats: PDF, DOC, DOCX (Max 5MB)"
            onUpload={handleDocumentUpload}
            acceptedExtensions={['.pdf', '.doc', '.docx']}
            maxFiles={1}
            maxFileSize={5 * 1024 * 1024}
            chooseButtonLabel="Select Resume"
            cancelButtonLabel="Clear"
            dragDropLabel="Drop your resume here"
            containerClassName="max-w-2xl"
            required
          />
        </div>
      </Card>

      {/* Example 9: With File Select Callback */}
      <Card title="9. Upload with File Select Callback" className="mb-4">
        <div className="space-y-4">
          <FormUpload
            label="Upload Files"
            helperText="Files are validated on selection"
            onUpload={handleSimpleUpload}
            onFileSelect={(e) => {
              console.log('Files selected:', e.files);
              toast.current?.show({
                severity: 'info',
                summary: 'Files Selected',
                detail: `${e.files.length} file(s) selected`,
                life: 2000,
              });
            }}
            onFileRemove={(file) => {
              console.log('File removed:', file.name);
              toast.current?.show({
                severity: 'warn',
                summary: 'File Removed',
                detail: `${file.name} removed`,
                life: 2000,
              });
            }}
            maxFiles={5}
          />
        </div>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card title="Uploaded Files" className="mb-4">
          <ul className="list-disc list-inside space-y-1">
            {uploadedFiles.map((filename, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {filename}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Usage Examples Code */}
      <Card title="Usage Examples" className="mb-4">
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import { FormUpload } from '@/components/form';

// Basic usage
<FormUpload
  label="Upload Files"
  helperText="Select files to upload"
  onUpload={async (files) => {
    // Handle upload logic
    console.log('Uploading:', files);
  }}
  maxFiles={10}
  maxFileSize={5 * 1024 * 1024} // 5MB
  required
/>

// Image upload only
<FormUpload
  label="Upload Images"
  acceptedExtensions={['.jpg', '.jpeg', '.png']}
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024}
  onUpload={handleImageUpload}
/>

// Single file with callbacks
<FormUpload
  label="Upload Resume"
  acceptedExtensions={['.pdf', '.doc', '.docx']}
  maxFiles={1}
  onUpload={handleUpload}
  onFileSelect={(e) => console.log('Selected:', e.files)}
  onFileRemove={(file) => console.log('Removed:', file.name)}
/>`}</code>
        </pre>
      </Card>

      {/* Features List */}
      <Card title="Features" className="mb-4">
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>✅ Drag and drop support (can be disabled)</li>
          <li>✅ File type validation with customizable extensions</li>
          <li>✅ File size validation with configurable limits</li>
          <li>✅ Multiple or single file upload</li>
          <li>✅ Maximum files limit</li>
          <li>✅ Upload progress indicator</li>
          <li>✅ Custom upload callback function</li>
          <li>✅ File selection and removal callbacks</li>
          <li>✅ Customizable labels and messages</li>
          <li>✅ Error state support</li>
          <li>✅ Disabled state support</li>
          <li>✅ Integrates with PrimeReact theming</li>
          <li>✅ Follows project conventions (FieldWrapper, BaseFieldProps)</li>
          <li>✅ Full TypeScript support</li>
        </ul>
      </Card>
    </div>
  );
}
