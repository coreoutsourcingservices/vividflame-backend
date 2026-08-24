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



export async function sendOrderEmail({
  userName,
  userEmail,
  userNumber,
  address,
  products,
}) {
  try {
    const productRows = products
      .map((product) => {
        const quantity = Number(product.quantity || 1);
        const price = Number(product.price || 0);
        const total = quantity * price;

        return `
          <tr>
            <td style="padding:15px;border-bottom:1px solid #eeeeee;">
              ${
                product.productImage
                  ? `
                    <img
                      src="${product.productImage}"
                      width="80"
                      height="80"
                      style="
                        width:80px;
                        height:80px;
                        object-fit:cover;
                        border-radius:8px;
                      "
                    />
                  `
                  : "No Image"
              }
            </td>

            <td style="padding:15px;border-bottom:1px solid #eeeeee;">
              ${product.productName || "Product"}
            </td>

            <td style="padding:15px;border-bottom:1px solid #eeeeee;text-align:center;">
              ${quantity}
            </td>

            <td style="padding:15px;border-bottom:1px solid #eeeeee;text-align:right;">
              ₹${price.toLocaleString("en-IN")}
            </td>

            <td style="padding:15px;border-bottom:1px solid #eeeeee;text-align:right;">
              ₹${total.toLocaleString("en-IN")}
            </td>
          </tr>
        `;
      })
      .join("");

    const grandTotal = products.reduce((total, product) => {
      return (
        total +
        Number(product.price || 0) *
          Number(product.quantity || 1)
      );
    }, 0);

    const fullAddress = address
      ? Object.values(address)
          .filter(Boolean)
          .join(", ")
      : "Address not available";

    await transporter.sendMail({
      from: `"Vivid Flame Orders" <${process.env.USER}>`,

      // Admin / owner ko order notification jayega
      to: process.env.ORDER_EMAIL || process.env.USER,

      // Customer email par reply karne ke liye
      replyTo: userEmail || process.env.USER,

      subject: `🔥 New Order - ${userName || "Customer"}`,

      text: `
New Order Received

Customer: ${userName}
Email: ${userEmail}
Phone: ${userNumber || "N/A"}
Address: ${fullAddress}

Total: ₹${grandTotal}
      `,

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>New Vivid Flame Order</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f6f9;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#f4f6f9;
    padding:40px 15px;
  "
>

<tr>
<td align="center">

<table
  width="700"
  cellpadding="0"
  cellspacing="0"
  style="
    max-width:700px;
    width:100%;
    background:#ffffff;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
  "
>

<!-- HEADER -->
<tr>
<td
  align="center"
  style="
    background:linear-gradient(135deg,#ff6b35,#ff8c42);
    padding:35px;
  "
>

<h1
  style="
    margin:0;
    color:white;
    font-size:32px;
  "
>
🔥 Vivid Flame
</h1>

<p
  style="
    margin:10px 0 0;
    color:#fff;
    font-size:17px;
  "
>
New Order Received
</p>

</td>
</tr>


<!-- CUSTOMER DETAILS -->
<tr>
<td style="padding:35px;">

<h2
  style="
    margin-top:0;
    color:#222;
  "
>
👤 Customer Details
</h2>

<table
  width="100%"
  cellpadding="8"
  cellspacing="0"
  style="
    background:#fff7f3;
    border-radius:10px;
    margin-bottom:30px;
  "
>

<tr>
  <td><b>Name</b></td>
  <td>${userName || "N/A"}</td>
</tr>

<tr>
  <td><b>Email</b></td>
  <td>${userEmail || "N/A"}</td>
</tr>

<tr>
  <td><b>Phone</b></td>
  <td>${userNumber || "N/A"}</td>
</tr>

<tr>
  <td valign="top"><b>Address</b></td>
  <td>${fullAddress}</td>
</tr>

</table>


<!-- PRODUCTS -->
<h2 style="color:#222;">
🛒 Order Products
</h2>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    border:1px solid #eeeeee;
    border-radius:10px;
    overflow:hidden;
    border-collapse:collapse;
  "
>

<thead>

<tr
  style="
    background:#111827;
    color:white;
  "
>

<th style="padding:15px;text-align:left;">
Image
</th>

<th style="padding:15px;text-align:left;">
Product
</th>

<th style="padding:15px;text-align:center;">
Qty
</th>

<th style="padding:15px;text-align:right;">
Price
</th>

<th style="padding:15px;text-align:right;">
Total
</th>

</tr>

</thead>

<tbody>
${productRows}
</tbody>

</table>


<!-- GRAND TOTAL -->

<div
  style="
    margin-top:30px;
    background:#fff4ef;
    border:2px solid #ff6b35;
    border-radius:10px;
    padding:20px;
    text-align:right;
  "
>

<span
  style="
    font-size:17px;
    color:#555;
  "
>
Grand Total
</span>

<h2
  style="
    margin:5px 0 0;
    font-size:30px;
    color:#ff6b35;
  "
>
₹${grandTotal.toLocaleString("en-IN")}
</h2>

</div>

</td>
</tr>


<!-- FOOTER -->

<tr>

<td
  align="center"
  style="
    background:#111827;
    color:white;
    padding:30px;
  "
>

<h2
  style="
    margin:0;
    color:white;
  "
>
Vivid Flame
</h2>

<p
  style="
    color:#94a3b8;
    font-size:13px;
    margin-top:15px;
  "
>
New order notification generated automatically.
</p>

<p
  style="
    color:#64748b;
    font-size:12px;
  "
>
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
      `,
    });

    console.log("✅ Order email sent successfully");

    return true;
  } catch (error) {
    console.error(
      "❌ Order email error:",
      error.message
    );

    throw error;
  }
}