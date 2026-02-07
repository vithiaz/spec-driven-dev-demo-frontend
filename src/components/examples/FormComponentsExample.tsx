'use client';

import { useState } from 'react';
import { Nullable } from 'primereact/ts-helpers';
import {
  FormInputText,
  FormInputTextarea,
  FormInputNumber,
  FormInputMask,
  FormDropdown,
  FormMultiSelect,
  FormCalendar,
  FormCheckbox,
  FormRadioButton,
  FormInputSwitch,
  FormChips,
  FormPassword,
  FormEditor,
} from '@/components/form';

interface City {
  label: string;
  value: string;
}

export default function FormComponentsExample() {
  const [text, setText] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [textarea, setTextarea] = useState<string>('');
  const [number, setNumber] = useState<number | null>(0);
  const [price, setPrice] = useState<number | null>(0);
  const [phone, setPhone] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('option1');
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [chips, setChips] = useState<string[]>([]);
  const [password, setPassword] = useState<string>('');
  const [editorText, setEditorText] = useState<string>('');

  const cities: City[] = [
    { label: 'New York', value: 'NY' },
    { label: 'Los Angeles', value: 'LA' },
    { label: 'Chicago', value: 'CH' },
    { label: 'Houston', value: 'HO' },
  ];

  const radioOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Form Components Example</h1>

      {/* FormInputText - Basic */}
      <FormInputText
        label="Full Name"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your full name"
        required
        helperText="Please enter your first and last name"
      />

      {/* FormInputText - With Icon */}
      <FormInputText
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        icon={<i className="pi pi-envelope" />}
        iconPosition="left"
        error={
          email && !email.includes('@')
            ? 'Please enter a valid email'
            : undefined
        }
        required
      />

      {/* FormInputTextarea */}
      <FormInputTextarea
        label="Description"
        value={textarea}
        onChange={(e) => setTextarea(e.target.value)}
        rows={4}
        placeholder="Enter description"
        helperText="Maximum 500 characters"
      />

      {/* FormInputNumber - Basic */}
      <FormInputNumber
        label="Age"
        value={number}
        onValueChange={(e) => setNumber(e.value ?? null)}
        min={0}
        max={150}
        showButtons
        helperText="Enter your age"
      />

      {/* FormInputNumber - With Icon (Currency) */}
      <FormInputNumber
        label="Price"
        value={price}
        onValueChange={(e) => setPrice(e.value ?? null)}
        mode="currency"
        currency="USD"
        locale="en-US"
        icon={<i className="pi pi-dollar" />}
        iconPosition="left"
        required
        helperText="Enter the product price"
      />

      {/* FormInputMask - With Icon */}
      <FormInputMask
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value ?? '')}
        mask="(999) 999-9999"
        placeholder="(999) 999-9999"
        icon={<i className="pi pi-phone" />}
        iconPosition="left"
        helperText="Enter your contact number"
      />

      {/* FormDropdown */}
      <FormDropdown
        label="City"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={cities}
        placeholder="Select a city"
        required
        helperText="Choose your current city"
      />

      {/* FormMultiSelect */}
      <FormMultiSelect
        label="Preferred Cities"
        value={selectedCities}
        onChange={(e) => setSelectedCities(e.value)}
        options={cities}
        placeholder="Select cities"
        display="chip"
        helperText="You can select multiple cities"
      />

      {/* FormCalendar */}
      <FormCalendar
        label="Date of Birth"
        value={date}
        onChange={(e) => setDate(e.value)}
        placeholder="Select date"
        showIcon
        dateFormat="mm/dd/yy"
        required
        helperText="Select your birth date"
      />

      {/* FormCheckbox */}
      <FormCheckbox
        label="Terms and Conditions"
        checkboxLabel="I accept the terms and conditions"
        checked={checked}
        onChange={(e) => setChecked(e.checked ?? false)}
        required
        error={!checked ? 'You must accept the terms to continue' : undefined}
      />

      {/* FormRadioButton */}
      <FormRadioButton
        label="Select an Option"
        options={radioOptions}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value as string)}
        name="radioGroup"
        required
        helperText="Choose one option"
      />

      {/* FormInputSwitch */}
      <FormInputSwitch
        label="Notifications"
        switchLabel="Enable email notifications"
        checked={switchValue}
        onChange={(e) => setSwitchValue(e.value ?? false)}
        helperText="Receive updates via email"
      />

      {/* FormChips */}
      <FormChips
        label="Tags"
        value={chips}
        onChange={(e) => setChips(e.value ?? [])}
        placeholder="Add tags (press Enter)"
        helperText="Add relevant tags for categorization"
      />

      {/* FormPassword */}
      <FormPassword
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        toggleMask
        feedback
        required
        helperText="Password must be at least 8 characters"
      />

      {/* FormEditor */}
      <FormEditor
        label="Rich Text Content"
        value={editorText}
        onTextChange={(e) => setEditorText(e.htmlValue ?? '')}
        style={{ height: '200px' }}
        helperText="Use the toolbar to format your content"
      />

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          onClick={() => console.log('Form submitted')}
        >
          Submit Form
        </button>
      </div>
    </div>
  );
}
