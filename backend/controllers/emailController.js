import resendClient from '../config/resend.js';
import path from "path";
import fs from "fs";

export const sendBrochureEmail = async (req, res) => {
  const { name, email } = req.body;

  try {
    console.log("Incoming request:", { name, email });

    // build path
    const pdfPath = path.join(process.cwd(), "uploads", "aastha-chits-brochure.pdf");
    console.log("Looking for brochure at:", pdfPath);

    // check file
    if (!fs.existsSync(pdfPath)) {
      console.error("Brochure missing at path:", pdfPath);
      return res.status(404).json({ success: false, message: "Brochure file not found" });
    }

    // read file
    const pdfBuffer = fs.readFileSync(pdfPath);
    console.log("PDF loaded, size (bytes):", pdfBuffer.length);

    // check API key
    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key missing!");
      return res.status(500).json({ success: false, message: "Server misconfigured: missing API key" });
    }

    // send email
    const response = await resendClient.emails.send({
      from: "onboarding@resend.dev", // replace once your domain is verified
      to: "csvarshini01@gmail.com",
      subject: "Aastha Chits - Brochure Request",
      html: `<p>Hi ${name},</p>
             <p>Thanks for your interest in Aastha Chits. Please find the brochure attached.</p>`,
      attachments: [
        {
          filename: "Aastha-Brochure.pdf",
          content: pdfBuffer.toString("base64"),
          encoding: "base64",
        },
      ],
    });

    console.log("Resend API response:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
      stack: error.stack, // for deeper debugging on Render logs
    });
  }
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
