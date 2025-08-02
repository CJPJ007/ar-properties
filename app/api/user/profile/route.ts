import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, mobile, avatar } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Here you would typically make an API call to your backend to update the user profile
    // For now, we'll simulate the update
    const updatedProfile = {
      id: 1,
      name: name.trim(),
      email: session.user.email,
      mobile: mobile || null,
      avatar: avatar || null,
      updatedAt: new Date().toISOString()
    };

    // Mock API call to backend
    // const response = await fetch(`${process.env.BACKEND_URL}/api/user/profile`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${session.accessToken}`
    //   },
    //   body: JSON.stringify({
    //     name,
    //     mobile,
    //     avatar
    //   })
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to update profile');
    // }

    // const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let mobile = session.user.mobile || null;

    // If mobile is null, empty, or undefined, fetch from backend
    if (!mobile || mobile.trim() === '') {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/public/customer/${encodeURIComponent(session.user.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const customerData = await response.json();
          mobile = customerData.mobile || null;
        } else {
          console.warn(`Failed to fetch customer data for ${session.user.email}: ${response.status}`);
        }
      } catch (fetchError) {
        console.error('Error fetching customer mobile:', fetchError);
        // Continue with null mobile if API call fails
      }
    }

    // Mock data - replace with actual backend API call
    const userProfile = {
      id: 1,
      name: session.user.name || 'User',
      email: session.user.email,
      mobile: mobile,
      avatar: session.user.image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(userProfile);

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
} 