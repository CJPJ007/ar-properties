import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const { firebaseToken } = await request.json();

    if (!firebaseToken) {
      return NextResponse.json(
        { error: "Firebase token is required" },
        { status: 400 }
      );
    }

    // Verify Firebase token with your backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-firebase-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid Firebase token" },
        { status: 401 }
      );
    }

    const user = await response.json();

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
      },
    });

  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return NextResponse.json(
      { error: "Failed to verify Firebase token" },
      { status: 500 }
    );
  }
} 