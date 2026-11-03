// The text formats signing enforces (js-sdk's getValidators), with the builder's label and the message signers see.
export const TEXT_FORMATS = [
  {value: '', label: 'Any text'},
  {value: 'email', label: 'Email address'},
  {value: 'phone', label: 'Phone number'},
  {value: 'url', label: 'Web address'},
  {value: 'postal_code', label: 'ZIP or postal code'},
  {value: 'number', label: 'Number'},
  {value: 'date', label: 'Date'},
  {value: 'ssn', label: 'Social Security number'},
];

export const FORMAT_MESSAGES: Record<string, string> = {
  email: 'Enter a valid email address.',
  phone: 'Enter a valid phone number.',
  url: 'Enter a full Web address, starting with https://.',
  postal_code: 'Enter a valid ZIP or postal code.',
  number: 'Enter a number.',
  date: 'Enter a date like 10/27/2026.',
  ssn: 'Enter a Social Security number like 123-45-6789.',
};
