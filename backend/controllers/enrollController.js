import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// -------------------------
// Send enrollment email to admin
// -------------------------
export const sendEnrollMail = async (req, res) => {
  try {
    const { name, email, phone, plan } = req.body;
    if (!name || !email || !phone || !plan) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await resend.emails.send({
      from: "Website Enrollments <onboarding@resend.dev>",
      to: [process.env.ADMIN_EMAIL],
      subject: `New Enrollment Request – ${plan}`,
      html: `
        <h2>New Enrollment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Plan:</strong> ${plan}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Enroll mail error:", error);
    res.status(500).json({ message: "Failed to send enrollment mail" });
  }
};

