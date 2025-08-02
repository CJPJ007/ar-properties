# Firebase OTP Authentication System

This document outlines the Firebase-based OTP authentication system implemented for the Ananta Realty application.

## 🚀 Features

### ✅ Firebase Phone Authentication
- **6-digit OTP generation** via Firebase Auth
- **Automatic SMS delivery** through Firebase
- **reCAPTCHA integration** for security
- **User profile management** with Firebase
- **Avatar image upload** support

### ✅ Google OAuth Integration
- **Seamless Google login** alongside Firebase OTP
- **Unified session management** via NextAuth
- **Profile data synchronization**

### ✅ Security Features
- **Invisible reCAPTCHA** verification
- **Firebase token validation**
- **Rate limiting** on OTP requests
- **Secure session management**

## 📁 File Structure

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       │   └── route.ts              # NextAuth with Firebase integration
│       └── verify-firebase-token/
│           └── route.ts              # Firebase token verification
├── auth/
│   └── login/
│       └── page.tsx                  # Login page with Firebase OTP
└── ...

lib/
├── firebase.ts                       # Firebase configuration
└── auth.ts                          # Firebase auth utilities

types/
└── next-auth.d.ts                   # TypeScript definitions
```

## 🔧 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication
4. Enable Phone Number sign-in method
5. Configure reCAPTCHA settings

### 2. Get Firebase Configuration

In your Firebase project settings, get the configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Environment Variables

Add these to your `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
BACKEND_URL=http://localhost:8000
```

## 🔒 Security Configuration

### Firebase Authentication Rules

1. **Enable Phone Authentication** in Firebase Console
2. **Configure reCAPTCHA** for your domain
3. **Set up test phone numbers** for development
4. **Configure SMS templates** (optional)

### reCAPTCHA Setup

1. Go to Firebase Console → Authentication → Settings
2. Add your domain to authorized domains
3. Configure reCAPTCHA v3 settings
4. Add test phone numbers for development

## 📱 Usage

### For Users

1. **Navigate to Login Page**
   - Click "Sign In" in header or mobile menu
   - Visit `/auth/login` directly

2. **Firebase OTP Authentication**
   - Enter 10-digit mobile number
   - Complete invisible reCAPTCHA
   - Click "Send OTP"
   - Enter 6-digit OTP received via SMS
   - Fill optional profile details (name, email, avatar)
   - Click "Sign In"

3. **Google Authentication**
   - Switch to "Google" tab
   - Click "Continue with Google"
   - Complete Google OAuth flow

### For Developers

#### Sending OTP with Firebase
```typescript
import { sendOTP } from '@/lib/auth';

try {
  const containerId = 'recaptcha-container';
  await sendOTP('9876543210', containerId);
  // OTP sent successfully via Firebase
} catch (error) {
  // Handle error
}
```

#### Verifying OTP and Signing In
```typescript
import { verifyOTPAndSignIn } from '@/lib/auth';

try {
  const result = await verifyOTPAndSignIn(
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

## 🔧 Backend API Requirements

Your backend needs to implement this endpoint:

### Verify Firebase Token API
```
POST /api/auth/verify-firebase-token
Content-Type: application/json

{
  "firebaseToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "firebase_user_id",
    "displayName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+919876543210",
    "photoURL": "https://example.com/avatar.jpg"
  }
}
```

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install firebase --force
```

### 2. Firebase Emulator (Optional)
For local development, you can use Firebase emulators:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

### 3. Test Phone Numbers
Add test phone numbers in Firebase Console:
- Go to Authentication → Phone → Phone numbers for testing
- Add numbers like: +1 650-555-1234
- Use verification code: 123456

## 🚀 Production Deployment

### 1. Firebase Configuration
- **Enable Phone Authentication** in production
- **Configure reCAPTCHA** for your domain
- **Set up proper SMS templates**
- **Configure billing** for SMS costs

### 2. Security Considerations
- **Enable App Check** for additional security
- **Configure proper CORS** settings
- **Set up monitoring** and alerts
- **Implement rate limiting**

### 3. SMS Costs
- **Firebase charges** for SMS delivery
- **Monitor usage** in Firebase Console
- **Set up billing alerts**
- **Consider SMS templates** for cost optimization

## 🔍 Troubleshooting

### Common Issues

1. **reCAPTCHA not working**
   - Check domain configuration in Firebase Console
   - Verify reCAPTCHA container ID
   - Check browser console for errors

2. **OTP not received**
   - Verify phone number format (+91XXXXXXXXXX)
   - Check Firebase Console for SMS delivery status
   - Use test phone numbers in development

3. **Firebase initialization errors**
   - Verify environment variables
   - Check Firebase project configuration
   - Ensure proper API key permissions

4. **Token verification fails**
   - Check backend API implementation
   - Verify Firebase token format
   - Check network connectivity

### Debug Mode

In development, you can:
- Use Firebase emulators
- Add test phone numbers
- Check Firebase Console logs
- Monitor network requests

## 📊 Monitoring

### Firebase Console
- **Authentication** → Users
- **Authentication** → Sign-in method
- **Analytics** → Events
- **Functions** → Logs (if using Cloud Functions)

### Application Monitoring
- **OTP delivery success rates**
- **Authentication success rates**
- **Error tracking and logging**
- **Performance monitoring**

## 🔧 Customization

### Styling
- Modify `app/auth/login/page.tsx` for UI changes
- Update reCAPTCHA container styling
- Customize loading states and animations

### Functionality
- **OTP length**: Configure in Firebase Console
- **SMS templates**: Customize in Firebase Console
- **Rate limiting**: Implement in your backend
- **User profile fields**: Extend in Firebase Auth

## 📞 Support

For technical support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Firebase Console](https://console.firebase.google.com/)

---

**Note**: This Firebase OTP authentication system provides a secure, scalable, and user-friendly authentication experience. Make sure to properly configure Firebase in production and monitor SMS costs. 