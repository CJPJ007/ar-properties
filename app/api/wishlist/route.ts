import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestData = await request.json();

  const response = await fetch(`${process.env.BACKEND_URL}/api/public/wishlist`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(requestData),
  });
  const responseData = await response.json();

  return NextResponse.json(responseData);
}

export async function DELETE(request: Request) {
  const urlParams = new URL(request.url).searchParams;

  const response = await fetch(`${process.env.BACKEND_URL}/api/public/wishlist?${urlParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
  const responseData = await response.text();

  return NextResponse.json(responseData);
}