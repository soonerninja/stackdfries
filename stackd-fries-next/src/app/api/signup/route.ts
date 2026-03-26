import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('email_signups')
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Duplicate email', code: 'duplicate' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
