export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, message) are required.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Log the form submission (you can see this in Vercel function logs)
    console.log('New contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    // Send email notification if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.BUSINESS_EMAIL) {
      try {
        await sendEmailNotification({ name, email, message });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

// Email sending function (optional - requires environment variables)
async function sendEmailNotification({ name, email, message }) {
  // Dynamic import for nodemailer (install: npm install nodemailer)
  const nodemailer = await import('nodemailer');
  
  const transporter = nodemailer.default.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.BUSINESS_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
    `,
    replyTo: email
  };

  await transporter.sendMail(mailOptions);
  console.log('Email notification sent successfully');
} 