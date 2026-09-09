import React, { useState, useEffect } from 'react';
import { X, CloudRain, Zap, Tornado, Waves, AlertTriangle } from 'lucide-react';
import '../styles/weatherAnimations.css';

export default function FullScreenDisasterSimulation({ type, onClose }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [waterMeters, setWaterMeters] = useState(0.2);

  useEffect(() => {
    // 10 second countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Escape key listener to exit anytime
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // For flood water level meter animation
  useEffect(() => {
    if (type !== 'flood') return;
    const meterInterval = setInterval(() => {
      setWaterMeters((prev) => {
        if (prev >= 3.2) return 3.2;
        return +(prev + 0.15).toFixed(1);
      });
    }, 450);

    return () => clearInterval(meterInterval);
  }, [type]);

  if (!type) return null;

  const getDisasterInfo = () => {
    switch (type) {
      case 'flood':
        return {
          title: 'Flood Inundation Surge Simulation',
          subtitle: 'Rising flood waters reaching 50% street level elevation',
          icon: Waves,
          color: 'text-cyan-400',
          borderColor: 'border-cyan-500/40',
          accent: 'bg-cyan-500',
        };
      case 'rainfall':
        return {
          title: 'Torrential Rainfall Simulation',
          subtitle: 'Intense precipitation storm exceeding 120 mm/hr',
          icon: CloudRain,
          color: 'text-blue-400',
          borderColor: 'border-blue-500/40',
          accent: 'bg-blue-500',
        };
      case 'lightning':
        return {
          title: 'Severe Lightning Storm Simulation',
          subtitle: 'High frequency cloud-to-ground electrical strikes',
          icon: Zap,
          color: 'text-yellow-400',
          borderColor: 'border-yellow-500/40',
          accent: 'bg-yellow-500',
        };
      case 'cyclone':
        return {
          title: 'Tropical Cyclone Category 4 Simulation',
          subtitle: 'Severe cyclonic gale vortex with destructive wind gusts',
          icon: Tornado,
          color: 'text-purple-400',
          borderColor: 'border-purple-500/40',
          accent: 'bg-purple-500',
        };
      default:
        return {
          title: 'Disaster Simulation',
          subtitle: 'Live weather hazard simulation active',
          icon: AlertTriangle,
          color: 'text-white',
          borderColor: 'border-white/20',
          accent: 'bg-white',
        };
    }
  };

  const info = getDisasterInfo();
  const IconComponent = info.icon;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none animate-in fade-in duration-500">
      {/* Floating Control HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[10002] flex items-center gap-4 bg-navy-900/90 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-2xl">
        <div className={`p-2 rounded-full bg-white/10 ${info.color}`}>
          <IconComponent size={22} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm tracking-wide">{info.title}</span>
            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              Live
            </span>
          </div>
          <div className="text-gray-400 text-xs hidden sm:block">{info.subtitle}</div>
        </div>

        {/* Countdown Badge */}
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Duration</span>
            <span className="text-sm font-extrabold text-white font-mono">{timeLeft}s</span>
          </div>

          <button
            onClick={onClose}
            className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors group cursor-pointer"
            title="Close Simulation (Esc)"
          >
            <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. FLOOD FULLSCREEN SIMULATION - WATER GRADUALLY RISES TO 50% */}
      {/* ========================================================= */}
      {type === 'flood' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Ambient flood atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-cyan-950/80 transition-opacity" />

          {/* Water level container rising to 50% over 10 seconds */}
          <div className="absolute bottom-0 left-0 right-0 flood-water-surge">
            {/* Top Wavy Water Surface */}
            <div className="absolute -top-14 left-0 w-[200%] h-20 flood-surface-wave-1 opacity-75">
              <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path
                  d="M0,45 C240,110 480,-10 720,45 C960,100 1200,-10 1440,45 L1440,120 L0,120 Z"
                  fill="rgba(6, 182, 212, 0.6)"
                />
              </svg>
            </div>

            <div className="absolute -top-12 left-0 w-[200%] h-20 flood-surface-wave-2 opacity-60">
              <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path
                  d="M0,60 C300,10 600,90 900,50 C1200,10 1350,80 1440,60 L1440,120 L0,120 Z"
                  fill="rgba(37, 99, 235, 0.7)"
                />
              </svg>
            </div>

            {/* Deep Water Column (Covers up to 50vh) */}
            <div className="w-full h-full bg-gradient-to-b from-cyan-600/50 via-blue-900/80 to-navy-950/95 backdrop-blur-[2px] relative overflow-hidden shadow-[0_-15px_40px_rgba(6,182,212,0.4)]">
              {/* Underwater Caustics & Light Refractions */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent animate-pulse" />

              {/* Rising aquatic bubbles */}
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="fullscreen-bubble"
                  style={{
                    left: `${(i * 4.2 + 2) % 96}%`,
                    animationDuration: `${1.8 + (i % 5) * 0.5}s`,
                    animationDelay: `${(i * 0.35) % 3}s`,
                    width: `${6 + (i % 4) * 4}px`,
                    height: `${6 + (i % 4) * 4}px`,
                  }}
                />
              ))}

              {/* Underwater HUD Indicator */}
              <div className="absolute bottom-8 left-8 bg-navy-950/80 border border-cyan-500/40 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
                <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Waves size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                  Inundation Depth Monitor
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  +{waterMeters}m <span className="text-sm font-normal text-gray-400">/ 50% Viewport Level</span>
                </div>
                <div className="text-xs text-orange-400 mt-1">⚠️ Submersion of low-lying roadways active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. HEAVY RAINFALL FULLSCREEN SIMULATION */}
      {/* ========================================================= */}
      {type === 'rainfall' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark storm sky backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />

          {/* 60+ Fullscreen rain streaks */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="fullscreen-rain-drop"
                style={{
                  left: `${(i * 1.68) % 100}%`,
                  animationDuration: `${0.35 + (i % 4) * 0.08}s`,
                  animationDelay: `${(i * 0.06) % 1}s`,
                  height: `${35 + (i % 5) * 15}px`,
                  opacity: 0.6 + (i % 4) * 0.1,
                }}
              />
            ))}
          </div>

          {/* Heavy ground mist and water splashes */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-blue-500/30 via-cyan-500/10 to-transparent fullscreen-rain-mist" />

          {/* Rainfall Intensity HUD */}
          <div className="absolute bottom-8 left-8 bg-navy-950/80 border border-blue-500/40 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <CloudRain size={14} /> Precipitation Radar
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              135 <span className="text-sm font-normal text-gray-400">mm/hr</span>
            </div>
            <div className="text-xs text-blue-300 mt-1">Extreme downpour • Zero visibility warning</div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. LIGHTNING / THUNDERSTORM FULLSCREEN SIMULATION */}
      {/* ========================================================= */}
      {type === 'lightning' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Ominous purple-black storm sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/60 to-slate-950/90" />

          {/* Fullscreen storm flash overlay */}
          <div className="fullscreen-storm-flash" />

          {/* Giant Branching SVG Lightning Bolts */}
          <svg className="absolute inset-0 w-full h-full fullscreen-lightning-bolt-1" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <path
              d="M 520 0 L 490 140 L 540 160 L 460 320 L 510 340 L 410 520 L 440 540 L 370 700"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#fullLightningGlow)"
            />
            {/* Branch 1 */}
            <path
              d="M 460 320 L 380 410 L 400 470 L 320 560"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#fullLightningGlow)"
            />
            {/* Branch 2 */}
            <path
              d="M 510 340 L 610 420 L 590 480 L 680 560"
              fill="none"
              stroke="#fde047"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#fullLightningGlow)"
            />
            <defs>
              <filter id="fullLightningGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Secondary rapid flash bolt */}
          <svg className="absolute inset-0 w-full h-full fullscreen-lightning-bolt-2" viewBox="0 0 1000 700" preserveAspectRatio="none">
            <path
              d="M 800 0 L 770 120 L 810 140 L 740 280 L 770 300 L 700 480"
              fill="none"
              stroke="#fef08a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Electric Strike HUD */}
          <div className="absolute bottom-8 left-8 bg-navy-950/80 border border-yellow-500/40 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Zap size={14} /> Lightning Strike Sensor
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              38 <span className="text-sm font-normal text-gray-400">strikes / min</span>
            </div>
            <div className="text-xs text-yellow-300 mt-1">Ground strike proximity: 0.8 km • Stay sheltered</div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CYCLONE / TYPHOON FULLSCREEN SIMULATION */}
      {/* ========================================================= */}
      {type === 'cyclone' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Tempest background with purple/red ominous vortex */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-purple-950/60 to-red-950/60" />

          {/* Massive central rotating vortex bands */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full fullscreen-cyclone-core" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full fullscreen-cyclone-core-rev" />

          {/* Flying wind debris / gusts rushing across viewport */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="fullscreen-cyclone-wind-streak"
                style={{
                  top: `${(i * 3.4) % 100}%`,
                  animationDuration: `${0.8 + (i % 4) * 0.3}s`,
                  animationDelay: `${(i * 0.12) % 2}s`,
                  width: `${120 + (i % 5) * 40}px`,
                }}
              />
            ))}
          </div>

          {/* Eye of the Cyclone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-950/90 border-2 border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.9)] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-red-500 animate-ping opacity-75" />
          </div>

          {/* Cyclone Telemetry HUD */}
          <div className="absolute bottom-8 left-8 bg-navy-950/80 border border-purple-500/40 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Tornado size={14} /> Cyclone Vortex Center
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              185 <span className="text-sm font-normal text-gray-400">km/h gusts</span>
            </div>
            <div className="text-xs text-purple-300 mt-1">Central Pressure: 942 hPa • Landfall imminent</div>
          </div>
        </div>
      )}
    </div>
  );
}
