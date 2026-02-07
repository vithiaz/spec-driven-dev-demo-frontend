/**
 * PrimeReact Form Components Example
 *
 * This file demonstrates the usage of all styled PrimeReact form components.
 * All components automatically inherit the custom theme styles.
 */

'use client';

import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { Nullable } from 'primereact/ts-helpers';
import { Button } from 'primereact/button';
import { SelectButton as PrimeSelectButton } from 'primereact/selectbutton';
import { SplitButton as PrimeSplitButton } from 'primereact/splitbutton';
import { MenuItem } from 'primereact/menuitem';
import type { BreadcrumbItem } from '@/state/pageHeaderStore';
import {
  Accordion,
  Card,
  Divider,
  Panel,
  ScrollPanel,
  Stepper,
  Tab,
} from '@/components/panel';
import { FormCheckbox } from '@/components/form';
import { SelectButton, SplitButton } from '@/components/button';
import { Tooltip, Drawer, Modal } from '@/components/overlay';
import { Breadcrumbs, TabMenu } from '@/components/menu';
import { LineChart, BarChart, PieChart } from '@/components/chart';
import {
  Avatar,
  Badge,
  Chip,
  ProgressBar,
  Spinner,
  Tag,
} from '@/components/misc';
import { DialogConfirmation } from '../common/DialogConfirmation';

interface City {
  label: string;
  value: string;
}

