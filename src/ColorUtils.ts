// Simple color utilities without external dependencies
export interface ColorCombination {
  primary: string;
  secondary: string;
  score: number;
  harmonyType: string;
  contrastRatio: number;
}

export interface Palette {
  colors: string[];
  score: number;
  name: string;
}

// Simple HSL color parsing
const parseColor = (color: string): {h: number, s: number, l: number} | null => {
  try {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      if (hex.length === 3) {
        // Expand shorthand hex
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return rgbToHsl(r, g, b);
      } else if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return rgbToHsl(r, g, b);
      }
    }
    
    // Handle RGB format
    if (color.startsWith('rgb')) {
      const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return rgbToHsl(r, g, b);
      }
    }
    
    // Handle HSL format
    if (color.startsWith('hsl')) {
      const match = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
      if (match) {
        return {
          h: parseInt(match[1]),
          s: parseInt(match[2]),
          l: parseInt(match[3])
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing color:', error);
    return null;
  }
};

// RGB to HSL conversion
const rgbToHsl = (r: number, g: number, b: number): {h: number, s: number, l: number} => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = 0; // achromatic
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    // Make sure h is defined
    if (h === undefined) {
      h = 0;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Calculate simple color similarity (0-100)
const calculateColorSimilarity = (color1: string, color2: string): number => {
  const hsl1 = parseColor(color1);
  const hsl2 = parseColor(color2);
  
  if (!hsl1 || !hsl2) {
    return 0; // If we can't parse colors, assume they're very different
  }
  
  // Calculate difference in hue (considering circular nature of hue wheel)
  let hueDiff = Math.abs(hsl1.h - hsl2.h);
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff;
  }
  
  // Calculate difference in saturation and lightness
  const satDiff = Math.abs(hsl1.s - hsl2.s);
  const lightDiff = Math.abs(hsl1.l - hsl2.l);
  
  // Combine differences (normalize to 0-100 range)
  const hueScore = Math.max(0, 100 - hueDiff);
  const satScore = Math.max(0, 100 - satDiff);
  const lightScore = Math.max(0, 100 - lightDiff);
  
  // Weighted average: hue is more important for color similarity
  const similarity = (hueScore * 0.5 + satScore * 0.2 + lightScore * 0.3);
  
  return Math.round(similarity);
};

// Calculate contrast ratio (simplified)
const calculateContrastRatio = (color1: string, color2: string): number => {
  // For simplicity, check if one is black and the other is white
  if ((color1 === '#000000' && color2 === '#FFFFFF') || 
      (color1 === '#FFFFFF' && color2 === '#000000')) {
    return 21;
  }
  
  // For other cases, a simple heuristic
  const hsl1 = parseColor(color1);
  const hsl2 = parseColor(color2);
  
  if (!hsl1 || !hsl2) {
    return 1;
  }
  
  // The higher the difference in lightness, the better the contrast
  const lightnessDiff = Math.abs(hsl1.l - hsl2.l);
  
  // Normalize to a contrast ratio between 1 and 21
  const ratio = 1 + (lightnessDiff / 100) * 20;
  
  return Math.min(21, Math.max(1, ratio));
};

export const calculateColorScore = (color1: string, color2: string): ColorCombination => {
  try {
    const score = calculateColorSimilarity(color1, color2);
    
    // Determine harmony type based on similarity
    let harmonyType = 'Neutral';
    if (score > 90) harmonyType = 'Identical';
    else if (score > 75) harmonyType = 'Same Hue';
    else if (score > 50) harmonyType = 'Analogous';
    else if (score > 30) harmonyType = 'Complementary';
    else if (score > 10) harmonyType = 'Near Complementary';
    else harmonyType = 'Very Different';
    
    const contrastRatio = calculateContrastRatio(color1, color2);
    
    return {
      primary: color1,
      secondary: color2,
      score,
      harmonyType,
      contrastRatio
    };
  } catch (error) {
    console.error('Error calculating color score:', error);
    console.log('Color 1:', color1, 'Color 2:', color2);
    return {
      primary: color1,
      secondary: color2,
      score: 50,
      harmonyType: 'Unknown',
      contrastRatio: 1
    };
  }
};

export const generateColorPalette = (baseColor: string, count: number = 5): string[] => {
  try {
    // Generate a simple palette using variations of the base color
    const baseHsl = parseColor(baseColor);
    
    if (!baseHsl) {
      return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    }
    
    const palette = [baseColor];
    
    // Generate variations
    for (let i = 1; i < count; i++) {
      // Vary hue, saturation, and lightness
      const hue = (baseHsl.h + (i * 60)) % 360;
      const saturation = Math.min(100, Math.max(0, baseHsl.s + (Math.random() * 20 - 10)));
      const lightness = Math.min(100, Math.max(0, baseHsl.l + (Math.random() * 20 - 10)));
      
      // Convert back to hex string
      const hex = hslToHex(hue, saturation, lightness);
      palette.push(hex);
    }
    
    return palette;
  } catch (error) {
    console.error('Error generating color palette:', error);
    console.log('Base color causing issue:', baseColor);
    // Return a default set of colors
    return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  }
};

// HSL to Hex conversion (simplified)
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`;
};