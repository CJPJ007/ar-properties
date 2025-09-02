import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { revalidate } from "../../company-details/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { customerIdentifier: string } }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/public/customer/${encodeURIComponent(
        params.customerIdentifier
      )}`,
      {
        next: { revalidate: 10 },

        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("After calling customerData api");
    if (response.ok) {
      const customerData = await response.json();
      return NextResponse.json(customerData);
    }
  } catch (fetchError) {
    console.error(
      "Error fetching customer mobile in JWT callback:",
      fetchError
    );
  }
  return NextResponse.json({}, { status: 400 });
}
