require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to ms
  max: process.env.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/send-confirmation', limiter);

// Email Transporter Configuration (using SSL)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email Endpoint
app.post('/api/send-confirmation', async (req, res) => {
  try {
    const { name, email, doctor, date, time } = req.body;

    // Input Validation
    if (!name || !email || !doctor || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Format date nicely
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send Email
    await transporter.sendMail({
      from: `"Medical Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #4a6fa5; padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center;">
            <h2 style="margin: 0;">Appointment Confirmed!</h2>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${name},</p>
            <p>Your appointment with <strong>Dr. ${doctor}</strong> has been confirmed.</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4a6fa5;">
              <h3 style="margin-top: 0; color: #4a6fa5;">Appointment Details</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
            </div>
            
            <p>Please arrive 15 minutes before your scheduled time.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
              <p>Best regards,</p>
              <p><strong>Medical Clinic Team</strong></p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ 
      success: true, 
      message: 'Confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send confirmation email',
      error: error.message 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email service configured for: ${process.env.EMAIL_USER}`);
});