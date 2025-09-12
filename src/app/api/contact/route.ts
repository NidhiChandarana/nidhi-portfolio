import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  body: string;
};

const TO = process.env.CONTACT_TO!;
const FROM = process.env.CONTACT_FROM || "Nidhi Portfolio <onboarding@resend.dev>";

export async function POST(req: Request) {
  try {
    const { name, email, subject, body }: ContactPayload = await req.json();

    if (!name || !email || !body) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: subject ? `[Portfolio] ${subject}` : "[Portfolio] New message",
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial">
          <h2>New portfolio message</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Subject:</b> ${escapeHtml(subject || "")}</p>
          <p style="white-space:pre-wrap"><b>Message:</b><br/>${escapeHtml(body)}</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "Thanks — I got your message",
      text: `Hi ${name},\n\nThanks for reaching out via my portfolio. I'll get back to you shortly.\n\n— Nidhi`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("contact form error:", err);
    return NextResponse.json({ ok: false, error: "Email failed to send." }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}