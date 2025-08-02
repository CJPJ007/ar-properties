# InquiryForm Component

A reusable inquiry form component that can be used across different pages with configurable properties.

## Features

- **Configurable Fields**: Show/hide property and appointment date fields
- **Property Field**: Automatically populated and disabled when property is provided
- **Appointment Date**: Optional datetime picker for scheduling viewings
- **Form Validation**: Built-in validation for required fields
- **Toast Notifications**: Success and error notifications
- **Loading States**: Shows loading spinner during submission
- **Responsive Design**: Works on all screen sizes

## Props

```typescript
interface InquiryFormProps {
  property?: string                    // Property name to display (disabled field)
  showAppointmentDate?: boolean        // Whether to show appointment date field
  onSubmit?: (data: InquiryFormData) => void  // Custom submit handler
  className?: string                   // Additional CSS classes
}
```

## Form Data Structure

```typescript
interface InquiryFormData {
  name: string
  email: string
  phone: string
  property?: string
  appointmentDate?: string
  message: string
}
```

## Usage Examples

### Basic Contact Form
```tsx
import InquiryForm from "@/components/inquiry-form"

<InquiryForm />
```

### Property Inquiry Form
```tsx
<InquiryForm 
  property="Luxury Villa in Downtown"
  showAppointmentDate={true}
/>
```

### Property Only Form
```tsx
<InquiryForm 
  property="Modern Apartment Complex"
/>
```

### Appointment Only Form
```tsx
<InquiryForm 
  showAppointmentDate={true}
/>
```

### Custom Submit Handler
```tsx
<InquiryForm 
  property="Custom Property"
  onSubmit={async (data) => {
    // Custom logic here
    console.log(data)
  }}
/>
```

## Default Behavior

When no custom `onSubmit` handler is provided, the component will:
1. Send the form data to `/api/inquiries` endpoint
2. Show success/error toast notifications
3. Reset the form on successful submission

## Styling

The component uses Tailwind CSS classes and can be customized with the `className` prop. It includes:
- Responsive design
- Hover effects
- Loading animations
- Form validation styling
- Disabled state styling for property field

## Integration

The component has been integrated into:
- Contact page (`/contact`)
- Property detail pages (`/properties/[id]`)
- Services page (`/services`)
- Demo pages (`/inquiry-demo`, `/inquiry-modal-demo`)

# InquiryModal Component

A modal wrapper for the InquiryForm component that provides a button trigger and modal interface.

## Features

- **Button Trigger**: Customizable button that opens the modal
- **Modal Interface**: Beautiful modal with header and close functionality
- **Form Integration**: Uses the InquiryForm component internally
- **Auto-close**: Automatically closes modal after successful form submission
- **Customizable**: Full control over button and modal appearance
- **Responsive**: Works on all screen sizes

## Props

```typescript
interface InquiryModalProps extends InquiryFormProps {
  buttonText?: string                    // Text for the trigger button
  buttonVariant?: ButtonVariant          // Button variant (default, outline, etc.)
  buttonSize?: ButtonSize                // Button size (default, sm, lg, icon)
  buttonClassName?: string               // Additional CSS classes for button
  modalTitle?: string                    // Title for the modal header
  modalDescription?: string              // Description for the modal header
}
```

## Usage Examples

### Basic Modal
```tsx
import InquiryModal from "@/components/inquiry-modal"

<InquiryModal 
  buttonText="Contact Us"
  modalTitle="Get in Touch"
  modalDescription="We'd love to hear from you!"
/>
```

### Property Inquiry Modal
```tsx
<InquiryModal 
  buttonText="Inquire About Property"
  buttonVariant="outline"
  modalTitle="Property Inquiry"
  modalDescription="Tell us about your interest in this property."
  property="Luxury Villa in Downtown"
  showAppointmentDate={true}
/>
```

### Consultation Modal
```tsx
<InquiryModal 
  buttonText="Schedule Consultation"
  buttonSize="lg"
  buttonClassName="bg-gradient-to-r from-amber-500 to-orange-500"
  modalTitle="Schedule a Consultation"
  modalDescription="Tell us about your real estate needs."
  showAppointmentDate={true}
/>
```

### Custom Submit Handler
```tsx
<InquiryModal 
  buttonText="Custom Submit"
  modalTitle="Custom Form"
  onSubmit={async (data) => {
    console.log("Custom submit:", data)
    // Custom logic here
  }}
/>
```

## Button Variants

The component supports all button variants from the UI library:
- `default` - Primary button style
- `outline` - Outlined button style
- `secondary` - Secondary button style
- `ghost` - Ghost button style
- `link` - Link button style
- `destructive` - Destructive button style

## Modal Features

- **Smooth Animations**: Uses Framer Motion for smooth open/close animations
- **Backdrop Click**: Click outside modal to close
- **Close Button**: X button in header to close modal
- **Auto-close**: Automatically closes after successful form submission
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper focus management and keyboard navigation 