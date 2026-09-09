import { useState, useEffect } from 'react';
import { getWeather } from '../services/weatherService';
import { CloudRain, Wind, Droplets, Thermometer, Sun, Cloud, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather().then(data => setWeather(data));
  }, []);


  if (!weather) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{weather.location}</h1>
          <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search city..." 
            className="bg-navy-800 border border-glass-border text-white px-4 py-2 rounded-full focus:outline-none focus:border-accent-blue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Current Weather */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-t-accent-blue">
          <div className="flex items-center gap-6">
            <CloudRain size={100} className="text-accent-blue" />
            <div>
              <div className="text-7xl font-bold text-white tracking-tighter">{weather.temperature}°<span className="text-4xl text-gray-400">C</span></div>
              <div className="text-xl font-medium text-accent-blue">{weather.condition}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <MetricItem icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
            <MetricItem icon={Wind} label="Wind" value={`${weather.windSpeed} km/h`} />
            <MetricItem icon={Thermometer} label="Feels Like" value={`${weather.feelsLike}°C`} />
            <MetricItem icon={Eye} label="Visibility" value={`${weather.visibility} km`} />
          </div>
        </div>

        {/* UV & Sun */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-300 mb-4">UV Index</h3>
            <div className="flex items-center gap-4">
              <Sun size={40} className="text-yellow-500" />
              <div>
                <div className="text-3xl font-bold text-white">6.5</div>
                <div className="text-orange-400 font-semibold text-sm">High</div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-glass-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1"><ArrowUp size={14} className="text-yellow-500" /> Sunrise</span>
              <span className="text-white font-medium">05:42 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-1"><ArrowDown size={14} className="text-orange-500" /> Sunset</span>
              <span className="text-white font-medium">06:15 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Forecast */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6">Today's Forecast</h2>
          <div className="flex justify-between gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {weather.hourly.map((h, i) => (
              <div key={i} className={`flex flex-col items-center gap-3 p-3 rounded-xl min-w-[70px] ${i === 2 ? 'bg-accent-blue/20 border border-accent-blue/50' : 'bg-navy-800'}`}>
                <span className="text-sm text-gray-400">{h.time}</span>
                <CloudRain size={24} className={i > 3 ? 'text-gray-400' : 'text-accent-blue'} />
                <span className="font-bold text-white">{h.temp}°</span>
                <span className="text-xs text-blue-400">{h.rain}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Temp Chart */}
        <div className="glass-panel p-6 h-64">
          <h2 className="text-xl font-bold text-white mb-2">Temperature Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weather.hourly} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c2b4d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                itemStyle={{ color: '#fff' }} 
              />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 7-Day Forecast */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-white mb-6">7-Day Forecast</h2>
        <div className="space-y-4">
          {weather.daily.map((day, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors">
              <span className="w-12 text-gray-300 font-medium">{day.day}</span>
              <div className="flex items-center gap-2 w-24">
                {day.condition === 'Sunny' ? <Sun size={20} className="text-yellow-500" /> : 
                 day.condition === 'Cloudy' ? <Cloud size={20} className="text-gray-400" /> : 
                 <CloudRain size={20} className="text-accent-blue" />}
                <span className="text-sm text-gray-400">{day.condition}</span>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-[200px]">
                <span className="text-gray-400 text-sm">{day.min}°</span>
                <div className="flex-1 h-2 bg-navy-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" 
                    style={{ width: `${((day.max - day.min) / 15) * 100}%`, marginLeft: `${((day.min - 20) / 20) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-white text-sm">{day.max}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MetricItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-navy-800 rounded-xl">
      <div className="p-2 bg-navy-900 rounded-lg text-accent-blue">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
