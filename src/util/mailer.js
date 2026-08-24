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
  orderId,
  userName,
  userEmail,
  userNumber,
  address,
  products,
}) {
  try {
    if (!userEmail) {
      throw new Error("User email is required");
    }

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Products are required");
    }

    // ==========================================
    // ADDRESS FORMAT
    // ==========================================

    let fullAddress = "Address not available";

    if (address) {
      const ignoreFields = [
        "_id",
        "__v",
        "user",
        "createdAt",
        "updatedAt",
      ];

      const addressValues = Object.entries(address)
        .filter(([key, value]) => {
          return (
            !ignoreFields.includes(key) &&
            value !== null &&
            value !== undefined &&
            value !== "" &&
            typeof value !== "object"
          );
        })
        .map(([, value]) => value);

      if (addressValues.length > 0) {
        fullAddress = addressValues.join(", ");
      }
    }

    // ==========================================
    // PRODUCT ROWS
    // ==========================================

    const productRows = products
      .map((product) => {
        const quantity = Number(product.quantity || 1);

        const price = Number(product.price || 0);

        const total = quantity * price;

        return `
          <tr>

            <td
              style="
                padding:15px;
                border-bottom:1px solid #eeeeee;
              "
            >

              ${
                product.productImage
                  ? `
                    <img
                      src="${product.productImage}"
                      width="80"
                      height="80"
                      alt="${product.productName || "Product"}"
                      style="
                        width:80px;
                        height:80px;
                        object-fit:cover;
                        border-radius:10px;
                        display:block;
                      "
                    />
                  `
                  : `
                    <div
                      style="
                        width:80px;
                        height:80px;
                        background:#f3f4f6;
                        border-radius:10px;
                        text-align:center;
                        line-height:80px;
                        color:#777;
                        font-size:12px;
                      "
                    >
                      No Image
                    </div>
                  `
              }

            </td>


            <td
              style="
                padding:15px;
                border-bottom:1px solid #eeeeee;
              "
            >

              <strong>
                ${product.productName || "Product"}
              </strong>

            </td>


            <td
              style="
                padding:15px;
                border-bottom:1px solid #eeeeee;
                text-align:center;
              "
            >

              ${quantity}

            </td>


            <td
              style="
                padding:15px;
                border-bottom:1px solid #eeeeee;
                text-align:right;
              "
            >

              ₹${price.toLocaleString("en-IN")}

            </td>


            <td
              style="
                padding:15px;
                border-bottom:1px solid #eeeeee;
                text-align:right;
                font-weight:bold;
              "
            >

              ₹${total.toLocaleString("en-IN")}

            </td>

          </tr>
        `;
      })
      .join("");

    // ==========================================
    // GRAND TOTAL
    // ==========================================

    const grandTotal = products.reduce(
      (total, product) => {
        const quantity = Number(product.quantity || 1);

        const price = Number(product.price || 0);

        return total + quantity * price;
      },
      0
    );

    // ==========================================
    // SEND EMAIL ONLY TO USER
    // ==========================================

    await transporter.sendMail({
      from: `"Vivid Flame" <${process.env.USER}>`,

      // ONLY CUSTOMER EMAIL
      to: userEmail,

      replyTo: process.env.USER,

      subject: `🔥 Your Vivid Flame Order #${orderId}`,

      text: `
Hello ${userName || "Customer"},

You ordered the following products from Vivid Flame.

Order ID: ${orderId}

${products
  .map((product) => {
    const quantity = Number(product.quantity || 1);

    const price = Number(product.price || 0);

    return `${product.productName}
Quantity: ${quantity}
Price: ₹${price}
Total: ₹${price * quantity}`;
  })
  .join("\n\n")}

Delivery Address:
${fullAddress}

Grand Total:
₹${grandTotal.toLocaleString("en-IN")}

Thank you for shopping with Vivid Flame.
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

<title>Your Vivid Flame Order</title>

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
    padding:30px 15px;
    background:#f4f6f9;
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
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
  "
>


<!-- HEADER -->

<tr>

<td
  align="center"
  style="
    background:linear-gradient(
      135deg,
      #ff6b35,
      #ff8c42
    );
    padding:40px 20px;
  "
>

<h1
  style="
    margin:0;
    color:#ffffff;
    font-size:32px;
  "
>

🔥 Vivid Flame

</h1>


<p
  style="
    margin:12px 0 0;
    color:#ffffff;
    font-size:17px;
  "
>

Your Order Details

</p>

</td>

</tr>


<!-- BODY -->

<tr>

<td style="padding:35px;">


<h2
  style="
    margin:0;
    color:#111827;
  "
>

Hello ${userName || "Customer"} 👋

</h2>


<p
  style="
    margin-top:15px;
    color:#555;
    font-size:16px;
    line-height:28px;
  "
>

You ordered the following products from
<strong>Vivid Flame</strong>.

</p>


<!-- ORDER ID -->

<div
  style="
    margin-top:25px;
    padding:15px 18px;
    background:#fff7f3;
    border-radius:10px;
  "
>

<strong>
Order ID:
</strong>

<span style="color:#ff6b35;">
${orderId}
</span>

</div>


<!-- PRODUCTS -->

<h2
  style="
    margin-top:35px;
    color:#111827;
  "
>

🛍️ Your Products

</h2>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="
    border-collapse:collapse;
    border:1px solid #eeeeee;
    border-radius:10px;
  "
>


<thead>

<tr
  style="
    background:#111827;
    color:#ffffff;
  "
>


<th
  style="
    padding:15px;
    text-align:left;
  "
>

Image

</th>


<th
  style="
    padding:15px;
    text-align:left;
  "
>

Product

</th>


<th
  style="
    padding:15px;
    text-align:center;
  "
>

Qty

</th>


<th
  style="
    padding:15px;
    text-align:right;
  "
>

Price

</th>


<th
  style="
    padding:15px;
    text-align:right;
  "
>

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
    border-radius:12px;
    padding:22px;
    text-align:right;
  "
>


<div
  style="
    color:#555;
    font-size:15px;
  "
>

Grand Total

</div>


<div
  style="
    margin-top:5px;
    font-size:30px;
    font-weight:bold;
    color:#ff6b35;
  "
>

₹${grandTotal.toLocaleString("en-IN")}

</div>


</div>


<!-- ADDRESS -->

<h2
  style="
    margin-top:35px;
    color:#111827;
  "
>

📍 Delivery Address

</h2>


<div
  style="
    background:#f8fafc;
    border:1px solid #e5e7eb;
    border-radius:10px;
    padding:20px;
    color:#444;
    line-height:26px;
  "
>

${fullAddress}

</div>


<!-- CUSTOMER DETAILS -->

<div
  style="
    margin-top:25px;
    color:#555;
    line-height:26px;
    font-size:14px;
  "
>

<strong>Name:</strong>
${userName || "N/A"}

<br>

<strong>Email:</strong>
${userEmail}

<br>

<strong>Phone:</strong>
${userNumber || "N/A"}

</div>


</td>

</tr>


<!-- FOOTER -->

<tr>

<td
  align="center"
  style="
    background:#111827;
    padding:30px;
  "
>


<h2
  style="
    margin:0;
    color:#ffffff;
  "
>

🔥 Vivid Flame

</h2>


<p
  style="
    margin-top:10px;
    color:#cbd5e1;
    font-size:14px;
  "
>

Thank you for shopping with Vivid Flame.

</p>


<p
  style="
    margin-top:15px;
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

    console.log(
      `✅ Order email sent to user: ${userEmail}`
    );

    return true;

  } catch (error) {

    console.error(
      "❌ Order email error:",
      error.message
    );

    throw error;
  }
}