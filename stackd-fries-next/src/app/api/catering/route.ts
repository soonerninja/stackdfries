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
    const { name, email, phone, event_date, headcount, event_type, message, company } = body;

    // Honeypot: real users never fill this hidden field
    if (company) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (name.length > 120) {
      return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (!event_date) {
      return NextResponse.json({ error: 'Event date is required' }, { status: 400 });
    }
    if (!headcount || typeof headcount !== 'number' || headcount < 10) {
      return NextResponse.json({ error: 'Headcount must be at least 10' }, { status: 400 });
    }
    if (!event_type || typeof event_type !== 'string' || event_type.length > 80) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }
    if (message && (typeof message !== 'string' || message.length > 2000)) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }
    if (phone && (typeof phone !== 'string' || phone.length > 40)) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
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
      console.error('[catering] DB insert failed', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

    // Send notification email if Resend API key is configured.
    // NOTE: The default `onboarding@resend.dev` sandbox sender will ONLY
    // deliver to the email address of the verified Resend account owner.
    // For real deliverability, verify a domain in Resend and set
    // CATERING_FROM_EMAIL to e.g. "Stack'd Fries <catering@stackdfries.com>".
    if (process.env.RESEND_API_KEY) {
      const from = process.env.CATERING_FROM_EMAIL || "Stack'd Fries <onboarding@resend.dev>";
      const to = process.env.CATERING_TO_EMAIL || 'stackdfries@gmail.com';
      const esc = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to,
            reply_to: email,
            subject: `New Catering Inquiry: ${name} — ${event_type}`,
            text:
              `New Catering Inquiry\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Phone: ${phone || 'Not provided'}\n` +
              `Event Date: ${event_date}\n` +
              `Headcount: ${headcount}\n` +
              `Event Type: ${event_type}\n` +
              `Details: ${message || 'None'}\n`,
            html: `<h2>New Catering Inquiry</h2>
              <p><strong>Name:</strong> ${esc(name)}</p>
              <p><strong>Email:</strong> ${esc(email)}</p>
              <p><strong>Phone:</strong> ${esc(phone || 'Not provided')}</p>
              <p><strong>Event Date:</strong> ${esc(event_date)}</p>
              <p><strong>Headcount:</strong> ${headcount}</p>
              <p><strong>Event Type:</strong> ${esc(event_type)}</p>
              <p><strong>Details:</strong> ${esc(message || 'None')}</p>`,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('[catering] Resend failed', res.status, text);
        }
      } catch (e) {
        console.error('[catering] Resend threw', e);
      }
    } else {
      console.warn('[catering] RESEND_API_KEY not set — skipping email notification');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('[catering] Unhandled error', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
