import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';

// Add CartItem interface at the top
interface CartItem {
  name: string;
  quantity: number;
  description: string;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);
    const { cart, customerDetails } = data;

    // Read email template
    const templatePath = path.join(process.cwd(), 'src/app/api/send-mail/index.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Add type annotation to item parameter
    const orderItemsHtml = cart.map((item: CartItem) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.description}</td>
        <td>${item.type}</td>
      </tr>
    `).join('');

    emailTemplate = emailTemplate
      .replace('{{ORDER_ITEMS}}', orderItemsHtml)
      .replace('{{CUSTOMER_NAME}}', customerDetails.name)
      .replace('{{CUSTOMER_PHONE}}', customerDetails.phone)
      .replace('{{CUSTOMER_EMAIL}}', customerDetails.email)
      .replace('{{CUSTOMER_ADDRESS}}', customerDetails.address)
      .replace('{{CUSTOMER_CITY}}', customerDetails.city)
      .replace('{{CUSTOMER_STATE}}', customerDetails.state)
      .replace('{{CUSTOMER_PINCODE}}', customerDetails.pincode);

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
