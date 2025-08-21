import { url } from "inspector";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestData = await request.json();
  const urlParams = request.url.split('?')[1] || {};
  console.log("Request Data:", urlParams, requestData);
  const response = await fetch(`${process.env.BACKEND_URL}/api/public/advancedSearch/Testimonial?${new URLSearchParams(urlParams)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(requestData),
  });
  const responseData = await response.json();

  return NextResponse.json(responseData);
}
