import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in your backend (with expiration)
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile,
        otp,
        expiresIn: 300, // 5 minutes
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    // In development, you might want to return the OTP for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      ...(isDevelopment && { otp }), // Only include OTP in development
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
} 