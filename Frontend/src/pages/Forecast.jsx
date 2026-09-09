import { useState, useEffect } from 'react';
import { CloudRain, Wind, Droplets, Thermometer, Sun, Cloud, Eye, ArrowUp, ArrowDown, MapPin, Activity, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from '../contexts/LocationContext'; // Keep your location context

// Re-using your API key
const API_KEY = "fdcb81093bd238b09066a02ec7c13bed";

export default function Forecast() {
  const { userLocation } = useLocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Use the location from context, or default to a city if context isn't ready
  const cityQuery = userLocation?.city || userLocation?.address || 'Delhi';

  useEffect(() => {
    let isMounted = true;

    const fetchWeatherData = async () => {
      setError(null);
      try {
        // Build API query: prefer GPS lat/lon when available for pinpoint accuracy, fallback to city query
        const queryParam = (userLocation?.lat && userLocation?.lng)
          ? `lat=${userLocation.lat}&lon=${userLocation.lng}`
          : `q=${encodeURIComponent(userLocation?.city || (userLocation?.address ? userLocation.address.split(',')[0].trim() : 'Delhi'))}`;

        // 1. Fetch Current Weather (for exact temp, wind, sunrise, sunset)
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=${API_KEY}&units=metric`);
        const currentData = await currentRes.json();

        // 2. Fetch 5-Day / 3-Hour Forecast (for hourly chart and daily list)
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${queryParam}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastRes.json();

        if (Number(currentData.cod) !== 200 || Number(forecastData.cod) !== 200) {
          throw new Error(currentData.message || forecastData.message || "City not found or API error");
        }

        // Helper: Format UNIX timestamp to AM/PM time
        const formatTime = (timestamp) => {
          return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };

        // Extract next 8 items for 24-hour timeline (3-hour intervals)
        const hourlyData = forecastData.list.slice(0, 8).map(item => ({
          time: formatTime(item.dt).replace(':00 ', ' '), // Shorthand time (e.g., "03 PM")
          temp: Math.round(item.main.temp),
          rain: Math.round((item.pop || 0) * 100), // Probability of precipitation
          condition: item.weather[0].main
        }));

        // Group forecast data by day to get Min/Max for the Daily UI
        const dailyMap = {};
        forecastData.list.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyMap[date]) {
            dailyMap[date] = { min: item.main.temp_min, max: item.main.temp_max, condition: item.weather[0].main };
          } else {
            dailyMap[date].min = Math.min(dailyMap[date].min, item.main.temp_min);
            dailyMap[date].max = Math.max(dailyMap[date].max, item.main.temp_max);
          }
        });

        // Convert the daily map into an array and take the next 5 days
        const dailyData = Object.keys(dailyMap).map(day => ({
          day,
          condition: dailyMap[day].condition,
          min: Math.round(dailyMap[day].min),
          max: Math.round(dailyMap[day].max)
        })).slice(0, 5);

        if (!isMounted) return;

        // Combine all API data into the shape your UI expects
        setWeather({
          location: currentData.name || userLocation?.address || cityQuery,
          temperature: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          feelsLike: Math.round(currentData.main.feels_like),
          visibility: (currentData.visibility / 1000).toFixed(1), // Convert meters to km
          sunrise: formatTime(currentData.sys.sunrise),
          sunset: formatTime(currentData.sys.sunset),
          hourly: hourlyData,
          daily: dailyData
        });

      } catch (err) {
        console.error("Error fetching weather:", err);
        if (isMounted) {
          setError(err.message || "Unable to load weather data.");
        }
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [userLocation?.lat, userLocation?.lng, cityQuery, retryCount]); // Re-run if userLocation changes or on retry

  if (error) return (
    <div className="flex flex-col justify-center items-center h-[50vh] text-center p-6 max-w-md mx-auto space-y-4">
      <div className="p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <Activity size={36} />
      </div>
      <p className="text-red-400 font-semibold">{error}</p>
      <p className="text-xs text-gray-500">Please verify network connectivity or location details.</p>
      <button 
        onClick={() => setRetryCount(c => c + 1)}
        className="px-5 py-2.5 bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue rounded-xl text-sm font-semibold transition-all border border-accent-blue/30 flex items-center gap-2 cursor-pointer shadow-sm"
      >
        <RefreshCw size={15} /> Retry Forecast Sync
      </button>
    </div>
  );

  if (!weather) return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-accent-blue space-y-4">
      <Activity size={48} className="animate-pulse" />
      <div className="text-lg font-bold tracking-widest uppercase">Loading Forecast Data...</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-glass-border pb-4">
        <div>
          <div className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
            <MapPin size={14} className="text-accent-blue" />
            {weather.location}
          </div>
          <h1 className="text-3xl font-semibold text-white">Meteorological Forecast</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Data live
        </div>
      </div>

      {/* CURRENT CONDITIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 flex flex-col justify-between">
          <h2 className="text-sm font-medium text-gray-400 mb-6 border-b border-glass-border pb-2">Current conditions</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-navy-900 rounded-xl text-gray-400 border border-glass-border">
                {weather.condition === 'Clear' ? <Sun size={64} className="text-yellow-400 animate-spin-slow" /> : 
                 weather.condition === 'Clouds' ? <Cloud size={64} className="text-gray-300" /> : 
                 <CloudRain size={64} className="text-accent-blue" />}
              </div>
              <div>
                <div className="text-6xl font-semibold text-white tracking-tight">{weather.temperature}°</div>
                <div className="text-xl font-medium text-accent-blue">{weather.condition}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <MetricItem icon={Droplets} label="Humidity" value={`${weather.humidity}%`} />
              <MetricItem icon={Wind} label="Wind" value={`${weather.windSpeed} km/h`} />
              <MetricItem icon={Thermometer} label="Feels like" value={`${weather.feelsLike}°C`} />
              <MetricItem icon={Eye} label="Visibility" value={`${weather.visibility} km`} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-400 mb-6 border-b border-glass-border pb-2">Solar & UV data</h2>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-navy-900 rounded-xl text-gray-400 border border-glass-border">
                <Sun size={32} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">6.5</div>
                <div className="text-orange-400 font-medium text-sm">High risk</div>
                <div className="text-xs text-gray-500 mt-1">*UV data is mock (API limitation)</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-glass-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <ArrowUp size={14} className="text-yellow-400" /> Sunrise
              </span>
              <span className="text-white font-medium text-sm">{weather.sunrise}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <ArrowDown size={14} className="text-orange-400" /> Sunset
              </span>
              <span className="text-white font-medium text-sm">{weather.sunset}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HOURLY TIMELINE */}
        <div className="glass-panel p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-6 border-b border-glass-border pb-2">Hourly projection</h2>
          <div className="flex justify-between gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {weather.hourly.map((h, i) => (
              <div key={i} className={`flex flex-col items-center gap-3 p-4 rounded-xl min-w-[80px] transition-colors border ${i === 2 ? 'bg-accent-blue/10 border-accent-blue/50 shadow-[0_0_15px_rgba(0,180,216,0.15)]' : 'bg-navy-900/80 border-glass-border'}`}>
                <span className="text-sm font-medium text-gray-400">{h.time}</span>
                {h.condition === 'Clear' ? <Sun size={24} className="text-yellow-400" /> : 
                 h.condition === 'Clouds' ? <Cloud size={24} className="text-gray-400" /> : 
                 <CloudRain size={24} className={i > 3 ? 'text-gray-400' : 'text-accent-blue'} />}
                <span className="font-semibold text-white text-lg">{h.temp}°</span>
                <span className="text-xs text-accent-blue font-medium">{h.rain}% rain</span>
              </div>
            ))}
          </div>
        </div>

        {/* TREND CHART */}
        <div className="glass-panel p-6 h-64 flex flex-col">
          <h2 className="text-sm font-medium text-gray-400 mb-4 border-b border-glass-border pb-2">Temperature trend</h2>
          <div className="flex-1 min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weather.hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#8E9AAF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8E9AAF', fontSize: 12}} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F2F4F8' }} 
                  itemStyle={{ color: '#00B4D8' }} 
                />
                <Area type="monotone" dataKey="temp" stroke="#00B4D8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5-DAY FORECAST ROWS */}
      <div className="glass-panel p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-6 border-b border-glass-border pb-2">5-Day analysis</h2>
        <div className="space-y-2">
          {weather.daily.map((day, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-navy-700/50 transition-colors border border-transparent hover:border-glass-border">
              <span className="w-16 text-gray-200 font-medium text-sm">{day.day}</span>
              
              <div className="flex items-center gap-3 w-32">
                {day.condition === 'Clear' ? <Sun size={20} className="text-yellow-400" /> : 
                 day.condition === 'Clouds' ? <Cloud size={20} className="text-gray-400" /> : 
                 <CloudRain size={20} className="text-accent-blue" />}
                <span className="text-sm text-gray-400">{day.condition}</span>
              </div>
              
              <div className="flex items-center gap-4 flex-1 max-w-[300px]">
                <span className="text-gray-400 text-sm font-medium w-6 text-right">{day.min}°</span>
                <div className="flex-1 h-2 bg-navy-900 rounded-full overflow-hidden relative border border-glass-border">
                  {/* Progress bar logic to prevent rendering errors */}
                  <div 
                    className="absolute h-full bg-gradient-to-r from-accent-blue to-cyan-400 rounded-full" 
                    style={{ 
                      left: `${Math.max(0, Math.min(90, ((day.min + 10) / 60) * 100))}%`, // Assuming -10C is min possible
                      width: `${Math.max(8, Math.min(100, ((day.max - day.min) / 60) * 100))}%`
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-white text-sm w-6">{day.max}°</span>
              </div>
              
              <div className="w-28 text-right hidden sm:block">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  day.condition === 'Rain' || day.condition === 'Storm' 
                    ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30' 
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {day.condition === 'Rain' || day.condition === 'Storm' ? 'High chance' : 'Low chance'}
                </span>
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
    <div className="flex items-center gap-3 p-3 bg-navy-900/90 rounded-xl border border-glass-border">
      <div className="text-gray-400">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-medium text-white text-sm">{value}</div>
      </div>
    </div>
  );
}
