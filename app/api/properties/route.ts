import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request:Request) {
  let requestJSON;
  try {
    requestJSON = await request.json();
  } catch (error) {
    
  }
  const url = `${process.env.BACKEND_URL}/api/public/advancedSearch/Property${request.url.split("?")[1] ? `?${request.url.split("?")[1]}` : ''}`;

  console.log(url);
  const response = await fetch(
    url,
    {
      method: "POST",
      body: JSON.stringify(requestJSON?requestJSON:{
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
