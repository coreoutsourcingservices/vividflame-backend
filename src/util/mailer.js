import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS, // Gmail App Password
  },
});

// SMTP Connection Check
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error.message);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

export const sendEmailOTP = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"OTP Verification" <${process.env.USER}>`,
      to: to,
      subject: "Your OTP Verification Code",
      html: `
<div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 15px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#2563eb;padding:35px;">



              <h1 style="margin:0;color:#fff;font-size:28px;">
                OTP Verification
              </h1>

              <p style="margin-top:10px;color:#dbeafe;font-size:15px;">
                Secure Email Verification
              </p>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2 style="margin:0;color:#222;">
                Hello 👋
              </h2>

              <p style="margin-top:18px;font-size:16px;color:#555;line-height:28px;">
                We received a request to verify your email address.
                Please use the One-Time Password (OTP) below to continue.
              </p>

              <div style="
                  margin:35px auto;
                  background:#eef4ff;
                  border:2px dashed #2563eb;
                  border-radius:10px;
                  padding:18px;
                  text-align:center;
              ">

                <span style="
                    font-size:38px;
                    font-weight:bold;
                    color:#2563eb;
                    letter-spacing:12px;
                ">
                  ${otp}
                </span>

              </div>

              <p style="font-size:15px;color:#555;line-height:28px;">
                ⏰ This OTP will expire in
                <strong style="color:#dc2626;">
                  10 minutes
                </strong>.
              </p>

              <p style="font-size:15px;color:#555;line-height:28px;">
                For your security, never share this OTP with anyone.
                Our team will never ask you for your verification code.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;background:#f8fafc;border-radius:8px;">
                <tr>
                  <td style="padding:20px;">

                    <h3 style="margin:0;color:#111;">
                      Security Tips
                    </h3>

                    <ul style="padding-left:20px;color:#666;line-height:30px;font-size:15px;">
                      <li>Never share your OTP with anyone.</li>
                      <li>OTP is valid for only 10 minutes.</li>
                      <li>If you didn't request this OTP, simply ignore this email.</li>
                      <li>Your account remains secure.</li>
                    </ul>

                  </td>
                </tr>
              </table>

              <div style="margin-top:35px;text-align:center;">

                <a href="https://vividflame.in"
                  style="
                    background:#2563eb;
                    color:#fff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:8px;
                    display:inline-block;
                    font-weight:bold;
                  ">
                  Visit Website
                </a>

              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111827;padding:30px;text-align:center;">

              <p style="margin:0;color:#fff;font-size:18px;font-weight:bold;">
                Thank You ❤️
              </p>

              <p style="margin-top:10px;color:#cbd5e1;font-size:14px;line-height:24px;">
                This is an automated email.
                Please do not reply to this message.
              </p>

              <p style="margin-top:18px;color:#94a3b8;font-size:13px;">
                © 2026 Your Company Name. All Rights Reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`
    });

    // console.log("✅ Email Sent Successfully");
    // console.log("Message ID:", info.messageId);
    // console.log("Accepted:", info.accepted);
    // console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("❌ Email Sending Failed");
    console.error(error);

    throw error;
  }
};