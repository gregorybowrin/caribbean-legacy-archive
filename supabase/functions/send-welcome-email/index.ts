import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()
    const email = record.email

    console.log(`Sending welcome email to: ${email}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Caribbean Legacy Archive <info@caribbeanlegacyarchive.com>',
        to: [email],
        subject: 'Welcome to the Caribbean Legacy Archive',
        html: `
          <div style="font-family: serif; color: #1a2c38; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fcfaf2; border: 1px solid #d4af37;">
            <h1 style="color: #1a2c38; border-bottom: 2px solid #d4af37; padding-bottom: 20px;">Welcome to the Archive</h1>
            <p style="font-size: 18px; line-height: 1.6;">Thank you for joining the <strong>Caribbean Legacy Archive</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
              You are now part of a community dedicated to preserving the history and excellence of our Caribbean ancestors. 
              We are currently in the final stages of documenting over 100 historical figures from across the archipelago.
            </p>
            <div style="margin: 40px 0; padding: 20px; background-color: #ffffff; border-left: 4px solid #d4af37;">
              <p style="margin: 0; font-style: italic;">"A people without the knowledge of their past history, origin and culture is like a tree without roots."</p>
              <p style="margin: 10px 0 0 0; font-weight: bold;">— Marcus Garvey</p>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
              We will notify you the moment the archive is fully open to the public. 
              In the meantime, we are adding new profiles daily.
            </p>
            <hr style="border: 0; border-top: 1px solid #d4af37; margin: 40px 0;" />
            <p style="font-size: 12px; color: #a0aec0; text-align: center; text-transform: uppercase; letter-spacing: 2px;">
              Caribbean Legacy Archive &copy; 2026
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
