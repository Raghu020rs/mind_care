// backend/src/utils/emailService.ts
import nodemailer, { Transporter } from 'nodemailer';

export const sendBookingEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email credentials not configured - skipping email');
      return;
    }

    const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw - just log, so booking doesn't fail
  }
};