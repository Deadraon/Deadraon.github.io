import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  projectType,
  budget,
  timeline,
  phone,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  phone?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "chauhankunal695@gmail.com";

  const mailOptions = {
    from: `"Deadraon Portfolio" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New Inquiry: ${subject}`,
    text: `
      You have a new inquiry from your portfolio site.

      Name: ${name}
      Email: ${email}
      Phone: ${phone || "N/A"}
      Subject: ${subject}
      Project Type: ${projectType || "N/A"}
      Budget: ${budget || "N/A"}
      Timeline: ${timeline || "N/A"}

      Message:
      ${message}
    `,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0070F3;">New Portfolio Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
        <p><strong>Budget:</strong> ${budget || "N/A"}</p>
        <p><strong>Timeline:</strong> ${timeline || "N/A"}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
