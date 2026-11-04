import { NextResponse, type NextRequest } from "next/server";
import { isMailerConfigured, sendNewsletterSignup } from "@/services/mailer";

export const runtime = "nodejs"; // nodemailer needs Node sockets

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Best-effort per-instance rate limit: 5 attempts per IP per 10 minutes. */
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5_000) attempts.clear(); // keep memory bounded
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  let body: { email?: unknown; company?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill "company". Pretend success for bots.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  if (!isMailerConfigured()) {
    return NextResponse.json({ error: "Signups open soon. Check back shortly." }, { status: 503 });
  }

  try {
    const source = typeof body.source === "string" ? body.source.slice(0, 40) : "unknown";
    await sendNewsletterSignup(email, { source, ip });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] signup failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Couldn't sign you up right now. Please try again." }, { status: 502 });
  }
}
