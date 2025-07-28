import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/api/public/featuredProperties`,
    { next: { revalidate: 1 } } // Adjust revalidation time as needed
  )
  const properties = await response.json()

  return NextResponse.json(properties)
}