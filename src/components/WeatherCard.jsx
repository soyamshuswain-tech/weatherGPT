import { CloudRain, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

export default function WeatherCard({ weather }) {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{weather.location}</h2>
          <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain size={40} className="text-accent-blue" />
          <div className="text-4xl font-bold text-white">{weather.temperature}°C</div>
        </div>
      </div>
      
      <div className="text-lg font-medium text-accent-blue mb-6">{weather.condition}</div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-navy-900/50 p-3 rounded-lg flex flex-col items-center gap-1 border border-glass-border">
          <Droplets size={20} className="text-blue-400" />
          <span className="text-sm text-gray-400">Humidity</span>
          <span className="font-semibold text-white">{weather.humidity}%</span>
        </div>
        <div className="bg-navy-900/50 p-3 rounded-lg flex flex-col items-center gap-1 border border-glass-border">
          <Wind size={20} className="text-gray-300" />
          <span className="text-sm text-gray-400">Wind</span>
          <span className="font-semibold text-white">{weather.windSpeed} km/h</span>
        </div>
        <div className="bg-navy-900/50 p-3 rounded-lg flex flex-col items-center gap-1 border border-glass-border">
          <CloudRain size={20} className="text-accent-blue" />
          <span className="text-sm text-gray-400">Rain Prob.</span>
          <span className="font-semibold text-white">{weather.rainProbability}%</span>
        </div>
        <div className="bg-navy-900/50 p-3 rounded-lg flex flex-col items-center gap-1 border border-glass-border">
          <Thermometer size={20} className="text-orange-400" />
          <span className="text-sm text-gray-400">Feels Like</span>
          <span className="font-semibold text-white">{weather.feelsLike}°C</span>
        </div>
      </div>
    </div>
  );
}
