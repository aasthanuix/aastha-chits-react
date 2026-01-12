// utils/emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCredentialEmail = async ({ name, email, userId, password }) => {
  try {
    const response = await resend.emails.send({
      from: "Aastha Chits <no-reply@universalsexports.com>",
      to: [email], // 🚨 MUST be array
      subject: "Your Aastha Chits Credentials",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your account has been created successfully.</p>
        <ul>
          <li><strong>User ID:</strong> ${userId}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>
          Login here:
          <a href="${process.env.FRONTEND_URL}/login">
            ${process.env.FRONTEND_URL}/login
          </a>
        </p>
        <p style="color:#777;font-size:12px">
          Please change your password after first login.
        </p>
      `,
    });

    console.log("Resend response:", response);
  } catch (err) {
    console.error("❌ Resend Email Error:", err);
    throw new Error("Email sending failed");
  }
};


export const sendTransactionEmail = async ({
  userEmail,
  userName,
  planName,
  amount,
  status,
  date,
}) => {
  try {
    await resend.emails.send({
      from: "Aastha Chits <no-reply@universalsexports.com>",
      to: userEmail,
      subject: `Transaction ${status} – ${planName}`,
      html: `
        <h2>Hello ${userName},</h2>
        <p>Your transaction has been <strong>${status}</strong>.</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr><td><strong>Chit Plan</strong></td><td>${planName}</td></tr>
          <tr><td><strong>Amount</strong></td><td>₹${amount}</td></tr>
          <tr><td><strong>Date</strong></td><td>${new Date(date).toDateString()}</td></tr>
          <tr><td><strong>Status</strong></td><td>${status}</td></tr>
        </table>

        <p>If you have any questions, feel free to reach out.</p>
        <p>with Regards,<br/> Team Aastha Chits</p>
      `,
    });

    console.log("📧 Transaction email sent to:", userEmail);
  } catch (error) {
    console.error("Transaction Email Error:", error);
  }
};
