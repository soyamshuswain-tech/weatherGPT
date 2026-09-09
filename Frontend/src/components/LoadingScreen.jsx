import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-navy-900 flex flex-col items-center justify-center z-[9999] animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-8 animate-pulse">
        <img 
          src="/logo.png" 
          alt="WeatherGPT Loading" 
          className="h-32 w-auto drop-shadow-2xl" 
        />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-accent-blue animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
            Initializing Intelligence...
          </p>
        </div>
      </div>
    </div>
  );
}
