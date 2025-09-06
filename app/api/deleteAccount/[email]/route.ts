import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { email: string } }) {
  try {
    const emailId = decodeURIComponent(params.email)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailId)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const result = await fetch(`${process.env.BACKEND_URL}/api/public/deleteAccount/${emailId}`,
        {
            method:"DELETE",
            headers:{
                "Content-type":"application/json"
            }
        }
    )

    if(result.ok)
    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
      deletedEmail: emailId,
      deletedAt: new Date().toISOString(),
    })
    else
        return NextResponse.json({ error: "Improper Request" }, { status: 400 })
 
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
