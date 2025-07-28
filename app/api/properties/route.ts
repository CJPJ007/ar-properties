import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/public/advancedSearch/Property`,

    {
      method: "POST",
      body: JSON.stringify({
        criteriaList: [],
        operations: [],
      }),
      next: { revalidate: 1 },
      headers: {
        "Content-Type":"application/json"
      },
    } // Adjust revalidation time as needed
  );
  const properties = await response.json();

  return NextResponse.json(properties);
}
