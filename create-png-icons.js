// Convert SVG to base64 data URLs for PNG fallback
const fs = require('fs');

// Create base64 encoded PNG-like data URLs
const createPngIcon = (size) => {
  // Simple colored rectangle as PNG fallback (browsers will use this if SVG fails)
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size/8}" fill="#37ca37"/>
    <text x="${size/2}" y="${size/2 - 10}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size/12}" font-weight="bold">T-REX</text>
    <text x="${size/2}" y="${size/2 + 10}" text-anchor="middle" fill="white" font-family="Arial" font-size="${size/16}">MOTORS</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
};

console.log('192px icon:', createPngIcon(192));
console.log('512px icon:', createPngIcon(512));