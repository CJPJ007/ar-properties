# Firebase OTP Setup Guide

Follow this step-by-step guide to set up Firebase OTP authentication for your application.

## 🚀 Quick Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name (e.g., "ananta-realty")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Phone** provider
5. Configure settings:
   - **Phone numbers for testing**: Add your test numbers
   - **reCAPTCHA**: Enable invisible reCAPTCHA
   - **SMS templates**: Customize if needed

### Step 3: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Add app** → **Web**
4. Register app with nickname
5. Copy the configuration object

### Step 4: Environment Variables

Create `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
BACKEND_URL=http://localhost:8000
```

### Step 5: Install Dependencies

```bash
npm install firebase --force
```

### Step 6: Test Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/login`

3. Test with a phone number:
   - Use test numbers from Firebase Console
   - Or use your own number (will receive real SMS)

## 🔧 Advanced Configuration

### reCAPTCHA Setup

1. In Firebase Console → Authentication → Settings
2. Add your domain to **Authorized domains**
3. Configure **reCAPTCHA v3** settings
4. Add test phone numbers for development

### SMS Templates

1. In Firebase Console → Authentication → Templates
2. Customize SMS message templates
3. Add your app name and branding
4. Test with different languages

### Test Phone Numbers

Add these in Firebase Console for development:

```
+1 650-555-1234 (Code: 123456)
+91 98765-43210 (Code: 123456)
+44 7911 123456 (Code: 123456)
```

## 🚀 Production Deployment

### 1. Domain Configuration

1. Add your production domain to Firebase Console
2. Configure reCAPTCHA for production domain
3. Update environment variables for production

### 2. Billing Setup

1. Enable billing in Firebase Console
2. Set up payment method
3. Configure SMS cost alerts
4. Monitor usage regularly

### 3. Security Rules

1. Enable App Check for additional security
2. Configure proper CORS settings
3. Set up monitoring and alerts
4. Implement rate limiting

## 🔍 Troubleshooting

### Common Issues

**Issue**: reCAPTCHA not working
**Solution**: 
- Check domain in Firebase Console
- Verify container ID in code
- Check browser console for errors

**Issue**: OTP not received
**Solution**:
- Verify phone number format (+91XXXXXXXXXX)
- Check Firebase Console for SMS status
- Use test phone numbers in development

**Issue**: Firebase initialization error
**Solution**:
- Verify environment variables
- Check Firebase project configuration
- Ensure API key permissions

### Debug Steps

1. **Check Browser Console**
   - Look for Firebase errors
   - Check network requests
   - Verify reCAPTCHA loading

2. **Firebase Console**
   - Check Authentication → Users
   - Monitor SMS delivery status
   - Review error logs

3. **Environment Variables**
   - Verify all variables are set
   - Check for typos
   - Restart development server

## 📊 Monitoring

### Firebase Console Monitoring

1. **Authentication** → Users
   - Monitor user sign-ups
   - Check phone verification status

2. **Analytics** → Events
   - Track authentication events
   - Monitor user engagement

3. **Functions** → Logs
   - Check for errors
   - Monitor performance

### Cost Monitoring

1. **Billing** → Usage
   - Monitor SMS costs
   - Set up alerts
   - Track usage patterns

## 🔒 Security Best Practices

1. **Enable App Check**
   - Prevents abuse
   - Validates app authenticity

2. **Rate Limiting**
   - Implement on your backend
   - Prevent OTP spam

3. **Domain Restrictions**
   - Limit to your domains
   - Prevent unauthorized use

4. **Monitoring**
   - Set up alerts
   - Monitor for abuse

## 📞 Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

---

**Note**: This setup guide covers the essential steps to get Firebase OTP authentication working. For production deployment, make sure to follow security best practices and monitor costs regularly. 