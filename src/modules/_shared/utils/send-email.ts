import nodemailer from 'nodemailer'

export async function sendEmail(email: string, token: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Seu Magic Link',
    html: `
      <h1>Faça login na sua conta</h1>
      <p>Clique no link abaixo para fazer login:</p>
      <a href="${magicLinkUrl}">Faça login agora</a>
      <p>Este link expirará em 15 minutos.</p>
    `,
  })
}
