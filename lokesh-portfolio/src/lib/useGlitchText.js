import { useState, useEffect } from 'react';

const GLITCH_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~';

export default function useGlitchText(targetText, speed = 25, steps = 12) {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    if (!targetText) return;
    
    let iteration = 0;
    const originalLength = targetText.length;
    
    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((char, idx) => {
            // Keep spaces intact for readability
            if (char === ' ') return ' ';
            
            // If we have resolved past this index, show original character
            if (idx < iteration) {
              return targetText[idx];
            }
            
            // Otherwise, show a random glitch character
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('');
      });

      if (iteration >= originalLength) {
        clearInterval(interval);
        setDisplayText(targetText); // lock to original
      }
      
      // Advance iteration counter
      iteration += Math.max(1, originalLength / steps);
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [targetText, speed, steps]);

  return displayText;
}
