import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Mock data - replace with actual backend API call
    const mockSiteVisits = [
      {
        id: 1,
        propertyId: 1,
        propertyTitle: "Luxury 3BHK Apartment in City Center",
        propertyImage: "/placeholder.jpg",
        scheduledDate: "2024-01-25T14:00:00Z",
        status: "scheduled",
        notes: "Please bring your ID proof for verification",
        createdAt: "2024-01-18T11:00:00Z"
      },
      {
        id: 2,
        propertyId: 3,
        propertyTitle: "Premium 4BHK Penthouse",
        propertyImage: "/placeholder.jpg",
        scheduledDate: "2024-01-22T16:00:00Z",
        status: "completed",
        notes: "Site visit completed successfully",
        createdAt: "2024-01-20T10:00:00Z"
      }
    ];

    return NextResponse.json(mockSiteVisits);

  } catch (error) {
    console.error('Error fetching site visits:', error);
    return NextResponse.json(
      { error: "Failed to fetch site visits" },
      { status: 500 }
    );
  }
} 