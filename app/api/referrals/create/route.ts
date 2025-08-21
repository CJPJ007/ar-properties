import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestData = await request.json();
  try{
  const response = await fetch(`${process.env.BACKEND_URL}/api/public/referrals/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    console.error("Failed to process referral:", response.status, await response.text());
  }
  const responseData = await response.json();

  return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error processing referral:", error);
  }
  return NextResponse.json({ error: "Failed to process referral" }, { status: 500 });
}