export const monthList = [
  {label: '1 Month', value: 'january', day: 31},
  {label: '2 Month', value: 'february', day: 28},
  {label: '3 Month', value: 'march', day: 31},
  {label: '4 Month', value: 'april', day: 30},
  {label: '5 Month', value: 'may', day: 31},
  {label: '6 Month', value: 'june', day: 30},
  {label: '7 Month', value: 'july', day: 31},
  {label: '8 Month', value: 'august', day: 31},
  {label: '9 Month', value: 'september', day: 30},
  {label: '10 Month', value: 'october', day: 31},
  {label: '11 Month', value: 'november', day: 30},
  {label: '12 Month', value: 'december', day: 31},
];

export const monthListWithShortName = [
  {label: 'Jan', value: 'january', day: 31},
  {label: 'Feb', value: 'february', day: 28},
  {label: 'Mar', value: 'march', day: 31},
  {label: 'Apr', value: 'april', day: 30},
  {label: 'May', value: 'may', day: 31},
  {label: 'Jun', value: 'june', day: 30},
  {label: 'Jul', value: 'july', day: 31},
  {label: 'Aug', value: 'august', day: 31},
  {label: 'Sep', value: 'september', day: 30},
  {label: 'Oct', value: 'october', day: 31},
  {label: 'Nov', value: 'november', day: 30},
  {label: 'Dec', value: 'december', day: 31},
];

export const templetDetails = {
  templateId: 1,
  templateName: 'car_service_reminder',
  language: 'en',
  templateDisaplyName: 'Car Service Reminder',
  message:
    'Hi {{1}},\n\nYour {{2}} is due for service on {{3}}.\n\nBook your service now: {{4}}\n\nFeel free to call us at {{5}} for any queries.',
  sampleMessage:
    'Hi John,\n\nYour Toyota Corolla (Reg: AB123CD) is due for service on 15 Jan 2025.\n\nBook your service now: 9876543210\n\nFeel free to call us at 123-456-7890 for any queries.',
  variables: [
    {
      name: 'firstName',
      type: 'text',
      displayName: 'First Name',
      defaultValue: '{{customer.firstName}}',
      isVisibleInUI: false,
      value: 'John',
    },
    {
      name: 'carModal',
      type: 'text',
      displayName: 'Car Modal',
      defaultValue: '',
      isVisibleInUI: true,
      value: 'Toyota Corolla (Reg: AB123CD)',
    },
    {
      name: 'serviceDate',
      type: 'date',
      displayName: 'Service Date',
      defaultValue: '',
      isVisibleInUI: true,
      value: '15 Jan 2025',
    },
    {
      name: 'bookingNumber',
      type: 'number',
      displayName: 'Booking Number',
      defaultValue: '',
      isVisibleInUI: true,
      value: '9876543210',
    },
    {
      name: 'queryNumber',
      type: 'text',
      displayName: 'query Number',
      defaultValue: '',
      isVisibleInUI: true,
      value: '123-456-7890',
    },
  ],
};
