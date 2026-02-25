import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type ContactPayload = {
  email?: string;
  phone?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+()\-\s0-9]{7,20}$/;

const toEmail = process.env.CONTACT_TO_EMAIL ?? "aryankumar15082002@gmail.com";

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (!phoneRegex.test(phone)) {
    return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
  }

  if (message.length < 10 || message.length > 3000) {
    return NextResponse.json(
      { error: "Message should be between 10 and 3000 characters." },
      { status: 400 }
    );
  }

  const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT ?? "465");
  const smtpSecure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      {
        error:
          "Email service is not configured yet. Add SMTP_USER and SMTP_PASS in your environment."
      },
      { status: 500 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"Portfolio Contact" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `Portfolio inquiry from ${email}`,
      text: [
        "New portfolio inquiry",
        "",
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <h2>New portfolio inquiry</h2>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again in a moment." },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
