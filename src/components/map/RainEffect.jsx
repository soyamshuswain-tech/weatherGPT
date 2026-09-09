import React from 'react';

export default function RainEffect({ intensity }) {
  // Determine number of particles based on intensity
  const particleCount = intensity === 'high' ? 400 : intensity === 'moderate' ? 200 : 100;

  return (
    <g>
      {Array.from({ length: particleCount }).map((_, i) => {
        // Randomize speed, delay, and position for realistic effect
        const speed = intensity === 'high' ? 0.6 : 0.8;
        const duration = speed + Math.random() * 0.4;
        const delay = Math.random() * 2;
        
        // Coordinates in 0-100 viewBox
        const x = Math.random() * 150 - 25; // spread wider to account for angle
        const y = Math.random() * -100; // start anywhere above the 0-100 box
        
        // Add occasional heavier streaks
        const isHeavyStreak = Math.random() > 0.85;
        const opacity = isHeavyStreak ? 0.7 : 0.3 + Math.random() * 0.3;
        const strokeWidth = isHeavyStreak ? 0.4 : 0.15; // thin lines in the 0-100 SVG space
        const length = isHeavyStreak ? 12 : 6;

        return (
          <line 
            key={i} 
            className="effect-rain-drop-svg"
            x1={x}
            y1={y}
            x2={x - (length * 0.17)} // slight angle corresponding to the fall animation
            y2={y + length}
            stroke="white"
            strokeWidth={strokeWidth}
            opacity={opacity}
            style={{ 
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }} 
          />
        );
      })}
    </g>
  );
}
