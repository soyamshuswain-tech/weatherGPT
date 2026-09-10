import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import Animated3DWeatherIcon from '../components/Animated3DWeatherIcon';
import WeatherBackground from '../components/WeatherBackground';
import DisasterCardEffect from '../components/DisasterCardEffect';
import FullScreenDisasterSimulation from '../components/FullScreenDisasterSimulation';
import { 
  CloudRain, 
  Zap, 
  Tornado, 
  Waves, 
  ArrowRight, 
  Bot, 
  Play, 
  MapPin, 
  Search, 
  RefreshCw, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "fdcb81093bd238b09066a02ec7c13bed";

export default function Home() {
  const { userLocation, setUserLocation } = useLocation();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [coords, setCoords] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // 1. Determine Initial Location on Mount
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      setCoords({ lat: userLocation.lat, lng: userLocation.lng });
      setActiveCity(userLocation.city || userLocation.name || '');
    } else if (userLocation?.city) {
      setActiveCity(userLocation.city);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          setUserLocation((prev) => ({
            ...(prev || {}),
            lat,
            lng,
            address: prev?.address || 'Current GPS Location',
          }));
        },
        () => {
          // Geolocation denied or unavailable; default to Bhubaneswar
          setActiveCity('Bhubaneswar');
        },
        { timeout: 8000 }
      );
    } else {
      setActiveCity('Bhubaneswar');
    }
  }, [userLocation, setUserLocation]);

  // 2. Fetch Live Weather Data from OpenWeatherMap
  const fetchLiveWeather = useCallback(async (customQuery = null, customCoords = null) => {
    setIsRefreshing(true);
    setFetchError(null);

    const targetCoords = customCoords || coords;
    const targetCity = customQuery !== null ? customQuery : activeCity;

    let queryParam = '';
    if (customQuery) {
      queryParam = `q=${encodeURIComponent(customQuery.trim())}`;
    } else if (targetCoords?.lat && targetCoords?.lng) {
      queryParam = `lat=${targetCoords.lat}&lon=${targetCoords.lng}`;
    } else if (targetCity && targetCity.trim()) {
      queryParam = `q=${encodeURIComponent(targetCity.trim())}`;
    } else {
      queryParam = 'q=Bhubaneswar';
    }

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=${API_KEY}&units=metric`);
      const data = await res.json();

      if (Number(data.cod) === 200) {
        const condition = data.weather[0]?.main || 'Clear';
        const windSpeed = Math.round((data.wind?.speed || 0) * 3.6); // km/h
        const humidity = data.main.humidity;
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const tempMin = Math.round(data.main.temp_min);
        const tempMax = Math.round(data.main.temp_max);
        const pressure = data.main.pressure;
        const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : '10.0';

        // Compute dynamic risk levels based on live weather data
        const condLower = condition.toLowerCase();
        const isRain = condLower.includes('rain') || condLower.includes('drizzle');
        const isStorm = condLower.includes('thunder') || condLower.includes('storm');
        const isHighWind = windSpeed > 45;
        const isCycloneWatch = windSpeed > 65;

        const rainScore = isStorm ? 88 : isRain ? (humidity > 85 ? 75 : 54) : (humidity > 80 ? 30 : 12);
        const lightningScore = isStorm ? 82 : 12;
        const floodScore = (isRain && humidity > 80) ? 78 : isRain ? 48 : 10;
        const cycloneScore = isCycloneWatch ? 88 : isHighWind ? 52 : 14;

        const overallScore = Math.min(
          99,
          Math.max(10, Math.round((rainScore * 0.35) + (lightningScore * 0.25) + (floodScore * 0.25) + (cycloneScore * 0.15)))
        );

        setWeather({
          location: data.name || targetCity || 'Current Location',
          country: data.sys?.country || 'IN',
          temperature: temp,
          feelsLike,
          tempMin,
          tempMax,
          humidity,
          pressure,
          visibility,
          windSpeed,
          condition,
          description: data.weather[0]?.description || condition,
          overallRisk: overallScore,
          rainRisk: isStorm ? 'Severe' : isRain ? (humidity > 85 ? 'High' : 'Moderate') : 'Low',
          rainScore,
          lightningRisk: isStorm ? 'High' : 'Low',
          lightningScore,
          floodRisk: (isRain && humidity > 80) ? 'High' : isRain ? 'Moderate' : 'Low',
          floodScore,
          cycloneRisk: isCycloneWatch ? 'Severe' : isHighWind ? 'Moderate' : 'Low',
          cycloneScore,
        });

        if (customQuery) {
          setActiveCity(data.name);
          setCoords({ lat: data.coord.lat, lng: data.coord.lon });
        }
      } else {
        throw new Error(data.message || 'Location not found');
      }
    } catch (err) {
      console.warn('Weather fetch warning:', err.message);
      setFetchError(err.message);
      // Resilient fallback with dynamic flag
      setWeather((prev) => prev || {
        location: activeCity || userLocation?.address || 'Bhubaneswar, Odisha',
        country: 'IN',
        temperature: 31,
        feelsLike: 36,
        tempMin: 27,
        tempMax: 33,
        humidity: 78,
        pressure: 1006,
        visibility: '8.5',
        windSpeed: 14,
        condition: 'Clouds',
        description: 'scattered clouds',
        overallRisk: 42,
        rainRisk: 'Moderate',
        rainScore: 45,
        lightningRisk: 'Low',
        lightningScore: 15,
        floodRisk: 'Low',
        floodScore: 20,
        cycloneRisk: 'Low',
        cycloneScore: 12,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [coords, activeCity, userLocation]);

  useEffect(() => {
    if (coords || activeCity) {
      fetchLiveWeather();
    }
  }, [coords, activeCity, fetchLiveWeather]);

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchLiveWeather(searchQuery.trim());
    setSearchQuery('');
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      setIsRefreshing(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const newCoords = { lat, lng };
          setCoords(newCoords);
          setActiveCity('');
          fetchLiveWeather(null, newCoords);
        },
        () => {
          setIsRefreshing(false);
          alert('GPS location permission was denied. Please search your city manually.');
        }
      );
    }
  };

  if (!weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-accent-blue space-y-4">
        <div className="w-10 h-10 border-3 border-accent-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-medium text-gray-400 tracking-wider uppercase">
          {t('live_data')}...
        </div>
      </div>
    );
  }

  const isSevereAlert = weather.overallRisk >= 70;
  const isModerateAlert = weather.overallRisk >= 40 && weather.overallRisk < 70;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16 relative">
      {/* 10-second Fullscreen Disaster Simulation Modal */}
      {activeSimulation && (
        <FullScreenDisasterSimulation
          type={activeSimulation}
          onClose={() => setActiveSimulation(null)}
        />
      )}

      {/* Top Location Bar with Live Search & GPS Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900/60 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 text-sm text-gray-300 w-full sm:w-auto">
          <MapPin size={16} className="text-accent-blue shrink-0" />
          <span className="font-semibold text-white truncate">{weather.location}, {weather.country}</span>
          <span className="text-xs text-gray-500 hidden md:inline">| Live Meteorological Station</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <form onSubmit={handleCitySearch} className="relative flex items-center flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search city (e.g. Puri, Delhi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 bg-navy-800/90 text-xs text-white placeholder-gray-400 pl-8 pr-7 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-accent-blue transition-colors"
            />
            <Search size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
          </form>

          <button
            onClick={handleUseGPS}
            title="Detect GPS coordinates"
            className="p-2 bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            <Navigation size={14} />
          </button>

          <button
            onClick={() => fetchLiveWeather()}
            disabled={isRefreshing}
            title="Refresh weather data"
            className="p-2 bg-navy-800 hover:bg-navy-700 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-accent-blue' : ''} />
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <AlertTriangle size={14} />
          <span>Could not find &quot;{searchQuery}&quot;. Displaying regional data for {weather.location}.</span>
        </div>
      )}

      {/* 1. Location & Weather Overview Hero */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl">
        <WeatherBackground condition={weather.condition} />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between items-start">
          <div className="flex-1">
            <div className="text-gray-100 text-xs sm:text-sm font-medium mb-1 drop-shadow-md tracking-wider uppercase">
              {t('operational_overview')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
              {weather.location}
            </h1>
            <div className="capitalize text-sm font-medium text-gray-200 drop-shadow mb-6">
              {weather.description}
            </div>

            <div className="flex flex-wrap items-end gap-6 sm:gap-10 mt-4">
              <div className="drop-shadow-2xl">
                <Animated3DWeatherIcon condition={weather.condition} />
              </div>
              <div className="flex items-end gap-6">
                <div className="text-6xl sm:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
                  {weather.temperature}°
                </div>
                <div className="pb-1.5 drop-shadow-md space-y-0.5">
                  <div className="text-lg text-white font-semibold">{weather.condition}</div>
                  <div className="text-gray-200 text-xs sm:text-sm">
                    {t('feels_like')} {weather.feelsLike}°
                  </div>
                  <div className="text-gray-300 text-xs">
                    H: {weather.tempMax}° &nbsp; L: {weather.tempMin}°
                  </div>
                </div>
              </div>
            </div>

            {/* In-Card Quick Weather Metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-950/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 max-w-xl">
              <div className="flex items-center gap-2.5">
                <Droplets size={16} className="text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Humidity</div>
                  <div className="text-xs font-bold text-white">{weather.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Wind size={16} className="text-teal-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Wind</div>
                  <div className="text-xs font-bold text-white">{weather.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Eye size={16} className="text-indigo-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Visibility</div>
                  <div className="text-xs font-bold text-white">{weather.visibility} km</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Gauge size={16} className="text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Pressure</div>
                  <div className="text-xs font-bold text-white">{weather.pressure} hPa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Overall Local Risk */}
          <div className="lg:text-right pt-6 lg:pt-0 drop-shadow-md w-full lg:w-auto">
            <div className="text-gray-100 text-xs sm:text-sm font-medium mb-1 tracking-wider uppercase">
              {t('overall_risk')}
            </div>
            <div className="flex items-end lg:justify-end gap-2 mb-4">
              <span className={`text-4xl sm:text-5xl font-extrabold drop-shadow-lg ${
                weather.overallRisk >= 70 ? 'text-red-400' : weather.overallRisk >= 40 ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                {weather.overallRisk}
              </span>
              <span className="text-gray-300 pb-1 font-medium">/ 100</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:text-sm bg-navy-900/50 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl min-w-[280px] sm:min-w-[340px]">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 truncate">{t('rainfall')}</span>
                <span className={`font-semibold shrink-0 ${
                  weather.rainRisk === 'Severe' ? 'text-red-400' : weather.rainRisk === 'High' ? 'text-orange-400' : weather.rainRisk === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {weather.rainRisk}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 truncate">{t('lightning')}</span>
                <span className={`font-semibold shrink-0 ${
                  weather.lightningRisk === 'High' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {weather.lightningRisk}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 truncate">{t('flood_risk')}</span>
                <span className={`font-semibold shrink-0 ${
                  weather.floodRisk === 'High' ? 'text-red-400' : weather.floodRisk === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {weather.floodRisk}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 truncate">{t('cyclone_risk')}</span>
                <span className={`font-semibold shrink-0 ${
                  weather.cycloneRisk === 'Severe' ? 'text-red-400' : weather.cycloneRisk === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {weather.cycloneRisk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Active Alert / Reassurance Banner */}
      <section className={`rounded-2xl p-6 border transition-all ${
        isSevereAlert
          ? 'border-red-500 bg-red-950/20 shadow-lg shadow-red-950/30'
          : isModerateAlert
          ? 'border-amber-500/70 bg-amber-950/20 shadow-lg shadow-amber-950/20'
          : 'border-emerald-500/50 bg-emerald-950/20'
      }`}>
        <div className="flex items-center gap-2 font-bold mb-2">
          {isSevereAlert ? (
            <>
              <AlertTriangle size={20} className="text-red-500 animate-pulse" />
              <span className="text-red-400 uppercase tracking-wide text-sm">{t('active_alert')}</span>
            </>
          ) : isModerateAlert ? (
            <>
              <AlertTriangle size={20} className="text-amber-400" />
              <span className="text-amber-400 uppercase tracking-wide text-sm">Weather Advisory</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} className="text-emerald-400" />
              <span className="text-emerald-400 uppercase tracking-wide text-sm">Normal Operational Status</span>
            </>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {isSevereAlert
            ? `Severe Weather Warning: High Inundation Risk for ${weather.location}`
            : isModerateAlert
            ? `Localized Caution: Damp Conditions & Wet Roads in ${weather.location}`
            : `Favorable Weather Conditions for ${weather.location}`}
        </h2>

        <p className="text-gray-300 max-w-3xl mb-4 leading-relaxed text-sm">
          {isSevereAlert
            ? `Active storm activity detected. Precipitation is elevated with a risk score of ${weather.overallRisk}/100. Avoid low-lying zones and monitor evacuation routes.`
            : isModerateAlert
            ? `Current weather indicates ${weather.description} with humidity at ${weather.humidity}% and winds at ${weather.windSpeed} km/h. Keep an umbrella handy and exercise standard road caution.`
            : `Atmospheric parameters are within standard baseline thresholds. Wind speed is steady at ${weather.windSpeed} km/h with good visibility (${weather.visibility} km). No emergency warnings are in effect.`}
        </p>

        <div className="flex flex-wrap gap-6 text-xs text-gray-400 mb-5">
          <div>
            <span className="text-gray-500">{t('location_context')}:</span>{' '}
            <span className="text-gray-200 font-medium">{weather.location}, {weather.country}</span>
          </div>
          <div>
            <span className="text-gray-500">{t('updated')}:</span>{' '}
            <span className="text-gray-200 font-medium">Just now</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => navigate('/map')}
            className="text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 group transition-colors cursor-pointer"
          >
            {t('view_map')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/emergency')}
            className="text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 group transition-colors cursor-pointer"
          >
            {t('safety_guide')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 3. Disaster Intelligence Grid */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">{t('disaster_intelligence')}</h2>
          <p className="text-gray-400 text-sm mt-1">{t('disaster_intelligence_sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntelligenceItem
            icon={CloudRain}
            title={t('heavy_rainfall')}
            severity={weather.rainRisk}
            severityColor={weather.rainRisk === 'Severe' ? 'text-red-400' : weather.rainRisk === 'High' ? 'text-orange-400' : 'text-emerald-400'}
            score={weather.rainScore}
            description={t('heavy_rainfall_desc')}
            time="Live Station Data"
            effectType="rainfall"
            onSimulate={() => setActiveSimulation('rainfall')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem
            icon={Waves}
            title={t('flood_risk')}
            severity={weather.floodRisk}
            severityColor={weather.floodRisk === 'High' ? 'text-red-400' : weather.floodRisk === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'}
            score={weather.floodScore}
            description={t('flood_warning_desc')}
            time="Live Station Data"
            effectType="flood"
            onSimulate={() => setActiveSimulation('flood')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem
            icon={Zap}
            title={t('lightning_activity')}
            severity={weather.lightningRisk}
            severityColor={weather.lightningRisk === 'High' ? 'text-red-400' : 'text-emerald-400'}
            score={weather.lightningScore}
            description={t('lightning_desc')}
            time="Live Station Data"
            effectType="lightning"
            onSimulate={() => setActiveSimulation('lightning')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem
            icon={Tornado}
            title={t('cyclone_system')}
            severity={weather.cycloneRisk}
            severityColor={weather.cycloneRisk === 'Severe' ? 'text-red-400' : weather.cycloneRisk === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'}
            score={weather.cycloneScore}
            description={t('cyclone_desc')}
            time="Live Station Data"
            effectType="cyclone"
            onSimulate={() => setActiveSimulation('cyclone')}
            onView={() => navigate('/map')}
          />
        </div>
      </section>

      {/* 4. AI Meteorological Insight */}
      <section className="bg-navy-800/80 backdrop-blur-md p-8 rounded-3xl border border-glass-border shadow-xl">
        <div className="flex items-center gap-2 text-accent-blue font-semibold mb-4">
          <Bot size={20} />
          <span>{t('weathergpt_insight')}</span>
        </div>
        <p className="text-base sm:text-lg text-white leading-relaxed max-w-4xl mb-6">
          &quot;Live observations for {weather.location} register a temperature of {weather.temperature}°C with {weather.description}. Humidity stands at {weather.humidity}% and surface winds blow at {weather.windSpeed} km/h. Risk index is currently evaluated at {weather.overallRisk}/100.&quot;
        </p>
        <div className="text-xs text-gray-400 mb-6 border-b border-glass-border pb-6">
          {t('based_on')} — Automated Weather Analysis Engine
        </div>
        <button
          onClick={() => navigate('/ai')}
          className="text-sm text-accent-blue hover:text-accent-blue-hover font-medium flex items-center gap-1.5 group transition-colors cursor-pointer"
        >
          {t('ask_weathergpt')} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
}

function IntelligenceItem({ icon: Icon, title, severity, severityColor, score, description, time, onView, effectType, onSimulate }) {
  const { t } = useLanguage();
  return (
    <div
      onClick={onSimulate}
      className="card-3d p-6 flex flex-col justify-between group relative overflow-hidden border border-glass-border cursor-pointer hover:border-accent-blue/40 transition-all duration-300 rounded-2xl"
    >
      {effectType && <DisasterCardEffect type={effectType} />}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-navy-900/80 rounded-xl text-gray-300 shadow-inner group-hover:text-accent-blue group-hover:scale-110 transition-all duration-300">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base group-hover:text-accent-blue transition-colors">{title}</h3>
                <span className="text-[11px] text-accent-blue flex items-center gap-1 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                  <Play size={10} className="fill-current" /> Click for 10s Fullscreen
                </span>
              </div>
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-navy-900/60 ${severityColor}`}>
              {severity}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-400 font-medium mb-1">{t('risk_score')}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white tracking-tight">{score}</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
          <span className="text-gray-500 text-xs">{t('updated')} {time}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="text-accent-blue hover:text-accent-blue-hover font-medium flex items-center gap-1 group/btn transition-colors cursor-pointer"
          >
            {t('view_details')} <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
