import { useState } from 'react';
import { Sliders, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';

export default function Simulator() {
  const [rain, setRain] = useState(0);
  const [temp, setTemp] = useState(0);
  const [wind, setWind] = useState(0);

  // Calculate simulated risks
  const baseFloodRisk = 45;
  const baseCropRisk = 30;
  const baseInfraRisk = 20;

  const simFloodRisk = Math.min(100, baseFloodRisk + rain * 0.8 + temp * 2);
  const simCropRisk = Math.min(100, baseCropRisk + Math.abs(rain) * 0.5 + Math.abs(temp) * 3 + wind * 0.2);
  const simInfraRisk = Math.min(100, baseInfraRisk + wind * 0.9 + rain * 0.3);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3">
          <Sliders className="text-accent-blue" size={32} /> Weather Scenario Simulator
        </h1>
        <p className="text-gray-400">Modify weather variables to understand potential future impacts on your region.</p>
        <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-sm font-bold rounded-full">
          ⚠️ Scenario Simulation — Not a Real-Time Forecast
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="glass-panel p-6 space-y-8">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-glass-border pb-2">Adjust Variables</h2>
          
          <SliderControl 
            icon={Droplets} 
            title="Rainfall Anomaly (%)" 
            value={rain} 
            setValue={setRain} 
            min={-50} 
            max={200} 
            step={10} 
            color="text-blue-400" 
          />
          
          <SliderControl 
            icon={Thermometer} 
            title="Temperature Anomaly (°C)" 
            value={temp} 
            setValue={setTemp} 
            min={-5} 
            max={10} 
            step={1} 
            color="text-orange-400" 
          />
          
          <SliderControl 
            icon={Wind} 
            title="Cyclone Wind Speed Anomaly (%)" 
            value={wind} 
            setValue={setWind} 
            min={0} 
            max={100} 
            step={10} 
            color="text-gray-300" 
          />
          
          <div className="pt-4 flex justify-between">
            <button 
              onClick={() => { setRain(0); setTemp(0); setWind(0); }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reset Simulation
            </button>
            <button className="px-6 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-bold transition-colors">
              Run Advanced Model
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-glass-border pb-2">Simulated Impact</h2>
          
          <div className="space-y-6">
            <RiskResult title="Flood Risk" current={baseFloodRisk} simulated={simFloodRisk} />
            <RiskResult title="Agriculture / Crop Risk" current={baseCropRisk} simulated={simCropRisk} />
            <RiskResult title="Infrastructure Risk" current={baseInfraRisk} simulated={simInfraRisk} />
          </div>
          
          {(simFloodRisk > 80 || simCropRisk > 80 || simInfraRisk > 80) && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-bold text-sm">Critical Threshold Exceeded</h4>
                <p className="text-gray-300 text-xs mt-1">This simulated scenario would likely trigger mass evacuations and cause severe damage to the local economy.</p>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

function SliderControl({ icon: Icon, title, value, setValue, min, max, step, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icon className={color} size={20} />
          <span className="font-medium text-gray-200">{title}</span>
        </div>
        <span className={`font-bold ${color} bg-navy-900 px-3 py-1 rounded-md border border-glass-border`}>
          {value > 0 ? '+' : ''}{value}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-accent-blue h-2 bg-navy-900 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
        <span>{min}</span>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function RiskResult({ title, current, simulated }) {
  const getLevel = (score) => {
    if (score >= 80) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500' };
    if (score >= 60) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-500' };
    if (score >= 40) return { label: 'MODERATE', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'LOW', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const curr = getLevel(current);
  const sim = getLevel(simulated);
  const diff = Math.round(simulated - current);

  return (
    <div className="bg-navy-800 rounded-xl p-4 border border-glass-border">
      <h3 className="font-medium text-gray-300 mb-3">{title}</h3>
      
      <div className="flex items-center gap-4">
        {/* Current */}
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-xl font-bold text-gray-400">{current}</span>
            <span className={`text-[10px] font-bold ${curr.color}`}>{curr.label}</span>
          </div>
          <div className="w-full bg-navy-900 h-1.5 rounded-full">
            <div className={`h-full rounded-full ${curr.bg} opacity-50`} style={{ width: `${current}%` }}></div>
          </div>
        </div>
        
        <div className="px-2 text-gray-600 font-bold">→</div>
        
        {/* Simulated */}
        <div className="flex-1">
          <div className="text-xs text-accent-blue mb-1 font-bold">Simulated</div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-2xl font-bold text-white">{Math.round(simulated)}</span>
            <span className={`text-[10px] font-bold ${sim.color}`}>{sim.label}</span>
          </div>
          <div className="w-full bg-navy-900 h-1.5 rounded-full relative">
            <div className={`h-full rounded-full ${sim.bg} transition-all duration-500`} style={{ width: `${simulated}%` }}></div>
            {diff > 0 && (
              <div className="absolute top-0 h-full rounded-r-full bg-white/30 animate-pulse" style={{ left: `${current}%`, width: `${diff}%` }}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
