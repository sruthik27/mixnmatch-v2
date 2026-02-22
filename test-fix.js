// Debug file to test our color calculations
const Color = require('colorjs.io');

console.log("Testing colorjs.io...");
try {
  // Test creating colors
  const color1 = new Color.Color('#FF0000');
  console.log('Color 1:', color1);
  console.log('Color 1 HSL:', color1.hsl);
  console.log('Color 1 luminance:', color1.luminance);
  
  const color2 = new Color.Color('#00FF00');
  console.log('Color 2:', color2);
  console.log('Color 2 HSL:', color2.hsl);
  console.log('Color 2 luminance:', color2.luminance);
  
  const deltaE = color1.deltaE(color2, {method: 'CIE2000'});
  console.log('Delta E:', deltaE);
  
  // Test some basic harmony detection
  const hue1 = color1.hsl[0];
  const hue2 = color2.hsl[0];
  console.log('Hue 1:', hue1, 'Hue 2:', hue2);
  
  let hueDiff = Math.abs(hue1 - hue2);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  console.log('Hue difference:', hueDiff);
  
  // Test palette generation
  const palette = [];
  for (let i = 0; i < 5; i++) {
    const hue = (color1.hsl[0] + (i * 30)) % 360;
    const saturation = Math.min(100, color1.hsl[1] + (Math.random() * 20 - 10));
    const lightness = Math.min(100, Math.max(0, color1.hsl[2] + (Math.random() * 20 - 10)));
    
    const newColor = new Color.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    console.log(`Color ${i}:`, newColor.toString());
    palette.push(newColor.toString());
  }
  
  console.log('Palette:', palette);
  
} catch (error) {
  console.error('Error in test:', error);
}