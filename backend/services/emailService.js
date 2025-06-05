const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configure Nodemailer transporter with your email service details
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'Outlook365', 'SendGrid', etc.
                     // For generic SMTP, use 'host' and 'port' options.
  auth: {
    user: process.env.EMAIL_SERVICE_USER, // Your email address from .env
    pass: process.env.EMAIL_SERVICE_PASS, // Your email password or App Password from .env
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_SERVICE_USER, // Sender address
    to: toEmail, // Recipient address
    subject: 'Your OTP for Authentication System Login', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello!</h2>
        <p>Your One-Time Password (OTP) for logging into the Authentication System is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff; background-color: #f0f0f0; padding: 15px; border-radius: 5px; display: inline-block;">${otp}</p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks,<br/>Auth System Team</p>
      </div>
    `, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${toEmail}:`, error);
    // Important: Depending on your error handling, you might want to re-throw this error
    // to indicate to the calling function that email sending failed.
    throw new Error('Failed to send OTP email. Please check your email configuration.');
  }
};

module.exports = { sendOtpEmail };