export default function PrimeReactFormExample() {
  // InputText
  const [text, setText] = useState<string>('');

  // InputTextArea
  const [textarea, setTextarea] = useState<string>('');

  // InputNumber
  const [number, setNumber] = useState<number | null>(0);

  // InputMask
  const [phone, setPhone] = useState<string>('');

  // Dropdown
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cities: City[] = [
    { label: 'New York', value: 'NY' },
    { label: 'Los Angeles', value: 'LA' },
    { label: 'Chicago', value: 'CH' },
    { label: 'Houston', value: 'HO' },
  ];

  // MultiSelect
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Calendar
  const [date, setDate] = useState<Nullable<Date>>(null);

  // Checkbox
  const [checked, setChecked] = useState<boolean>(false);

  // RadioButton
  const [selectedOption, setSelectedOption] = useState<string>('option1');

  // Switch
  const [switchValue, setSwitchValue] = useState<boolean>(false);

  // Chips
  const [chips, setChips] = useState<string[]>([]);

  // Password
  const [password, setPassword] = useState<string>('');

  // Editor
  const [editorText, setEditorText] = useState<string>('');

  // Stepper
  const [activeStep, setActiveStep] = useState<number>(0);

  // Notification preferences
  const [emailNotif] = useState<boolean>(false);
  const [smsNotif] = useState<boolean>(false);
  const [pushNotif] = useState<boolean>(false);

  // Overlay components
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [drawerPosition, setDrawerPosition] = useState<
    'top' | 'right' | 'bottom' | 'left'
  >('right');

  // Misc components
  const [progressValue, setProgressValue] = useState<number>(45);
  const [techChips, setTechChips] = useState<string[]>([
    'React',
    'TypeScript',
    'Next.js',
  ]);

  // SelectButton
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const paymentOptions = [
    { label: 'Credit Card', value: 'credit' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank' },
  ];

  // SplitButton
  const splitButtonItems: MenuItem[] = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        alert('Update action');
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        alert('Delete action');
      },
    },
    {
      separator: true,
    },
    {
      label: 'Export',
      icon: 'pi pi-external-link',
      command: () => {
        alert('Export action');
      },
    },
  ];

  // TabMenu
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const tabMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home' },
    { label: 'Transactions', icon: 'pi pi-list' },
    { label: 'Products', icon: 'pi pi-shopping-cart' },
    { label: 'Reports', icon: 'pi pi-chart-line' },
  ];

  // Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Examples', url: '/components/examples' },
  ];
  const breadcrumbHome: MenuItem = { icon: 'pi pi-home', url: '/' };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">PrimeReact Form Components</h1>

      {/* Divider */}
      <Divider label="Menu Navigation Components" />

      {/* Breadcrumbs */}
      <Panel header="Breadcrumbs Example" containerClassName="mb-6">
        <div className="space-y-4 p-4">
          <p className="mb-4">
            Breadcrumbs show the current page location in the navigation
            hierarchy.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Basic Breadcrumbs</h4>
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">With Home Icon</h4>
              <Breadcrumbs items={breadcrumbItems} home={breadcrumbHome} />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Nested Navigation</h4>
              <Breadcrumbs
                items={[
                  { label: 'Dashboard', url: '/dashboard' },
                  { label: 'Settings', url: '/dashboard/settings' },
                  { label: 'Profile', url: '/dashboard/settings/profile' },
                  { label: 'Edit' },
                ]}
                home={breadcrumbHome}
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* TabMenu */}
      <Panel header="TabMenu Example" containerClassName="mb-6">
        <div className="space-y-4 p-4">
          <p className="mb-4">
            TabMenu provides tab-based navigation for switching between
            different views.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Navigation Tabs</h4>
              <TabMenu
                items={tabMenuItems}
                activeIndex={activeTabIndex}
                onTabChange={(e) => setActiveTabIndex(e.index)}
              />
              <div className="mt-4 p-4 border rounded">
                <h5 className="font-semibold mb-2">
                  Content for: {tabMenuItems[activeTabIndex].label}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is the content for the{' '}
                  {tabMenuItems[activeTabIndex].label} tab. Click different tabs
                  to see the content change.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                Simple Tabs (No Icons)
              </h4>
              <TabMenu
                items={[
                  { label: 'Overview' },
                  { label: 'Details' },
                  { label: 'Comments' },
                  { label: 'History' },
                ]}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                Tab Navigation with Commands
              </h4>
              <TabMenu
                items={[
                  {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    command: () => alert('Navigate to Profile'),
                  },
                  {
                    label: 'Settings',
                    icon: 'pi pi-cog',
                    command: () => alert('Navigate to Settings'),
                  },
                  {
                    label: 'Messages',
                    icon: 'pi pi-envelope',
                    command: () => alert('Navigate to Messages'),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* Divider */}
      <Divider label="Form Input Components" />

      {/* InputText */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="block font-semibold">
          InputText
        </label>
        <InputText
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here"
          className="w-full"
        />
      </div>

      {/* InputTextArea */}
      <div className="space-y-2">
        <label htmlFor="textarea" className="block font-semibold">
          InputTextArea
        </label>
        <InputTextarea
          id="textarea"
          value={textarea}
          onChange={(e) => setTextarea(e.target.value)}
          rows={4}
          placeholder="Enter description"
          className="w-full"
        />
      </div>

      {/* InputNumber */}
      <div className="space-y-2">
        <label htmlFor="number-input" className="block font-semibold">
          InputNumber
        </label>
        <InputNumber
          id="number-input"
          value={number}
          onValueChange={(e) => setNumber(e.value ?? null)}
          min={0}
          max={100}
        />
      </div>

      {/* InputMask */}
      <div className="space-y-2">
        <label htmlFor="phone-input" className="block font-semibold">
          InputMask (Phone)
        </label>
        <InputMask
          id="phone-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value ?? '')}
          mask="(999) 999-9999"
          placeholder="(999) 999-9999"
        />
      </div>

      {/* Dropdown */}
      <div className="space-y-2">
        <label htmlFor="dropdown" className="block font-semibold">
          Dropdown
        </label>
        <Dropdown
          id="dropdown"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={cities}
          placeholder="Select a city"
          className="w-full"
        />
      </div>

      {/* MultiSelect */}
      <div className="space-y-2">
        <label htmlFor="multiselect" className="block font-semibold">
          MultiSelect
        </label>
        <MultiSelect
          id="multiselect"
          value={selectedCities}
          onChange={(e) => setSelectedCities(e.value)}
          options={cities}
          placeholder="Select cities"
          className="w-full"
          display="chip"
        />
      </div>

      {/* Calendar */}
      <div className="space-y-2">
        <label htmlFor="calendar" className="block font-semibold">
          Calendar
        </label>
        <Calendar
          id="calendar"
          value={date}
          onChange={(e) => setDate(e.value)}
          placeholder="Select date"
          showIcon
          className="w-full"
        />
      </div>

      {/* Checkbox */}
      <div className="space-y-2">
        <label className="block font-semibold">Checkbox</label>
        <div className="flex items-center gap-3">
          <Checkbox
            inputId="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.checked ?? false)}
          />
          <label htmlFor="checkbox" className="cursor-pointer">
            Accept terms and conditions
          </label>
        </div>
      </div>

      {/* RadioButton */}
      <div className="space-y-2">
        <label className="block font-semibold">RadioButton</label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <RadioButton
              inputId="option1"
              name="option"
              value="option1"
              checked={selectedOption === 'option1'}
              onChange={(e) => setSelectedOption(e.value)}
            />
            <label htmlFor="option1" className="cursor-pointer">
              Option 1
            </label>
          </div>
          <div className="flex items-center gap-3">
            <RadioButton
              inputId="option2"
              name="option"
              value="option2"
              checked={selectedOption === 'option2'}
              onChange={(e) => setSelectedOption(e.value)}
            />
            <label htmlFor="option2" className="cursor-pointer">
              Option 2
            </label>
          </div>
          <div className="flex items-center gap-3">
            <RadioButton
              inputId="option3"
              name="option"
              value="option3"
              checked={selectedOption === 'option3'}
              onChange={(e) => setSelectedOption(e.value)}
            />
            <label htmlFor="option3" className="cursor-pointer">
              Option 3
            </label>
          </div>
        </div>
      </div>

      {/* Switch */}
      <div className="space-y-2">
        <label className="block font-semibold">Switch</label>
        <div className="flex items-center gap-3">
          <InputSwitch
            inputId="switch"
            checked={switchValue}
            onChange={(e) => setSwitchValue(e.value ?? false)}
          />
          <label htmlFor="switch" className="cursor-pointer">
            Enable notifications
          </label>
        </div>
      </div>

      {/* Chips */}
      <div className="space-y-2">
        <label htmlFor="chips" className="block font-semibold">
          Chips (Tags)
        </label>
        <Chips
          id="chips"
          value={chips}
          onChange={(e) => setChips(e.value ?? [])}
          placeholder="Add tags (press Enter)"
          className="w-full"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block font-semibold">
          Password
        </label>
        <Password
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          toggleMask
          feedback
          className="w-full"
        />
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label htmlFor="editor" className="block font-semibold">
          Editor (Rich Text)
        </label>
        <Editor
          id="editor"
          value={editorText}
          onTextChange={(e) => setEditorText(e.htmlValue ?? '')}
          style={{ height: '200px' }}
        />
      </div>

      {/* SelectButton */}
      <div className="space-y-2">
        <label className="block font-semibold">SelectButton</label>
        <PrimeSelectButton
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.value)}
          options={paymentOptions}
        />
      </div>

      {/* FormSelectButton - With Wrapper */}
      <SelectButton
        label="Payment Method (with wrapper)"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.value)}
        options={paymentOptions}
        required
        helperText="Select your preferred payment method"
      />

      {/* SplitButton */}
      <div className="space-y-2">
        <label className="block font-semibold">SplitButton</label>
        <PrimeSplitButton
          label="Save"
          icon="pi pi-check"
          model={splitButtonItems}
          onClick={() => alert('Save clicked')}
        />
      </div>

      {/* FormSplitButton - With Wrapper */}
      <SplitButton
        label="Actions (with wrapper)"
        buttonLabel="Save"
        icon="pi pi-check"
        model={splitButtonItems}
        onClick={() => alert('Save clicked')}
        helperText="Primary action saves, dropdown shows more options"
      />

      {/* Divider */}
      <Divider label="Layout Components" />

      {/* Card */}
      <Card
        title="Form Card Example"
        subtitle="A reusable card component"
        footer={
          <div className="flex gap-2">
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" icon="pi pi-times" severity="secondary" />
          </div>
        }
        containerClassName="mb-6"
      >
        <p className="m-0">
          This is a card component that can contain any content. It&apos;s
          useful for grouping related form fields or displaying information in a
          structured way.
        </p>
      </Card>

      {/* Panel */}
      <Panel header="Form Panel Example" toggleable containerClassName="mb-6">
        <p className="m-0">
          This is a panel component that can be collapsed/expanded. It&apos;s
          perfect for organizing form sections that users may want to show or
          hide.
        </p>
        <div className="mt-4 space-y-2">
          <InputText placeholder="Field inside panel" className="w-full" />
        </div>
      </Panel>

      {/* Accordion */}
      <Accordion
        tabs={[
          {
            header: 'Personal Information',
            children: (
              <div className="space-y-4">
                <InputText placeholder="Full Name" className="w-full" />
                <InputText placeholder="Email" className="w-full" />
                <InputMask
                  mask="(999) 999-9999"
                  placeholder="Phone Number"
                  className="w-full"
                />
              </div>
            ),
          },
          {
            header: 'Address Details',
            children: (
              <div className="space-y-4">
                <InputText placeholder="Street Address" className="w-full" />
                <InputText placeholder="City" className="w-full" />
                <InputText placeholder="Postal Code" className="w-full" />
              </div>
            ),
          },
          {
            header: 'Additional Information',
            children: (
              <div className="space-y-4">
                <InputTextarea
                  placeholder="Comments"
                  rows={4}
                  className="w-full"
                />
              </div>
            ),
          },
        ]}
        containerClassName="mb-6"
      />

      {/* TabView */}
      <Tab
        tabs={[
          {
            header: 'Profile',
            leftIcon: 'pi pi-user',
            children: (
              <div className="space-y-4 p-4">
                <h3 className="text-lg font-semibold">Profile Settings</h3>
                <InputText placeholder="Username" className="w-full" />
                <InputText placeholder="Display Name" className="w-full" />
                <InputTextarea placeholder="Bio" rows={4} className="w-full" />
              </div>
            ),
          },
          {
            header: 'Security',
            leftIcon: 'pi pi-lock',
            children: (
              <div className="space-y-4 p-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <Password
                  placeholder="Current Password"
                  className="w-full"
                  toggleMask
                />
                <Password
                  placeholder="New Password"
                  className="w-full"
                  toggleMask
                  feedback
                />
                <Password
                  placeholder="Confirm Password"
                  className="w-full"
                  toggleMask
                />
              </div>
            ),
          },
          {
            header: 'Notifications',
            leftIcon: 'pi pi-bell',
            children: (
              <div className="space-y-4 p-4">
                <h3 className="text-lg font-semibold">
                  Notification Preferences
                </h3>
                <div className="flex items-center gap-3">
                  <FormCheckbox checked={emailNotif} inputId="email-notif" />
                  <label htmlFor="email-notif">Email Notifications</label>
                </div>
                <div className="flex items-center gap-3">
                  <FormCheckbox checked={smsNotif} inputId="email-notif" />
                  <label htmlFor="sms-notif">SMS Notifications</label>
                </div>
                <div className="flex items-center gap-3">
                  <FormCheckbox checked={pushNotif} inputId="email-notif" />
                  <label htmlFor="push-notif">Push Notifications</label>
                </div>
              </div>
            ),
          },
        ]}
        containerClassName="mb-6"
      />

      {/* ScrollPanel */}
      <Panel header="Scroll Panel Example" containerClassName="mb-6">
        <ScrollPanel style={{ width: '100%', height: '200px' }}>
          <div className="space-y-2 p-2">
            {[...Array(20)].map((_, i) => (
              <p key={i} className="m-0">
                Line {i + 1}: This is scrollable content. The ScrollPanel
                component is useful when you have long content that needs to fit
                in a fixed height area.
              </p>
            ))}
          </div>
        </ScrollPanel>
      </Panel>

      {/* Stepper */}
      <Stepper
        steps={[
          {
            header: 'Step 1',
            children: (
              <div className="flex flex-col h-48">
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <InputText placeholder="Full Name" className="w-full" />
                    <InputText placeholder="Email Address" className="w-full" />
                  </div>
                </div>
                <div className="flex pt-4 justify-end">
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => setActiveStep(1)}
                  />
                </div>
              </div>
            ),
          },
          {
            header: 'Step 2',
            children: (
              <div className="flex flex-col h-48">
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    <InputMask
                      mask="(999) 999-9999"
                      placeholder="Phone Number"
                      className="w-full"
                    />
                    <InputText placeholder="Address" className="w-full" />
                  </div>
                </div>
                <div className="flex pt-4 justify-between">
                  <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    onClick={() => setActiveStep(0)}
                  />
                  <Button
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => setActiveStep(2)}
                  />
                </div>
              </div>
            ),
          },
          {
            header: 'Step 3',
            children: (
              <div className="flex flex-col h-48">
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Review & Submit
                  </h3>
                  <p className="m-0">
                    Please review your information and click Submit to complete
                    the process.
                  </p>
                </div>
                <div className="flex pt-4 justify-between">
                  <Button
                    label="Back"
                    icon="pi pi-arrow-left"
                    onClick={() => setActiveStep(1)}
                  />
                  <Button label="Submit" icon="pi pi-check" iconPos="right" />
                </div>
              </div>
            ),
          },
        ]}
        activeStep={activeStep}
        onChangeStep={(e) => setActiveStep(e.index)}
        containerClassName="mb-6"
      />

      {/* Divider */}
      <Divider label="Overlay Components" />

      {/* Tooltip Examples */}
      <Panel header="Tooltip Examples" containerClassName="mb-6">
        <div className="space-y-4 p-4">
          <p className="mb-4">
            Hover over the buttons below to see tooltips in different positions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Top Tooltip"
              className="tooltip-top"
              data-pr-tooltip="This is a tooltip on top"
            />
            <Button
              label="Right Tooltip"
              className="tooltip-right"
              data-pr-tooltip="This is a tooltip on right"
            />
            <Button
              label="Bottom Tooltip"
              className="tooltip-bottom"
              data-pr-tooltip="This is a tooltip on bottom"
            />
            <Button
              label="Left Tooltip"
              className="tooltip-left"
              data-pr-tooltip="This is a tooltip on left"
            />
            <Button
              label="Info"
              icon="pi pi-info-circle"
              className="tooltip-info p-button-help"
              data-pr-tooltip="Click for more information about this feature"
            />
          </div>
          <Tooltip target=".tooltip-top" position="top" />
          <Tooltip target=".tooltip-right" position="right" />
          <Tooltip target=".tooltip-bottom" position="bottom" />
          <Tooltip target=".tooltip-left" position="left" />
          <Tooltip
            target=".tooltip-info"
            position="top"
            mouseTrack
            mouseTrackTop={10}
          />
        </div>
      </Panel>

      {/* Drawer Examples */}
      <Panel header="Drawer Examples" containerClassName="mb-6">
        <div className="space-y-4 p-4">
          <p className="mb-4">
            Click the buttons below to open drawers from different positions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Open Right Drawer"
              icon="pi pi-arrow-left"
              onClick={() => {
                setDrawerPosition('right');
                setShowDrawer(true);
              }}
            />
            <Button
              label="Open Left Drawer"
              icon="pi pi-arrow-right"
              onClick={() => {
                setDrawerPosition('left');
                setShowDrawer(true);
              }}
            />
            <Button
              label="Open Top Drawer"
              icon="pi pi-arrow-down"
              onClick={() => {
                setDrawerPosition('top');
                setShowDrawer(true);
              }}
            />
            <Button
              label="Open Bottom Drawer"
              icon="pi pi-arrow-up"
              onClick={() => {
                setDrawerPosition('bottom');
                setShowDrawer(true);
              }}
            />
          </div>
        </div>
      </Panel>

      {/* Modal Examples */}
      <Panel header="Modal Examples" containerClassName="mb-6">
        <div className="space-y-4 p-4">
          <p className="mb-4">
            Click the buttons below to open different types of modals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Open Modal"
              icon="pi pi-external-link"
              onClick={() => setShowModal(true)}
            />
            <Button
              label="Confirm Dialog"
              icon="pi pi-exclamation-triangle"
              severity="warning"
              onClick={() => setShowConfirmModal(true)}
            />
          </div>
        </div>
      </Panel>

      {/* Drawer Component */}
      <Drawer
        visible={showDrawer}
        onHide={() => setShowDrawer(false)}
        position={drawerPosition}
        title={`${drawerPosition.charAt(0).toUpperCase() + drawerPosition.slice(1)} Drawer`}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => setShowDrawer(false)}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={() => {
                alert('Saved!');
                setShowDrawer(false);
              }}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <p>
            This is a drawer sliding from the {drawerPosition}. You can put any
            content here, including forms, lists, or other components.
          </p>
          <div className="space-y-4">
            <InputText placeholder="Name" className="w-full" />
            <InputText placeholder="Email" className="w-full" />
            <Dropdown
              options={cities}
              placeholder="Select a city"
              className="w-full"
            />
            <InputTextarea
              placeholder="Description"
              rows={4}
              className="w-full"
            />
          </div>
        </div>
      </Drawer>

      {/* Modal Component */}
      <Modal
        visible={showModal}
        onHide={() => setShowModal(false)}
        title="Modal Dialog"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => setShowModal(false)}
            />
            <Button
              label="Submit"
              icon="pi pi-check"
              onClick={() => {
                alert('Submitted!');
                setShowModal(false);
              }}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <p>
            This is a modal dialog. It blocks interaction with the rest of the
            page until it is closed.
          </p>
          <div className="space-y-4">
            <InputText placeholder="Username" className="w-full" />
            <Password
              placeholder="Password"
              className="w-full"
              toggleMask
              feedback={false}
            />
            <div className="flex items-center gap-3">
              <FormCheckbox checked inputId="remember" />
              <label htmlFor="remember" className="cursor-pointer">
                Remember me
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        title="Confirm Action"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label="No"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => setShowConfirmModal(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={() => {
                alert('Confirmed!');
                setShowConfirmModal(false);
              }}
            />
          </div>
        }
      >
        <div className="flex items-center gap-4">
          <i className="pi pi-exclamation-triangle text-4xl text-yellow-500"></i>
          <div>
            <p className="m-0">
              Are you sure you want to proceed? This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* Divider */}
      <Divider label="Dialog Confirmation Component" />

      {/* DialogConfirmation Examples */}
      <Panel
        header="DialogConfirmation - Delete Confirmation"
        containerClassName="mb-6"
      >
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Delete Confirmation with Hook
            </h3>
            <p className="text-gray-600 mb-4">
              This example demonstrates a delete confirmation dialog with async
              operation handling.
            </p>
            <Button
              label="Delete Item"
              icon="pi pi-trash"
              severity="danger"
              // onClick={() => deleteDialog.open('delete', { id: 1, name: 'Sample Item' })}
            />
          </div>
        </div>
      </Panel>

      {/* Create Dialog */}
      <Panel
        header="DialogConfirmation - Create Confirmation"
        containerClassName="mb-6"
      >
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Create with Custom Form
            </h3>
            <p className="text-gray-600 mb-4">
              This example shows a create dialog with custom form fields in the
              body.
            </p>
            <Button
              label="Create New Item"
              icon="pi pi-plus"
              severity="success"
              // onClick={() => createDialog.open('create')}
            />
          </div>
        </div>
      </Panel>

      {/* Update Dialog */}
      <Panel
        header="DialogConfirmation - Update Confirmation"
        containerClassName="mb-6"
      >
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Update Confirmation</h3>
            <p className="text-gray-600 mb-4">
              This example demonstrates an update confirmation with info
              severity.
            </p>
            <Button
              label="Update Item"
              icon="pi pi-pencil"
              severity="info"
              // onClick={() => updateDialog.open('update', { id: 1, name: 'Updated Item' })}
            />
          </div>
        </div>
      </Panel>

      {/* Custom Description */}
      <Panel
        header="DialogConfirmation - Custom Description"
        containerClassName="mb-6"
      >
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Custom Description Component
            </h3>
            <p className="text-gray-600 mb-4">
              You can pass a custom React component as the description for rich
              content.
            </p>
            <Button
              label="Show Warning"
              icon="pi pi-exclamation-triangle"
              severity="warning"
              onClick={() => setShowConfirmModal(true)}
            />
          </div>
        </div>
      </Panel>

      <DialogConfirmation
        visible={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        title="Important Warning"
        description={
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <i className="pi pi-exclamation-triangle text-yellow-600 dark:text-yellow-500 text-xl" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
                  Important Notice
                </h4>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                  This action will affect multiple records. Please proceed with
                  caution. Make sure you have reviewed all the changes before
                  confirming.
                </p>
                <ul className="list-disc list-inside text-yellow-600 dark:text-yellow-500 text-sm mt-2 space-y-1">
                  <li>All related data will be modified</li>
                  <li>This action cannot be undone</li>
                  <li>Backup will be created automatically</li>
                </ul>
              </div>
            </div>
          </div>
        }
        submitText="I Understand, Proceed"
        submitSeverity="warning"
        onSubmit={() => {
          console.log('Confirmed with understanding');
          setShowConfirmModal(false);
        }}
      />

      {/* Divider */}
      <Divider label="Misc Components" />

      {/* Misc Components Examples */}
      <Panel header="Avatar Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Avatar with Label */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Avatar with Label</h3>
            <div className="flex gap-4">
              <Avatar label="JD" shape="circle" size="xlarge" />
              <Avatar label="AM" shape="circle" size="large" />
              <Avatar label="SK" shape="circle" />
            </div>
          </div>

          {/* Avatar with Image */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Avatar with Image</h3>
            <div className="flex gap-4">
              <Avatar
                image="https://i.pravatar.cc/150?img=1"
                shape="circle"
                size="xlarge"
              />
              <Avatar
                image="https://i.pravatar.cc/150?img=2"
                shape="circle"
                size="large"
              />
              <Avatar image="https://i.pravatar.cc/150?img=3" shape="circle" />
            </div>
          </div>

          {/* Avatar with Icon */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Avatar with Icon</h3>
            <div className="flex gap-4">
              <Avatar icon="pi pi-user" shape="circle" size="large" />
              <Avatar icon="pi pi-users" shape="square" size="large" />
              <Avatar icon="pi pi-cog" shape="circle" />
            </div>
          </div>

          {/* Avatar Group */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Avatar Group</h3>
            <div className="flex -space-x-3">
              <Avatar
                image="https://i.pravatar.cc/150?img=4"
                shape="circle"
                size="large"
                className="border-2 border-white"
              />
              <Avatar
                image="https://i.pravatar.cc/150?img=5"
                shape="circle"
                size="large"
                className="border-2 border-white"
              />
              <Avatar
                image="https://i.pravatar.cc/150?img=6"
                shape="circle"
                size="large"
                className="border-2 border-white"
              />
              <Avatar
                label="+3"
                shape="circle"
                size="large"
                className="border-2 border-white"
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* Badge Examples */}
      <Panel header="Badge Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Severity Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Severity Badges</h3>
            <div className="flex gap-4 items-center">
              <Badge value="2" severity="success" />
              <Badge value="5" severity="info" />
              <Badge value="10" severity="warning" />
              <Badge value="99+" severity="danger" />
            </div>
          </div>

          {/* Badge Overlay */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badge on Button</h3>
            <div className="flex gap-4">
              <Button label="Messages" icon="pi pi-inbox" className="relative">
                <Badge
                  value="3"
                  severity="danger"
                  className="absolute -top-2 -right-2"
                />
              </Button>
              <Button
                label="Notifications"
                icon="pi pi-bell"
                className="relative"
              >
                <Badge
                  value="10"
                  severity="info"
                  className="absolute -top-2 -right-2"
                />
              </Button>
            </div>
          </div>

          {/* Badge on Avatar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badge on Avatar</h3>
            <div className="flex gap-4">
              <div className="relative inline-block">
                <Avatar
                  image="https://i.pravatar.cc/150?img=7"
                  shape="circle"
                  size="xlarge"
                />
                <Badge
                  value="5"
                  severity="danger"
                  className="absolute -top-1 -right-1"
                />
              </div>
              <div className="relative inline-block">
                <Avatar label="JD" shape="circle" size="xlarge" />
                <Badge className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>

          {/* Badge Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badge Sizes</h3>
            <div className="flex gap-4 items-center">
              <Badge value="2" />
              <Badge value="5" size="large" />
              <Badge value="10" size="xlarge" />
            </div>
          </div>
        </div>
      </Panel>

      {/* Chip Examples */}
      <Panel header="Chip Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Basic Chips */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Chips</h3>
            <div className="flex gap-2 flex-wrap">
              <Chip label="Apple" />
              <Chip label="Banana" />
              <Chip label="Orange" />
              <Chip label="Grape" />
            </div>
          </div>

          {/* Chips with Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chips with Icons</h3>
            <div className="flex gap-2 flex-wrap">
              <Chip label="React" icon="pi pi-tag" />
              <Chip label="TypeScript" icon="pi pi-code" />
              <Chip label="Next.js" icon="pi pi-bolt" />
              <Chip label="Tailwind" icon="pi pi-palette" />
            </div>
          </div>

          {/* Chips with Images */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chips with Images</h3>
            <div className="flex gap-2 flex-wrap">
              <Chip label="John Doe" image="https://i.pravatar.cc/150?img=8" />
              <Chip
                label="Jane Smith"
                image="https://i.pravatar.cc/150?img=9"
              />
              <Chip
                label="Mike Johnson"
                image="https://i.pravatar.cc/150?img=10"
              />
            </div>
          </div>

          {/* Removable Chips */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Removable Chips</h3>
            <div className="flex gap-2 flex-wrap">
              {techChips.map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  removable
                  onRemove={() => {
                    setTechChips(techChips.filter((_, i) => i !== index));
                    return true;
                  }}
                />
              ))}
              <Button
                icon="pi pi-plus"
                label="Add"
                size="small"
                outlined
                onClick={() =>
                  setTechChips([...techChips, `Item ${techChips.length + 1}`])
                }
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* ProgressBar Examples */}
      <Panel header="ProgressBar Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Basic ProgressBar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic ProgressBar</h3>
            <div className="space-y-4">
              <ProgressBar value={progressValue} />
              <div className="flex gap-2">
                <Button
                  icon="pi pi-minus"
                  onClick={() =>
                    setProgressValue(Math.max(0, progressValue - 10))
                  }
                  size="small"
                />
                <Button
                  icon="pi pi-plus"
                  onClick={() =>
                    setProgressValue(Math.min(100, progressValue + 10))
                  }
                  size="small"
                />
              </div>
            </div>
          </div>

          {/* ProgressBar with Label */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              ProgressBar with Label
            </h3>
            <ProgressBar value={75} showValue />
          </div>

          {/* Color Modes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Color Modes</h3>
            <div className="space-y-3">
              <ProgressBar value={25} color="#10B981" showValue />
              <ProgressBar value={50} color="#F59E0B" showValue />
              <ProgressBar value={75} color="#EF4444" showValue />
            </div>
          </div>

          {/* Indeterminate Mode */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Indeterminate Mode</h3>
            <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
          </div>
        </div>
      </Panel>

      {/* Spinner Examples */}
      <Panel header="Spinner Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Basic Spinner */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Spinner</h3>
            <div className="flex gap-4 items-center">
              <Spinner />
            </div>
          </div>

          {/* Custom Size Spinners */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Sizes</h3>
            <div className="flex gap-6 items-center">
              <Spinner style={{ width: '30px', height: '30px' }} />
              <Spinner style={{ width: '50px', height: '50px' }} />
              <Spinner style={{ width: '70px', height: '70px' }} />
            </div>
          </div>

          {/* Custom Color Spinners */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
            <div className="flex gap-6 items-center">
              <Spinner strokeWidth="4" fill="var(--green-500)" />
              <Spinner strokeWidth="4" fill="var(--orange-500)" />
              <Spinner strokeWidth="4" fill="var(--red-500)" />
            </div>
          </div>

          {/* Loading Example */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Example</h3>
            <div className="border rounded-lg p-8 text-center">
              <Spinner />
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Tag Examples */}
      <Panel header="Tag Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Severity Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Severity Tags</h3>
            <div className="flex gap-2 flex-wrap">
              <Tag value="Success" severity="success" />
              <Tag value="Info" severity="info" />
              <Tag value="Warning" severity="warning" />
              <Tag value="Danger" severity="danger" />
            </div>
          </div>

          {/* Status Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Status Tags</h3>
            <div className="flex gap-2 flex-wrap">
              <Tag value="New" severity="success" icon="pi pi-plus" />
              <Tag value="Active" severity="info" icon="pi pi-check" />
              <Tag value="Pending" severity="warning" icon="pi pi-clock" />
              <Tag value="Closed" severity="danger" icon="pi pi-times" />
            </div>
          </div>

          {/* Custom Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Tags</h3>
            <div className="flex gap-2 flex-wrap">
              <Tag
                value="Featured"
                className="bg-purple-500 text-white"
                icon="pi pi-star-fill"
              />
              <Tag
                value="Premium"
                className="bg-amber-500 text-white"
                icon="pi pi-crown"
              />
              <Tag
                value="Hot"
                className="bg-red-500 text-white"
                icon="pi pi-fire"
              />
            </div>
          </div>

          {/* Rounded Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Rounded Tags</h3>
            <div className="flex gap-2 flex-wrap">
              <Tag value="React" severity="success" rounded />
              <Tag value="Vue" severity="info" rounded />
              <Tag value="Angular" severity="danger" rounded />
              <Tag value="Svelte" severity="warning" rounded />
            </div>
          </div>

          {/* Tag Usage Example */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Usage in List</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-3">
                <span>Task #1: Update Documentation</span>
                <Tag value="High Priority" severity="danger" />
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span>Task #2: Review Pull Request</span>
                <Tag value="In Progress" severity="info" />
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span>Task #3: Fix Bugs</span>
                <Tag value="Completed" severity="success" />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Divider */}
      <Divider label="Chart Components" />

      {/* Line Chart Examples */}
      <Panel header="Line Chart Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Simple Line Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Simple Line Chart</h3>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Sales 2024',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F633',
                  },
                ],
              }}
              title="Monthly Sales"
              height={300}
            />
          </div>

          {/* Multiple Lines Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Multiple Lines Chart</h3>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Sales 2024',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3B82F6',
                  },
                  {
                    label: 'Sales 2023',
                    data: [45, 49, 60, 71, 46, 45],
                    borderColor: '#10B981',
                  },
                  {
                    label: 'Sales 2022',
                    data: [35, 39, 50, 61, 36, 35],
                    borderColor: '#F59E0B',
                  },
                ],
              }}
              title="Sales Comparison (Last 3 Years)"
              height={300}
              smooth
              showPoints
            />
          </div>

          {/* Filled Area Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Filled Area Chart</h3>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [30, 45, 60, 70, 85, 95],
                    borderColor: '#8B5CF6',
                    backgroundColor: '#8B5CF633',
                  },
                ],
              }}
              title="Revenue Growth"
              height={300}
              fill
              customTooltip={(label, value, datasetLabel) =>
                `${datasetLabel}: $${value?.toFixed(0)}k on ${label}`
              }
              onClick={(datasetIndex, dataIndex, value, label) => {
                alert(`Clicked: ${label} = $${value}k`);
              }}
            />
          </div>

          {/* Custom Labels with Dates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Date Labels</h3>
            <LineChart
              data={{
                labels: [
                  '2024-01-01',
                  '2024-02-01',
                  '2024-03-01',
                  '2024-04-01',
                  '2024-05-01',
                ],
                datasets: [
                  {
                    label: 'Active Users',
                    data: [120, 150, 180, 220, 260],
                    borderColor: '#EC4899',
                  },
                ],
              }}
              title="User Growth"
              height={300}
              legend={{
                display: true,
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                },
              }}
              customTooltip={(label, value, datasetLabel) => {
                const date = new Date(label);
                return `${datasetLabel}: ${value} users on ${date.toLocaleDateString()}`;
              }}
            />
          </div>
        </div>
      </Panel>

      {/* Bar Chart Examples */}
      <Panel header="Bar Chart Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Simple Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Simple Bar Chart</h3>
            <BarChart
              data={{
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [100, 150, 120, 180],
                    backgroundColor: '#10B981',
                  },
                ],
              }}
              title="Quarterly Revenue"
              height={300}
            />
          </div>

          {/* Grouped Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Grouped Bar Chart</h3>
            <BarChart
              data={{
                labels: ['Product A', 'Product B', 'Product C', 'Product D'],
                datasets: [
                  {
                    label: '2023',
                    data: [65, 59, 80, 81],
                    backgroundColor: '#3B82F6',
                  },
                  {
                    label: '2024',
                    data: [75, 69, 90, 91],
                    backgroundColor: '#10B981',
                  },
                ],
              }}
              title="Product Sales Comparison"
              height={300}
            />
          </div>

          {/* Stacked Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stacked Bar Chart</h3>
            <BarChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [
                  {
                    label: 'Desktop',
                    data: [30, 45, 40, 50, 55],
                    backgroundColor: '#3B82F6',
                  },
                  {
                    label: 'Mobile',
                    data: [50, 55, 60, 65, 70],
                    backgroundColor: '#10B981',
                  },
                  {
                    label: 'Tablet',
                    data: [20, 25, 30, 25, 30],
                    backgroundColor: '#F59E0B',
                  },
                ],
              }}
              title="Traffic Sources (Stacked)"
              height={300}
              stacked
            />
          </div>

          {/* Horizontal Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horizontal Bar Chart</h3>
            <BarChart
              data={{
                labels: [
                  'Category A',
                  'Category B',
                  'Category C',
                  'Category D',
                  'Category E',
                ],
                datasets: [
                  {
                    label: 'Score',
                    data: [85, 72, 90, 65, 78],
                    backgroundColor: [
                      '#3B82F6',
                      '#10B981',
                      '#F59E0B',
                      '#EF4444',
                      '#8B5CF6',
                    ],
                  },
                ],
              }}
              title="Performance Scores"
              height={300}
              horizontal
            />
          </div>

          {/* Bar + Line Combination Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Bar + Line Combination Chart
            </h3>
            <BarChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [120, 140, 160, 150, 180, 200],
                    backgroundColor: '#3B82F6',
                  },
                  {
                    label: 'Target',
                    data: [100, 120, 150, 160, 170, 190],
                    borderColor: '#EF4444',
                    borderWidth: 3,
                  },
                ],
              }}
              title="Revenue vs Target"
              height={300}
              showLine
              lineDatasetIndex={1}
              customTooltip={(label, value, datasetLabel) =>
                `${datasetLabel}: $${value}k in ${label}`
              }
              onClick={(datasetIndex, dataIndex, value, label) => {
                console.log('Chart clicked:', {
                  datasetIndex,
                  dataIndex,
                  value,
                  label,
                });
                alert(`${label}: $${value}k`);
              }}
            />
          </div>

          {/* Custom Colors Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Custom Colors per Bar
            </h3>
            <BarChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Daily Sales',
                    data: [45, 52, 38, 65, 72, 88, 95],
                    backgroundColor: [
                      '#EF4444',
                      '#F59E0B',
                      '#F59E0B',
                      '#10B981',
                      '#10B981',
                      '#3B82F6',
                      '#8B5CF6',
                    ],
                  },
                ],
              }}
              title="Weekly Sales Performance"
              height={300}
              legend={{
                display: true,
                position: 'top',
                align: 'end',
              }}
            />
          </div>
        </div>
      </Panel>

      {/* Pie Chart Examples */}
      <Panel header="Pie Chart Examples" containerClassName="mb-6">
        <div className="space-y-6 p-4">
          {/* Simple Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Simple Pie Chart</h3>
            <PieChart
              data={{
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [
                  {
                    data: [55, 35, 10],
                    label: '',
                  },
                ],
              }}
              title="Device Distribution"
              height={300}
            />
          </div>

          {/* Doughnut Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Doughnut Chart</h3>
            <PieChart
              data={{
                labels: [
                  'Product A',
                  'Product B',
                  'Product C',
                  'Product D',
                  'Product E',
                ],
                datasets: [
                  {
                    data: [300, 250, 200, 150, 100],
                    label: '',
                  },
                ],
              }}
              title="Product Sales Distribution"
              height={300}
              doughnut
              legend={{
                position: 'right',
              }}
            />
          </div>

          {/* Custom Colors Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Custom Colors Pie Chart
            </h3>
            <PieChart
              data={{
                labels: ['Success', 'Warning', 'Error', 'Info', 'Pending'],
                datasets: [
                  {
                    label: 'Status',
                    data: [120, 45, 15, 80, 35],
                    backgroundColor: [
                      '#10B981',
                      '#F59E0B',
                      '#EF4444',
                      '#3B82F6',
                      '#6B7280',
                    ],
                  },
                ],
              }}
              title="Request Status Distribution"
              height={300}
              customTooltip={(label, value) => {
                const total = 295;
                const percentage = (((value ?? 0) / total) * 100).toFixed(1);
                return `${label}: ${value} requests (${percentage}%)`;
              }}
              onClick={(datasetIndex, dataIndex, value, label) => {
                alert(`${label}: ${value} requests`);
              }}
            />
          </div>

          {/* Doughnut with Custom Cutout */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Doughnut with Custom Cutout
            </h3>
            <PieChart
              data={{
                labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Others'],
                datasets: [
                  {
                    label: 'Browser',
                    data: [450, 180, 120, 80, 40],
                    backgroundColor: [
                      '#3B82F6',
                      '#F97316',
                      '#06B6D4',
                      '#10B981',
                      '#6B7280',
                    ],
                  },
                ],
              }}
              title="Browser Market Share"
              height={300}
              doughnut
              cutout="70%"
              legend={{
                position: 'bottom',
                labels: {
                  padding: 20,
                  font: {
                    size: 13,
                  },
                },
              }}
            />
          </div>

          {/* Small Doughnut Chart */}
          <div className="flex justify-center">
            <div className="w-64">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Compact Chart
              </h3>
              <PieChart
                data={{
                  labels: ['Completed', 'In Progress', 'Pending'],
                  datasets: [
                    {
                      data: [65, 25, 10],
                      backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
                      label: '',
                    },
                  ],
                }}
                title="Task Status"
                height={250}
                doughnut
                cutout="60%"
                legend={{
                  position: 'bottom',
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
