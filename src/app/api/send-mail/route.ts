import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

// Add CartItem interface at the top
interface CartItem {
  name: string;
  quantity: number;
  description: string;
  type: string;
}

function getEmailTemplate(orderItemsHtml: string, customerDetails: {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgroDrone Tech - Order Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #e8f5e9;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,100,0,0.15);
            padding: 30px;
            margin: 20px auto;
            border-top: 5px solid #2e7d32;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #c8e6c9;
        }
        .header img {
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #2e7d32;
            font-size: 28px;
            margin: 0;
            padding: 0;
        }
        .order-details {
            margin-bottom: 30px;
            background-color: #f1f8e9;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #4caf50;
        }
        .section-title {
            color: #2e7d32;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #c8e6c9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #ffffff;
            border-radius: 4px;
            overflow: hidden;
        }
        th {
            background-color: #2e7d32;
            color: #ffffff;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e8f5e9;
        }
        tr:hover {
            background-color: #f1f8e9;
        }
        .customer-details {
            margin-top: 30px;
            padding: 20px;
            background-color: #f1f8e9;
            border-radius: 6px;
            border-left: 4px solid #4caf50;
        }
        .customer-details p {
            margin: 8px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #c8e6c9;
            text-align: center;
            color: #558b2f;
        }
        .contact-support {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px dashed #4caf50;
        }
        .highlight {
            color: #2e7d32;
            font-weight: 600;
        }
        .btn {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 10px;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #2e7d32;
        }
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 15px;
            }
            table {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://i.imghippo.com/files/xiqf9667dYQ.png" alt="AgroDrone Tech Logo">
            <h1>Order Confirmation</h1>
            <p>Thank you for choosing AgroDrone Tech!</p>
        </div>

        <div class="order-details">
            <h2 class="section-title">Order Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
            </table>
            
            <a href="#" class="btn">Track Your Order</a>
        </div>

        <div class="customer-details">
            <h2 class="section-title">Delivery Details</h2>
            <p><strong>Name:</strong> <span class="highlight">${customerDetails.name}</span></p>
            <p><strong>Phone:</strong> ${customerDetails.phone}</p>
            <p><strong>Email:</strong> ${customerDetails.email}</p>
            <p><strong>Address:</strong> ${customerDetails.address}</p>
            <p><strong>City:</strong> ${customerDetails.city}</p>
            <p><strong>State:</strong> ${customerDetails.state}</p>
            <p><strong>Pincode:</strong> ${customerDetails.pincode}</p>
        </div>

        <div class="contact-support">
            <p>🌱 Need help with your order?</p>
            <p>Our customer support team is available 24/7 to assist you.</p>
            <p>Email: <span class="highlight">agrodronessales@gmail.com</span> | Phone: <span class="highlight">+91 9347027509</span></p>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>© 2024 AgroDrone Tech. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);
    const { cart, customerDetails } = data;

    // Add type annotation to item parameter
    const orderItemsHtml = cart.map((item: CartItem) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.description}</td>
        <td>${item.type}</td>
      </tr>
    `).join('');

    const emailTemplate = getEmailTemplate(orderItemsHtml, customerDetails);

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: customerDetails.email,
      cc: process.env.ADMIN_EMAIL,  
      subject: 'Order Confirmation - AgroDrone Tech',
      html: emailTemplate,
    });

    return NextResponse.json({ message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
