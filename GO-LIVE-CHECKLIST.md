# T-Rex Motors - Go Live Checklist

## Pre-Launch Final Testing & Fixes
1. **Complete final site review and apply any remaining fixes**
2. **Test all forms (contact, financing, inquiries) with real submissions**
3. **Verify all vehicle images load correctly across different devices**
4. **Test 360° virtual showroom on mobile and desktop**
5. **Confirm admin dashboard functions properly for daily operations**

## Domain & DNS Setup
6. **Purchase your custom domain** (e.g., trexmotors.com, trexmotorsrichmond.com)
   - Recommended registrars: Namecheap, GoDaddy, or Google Domains
   
7. **Configure DNS settings** in your domain registrar:
   - Add CNAME record pointing to your Replit deployment URL
   - Set up www redirect if desired
   - Configure any email forwarding (info@yourdomain.com)

## Replit Deployment Configuration
8. **Click "Deploy" button in your Replit project**
9. **Connect your custom domain** in Replit Deployments settings
10. **Enable automatic SSL certificate** (handled by Replit)
11. **Configure environment variables** for production:
    - Verify DATABASE_URL is set
    - Confirm GOOGLE_SERVICE_ACCOUNT_KEY is properly configured
    - Set NODE_ENV=production

## Database & Data Preparation
12. **Run final database cleanup**:
    - Remove any test vehicles or sample data
    - Verify all real vehicle data is properly formatted
    - Confirm all images are loading correctly

13. **Set up database backups** (Replit handles this automatically)
14. **Test database connections** in production environment

## SEO & Search Engine Setup
15. **Submit sitemap** to Google Search Console
16. **Verify Google My Business listing** for T-Rex Motors
17. **Set up Google Analytics** for traffic tracking
18. **Configure Facebook/Instagram business pages** with website link

## Security & Performance
19. **Enable HTTPS** (automatically handled by Replit)
20. **Test website speed** using PageSpeed Insights
21. **Verify mobile responsiveness** across different devices
22. **Set up monitoring** for uptime alerts

## Business Integrations
23. **Configure email notifications** for new inquiries
24. **Set up CARFAX/AutoCheck integrations** if using paid accounts
25. **Test financing calculator** with real loan parameters
26. **Verify phone numbers and addresses** are correct throughout site

## Launch Day Tasks
27. **Update Google My Business** with new website URL
28. **Update social media profiles** with website link
29. **Send announcement** to existing customers
30. **Update business cards/marketing materials** with web address

## Post-Launch Monitoring
31. **Monitor website performance** for first 48 hours
32. **Check Google Analytics** for traffic flow
33. **Test contact forms** to ensure inquiries reach you
34. **Verify mobile functionality** on actual devices

## Staff Training
35. **Train staff on admin dashboard** usage
36. **Create admin login credentials** for authorized personnel
37. **Document daily procedures** for vehicle updates
38. **Set up backup admin accounts** for multiple users

## Marketing & Promotion
39. **Launch social media campaigns** featuring new website
40. **Send website announcement** to local car buying groups
41. **Update vehicle listing sites** (AutoTrader, Cars.com) with web link
42. **Consider Google Ads campaign** for local visibility

---

## Emergency Contacts & Support
- **Replit Support**: Available 24/7 for deployment issues
- **Domain Registrar Support**: For DNS/domain problems
- **Your Developer** (me): For any code fixes or feature additions

## Estimated Timeline
- **Domain setup**: 1-2 hours
- **Replit deployment**: 30 minutes  
- **DNS propagation**: 2-24 hours
- **Testing & verification**: 2-4 hours
- **Staff training**: 1-2 hours

**Total go-live time**: 1-2 days from start to fully operational

---

*Note: Most of these steps are one-time setup. Once live, your daily operations will be simple through the admin dashboard we've built.*