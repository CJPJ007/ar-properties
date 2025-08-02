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
    const mockInquiries = [
      {
        id: 1,
        propertyId: 1,
        propertyTitle: "Luxury 3BHK Apartment in City Center",
        propertyImage: "/placeholder.jpg",
        message: "I'm interested in this property. Can you provide more details about the amenities?",
        status: "responded",
        createdAt: "2024-01-15T10:30:00Z",
        respondedAt: "2024-01-15T14:20:00Z"
      },
      {
        id: 2,
        propertyId: 2,
        propertyTitle: "Modern 2BHK Villa with Garden",
        propertyImage: "/placeholder.jpg",
        message: "What's the best time to schedule a site visit?",
        status: "pending",
        createdAt: "2024-01-20T09:15:00Z"
      }
    ];

    return NextResponse.json(mockInquiries);

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
} 