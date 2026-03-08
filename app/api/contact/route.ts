import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  email?: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message?: string;
};

type ContactSubmission = {
  toEmail: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  message: string;
  source: string;
  submittedAt: string;
};

type WebhookResponsePayload = {
  success?: boolean;
  error?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+()\-\s0-9]{7,20}$/;

const toEmail = (process.env.CONTACT_TO_EMAIL ?? "aryankumar15082002@gmail.com").trim();
const googleWebhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL?.trim();
const googleWebhookSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim();

const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const smtpFrom = process.env.SMTP_FROM?.trim();
const smtpSecureRaw = process.env.SMTP_SECURE?.trim().toLowerCase();

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const budget = payload.budget?.trim() ?? "";
  const timeline = payload.timeline?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (phone && !phoneRegex.test(phone)) {
    return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
  }

  if (budget.length > 100 || timeline.length > 100) {
    return NextResponse.json(
      { error: "Budget and timeline values look invalid. Please try again." },
      { status: 400 }
    );
  }

  if (message.length < 10 || message.length > 3000) {
    return NextResponse.json(
      { error: "Message should be between 10 and 3000 characters." },
      { status: 400 }
    );
  }

  const submission: ContactSubmission = {
    toEmail,
    email,
    phone,
    budget,
    timeline,
    message,
    source: "portfolio-contact-form",
    submittedAt: new Date().toISOString()
  };

  const deliveryErrors: string[] = [];

  if (googleWebhookUrl) {
    try {
      await deliverViaGoogleWebhook(submission);
      return NextResponse.json({ success: true, provider: "google-apps-script" });
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown webhook error.";
      deliveryErrors.push(`Google Apps Script failed: ${details}`);
    }
  } else {
    deliveryErrors.push("Google Apps Script webhook URL is not configured.");
  }

  if (isSmtpConfigured()) {
    try {
      await deliverViaSmtp(submission);
      return NextResponse.json({ success: true, provider: "smtp" });
    } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown SMTP error.";
      deliveryErrors.push(`SMTP failed: ${details}`);
    }
  } else {
    deliveryErrors.push("SMTP is not configured.");
  }

  console.error("Contact form delivery failed:", deliveryErrors.join(" | "));

  return NextResponse.json(
    {
      error:
        "Unable to send your message right now. The mail relay is misconfigured. Configure Google Apps Script access or SMTP credentials and try again.",
      details: deliveryErrors
    },
    { status: 500 }
  );
}

async function deliverViaGoogleWebhook(submission: ContactSubmission): Promise<void> {
  if (!googleWebhookUrl) {
    throw new Error("Missing GOOGLE_APPS_SCRIPT_WEBHOOK_URL.");
  }

  const response = await fetch(googleWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      secret: googleWebhookSecret ?? "",
      ...submission
    })
  });

  const bodyText = await response.text();
  const payload = parseWebhookResponse(bodyText);

  if (response.ok && payload.success !== false) {
    return;
  }

  if (response.status === 401 || looksLikeGoogleLoginPage(bodyText)) {
    throw new Error(
      "Webhook is not publicly accessible. Redeploy Apps Script Web App with access set to Anyone."
    );
  }

  if (payload.error) {
    throw new Error(payload.error);
  }

  throw new Error(`Webhook returned HTTP ${response.status}.`);
}

async function deliverViaSmtp(submission: ContactSubmission): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("Missing SMTP configuration.");
  }

  const secure = smtpSecureRaw ? smtpSecureRaw === "true" : smtpPort === 465;
  const fromAddress = smtpFrom || smtpUser || submission.toEmail;
  const subject = `Portfolio inquiry from ${submission.email}`;
  const textBody = [
    "New portfolio inquiry",
    "",
    `Email: ${submission.email}`,
    `Phone: ${submission.phone || "Not provided"}`,
    `Budget: ${submission.budget || "Not provided"}`,
    `Timeline: ${submission.timeline || "Not provided"}`,
    `Submitted At: ${submission.submittedAt}`,
    "",
    "Message:",
    submission.message
  ].join("\n");

  const htmlBody = [
    "<h2>New portfolio inquiry</h2>",
    `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(submission.phone || "Not provided")}</p>`,
    `<p><strong>Budget:</strong> ${escapeHtml(submission.budget || "Not provided")}</p>`,
    `<p><strong>Timeline:</strong> ${escapeHtml(submission.timeline || "Not provided")}</p>`,
    `<p><strong>Submitted At:</strong> ${escapeHtml(submission.submittedAt)}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${escapeHtml(submission.message).replace(/\n/g, "<br/>")}</p>`
  ].join("");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
  });

  await transporter.sendMail({
    to: submission.toEmail,
    from: fromAddress,
    replyTo: submission.email,
    subject,
    text: textBody,
    html: htmlBody
  });
}

function parseWebhookResponse(body: string): WebhookResponsePayload {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body) as WebhookResponsePayload;
  } catch {
    return {};
  }
}

function looksLikeGoogleLoginPage(body: string): boolean {
  return /ServiceLogin|accounts\.google\.com|unable to open the file at present/i.test(body);
}

function isSmtpConfigured(): boolean {
  return Boolean(smtpHost && Number.isFinite(smtpPort) && smtpPort > 0);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
