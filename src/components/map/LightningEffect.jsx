import React from 'react';

export default function LightningEffect({ intensity }) {
  const animationDuration = intensity === 'high' ? '3s' : intensity === 'moderate' ? '6s' : '10s';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Dark storm cloud overlay base */}
      <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply rounded-full"></div>
      
      {/* Flashing element */}
      <div 
        className="effect-lightning-flash rounded-full" 
        style={{ animationDuration }}
      ></div>
    </div>
  );
}
