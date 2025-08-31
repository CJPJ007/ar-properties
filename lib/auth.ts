/**
 * Authentication utilities for Google login and Firebase Mobile OTP using NextAuth
 */

import { signIn, signOut, getSession } from "next-auth/react"
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Initiates Google OAuth login using NextAuth
 */
export const initiateGoogleLogin = () => {
  try {
    signIn('google', { callbackUrl: '/' })
  } catch (error) {
    console.error('Error initiating Google login:', error)
    alert('Unable to initiate Google login. Please try again.')
  }
}

/**
 * Sets up reCAPTCHA verifier for Firebase phone auth
 */
export const setupRecaptcha = (containerId: string) => {
  if (typeof window === 'undefined') return null;
  
  // Clear any existing reCAPTCHA
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  // Create new reCAPTCHA verifier
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });

  return window.recaptchaVerifier;
};

/**
 * Sends OTP to mobile number using Firebase
 */
export const sendOTP = async (mobile: string, containerId: string) => {
  try {
    // Format mobile number for Firebase (add +91 for India)
    const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    
    // Setup reCAPTCHA
    const recaptchaVerifier = setupRecaptcha(containerId);
    if (!recaptchaVerifier) {
      throw new Error('Failed to setup reCAPTCHA');
    }

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(
      auth, 
      formattedMobile, 
      recaptchaVerifier
    );

    // Store confirmation result for later verification
    if (typeof window !== 'undefined') {
      window.confirmationResult = confirmationResult;
    }

    return {
      success: true,
      message: "OTP sent successfully"
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Clear reCAPTCHA on error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    throw error;
  }
}

/**
 * Verifies OTP and signs in user using Firebase
 */
export const verifyOTPAndSignIn = async (
  otp: string,
  name?: string,
  email?: string,
  avatar?: string
) => {
  try {
    if (!window.confirmationResult) {
      throw new Error('No OTP confirmation pending. Please send OTP again.');
    }

    // Verify OTP
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    user.email = email;
    console.log(user, name, email, avatar);
    // Update user profile if provided
    if (name || email || avatar) {
      const updates: any = {};
      if (name) updates.displayName = name;
      if (email) updates.email = email;
      if (avatar) updates.photoURL = avatar;

      await updateProfile(user, updates);
    }

    // Get user token for NextAuth
    const token = await user.getIdToken();

    // Sign in with NextAuth using custom credentials
    const signInResult = await signIn('credentials', {
      firebaseToken: token,
      redirect: false,
      email:email
    });

    // Clear confirmation result
    window.confirmationResult = null;

    if (signInResult?.error) {
      throw new Error(signInResult.error);
    }

    return signInResult;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    // Clear confirmation result on error
    window.confirmationResult = null;
    
    throw error;
  }
}

/**
 * Uploads avatar image to Firebase Storage
 */
export const uploadAvatar = async (file: File) => {
  try {
    // For now, we'll use a simple approach
    // In production, you should upload to Firebase Storage
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/auth/upload-avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload avatar');
    }

    return data.avatarUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

/**
 * Logs out the user using NextAuth
 */
export const logout = () => {
  signOut({ callbackUrl: '/' })
}

/**
 * Gets the current user from NextAuth session
 */
export const getCurrentUser = async () => {
  try {
    const session = await getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}

/**
 * Gets the auth token from NextAuth session
 */
export const getAuthToken = async () => {
  try {
    const session = await getSession()
    return session?.accessToken || null
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Checks if user is authenticated using NextAuth
 */
export const isAuthenticated = async () => {
  try {
    const session = await getSession()
    return !!session
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
} 