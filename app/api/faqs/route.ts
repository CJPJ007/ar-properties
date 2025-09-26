import { NextResponse } from "next/server";

export async function GET() {
    console.log("Inside get faqs");
  const result = await fetch(`${process.env.BACKEND_URL}/api/public/faqs`,{
    next: { revalidate: 0 }
  });
  if (result.ok) {
    const faqs = await result.json();
    console.log("FAQS LIST : ",faqs);
    return NextResponse.json(faqs, { status: 200 });
  }

  return NextResponse.json([], { status: 200 });
}
