import resendClient from '../config/resend.js';
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const tokenStore = new Map();

export const sendBrochureEmail = async (req, res) => {
  const { name, email } = req.body;

  try {
    const pdfPath = path.join(process.cwd(), 'uploads', 'aastha-chits-brochure.pdf');

    // 2. Store token + expiry
    tokenStore.set(token, expiry);

    // 3. Build secure download link
    const downloadLink = `${process.env.FRONTEND_URL}/api/download-brochure?token=${token}`;

    await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Aastha Chits - Brochure Request',
      html: `<p>Hi ${name},</p><p>Thanks for your interest in Aastha Chits. Please find the brochure attached.</p>`,
      attachments: [
        {
          filename: 'Aastha-Brochure.pdf',
          content: pdfBuffer.toString('base64'),
          encoding: 'base64',
        },
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }

  // Serve the PDF
  const pdfPath = path.join(process.cwd(), "uploads", "aastha-chits-brochure.pdf");
  res.download(pdfPath, "Aastha-Brochure.pdf");
};

export const enrollmentEmail = async (req, res) => {
  const { name, email, phone, plan } = req.body;

  try {
    await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `New Enrollment for ${plan}`,
      text: `
      New enrollment details:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Plan: ${plan}
      `,
      html: `
        <h1>New enrollment details:</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Plan:</strong> ${plan}</p>
      `
    });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

export const contactFormHandler = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Env:", process.env.RESEND_API_KEY, process.env.EMAIL_FROM);

  const { firstName, contactNumber, email, subject, message } = req.body;

  try {
    await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_FROM,
      subject: `Contact Form: ${subject}`,
      html: `
        <p><b>Name:</b> ${firstName}</p>
        <p><b>Contact Number:</b> ${contactNumber}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
      reply_to: email,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to send email" });
  }
};
