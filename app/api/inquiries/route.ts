import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/public/createInquiry`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }

    const data = await response.text();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}