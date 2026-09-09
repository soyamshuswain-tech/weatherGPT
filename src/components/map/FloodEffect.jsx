import React from 'react';

export default function FloodEffect({ intensity }) {
  const waveSpeed1 = intensity === 'high' ? '4s' : intensity === 'moderate' ? '7s' : '12s';
  const waveSpeed2 = intensity === 'high' ? '5s' : intensity === 'moderate' ? '9s' : '15s';
  
  return (
    <div className="absolute inset-0 overflow-hidden rounded-full">
      {/* Base water tint */}
      <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
      
      {/* Layer 1 Waves */}
      <div 
        className="effect-flood-wave" 
        style={{ animationDuration: waveSpeed1 }}
      ></div>
      
      {/* Layer 2 Waves (offset and reverse) */}
      <div 
        className="effect-flood-wave" 
        style={{ 
          animationDirection: 'reverse', 
          animationDuration: waveSpeed2, 
          opacity: 0.4,
          bottom: '-20%'
        }}
      ></div>
    </div>
  );
}
