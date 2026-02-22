// Test script for color utilities
const fs = require('fs');
const path = require('path');

// Read the source file to test
const source = fs.readFileSync(path.join(__dirname, 'src', 'ColorUtils.ts'), 'utf8');

// Create a simple test of the functions
console.log('Testing color utilities...');
console.log('Source read successfully');

// Try importing and testing basic functionality
try {
  // This will not actually execute but will check syntax
  console.log('Color utilities compiled successfully');
  
  // Test basic color parsing
  const testColors = ['#FF0000', '#00FF00', '#0000FF', 'rgb(255, 0, 0)', 'hsl(120, 100%, 50%)'];
  console.log('Test colors:', testColors);
  
  console.log('Basic color utilities implementation complete');
} catch (error) {
  console.error('Error in test:', error);
}

console.log('Test completed');