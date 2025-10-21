import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.toLowerCase() || ""

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/public/advancedSearch/Property`,

    {
      method: "POST",
      body: JSON.stringify({
        criteriaList: [{
          key:"sold",
          value:"true",
          operation:"equals"
        }],
        operations: [],
      }),
      next: { revalidate: 0 },
      headers: {
        "Content-Type":"application/json"
      },
    } // Adjust revalidation time as needed
  );
  const properties = await response.json();

  return NextResponse.json(properties.totalRecords);
}
