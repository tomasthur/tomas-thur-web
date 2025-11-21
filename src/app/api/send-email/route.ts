import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { meno, email, sprava } = await request.json();

    if (!meno || !email) {
      return NextResponse.json(
        { error: "Meno a email sú povinné" },
        { status: 400 }
      );
    }

    // Email obsah
    const subject = `Kontakt z webu - ${meno}`;
    const emailBody = `
Nová správa z kontaktného formulára:

Meno: ${meno}
Email: ${email}
${sprava ? `Správa: ${sprava}` : ""}

---
Tento email bol odoslaný automaticky z webovej stránky.
    `.trim();

    // Použitie Web API na odoslanie emailu
    // Pre produkciu odporúčam použiť službu ako Resend, SendGrid alebo nodemailer
    // Tu je jednoduché riešenie pomocou mailto alebo email API služby
    
    // Použijeme jednoduchú metódu - vytvoríme mailto URL a pošleme cez email službu
    // Pre teraz použijeme mailto ako základ
    
    // Pre produkciu použite Resend (bezplatný tier k dispozícii)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const MAIL_TO = process.env.MAIL_TO || "thur.tomas@gmail.com";
    // Pokiaľ nemáte overenú doménu v Resend, použite onboarding@resend.dev
    const MAIL_FROM = process.env.MAIL_FROM || "Kontakt z webu <onboarding@resend.dev>";
    
    if (RESEND_API_KEY) {
      // Použitie Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: MAIL_TO,
          subject: subject,
          text: emailBody,
          reply_to: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email via Resend");
      }

      const data = await response.json();
      return NextResponse.json(
        { message: "Email bol úspešne odoslaný", id: data.id },
        { status: 200 }
      );
    } else {
      // Fallback - len logovanie (v produkcii odporúčam nastaviť RESEND_API_KEY)
      console.log("Email to send (simulation - missing RESEND_API_KEY):", {
        to: MAIL_TO,
        from: MAIL_FROM,
        reply_to: email,
        subject,
        body: emailBody,
      });
      
      // Pre produkciu nezabudnite:
      // 1. Vytvoriť účet na https://resend.com
      // 2. Pridať RESEND_API_KEY do .env.local
      // 3. Alebo použiť inú email službu (SendGrid, nodemailer s SMTP, atď.)
      
      return NextResponse.json(
        { message: "Email bol pripravený na odoslanie (skontrolujte konfiguráciu)" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Chyba pri odosielaní emailu" },
      { status: 500 }
    );
  }
}

