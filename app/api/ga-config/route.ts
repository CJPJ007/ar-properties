import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const url = `${process.env.BACKEND_URL}/api/public/gaConfig`
    const response = await fetch(url, { next: { revalidate: 0 } }) // Adjust revalidation time as needed
  
  const gaConfig = await response.json()
  console.log("Fetched GA Config:", gaConfig)

  return NextResponse.json(gaConfig)
}