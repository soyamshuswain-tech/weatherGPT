import React from 'react';

export default function CycloneEffect({ intensity }) {
  const rotationSpeed = intensity === 'high' ? '2s' : intensity === 'moderate' ? '4s' : '8s';
  const pulseSpeed = intensity === 'high' ? '2s' : '4s';

  return (
    <div 
      className="absolute inset-0 effect-cyclone-container flex items-center justify-center"
      style={{ animationDuration: pulseSpeed }}
    >
      {/* Outer spiral bands */}
      <div 
        className="effect-cyclone-band" 
        style={{ animationDuration: rotationSpeed }}
      ></div>
      
      {/* Inner fast bands */}
      <div 
        className="effect-cyclone-band" 
        style={{ 
          animationDuration: intensity === 'high' ? '1.5s' : '3s', 
          animationDirection: 'reverse',
          transform: 'scale(0.6)',
          opacity: 0.7
        }}
      ></div>

      {/* The Eye */}
      <div className="effect-cyclone-eye"></div>
    </div>
  );
}
