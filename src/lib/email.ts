import nodemailer from "nodemailer";
import path from "path";


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
export async function notifyAdminOfResumeRequest({
  name,
  email,
  company,
  token,
}: {
  name: string;
  email: string;
  company?: string;
  token: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "chauhankunal695@gmail.com";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const approveUrl = `${baseUrl}/api/resume/action?token=${token}&action=approve`;
  const rejectUrl = `${baseUrl}/api/resume/action?token=${token}&action=reject`;

  const mailOptions = {
    from: `"Deadraon Portfolio" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Resume Request from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0070F3;">New Resume Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <a href="${approveUrl}" style="background-color: #0070F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Approve & Send</a>
          <a href="${rejectUrl}" style="background-color: #ff4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Decline</a>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">Alternatively, go to your dashboard to manage this request.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendResumeEmail(toEmail: string, name: string) {
  const mailOptions = {
    from: `"Deadraon Portfolio" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Resume - Kunal Chauhan`,
    text: `Hello ${name},\n\nThank you for your interest. Please find my resume attached.\n\nBest regards,\nKunal Chauhan`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0070F3;">Resume Request Approved</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your interest in my professional background. Please find my resume attached to this email.</p>
        <p>If you have any questions or would like to discuss potential opportunities, feel free to reply to this email.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>Kunal Chauhan</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: "Kunal_Chauhan_Resume.pdf",
        path: path.join(process.cwd(), "public", "resume.pdf"),
      },
    ],
  };

  console.log("Sending resume email to:", toEmail, "with attachment from:", path.join(process.cwd(), "public", "resume.pdf"));
  return transporter.sendMail(mailOptions);

}
