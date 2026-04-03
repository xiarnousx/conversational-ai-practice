import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`

  const { data, error } = await resend.emails.send({
    from: "DevSnap <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email — DevSnap",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Click the button below to verify your email address and activate your DevSnap account.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify email
        </a>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  })

  if (error) {
    console.error("[sendVerificationEmail] Resend error:", error)
    throw new Error(error.message)
  }

  console.log("[sendVerificationEmail] sent, id:", data?.id)
}
