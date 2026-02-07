'use client';

import { useRef } from 'react';
import { Button } from 'primereact/button';
import Toast, { ToastRef } from '@/components/messages/Toast';
import Message from '@/components/messages/Message';
import { Card } from 'primereact/card';

export function MessagesExample() {
  const toastRef = useRef<ToastRef>(null);
  const toastTL = useRef<ToastRef>(null);
  const toastBL = useRef<ToastRef>(null);
  const toastBR = useRef<ToastRef>(null);
  const toastSticky = useRef<ToastRef>(null);

  // Handler default toast
  const showSuccess = () => {
    toastRef.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      life: 3000,
      icon: 'pi pi-check-circle',
    });
  };
  const showInfo = () => {
    toastRef.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      life: 3000,
    });
  };
  const showWarn = () => {
    toastRef.current?.show({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Message Content',
      life: 3000,
    });
  };
  const showError = () => {
    toastRef.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Message Content',
      life: 3000,
    });
  };

  // Handler toast position
  const showTopLeft = () => {
    toastTL.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: 'Top Left Toast',
      life: 3000,
    });
  };
  const showBottomLeft = () => {
    toastBL.current?.show({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Bottom Left Toast',
      life: 3000,
    });
  };
  const showBottomRight = () => {
    toastBR.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Bottom Right Toast',
      life: 3000,
    });
  };

  // Handler sticky toast
  const showSticky = () => {
    toastSticky.current?.show({
      severity: 'success',
      summary: 'Sticky Message',
      detail: 'This message will stay until cleared.',
      sticky: true,
    });
  };
  const clear = () => {
    toastSticky.current?.clear();
  };

  return (
    <div className="p-4">
      <Toast ref={toastRef} />
      <Toast ref={toastTL} position="top-left" />
      <Toast ref={toastBL} position="bottom-left" />
      <Toast ref={toastBR} position="bottom-right" />
      <Toast ref={toastSticky} />

      <h1 className="text-3xl font-bold mb-4">Message and Toast Examples</h1>

      <Card title="1. Message Component" className="mb-4">
        <p className="mb-4">
          The <code>Message</code> component is used to display inline messages
          with various severities.
        </p>
        <div className="flex flex-wrap gap-2">
          <Message
            severity="success"
            text="Success Message"
            icon="pi pi-check-circle"
          />
          <Message severity="info" text="Info Message" />
          <Message severity="warn" text="Warning Message" />
          <Message severity="error" text="Error Message" />
          <Message
            severity="secondary"
            text="Secondary Message"
            icon="pi pi-bell"
          />
          <Message severity="contrast" text="Contrast Message" />
        </div>
      </Card>

      <Card title="2. Toast Component" className="mb-4">
        <p className="mb-4">
          The <code>Toast</code> component is used to display overlay messages.
          Click the buttons below to show toasts.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Show Success"
            onClick={showSuccess}
            className="p-button-success"
          />
          <Button
            label="Show Info"
            onClick={showInfo}
            className="p-button-info"
          />
          <Button
            label="Show Warning"
            onClick={showWarn}
            className="p-button-warning"
          />
          <Button
            label="Show Error"
            onClick={showError}
            className="p-button-danger"
          />
        </div>
      </Card>

      <Card title="3. Toast Position" className="mb-4">
        <p className="mb-4">
          You can specify the <code>position</code> of the Toast (e.g.,
          `top-left`, `bottom-right`).
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Top Left"
            className="p-button-warning"
            onClick={showTopLeft}
          />
          <Button
            label="Bottom Left"
            className="p-button-warning"
            onClick={showBottomLeft}
          />
          <Button
            label="Bottom Right"
            className="p-button-success"
            onClick={showBottomRight}
          />
        </div>
      </Card>

      <Card title="4. Sticky Toast" className="mb-4">
        <p className="mb-4">
          Sticky toasts remain visible until they are manually cleared using the{' '}
          <code>clear()</code> method.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            label="Show Sticky"
            onClick={showSticky}
            className="p-button-success"
          />
          <Button
            label="Clear"
            onClick={clear}
            className="p-button-secondary"
          />
        </div>
      </Card>

      {/* Usage Examples */}
      <Card title="Usage Examples" className="mb-0">
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`// 1. Message Component
import Message from '@/components/messages/Message';

<Message severity="success" text="This is a success message" />
<Message severity="error" text="An error occurred" />

// 2. Toast Component (basic)
import { useRef } from 'react';
import Toast, { ToastRef } from '@/components/messages/Toast';
import { Button } from 'primereact/button';

const toastRef = useRef<ToastRef>(null);

<Toast ref={toastRef} />
<Button 
  label="Show Toast"
  onClick={() => toastRef.current?.show({ 
    severity: 'success', 
    summary: 'Success', 
    detail: 'Your action was successful', 
    life: 3000 
  })}
/>

// 3. Toast with Position
const toastTR = useRef<ToastRef>(null);

<Toast ref={toastTR} position="top-right" />
<Button 
  label="Show Top Right"
  onClick={() => toastTR.current?.show({ 
    severity: 'info', 
    summary: 'Info', 
    detail: 'This toast appears in the top-right corner', 
    life: 3000 
  })}
/>

// 4. Sticky Toast
const toastSticky = useRef<ToastRef>(null);

<Toast ref={toastSticky} />
<Button 
  label="Show Sticky"
  onClick={() => toastSticky.current?.show({ 
    severity: 'success', 
    summary: 'Sticky Message', 
    detail: 'This message stays until cleared.', 
    sticky: true 
  })}
/>
<Button 
  label="Clear" 
  onClick={() => toastSticky.current?.clear()} 
/>`}</code>
        </pre>
      </Card>
    </div>
  );
}
