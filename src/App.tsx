import React, { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import './App.css';
import { calculateColorScore, generateColorPalette, ColorCombination } from './ColorUtils';

function App() {
  const [primaryColor, setPrimaryColor] = useState('#aabbcc');
  const [secondaryColor, setSecondaryColor] = useState('#123456');
  const [colorCombination, setColorCombination] = useState<ColorCombination>({
    primary: '#aabbcc',
    secondary: '#123456',
    score: 0,
    harmonyType: 'Neutral',
    contrastRatio: 1
  });
  const [palette, setPalette] = useState<string[]>([]);

  // Handle color changes and recalculate score
  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
    const combination = calculateColorScore(color, secondaryColor);
    setColorCombination(combination);
  };

  const handleSecondaryColorChange = (color: string) => {
    setSecondaryColor(color);
    const combination = calculateColorScore(primaryColor, color);
    setColorCombination(combination);
  };

  // Generate a palette based on the primary color
  const generatePalette = useCallback(() => {
    const newPalette = generateColorPalette(primaryColor);
    setPalette(newPalette);
  }, [primaryColor]);

  // Initialize palette on first load
  React.useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mixnmatch - Color Matching Tool</h1>
        <p>Choose colors, experiment with combinations, and find the perfect matches</p>
        
        <div className="color-picker-container">
          <div className="color-pair">
            <div className="color-display">
              <h3>Primary Color</h3>
              <div 
                className="color-preview"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <HexColorPicker color={primaryColor} onChange={handlePrimaryColorChange} />
            </div>
            
            <div className="color-display">
              <h3>Secondary Color</h3>
              <div 
                className="color-preview"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <HexColorPicker color={secondaryColor} onChange={handleSecondaryColorChange} />
            </div>
          </div>
          
          <div className="color-scoring">
            <h3>Color Combination Score</h3>
            <div className="score-display">
              <span className="score-value">{colorCombination.score}</span>
              <span className="score-label">/ 100</span>
            </div>
            <div className="harmony-info">
              <p><strong>Harmony Type:</strong> {colorCombination.harmonyType}</p>
              <p><strong>Contrast Ratio:</strong> {colorCombination.contrastRatio}:1</p>
            </div>
          </div>
          
          <div className="palette-section">
            <h3>Generated Palette</h3>
            <button onClick={generatePalette} className="generate-palette-btn">
              Generate New Palette
            </button>
            <div className="palette-display">
              {palette.map((color, index) => (
                <div 
                  key={index} 
                  className="palette-color"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
