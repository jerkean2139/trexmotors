import puppeteer from 'puppeteer';
import fs from 'fs';

async function takeScreenshots() {
  console.log('Taking basic screenshots...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  
  try {
    // Admin login page
    console.log('Screenshot 1: Login page');
    await page.goto('http://localhost:5000/admin', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'screenshots/01-login-screen.png', fullPage: false });
    
    // Login and get dashboard
    console.log('Screenshot 2: Dashboard');
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      // Use environment variable for admin password instead of hardcoded value
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      await page.type('input[type="password"]', adminPassword);
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await page.screenshot({ path: 'screenshots/02-admin-dashboard.png', fullPage: true });
    
    // Mobile view
    console.log('Screenshot 3: Mobile view');
    await page.setViewport({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'screenshots/03-mobile-admin.png', fullPage: true });
    
    console.log('Screenshots completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();