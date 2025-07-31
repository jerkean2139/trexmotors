import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function takeScreenshots() {
  console.log('Starting screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection'
    ],
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  // Create screenshots directory
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  
  try {
    // Wait for server to be ready
    console.log('Waiting for server...');
    await page.goto('http://localhost:5000/admin', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Login screen
    console.log('Taking login screenshot...');
    await page.screenshot({ 
      path: 'screenshots/01-login-screen.png',
      fullPage: false
    });
    
    // Login with secure admin credentials
    console.log('Logging in...');
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      // Use environment variable for admin password instead of hardcoded value
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      await page.type('input[type="password"]', adminPassword);
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Admin dashboard main view
    console.log('Taking dashboard screenshot...');
    await page.screenshot({ 
      path: 'screenshots/02-admin-dashboard.png',
      fullPage: true
    });
    
    // Highlight Add New Vehicle button
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Add New Vehicle'));
      if (button) {
        button.style.border = '3px solid #ff0000';
        button.style.boxShadow = '0 0 10px #ff0000';
      }
    });
    
    await page.screenshot({ 
      path: 'screenshots/03-add-vehicle-button-highlighted.png',
      fullPage: false
    });
    
    // Click Add New Vehicle to open form
    console.log('Opening Add Vehicle form...');
    const addButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Add New Vehicle'));
    });
    if (addButton) {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(btn => btn.textContent.includes('Add New Vehicle'));
        if (btn) btn.click();
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await page.screenshot({ 
      path: 'screenshots/04-add-vehicle-form.png',
      fullPage: true
    });
    
    // Fill out some sample data to show filled form
    console.log('Filling form with sample data...');
    await page.type('input[id="make"]', 'Toyota');
    await page.type('input[id="model"]', 'Camry');
    await page.type('input[id="year"]', '2020');
    await page.type('input[id="price"]', '18500');
    await page.type('input[id="mileage"]', '45000');
    
    await page.screenshot({ 
      path: 'screenshots/05-form-filled-example.png',
      fullPage: true
    });
    
    // Close the form
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Highlight Mobile Entry button
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Mobile Entry'));
      if (button) {
        button.style.border = '3px solid #ff0000';
        button.style.boxShadow = '0 0 10px #ff0000';
      }
    });
    
    await page.screenshot({ 
      path: 'screenshots/06-mobile-entry-highlighted.png',
      fullPage: false
    });
    
    // Take screenshot of vehicle inventory table
    console.log('Taking inventory table screenshot...');
    await page.screenshot({ 
      path: 'screenshots/07-vehicle-inventory-table.png',
      fullPage: true
    });
    
    // Set mobile viewport to show mobile interface
    console.log('Switching to mobile view...');
    await page.setViewport({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle2' });
    
    await page.screenshot({ 
      path: 'screenshots/08-mobile-admin-view.png',
      fullPage: true
    });
    
    // Click Mobile Entry on mobile
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(btn => btn.textContent.includes('Quick Entry') || btn.textContent.includes('Mobile Entry'));
      if (btn) btn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ 
      path: 'screenshots/09-mobile-form.png',
      fullPage: true
    });
    
    console.log('Screenshots completed successfully!');
    
  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();