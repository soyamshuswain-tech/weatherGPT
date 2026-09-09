import React from 'react';
import '../styles/weatherAnimations.css';

export default function DisasterCardEffect({ type }) {
  if (type === 'rainfall') {
    // Generate deterministic rain streak positions & animation parameters
    const drops = [
      { left: '6%', delay: '0.1s', duration: '0.55s', height: '22px', opacity: 0.7 },
      { left: '15%', delay: '0.4s', duration: '0.48s', height: '18px', opacity: 0.5 },
      { left: '23%', delay: '0.2s', duration: '0.62s', height: '26px', opacity: 0.8 },
      { left: '32%', delay: '0.6s', duration: '0.50s', height: '20px', opacity: 0.6 },
      { left: '42%', delay: '0.15s', duration: '0.58s', height: '24px', opacity: 0.75 },
      { left: '50%', delay: '0.5s', duration: '0.45s', height: '19px', opacity: 0.55 },
      { left: '60%', delay: '0.3s', duration: '0.65s', height: '28px', opacity: 0.85 },
      { left: '71%', delay: '0.05s', duration: '0.52s', height: '21px', opacity: 0.65 },
      { left: '80%', delay: '0.45s', duration: '0.47s', height: '25px', opacity: 0.8 },
      { left: '89%', delay: '0.25s', duration: '0.60s', height: '23px', opacity: 0.7 },
      { left: '96%', delay: '0.55s', duration: '0.50s', height: '18px', opacity: 0.5 },
      { left: '10%', delay: '0.7s', duration: '0.63s', height: '24px', opacity: 0.6 },
      { left: '28%', delay: '0.35s', duration: '0.54s', height: '20px', opacity: 0.7 },
      { left: '55%', delay: '0.18s', duration: '0.49s', height: '27px', opacity: 0.85 },
      { left: '75%', delay: '0.62s', duration: '0.57s', height: '22px', opacity: 0.65 },
    ];

    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Ambient storm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-sky-950/20 to-blue-900/30" />
        
        {/* Animated Rain Drops */}
        {drops.map((d, i) => (
          <div
            key={i}
            className="card-rain-streak"
            style={{
              left: d.left,
              animationDelay: d.delay,
              animationDuration: d.duration,
              height: d.height,
              opacity: d.opacity,
            }}
          />
        ))}

        {/* Ground splash mist */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-500/15 via-cyan-500/5 to-transparent card-rain-mist" />
      </div>
    );
  }

  if (type === 'lightning') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Dark electric backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-purple-950/25 to-slate-950/50" />
        
        {/* Thunderstorm Ambient Flash */}
        <div className="card-lightning-bg-flash" />

        {/* Primary Lightning Bolt */}
        <svg
          className="absolute inset-0 w-full h-full card-lightning-bolt-primary"
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 0 L 165 45 L 185 55 L 140 105 L 155 110 L 115 160 L 130 165 L 90 200"
            fill="none"
            stroke="url(#lightningGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lightningGlow)"
          />
          {/* Branch */}
          <path
            d="M 140 105 L 165 130 L 155 155"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#lightningGlow)"
          />
          <defs>
            <linearGradient id="lightningGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <filter id="lightningGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Secondary Lightning Bolt on Right */}
        <svg
          className="absolute inset-0 w-full h-full card-lightning-bolt-secondary"
          viewBox="0 0 300 200"
          preserveAspectRatio="none"
        >
          <path
            d="M 240 0 L 230 35 L 245 42 L 215 85 L 225 90 L 195 140"
            fill="none"
            stroke="#fde047"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Electric Glow Orbs */}
        <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-yellow-400/10 rounded-full blur-2xl card-lightning-glow" />
      </div>
    );
  }

  if (type === 'cyclone') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Deep storm backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-red-950/20 to-slate-950/60" />

        {/* Outer Swirling Vortex Ring */}
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full card-cyclone-spiral" />

        {/* Counter-rotating Wind Layer */}
        <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full card-cyclone-spiral-reverse" />

        {/* Orbiting Wind SVG Streams */}
        <svg
          className="absolute -top-6 -right-6 w-60 h-60 card-cyclone-vortex-svg"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(239, 68, 68, 0.4)"
            strokeWidth="3"
            strokeDasharray="40 180"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="rgba(168, 85, 247, 0.5)"
            strokeWidth="3.5"
            strokeDasharray="60 120"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="rgba(248, 113, 113, 0.6)"
            strokeWidth="3"
            strokeDasharray="50 80"
            strokeLinecap="round"
          />
        </svg>

        {/* Eye of the storm */}
        <div className="absolute top-10 right-10 w-10 h-10 rounded-full bg-red-950/80 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.7)] card-cyclone-eye-pulse flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
        </div>
      </div>
    );
  }

  if (type === 'flood') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Water background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-cyan-950/25 to-transparent" />

        {/* Floating Water Bubbles */}
        <div className="card-flood-bubble bubble-1" />
        <div className="card-flood-bubble bubble-2" />
        <div className="card-flood-bubble bubble-3" />
        <div className="card-flood-bubble bubble-4" />
        <div className="card-flood-bubble bubble-5" />

        {/* Back Wave (slower) */}
        <div className="absolute bottom-0 left-0 w-[200%] h-24 card-wave-back opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,40 C150,90 350,-20 500,40 C650,100 850,-10 1000,40 C1150,90 1300,10 1400,40 L1400,120 L0,120 Z"
              fill="rgba(37, 99, 235, 0.5)"
            />
          </svg>
        </div>

        {/* Front Wave (faster) */}
        <div className="absolute bottom-0 left-0 w-[200%] h-20 card-wave-front opacity-60">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,50 C200,10 300,80 500,50 C700,20 800,80 1000,50 C1150,20 1250,70 1400,50 L1400,120 L0,120 Z"
              fill="rgba(6, 182, 212, 0.45)"
            />
          </svg>
        </div>

        {/* Bottom water base glow */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-blue-600/30 to-transparent" />
      </div>
    );
  }

  return null;
}
