import React from 'react';
import { User, Umbrella, Home, Zap, Waves, Wind } from 'lucide-react';

export default function SafetyAvatar({ layers }) {
  // Priority: Cyclone > Flood > Lightning > Rainfall
  let currentAction = null;
  let title = "Safety Status";

  if (layers.cyclone) {
    currentAction = 'cyclone';
    title = "Stay Indoors (Strong Winds)";
  } else if (layers.flood) {
    currentAction = 'flood';
    title = "Move to Higher Ground";
  } else if (layers.lightning) {
    currentAction = 'lightning';
    title = "Avoid Open Areas";
  } else if (layers.rainfall) {
    currentAction = 'rain';
    title = "Carry an Umbrella";
  } else {
    return null; // Don't render if no layers are active
  }

  return (
    <div className="absolute top-72 right-4 z-[1000] bg-navy-900/90 backdrop-blur-md p-4 rounded-xl border border-glass-border shadow-2xl w-72 overflow-hidden animate-in fade-in slide-in-from-right-4">
      <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 text-center border-b border-glass-border pb-2">
        {title}
      </h3>
      
      <div className="relative h-24 flex items-center justify-center bg-navy-800/50 rounded-lg overflow-hidden border border-glass-border">
        
        {currentAction === 'rain' && (
          <div className="flex flex-col items-center avatar-walk relative">
            <Umbrella size={32} className="text-blue-400 absolute -top-4 -right-2 transform rotate-12" />
            <User size={40} className="text-gray-300" />
            {/* Small ground shadow */}
            <div className="w-8 h-1 bg-black/30 rounded-full mt-1"></div>
          </div>
        )}

        {currentAction === 'lightning' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <Home size={64} className="text-gray-400" />
            <User size={24} className="text-gray-300 absolute bottom-4 left-1/2 transform -translate-x-1/2" />
            
            {/* Flashing lightning outside */}
            <Zap size={32} className="text-yellow-400 absolute top-2 right-4 avatar-flash" fill="currentColor" />
            <Zap size={24} className="text-yellow-400 absolute top-4 left-4 avatar-flash" style={{ animationDelay: '1s' }} fill="currentColor" />
          </div>
        )}

        {currentAction === 'flood' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <User size={40} className="text-gray-300 absolute bottom-6" />
            
            {/* Animated water waves covering the bottom of the user */}
            <div className="absolute bottom-0 left-0 w-[200%] h-8 bg-blue-500/40 flex avatar-wave">
               <div className="absolute top-0 left-0 w-full flex text-blue-400">
                  <Waves size={32} />
                  <Waves size={32} />
                  <Waves size={32} />
                  <Waves size={32} />
                  <Waves size={32} />
               </div>
            </div>
          </div>
        )}

        {currentAction === 'cyclone' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="avatar-sway">
              <User size={40} className="text-gray-300 transform -rotate-12" />
            </div>
            
            {/* Flying wind elements */}
            <Wind size={24} className="text-gray-400 absolute top-4 avatar-wind" />
            <Wind size={32} className="text-gray-500 absolute bottom-4 avatar-wind" style={{ animationDelay: '0.5s' }} />
          </div>
        )}

      </div>
    </div>
  );
}
