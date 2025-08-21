import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "Home"; // Default to "
  const response = await fetch(`${process.env.BACKEND_URL}/api/public/sliders?page=${page}`, {
    next: { revalidate: 0} // Adjust revalidation time as needed
  });
  const sliders = await response.json();

  return NextResponse.json(sliders);
}