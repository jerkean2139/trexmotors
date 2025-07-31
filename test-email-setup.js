// Quick test to verify email configuration once credentials are added
const nodemailer = require('nodemailer');

async function testEmailSetup() {
  console.log('🧪 Testing T-Rex Motors email configuration...');
  
  const config = {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'info1@trexmotors.com',
      pass: process.env.EMAIL_PASS || 'NOT_SET'
    }
  };
  
  console.log('📧 Email config:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    hasPassword: config.auth.pass !== 'NOT_SET'
  });

  if (config.auth.pass === 'NOT_SET') {
    console.log('❌ EMAIL_PASS not configured. Add it to Replit Secrets.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransporter(config);
    await transporter.verify();
    console.log('✅ Email configuration test PASSED');
    console.log('📧 Ready to send notifications to customers and internal team');
    return true;
  } catch (error) {
    console.log('❌ Email configuration test FAILED:', error.message);
    console.log('💡 Check your password or try an app-specific password for Office 365');
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testEmailSetup();
}

module.exports = { testEmailSetup };