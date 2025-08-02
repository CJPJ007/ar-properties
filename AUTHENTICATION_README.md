# Mobile OTP Authentication System

This document outlines the comprehensive mobile OTP-based authentication system implemented alongside Google OAuth for the Ananta Realty application.

## 🚀 Features

### ✅ Mobile OTP Authentication
- **6-digit OTP generation** with 5-minute expiration
- **Mobile number validation** (10-digit Indian format)
- **Resend OTP functionality** with 60-second cooldown
- **User registration** with optional profile details
- **Avatar image upload** support

### ✅ Google OAuth Integration
- **Seamless Google login** alongside mobile OTP
- **Unified session management** for both auth methods
- **Profile data synchronization**

### ✅ User Experience
- **Mobile-first responsive design**
- **Real-time form validation**
- **Loading states and error handling**
- **Smooth animations and transitions**
- **Toast notifications** for user feedback

## 📁 File Structure

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts          # NextAuth configuration
│       ├── send-otp/
│       │   └── route.ts          # OTP generation API
│       ├── verify-otp/
│       │   └── route.ts          # OTP verification API
│       └── upload-avatar/
│           └── route.ts          # Avatar upload API
├── auth/
│   └── login/
│       └── page.tsx              # Login page with both auth methods
└── ...

components/
├── header.tsx                    # Updated with new sign-in flow
└── mobile-navigation.tsx         # Updated with new sign-in flow

lib/
└── auth.ts                       # Authentication utilities

types/
└── next-auth.d.ts               # TypeScript definitions
```

## 🔧 Backend API Requirements

Your backend needs to implement these endpoints:

### 1. Send OTP API
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456",
  "expiresIn": 300
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP API
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### 3. Upload Avatar API
```
POST /api/auth/upload-avatar
Content-Type: multipart/form-data

FormData:
- avatar: File (image, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "avatarUrl": "https://example.com/uploads/avatar_123.jpg"
}
```

## 🛠️ Environment Variables

Add these to your `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
BACKEND_URL=http://localhost:8000
```

## 📱 Usage

### For Users

1. **Navigate to Login Page**
   - Click "Sign In" in header or mobile menu
   - Visit `/auth/login` directly

2. **Mobile OTP Authentication**
   - Enter 10-digit mobile number
   - Click "Send OTP"
   - Enter 6-digit OTP received via SMS
   - Fill optional profile details (name, email, avatar)
   - Click "Sign In"

3. **Google Authentication**
   - Switch to "Google" tab
   - Click "Continue with Google"
   - Complete Google OAuth flow

### For Developers

#### Sending OTP
```typescript
import { sendOTP } from '@/lib/auth';

try {
  await sendOTP('9876543210');
  // OTP sent successfully
} catch (error) {
  // Handle error
}
```

#### Verifying OTP and Signing In
```typescript
import { verifyOTPAndSignIn } from '@/lib/auth';

try {
  const result = await verifyOTPAndSignIn(
    '9876543210',
    '123456',
    'John Doe',
    'john@example.com',
    'https://example.com/avatar.jpg'
  );
  
  if (result?.ok) {
    // User signed in successfully
  }
} catch (error) {
  // Handle error
}
```

#### Uploading Avatar
```typescript
import { uploadAvatar } from '@/lib/auth';

try {
  const avatarUrl = await uploadAvatar(file);
  // Avatar uploaded successfully
} catch (error) {
  // Handle error
}
```

## 🔒 Security Features

### OTP Security
- **6-digit numeric OTP** (100,000 possible combinations)
- **5-minute expiration** to prevent brute force attacks
- **Rate limiting** on OTP generation (60-second cooldown)
- **Mobile number validation** (10-digit format)

### File Upload Security
- **File type validation** (images only)
- **File size limit** (5MB maximum)
- **Secure file storage** on backend

### Session Security
- **JWT tokens** with expiration
- **Secure cookie handling**
- **CSRF protection** via NextAuth

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first approach**
- **Tablet and desktop optimization**
- **Touch-friendly interface**

### User Feedback
- **Real-time validation**
- **Loading states**
- **Success/error toasts**
- **Progress indicators**

### Accessibility
- **Keyboard navigation**
- **Screen reader support**
- **High contrast mode**
- **Focus management**

## 🚀 Deployment Considerations

### Production Setup
1. **Configure SMS service** (Twilio, AWS SNS, etc.)
2. **Set up file storage** (AWS S3, Cloudinary, etc.)
3. **Configure environment variables**
4. **Set up SSL certificates**
5. **Configure rate limiting**

### Monitoring
- **OTP delivery success rates**
- **Authentication success rates**
- **Error tracking and logging**
- **Performance monitoring**

## 🔧 Customization

### Styling
The login page uses Tailwind CSS and can be customized by modifying:
- `app/auth/login/page.tsx` - Main layout and styling
- `components/ui/` - Base UI components

### Functionality
- **OTP length**: Modify in `app/api/auth/send-otp/route.ts`
- **Expiration time**: Change in both frontend and backend
- **File size limits**: Update in `app/api/auth/upload-avatar/route.ts`
- **Validation rules**: Customize in form components

## 🐛 Troubleshooting

### Common Issues

1. **OTP not received**
   - Check mobile number format
   - Verify SMS service configuration
   - Check rate limiting

2. **Avatar upload fails**
   - Verify file type and size
   - Check backend storage configuration
   - Ensure proper CORS settings

3. **Google login issues**
   - Verify Google OAuth credentials
   - Check redirect URIs configuration
   - Ensure NEXTAUTH_URL is correct

### Debug Mode
In development, OTP is returned in the API response for testing:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

## 📞 Support

For technical support or questions about the authentication system, please refer to:
- NextAuth.js documentation
- Your backend API documentation
- SMS service provider documentation

---

**Note**: This authentication system is designed to be secure, user-friendly, and scalable. Make sure to implement proper security measures on your backend and follow best practices for production deployment. 