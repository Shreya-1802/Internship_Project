const fs = require('fs');
const { createCanvas } = require('canvas');

function drawLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background Circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fillStyle = '#2196f3';
  ctx.fill();
  
  // Scale everything based on size
  const scale = size / 32;
  
  // Graduation Cap
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(16 * scale, 6 * scale);
  ctx.lineTo(4 * scale, 12 * scale);
  ctx.lineTo(16 * scale, 18 * scale);
  ctx.lineTo(28 * scale, 12 * scale);
  ctx.closePath();
  ctx.fill();
  
  // Cap String
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(10 * scale, 14.5 * scale);
  ctx.lineTo(10 * scale, 20.5 * scale);
  ctx.bezierCurveTo(10 * scale, 22.5 * scale, 16 * scale, 24.5 * scale, 16 * scale, 24.5 * scale);
  ctx.bezierCurveTo(16 * scale, 24.5 * scale, 22 * scale, 22.5 * scale, 22 * scale, 20.5 * scale);
  ctx.lineTo(22 * scale, 14.5 * scale);
  ctx.stroke();
  
  // Star
  ctx.fillStyle = '#f50057';
  ctx.beginPath();
  ctx.moveTo(16 * scale, 11 * scale);
  ctx.lineTo(17.5 * scale, 14 * scale);
  ctx.lineTo(20.5 * scale, 14 * scale);
  ctx.lineTo(18 * scale, 16 * scale);
  ctx.lineTo(19 * scale, 19 * scale);
  ctx.lineTo(16 * scale, 17.5 * scale);
  ctx.lineTo(13 * scale, 19 * scale);
  ctx.lineTo(14 * scale, 16 * scale);
  ctx.lineTo(11.5 * scale, 14 * scale);
  ctx.lineTo(14.5 * scale, 14 * scale);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toBuffer('image/png');
}

// Generate different sizes
const sizes = [16, 32, 64, 192, 512];
sizes.forEach(size => {
  const buffer = drawLogo(size);
  if (size <= 64) {
    fs.writeFileSync('favicon.ico', buffer);
  } else {
    fs.writeFileSync(`logo${size}.png`, buffer);
  }
}); 