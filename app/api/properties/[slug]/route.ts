import { NextResponse } from "next/server"


export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/public/advancedSearch/Property`,

    {
      method: "POST",
      body: JSON.stringify({
        criteriaList: [{
          key: "slug",
          value: slug,
          operation: "equals"
        }],
        operations: [],
      }),
      next: { revalidate: 1 },
      headers: {
        "Content-Type":"application/json"
      },
    } // Adjust revalidation time as needed
  );
  const properties = await response.json();

  return NextResponse.json(properties.data);
}
