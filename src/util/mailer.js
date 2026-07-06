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



export async function sendEmailOTP(email, otp) {
  await transporter.sendMail({
    from: `"Vivid Flame" <${process.env.USER}>`,
    to: email,
    replyTo: `${process.env.USER}`,
    subject: "Your Vivid Flame Verification Code",

    text: `Your Vivid Flame OTP is ${otp}. This code will expire in 10 minutes.`,

    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vivid Flame OTP</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;background:#f4f6f9;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#ff6b35,#ff8c42);padding:40px;">

<h1 style="margin:0;color:#ffffff;font-size:34px;">
🔥 Vivid Flame
</h1>

<p style="margin-top:12px;color:#fff7f2;font-size:16px;">
Secure Email Verification
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px;">

<h2 style="margin:0;color:#222;font-size:28px;">
Hello 👋
</h2>

<p style="margin-top:20px;color:#555;font-size:16px;line-height:30px;">

Thank you for choosing
<b>Vivid Flame</b>.

We received a request to verify your email address.

Please use the OTP below to continue.

</p>

<div
style="
margin:35px auto;
background:#fff4ef;
border:2px dashed #ff6b35;
border-radius:12px;
padding:22px;
text-align:center;
">

<div
style="
font-size:42px;
font-weight:bold;
letter-spacing:12px;
color:#ff6b35;
">

${otp}

</div>

</div>

<p
style="
font-size:16px;
color:#444;
line-height:30px;
">

⏰ This verification code is valid for

<b style="color:#d62828;">
10 minutes
</b>

only.

</p>

<p
style="
font-size:16px;
color:#555;
line-height:30px;
">

Never share your OTP with anyone.

Our support team will never ask for your verification code.

</p>



<hr
style="
margin:40px 0;
border:none;
border-top:1px solid #eee;
">

<h3 style="color:#222;">
Security Tips
</h3>

<ul
style="
color:#666;
line-height:32px;
font-size:15px;
padding-left:20px;
">

<li>Do not share your OTP with anyone.</li>

<li>Your OTP expires after 10 minutes.</li>

<li>If you didn't request this email, simply ignore it.</li>

<li>Your account remains secure.</li>

</ul>

</td>
</tr>

<!-- Footer -->

<tr>

<td
align="center"
style="
background:#111827;
padding:35px;
">

<h2
style="
margin:0;
color:#ffffff;
">

Vivid Flame

</h2>

<p
style="
margin-top:12px;
color:#cbd5e1;
font-size:15px;
line-height:28px;
">

Premium Lifestyle & Fragrance Products

</p>



<p
style="
margin-top:20px;
font-size:13px;
color:#94a3b8;
">

This is an automated email.

Please do not reply to this message.

</p>

<p
style="
margin-top:12px;
font-size:13px;
color:#64748b;
">

© 2026 Vivid Flame. All Rights Reserved.

</p>

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
  });
}