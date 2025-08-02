import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp, name, email, avatar } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: "Mobile number and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP with your backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile,
        otp,
        name,
        email,
        avatar,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid OTP" },
        { status: 400 }
      );
    }

    const user = await response.json();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
} 