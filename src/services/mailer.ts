import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE } from "@/lib/constants";

/**
 * SMTP mailer for newsletter signups. Defaults target Titan Email (Hostinger):
 * smtp.titan.email, port 465, SSL. Only SMTP_USER and SMTP_PASS are required.
 */
const config = {
  host: process.env.SMTP_HOST || "smtp.titan.email",
  port: Number(process.env.SMTP_PORT || 465),
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
};

export function isMailerConfigured(): boolean {
  return Boolean(config.user && config.pass);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  transporter ??= nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // 465 = implicit SSL; 587 = STARTTLS
    auth: { user: config.user, pass: config.pass },
  });
  return transporter;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Records a signup by mailing it to the team inbox (the inbox is the list of record),
 * then sends the subscriber a welcome note. Throws only if the team notification fails.
 */
export async function sendNewsletterSignup(email: string, meta: { source: string; ip?: string }) {
  const from = process.env.NEWSLETTER_FROM || `${SITE.name} <${config.user}>`;
  const notifyTo = process.env.NEWSLETTER_NOTIFY_TO || config.user!;
  const mail = getTransporter();
  const when = new Date().toISOString();

  await mail.sendMail({
    from,
    to: notifyTo,
    replyTo: email,
    subject: `[The Wire] New subscriber: ${email}`,
    text: `New newsletter signup\n\nEmail: ${email}\nSource: ${meta.source}\nTime: ${when}\nIP: ${meta.ip ?? "unknown"}\n`,
  });

  try {
    await mail.sendMail({
      from,
      to: email,
      subject: `You're on The Wire — ${SITE.name}`,
      text: [
        `Welcome to The Wire.`,
        ``,
        `One email a week: every confirmed detail, every rated rumor, zero spam.`,
        ``,
        `Didn't sign up? Just reply to this email and we'll remove you.`,
        ``,
        `${SITE.name} — ${SITE.url}`,
        SITE.disclaimer,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#e7e3f0;background:#0d0b14;padding:32px;border-radius:12px">
          <p style="font:600 11px monospace;letter-spacing:.25em;text-transform:uppercase;color:#00e5ff;margin:0 0 12px">${escapeHtml(SITE.name)} // The Wire</p>
          <h1 style="margin:0 0 16px;font-size:24px;color:#ff2d95">You're on the wire.</h1>
          <p style="line-height:1.6;margin:0 0 12px">One email a week: every confirmed detail, every rated rumor, zero spam.</p>
          <p style="line-height:1.6;margin:0 0 24px;color:#9a93ad">Didn't sign up? Just reply to this email and we'll remove you.</p>
          <p style="font-size:12px;color:#6f6884;margin:0"><a href="${escapeHtml(SITE.url)}" style="color:#00e5ff">${escapeHtml(SITE.url)}</a><br>${escapeHtml(SITE.disclaimer)}</p>
        </div>`,
    });
  } catch (error) {
    // The signup is already recorded in the team inbox; a failed welcome mail shouldn't fail it.
    console.error("[newsletter] welcome email failed", error instanceof Error ? error.message : error);
  }
}
