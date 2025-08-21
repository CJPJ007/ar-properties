import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL}/api/public/testimonial/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Backend API error:", errorData)
      return NextResponse.json({ error: "Failed to create testimonial" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
