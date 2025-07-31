import nodemailer from 'nodemailer';
import type { Inquiry, CustomerApplication } from '@shared/schema';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const emailConfig = this.getEmailConfig();
    if (emailConfig) {
      this.transporter = nodemailer.createTransport(emailConfig);
      this.isConfigured = true;
      console.log('📧 Email service initialized');
    } else {
      console.warn('⚠️ Email service not configured - set EMAIL_HOST, EMAIL_USER, EMAIL_PASS environment variables');
    }
  }

  private getEmailConfig(): EmailConfig | null {
    const host = process.env.EMAIL_HOST || 'smtpout.secureserver.net'; // Default to GoDaddy
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const port = parseInt(process.env.EMAIL_PORT || '587');

    if (!user || !pass) {
      return null;
    }

    return {
      host,
      port,
      secure: port === 465, // Use TLS for port 587, SSL for port 465
      auth: { user, pass }
    };
  }

  async sendContactNotification(inquiry: Inquiry): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email not configured, skipping contact notification');
      return false;
    }

    try {
      const internalEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
      const customerEmail = inquiry.email;

      // Send notification to internal team
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: internalEmail,
        subject: '🚗 New Contact Form Submission - T-Rex Motors',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #37ca37;">New Contact Form Submission</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${inquiry.firstName} ${inquiry.lastName}</p>
              <p><strong>Email:</strong> ${inquiry.email}</p>
              <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Message</h3>
              <p>${inquiry.message}</p>
            </div>
            
            ${inquiry.vehicleId ? `
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Vehicle Interest</h3>
              <p><strong>Vehicle ID:</strong> ${inquiry.vehicleId}</p>
              <p>Customer is interested in a specific vehicle</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 20px; background: #37ca37; color: white; border-radius: 8px;">
              <h3>Next Steps</h3>
              <p>• Follow up with customer within 2 hours</p>
              <p>• Check admin dashboard for full details</p>
              <p>• Prepare vehicle information if specific interest</p>
            </div>
          </div>
        `
      });

      // Send confirmation to customer
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Thank You for Contacting T-Rex Motors',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #37ca37;">Thank You, ${inquiry.firstName}!</h2>
            
            <p>We received your message and will get back to you within 2 business hours.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Message</h3>
              <p>${inquiry.message}</p>
            </div>
            
            <div style="background: #37ca37; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>T-Rex Motors Contact Information</h3>
              <p><strong>Phone:</strong> (765) 238-2887</p>
              <p><strong>Address:</strong> 1300 South 9th Street, Richmond, IN 47374</p>
              <p><strong>Hours:</strong> Monday-Saturday 9AM-6PM</p>
            </div>
            
            <p>Thank you for choosing T-Rex Motors!</p>
          </div>
        `
      });

      console.log('📧 Contact notification emails sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send contact notification:', error);
      return false;
    }
  }

  async sendApplicationNotification(application: CustomerApplication): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email not configured, skipping application notification');
      return false;
    }

    try {
      const internalEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
      const customerEmail = application.borrowerEmail;

      // Send notification to internal team
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: internalEmail,
        subject: '💰 New Financing Application - T-Rex Motors',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #37ca37;">New Financing Application</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Applicant Information</h3>
              <p><strong>Name:</strong> ${application.borrowerFirstName} ${application.borrowerLastName}</p>
              <p><strong>Email:</strong> ${application.borrowerEmail}</p>
              <p><strong>Phone:</strong> ${application.borrowerPhone}</p>
              <p><strong>Date of Birth:</strong> ${application.borrowerDob || 'Not provided'}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Employment Information</h3>
              <p><strong>Employer:</strong> ${application.employer || 'Not provided'}</p>
              <p><strong>Monthly Income:</strong> $${application.monthlyGrossIncome ? (application.monthlyGrossIncome / 100).toFixed(2) : 'Not provided'}</p>
              <p><strong>Years Employed:</strong> ${application.yearsEmployed || 'Not provided'}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Address Information</h3>
              <p><strong>Address:</strong> ${application.streetAddress || 'Not provided'}</p>
              <p><strong>City:</strong> ${application.city || 'Not provided'}, ${application.state || 'Not provided'} ${application.postalCode || ''}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Application Status</h3>
              <p><strong>Status:</strong> ${application.status}</p>
              <p><strong>Submitted:</strong> ${application.submittedAt ? new Date(application.submittedAt).toLocaleString() : 'Unknown'}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #37ca37; color: white; border-radius: 8px;">
              <h3>Next Steps</h3>
              <p>• Review application in admin dashboard</p>
              <p>• Run credit check if pre-approved</p>
              <p>• Contact customer within 4 hours</p>
              <p>• Prepare financing options</p>
            </div>
          </div>
        `
      });

      // Send confirmation to customer
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Financing Application Received - T-Rex Motors',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #37ca37;">Application Received, ${application.borrowerFirstName}!</h2>
            
            <p>Thank you for submitting your financing application. We're reviewing it now and will contact you within 4 business hours.</p>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>What Happens Next?</h3>
              <p>1. Our financing team reviews your application</p>
              <p>2. We'll contact you with pre-approval details</p>
              <p>3. Visit our lot to select your vehicle</p>
              <p>4. Complete final paperwork and drive away!</p>
            </div>
            
            <div style="background: #37ca37; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>T-Rex Motors Contact Information</h3>
              <p><strong>Phone:</strong> (765) 238-2887</p>
              <p><strong>Address:</strong> 1300 South 9th Street, Richmond, IN 47374</p>
              <p><strong>Financing Hours:</strong> Monday-Friday 9AM-5PM</p>
            </div>
            
            <p>We appreciate your business and look forward to helping you drive away in your perfect vehicle!</p>
          </div>
        `
      });

      console.log('📧 Application notification emails sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send application notification:', error);
      return false;
    }
  }

  async testEmailConfiguration(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('📧 Email configuration test passed');
      return true;
    } catch (error) {
      console.error('❌ Email configuration test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();