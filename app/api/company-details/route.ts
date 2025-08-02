import { NextResponse } from 'next/server'

export const revalidate = 10

export async function GET() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/public/company-details/company-info`, {
    next: { revalidate: 10 },
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch company details' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data)
} 