import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Dummy in-memory store for demonstration (replace with DB in production)
const customers: Record<string, { id: number; name: string; email: string; mobile: string; avatar: string }> = {
  'test@example.com': {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    mobile: '1234567890',
    avatar: '/avatar.png',
  },
};

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.email !== params.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const customer = customers[params.email];
  if (!customer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(customer);
}

export async function PUT(req: NextRequest, { params }: { params: { email: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.email !== params.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const customer = customers[params.email];
  if (!customer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = await req.json();
  // Only allow updating name, mobile, avatar
  customer.name = body.name ?? customer.name;
  customer.mobile = body.mobile ?? customer.mobile;
  customer.avatar = body.avatar ?? customer.avatar;
  return NextResponse.json(customer);
}