import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ThermometerSun, CloudRain, AlertTriangle, HelpCircle } from 'lucide-react';

const tempTrend = [
  { year: 1980, temp: 26.5 },
  { year: 1990, temp: 26.8 },
  { year: 2000, temp: 27.2 },
  { year: 2010, temp: 27.8 },
  { year: 2020, temp: 28.5 },
  { year: 2030, temp: 29.3, projected: true },
];

const rainTrend = [
  { year: 1980, days: 12 },
  { year: 1990, days: 14 },
  { year: 2000, days: 18 },
  { year: 2010, days: 22 },
  { year: 2020, days: 28 },
  { year: 2030, days: 35, projected: true },
];

export default function ClimateIntelligence() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-white">Climate Intelligence</h1>
        <div className="text-sm text-gray-400 bg-navy-800 px-4 py-2 rounded-lg border border-glass-border">
          Location: <span className="text-white font-medium">Bhubaneswar, Odisha</span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="glass-panel p-6 border-l-4 border-l-purple-500 bg-gradient-to-br from-navy-800 to-navy-900/50 flex flex-col md:flex-row gap-6 items-start">
        <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl flex-shrink-0">
          <HelpCircle size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">AI Climate Analysis</h2>
          <p className="text-gray-300 leading-relaxed">
            "The selected region has experienced an increasing number of extreme rainfall events over the past 4 decades. While average annual rainfall has remained relatively stable, the intensity has concentrated into fewer days, significantly elevating flash flood risks. Average temperatures have risen by ~2.0°C since 1980, exacerbating heatwave frequency during summer months."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Temperature Trend */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ThermometerSun className="text-orange-500" /> Avg Summer Temp Trend
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-navy-900 rounded text-gray-400 border border-glass-border">1980 - 2030</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c2b4d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#16171d', stroke: '#f97316', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-center text-gray-500">
            <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span> Historical Data
            <span className="inline-block w-3 h-3 border-2 border-orange-500 rounded-full border-dashed ml-4 mr-2"></span> 2030 Projection (CMIP6 Model)
          </div>
        </div>

        {/* Extreme Rainfall Events */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CloudRain className="text-blue-500" /> Extreme Rainfall Days (50mm)
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-navy-900 rounded text-gray-400 border border-glass-border">1980 - 2030</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c2b4d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#16171d', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-center text-gray-500">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span> Historical Data
            <span className="inline-block w-3 h-3 border-2 border-blue-500 rounded-full border-dashed ml-4 mr-2"></span> 2030 Projection (CMIP6 Model)
          </div>
        </div>

      </div>

      {/* Risk Indicators */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-white mb-6">Long-term Climate Risk Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IndicatorCard title="Sea Level Rise Impact" value="Moderate" desc="15% coastal land area threatened by 2050" color="border-yellow-500/50" text="text-yellow-400" />
          <IndicatorCard title="Drought Frequency" value="Low" desc="Stable precipitation limits long-term agricultural drought" color="border-green-500/50" text="text-green-400" />
          <IndicatorCard title="Cyclonic Intensity" value="Critical" desc="25% increase in Category 4+ storms projected" color="border-red-500/50" text="text-red-400" />
        </div>
      </div>

    </div>
  );
}

function IndicatorCard({ title, value, desc, color, text }) {
  return (
    <div className={`p-4 rounded-xl bg-navy-800 border-l-4 ${color}`}>
      <div className="text-gray-400 text-sm mb-1">{title}</div>
      <div className={`font-bold text-xl mb-2 ${text}`}>{value}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  );
}
