// supabase/functions/send-email/index.ts
// Triggered by a Supabase Database Webhook on INSERT to contact_messages.
// Requires RESEND_API_KEY secret set in the Supabase Dashboard.

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

Deno.serve(async (req: Request) => {
  try {
    const body = (await req.json()) as { record: ContactMessage };
    const { name, email, message } = body.record;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), { status: 500 });
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #de1b24;">New Contact Message — Aviix Media</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <hr style="border-color: #333;" />
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Aviix Media <noreply@yourdomain.com>", // Replace with your verified Resend domain
        to: ["avixmedia@gmail.com"],
        reply_to: email,
        subject: `New message from ${name}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", errBody);
      return new Response(JSON.stringify({ error: errBody }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
