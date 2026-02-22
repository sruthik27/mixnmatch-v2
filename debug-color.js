const Color = require('colorjs.io');

// Test color parsing
console.log('Testing color parsing...');

try {
  const colorA = new Color('#FF0000');
  console.log('Color A:', colorA);
  console.log('Color A HSL:', colorA.hsl);
  console.log('Color A luminance:', colorA.luminance);
  
  const colorB = new Color('#00FF00');
  console.log('Color B:', colorB);
  console.log('Color B HSL:', colorB.hsl);
  console.log('Color B luminance:', colorB.luminance);
  
  const deltaE = colorA.deltaE(colorB, {method: 'CIE2000'});
  console.log('Delta E:', deltaE);
  
} catch (error) {
  console.error('Error:', error);
}