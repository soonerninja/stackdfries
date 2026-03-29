import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) {
    return true;
  }
  return false;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000);

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, event_date, headcount, event_type, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (!event_date) {
      return NextResponse.json({ error: 'Event date is required' }, { status: 400 });
    }
    if (!headcount || typeof headcount !== 'number' || headcount < 10) {
      return NextResponse.json({ error: 'Headcount must be at least 10' }, { status: 400 });
    }
    if (!event_type || typeof event_type !== 'string') {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('catering_inquiries')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        event_date,
        headcount,
        event_type,
        message: message?.trim() || null,
      });

    if (error) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    // Send notification email if Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Stack\'d Fries <noreply@stackdfries.com>',
          to: 'stackdfries@gmail.com',
          subject: `New Catering Inquiry: ${name} - ${event_type}`,
          html: `<h2>New Catering Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Event Date:</strong> ${event_date}</p>
            <p><strong>Headcount:</strong> ${headcount}</p>
            <p><strong>Event Type:</strong> ${event_type}</p>
            <p><strong>Details:</strong> ${message || 'None'}</p>`,
        }),
      }).catch(() => {}); // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
