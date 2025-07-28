import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const params = searchParams.toString()
    const url = `${process.env.BACKEND_URL}/api/public/galleryItems${params ? `?${params}` : ''}`
    const response = await fetch(url, { next: { revalidate: 1 } }) // Adjust revalidation time as needed
  
  const properties = await response.json()

  return NextResponse.json(properties)
}