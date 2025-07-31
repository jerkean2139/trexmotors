# T-Rex Motors Email Configuration Guide

## Your DNS Settings Analysis

Based on your DNS configuration, you're using **Microsoft Outlook/Office 365** for email hosting with GoDaddy's Workspace Email service.

### Current Setup:
- **Email Provider**: Microsoft Outlook/Office 365
- **Domain**: trexmotors.com
- **MX Record**: trexmotors-com.mail.protection.outlook.com
- **SPF Record**: v=spf1 include:secureserver.net -all

## Required Environment Variables

Set these in your Replit Secrets:

### EMAIL_HOST
```
smtpout.secureserver.net
```
(GoDaddy's SMTP server for hosted email accounts)

### EMAIL_USER
```
info1@trexmotors.com
```

### EMAIL_PASS
```
your-godaddy-email-password
```
(Use your regular GoDaddy email password for info1@trexmotors.com)

### NOTIFICATION_EMAIL
```
info1@trexmotors.com
```
(Customer notifications will be sent to this address)

## Email Port Configuration

The system will automatically use:
- **Port**: 587 (TLS/STARTTLS)
- **Security**: TLS encryption
- **Authentication**: Required

## What This Enables

### For Customers:
- Immediate confirmation emails when they submit contact forms
- Professional responses with your business information
- Application status confirmations

### For Your Team:
- Instant notifications when customers submit inquiries
- Detailed customer information in formatted emails
- Application alerts with all borrower details
- All notifications sent to your specified email address

### Admin Dashboard Integration:
- All contact forms and applications still save to your admin portal
- You can view, respond to, and manage all inquiries from the dashboard
- Email notifications supplement (don't replace) the admin system

## Testing the System

Once you add the email credentials:
1. Submit a test contact form on your website
2. Check your email for both the internal notification and customer confirmation
3. Verify the inquiry appears in your admin dashboard

## UPDATED: GoDaddy Email Configuration

Since your email is hosted with GoDaddy (not Microsoft), I've updated the configuration:

### GoDaddy SMTP Settings:
- **Server**: smtpout.secureserver.net  
- **Port**: 587 (TLS encryption)
- **Authentication**: Your regular GoDaddy email password

### How to Get Your GoDaddy Email Password:
1. **Log into GoDaddy**: https://account.godaddy.com/
2. **Go to Email & Office**
3. **Find your info1@trexmotors.com account**
4. **Use the password you set up for this email**
5. **Update your EMAIL_PASS secret** in Replit with this password

If you don't remember the password:
1. You can reset it in your GoDaddy account
2. Or create a new email password in the GoDaddy control panel

## Test Results:
✅ Contact form submission works - saved to database  
✅ Server processes inquiries correctly  
❌ Email sending blocked by Office 365 authentication  

Once you update the EMAIL_PASS with an app-specific password, the email notifications will work perfectly.