import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function getContactTemplate(data: { name: string; email: string; phone: string; message: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
    }
    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .content {
      margin: 20px 0;
    }
    .message-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-top: 5px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      color: #777;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    
    <div class="content">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <div class="message-box">
        ${data.message}
      </div>
    </div>
    
    <div class="footer">
      <p>This is an automated email from your website contact form.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailTemplate = getContactTemplate({ name, email, phone, message });

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'agrodronessales@gmail.com',  
      subject: `New Contact Form Submission from ${name}`,
      html: emailTemplate,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send contact email' },
      { status: 500 }
    );
  }
}