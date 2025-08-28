import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Get IP address from request headers or connection
        const ip =
            req.headers.get('x-forwarded-for') ||
            req.ip ||
            req.headers.get('x-real-ip') ||
            '';

        // Get request body
        const body = await req.json();
        console.log('Request body:', body);
        // Add IP to request body
        const updatedBody = { ...body, ip };

        // Call external API
        const response = await fetch(`${process.env.BACKEND_URL}/api/public/viewProperty`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBody),
        });

        const data = await response.text();

        return NextResponse.json({data:data}, { status: response.status });
    } catch (error) {
        console.error('Error in /api/viewProperty:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}