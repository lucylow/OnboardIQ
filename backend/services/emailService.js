const nodemailer = require('nodemailer');
const { mockEmailService } = require('../mockApi');

// Use mock service if no email credentials are provided
const useMock = !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD;

// Create email transporter
const transporter = useMock ? null : nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailService {
  // Send welcome email with attached document
  static async sendWelcomeEmail(user, documentUrl) {
    if (useMock) {
      return mockEmailService.sendWelcomeEmail(user, documentUrl);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Welcome to ${user.companyName}! Your Onboarding Package`,
      html: `
        <h1>Welcome aboard, ${user.name}!</h1>
        <p>Thank you for choosing ${user.companyName}. We're excited to have you on board with our ${user.planTier} plan.</p>
        <p>Attached to this email, you'll find your personalized welcome package that includes:</p>
        <ul>
          <li>Welcome letter</li>
          <li>Plan details and features</li>
          <li>Next steps to get started</li>
        </ul>
        <p>If you have any questions, don't hesitate to reply to this email.</p>
        <br>
        <p>Best regards,<br>The ${user.companyName} Team</p>
      `,
      attachments: [
        {
          filename: `Welcome_to_${user.companyName}.pdf`,
          path: documentUrl
        }
      ]
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  // Send follow-up email after video session
  static async sendFollowUpEmail(user) {
    if (useMock) {
      return mockEmailService.sendFollowUpEmail(user);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'How is your onboarding going?',
      html: `
        <h1>How's your experience so far?</h1>
        <p>Hi ${user.name},</p>
        <p>We hope you enjoyed your personalized onboarding tour and found the welcome package helpful.</p>
        <p>Is there anything we can help you with as you continue to explore ${user.companyName}?</p>
        <p>Simply reply to this email, and our team will be happy to assist you.</p>
        <br>
        <p>Best regards,<br>The ${user.companyName} Team</p>
      `
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Follow-up email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      throw new Error('Failed to send follow-up email');
    }
  }
}

module.exports = EmailService;
