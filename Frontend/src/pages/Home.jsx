import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import Animated3DWeatherIcon from '../components/Animated3DWeatherIcon';
import WeatherBackground from '../components/WeatherBackground';
import DisasterCardEffect from '../components/DisasterCardEffect';
import FullScreenDisasterSimulation from '../components/FullScreenDisasterSimulation';
import { CloudRain, Zap, Tornado, Waves, ArrowRight, Bot, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_KEY = "fdcb81093bd238b09066a02ec7c13bed";

export default function Home() {
  const { userLocation } = useLocation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [activeSimulation, setActiveSimulation] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveWeather = async () => {
      try {
        // Prefer GPS coordinates when available for pinpoint accuracy; fallback to city/address
        const queryParam = (userLocation?.lat && userLocation?.lng)
          ? `lat=${userLocation.lat}&lon=${userLocation.lng}`
          : `q=${encodeURIComponent(userLocation?.city || (userLocation?.address ? userLocation.address.split(',')[0].trim() : 'Cuttack'))}`;
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (isMounted) {
          if (Number(data.cod) === 200) {
            setWeather({
              location: data.name || userLocation?.address || 'Cuttack',
              temperature: Math.round(data.main.temp),
              condition: data.weather[0]?.main || 'Clear', // e.g., 'Rain', 'Clouds', 'Clear'
              feelsLike: Math.round(data.main.feels_like),
            });
          } else {
            console.error("Weather API Error:", data.message);
            // Safe fallback so the page renders smoothly even if API quota or name issue occurs
            setWeather({
              location: userLocation?.address || 'Bhubaneswar, Odisha',
              temperature: 32,
              condition: 'Clouds',
              feelsLike: 38,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch live weather data:", error);
        if (isMounted) {
          // Safe fallback
          setWeather({
            location: userLocation?.address || 'Bhubaneswar, Odisha',
            temperature: 32,
            condition: 'Clouds',
            feelsLike: 38,
          });
        }
      }
    };

    fetchLiveWeather();

    return () => {
      isMounted = false;
    };
  }, [userLocation?.lat, userLocation?.lng, userLocation?.city, userLocation?.address]); // Re-runs if location changes

  if (!weather) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-accent-blue space-y-3">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-medium text-gray-400">{t('live_data')}...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16 relative">
      {/* 10-second Fullscreen Disaster Simulation */}
      {activeSimulation && (
        <FullScreenDisasterSimulation
          type={activeSimulation}
          onClose={() => setActiveSimulation(null)}
        />
      )}

      {/* 1. Location & Weather Overview */}
      <section className="relative overflow-hidden rounded-3xl p-8 border border-glass-border shadow-2xl">
        <WeatherBackground condition={weather.condition} />
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between items-start">
          <div>
            <div className="text-gray-100 text-sm font-medium mb-1 drop-shadow-md">{t('operational_overview')}</div>
            <h1 className="text-3xl font-semibold text-white mb-6 drop-shadow-md">
              {weather.location}
            </h1>
            <div className="flex items-end gap-10 mt-8">
              <div className="drop-shadow-2xl">
                <Animated3DWeatherIcon condition={weather.condition} />
              </div>
              <div className="flex items-end gap-6">
                <div className="text-6xl font-semibold text-white tracking-tight drop-shadow-lg">
                  {weather.temperature}°
                </div>
                <div className="pb-1 drop-shadow-md">
                  <div className="text-lg text-white font-medium">{weather.condition}</div>
                  <div className="text-gray-100 text-sm">{t('feels_like')} {weather.feelsLike}°</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overall Local Risk (Mock Data) */}
          <div className="lg:text-right pt-6 lg:pt-0 drop-shadow-md">
            <div className="text-gray-100 text-sm font-medium mb-1">{t('overall_risk')}</div>
            <div className="flex items-end lg:justify-end gap-2 mb-4">
              <span className="text-4xl font-semibold text-orange-400 drop-shadow-lg">82</span>
              <span className="text-gray-200 pb-1">/100</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:text-sm bg-navy-900/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl min-w-[320px] sm:min-w-[360px] overflow-hidden">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-200 truncate">{t('rainfall')}</span>
                <span className="text-orange-400 font-medium shrink-0">{t('high')}</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-200 truncate">{t('lightning')}</span>
                <span className="text-yellow-400 font-medium shrink-0">{t('moderate')}</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-200 truncate">{t('flood_risk')}</span>
                <span className="text-orange-400 font-medium shrink-0">{t('high')}</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-200 truncate">{t('cyclone_risk')}</span>
                <span className="text-green-400 font-medium shrink-0">{t('low')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Active Alert (Mock Data) */}
      <section className="border-l-2 border-red-500 pl-6 py-2">
        <div className="text-red-500 font-semibold mb-1 flex items-center gap-2">
          {t('active_alert')}
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">{t('flood_warning')}</h2>
        <p className="text-gray-300 max-w-3xl mb-4 leading-relaxed">
          {t('flood_warning_desc')}
        </p>
        <div className="flex gap-8 text-sm mb-4">
          <div><span className="text-gray-500">{t('location_context')}:</span> <span className="text-gray-200">Bhubaneswar Region</span></div>
          <div><span className="text-gray-500">{t('updated')}:</span> <span className="text-gray-200">20 min ago</span></div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => navigate('/map')} className="text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 group transition-colors cursor-pointer">
            {t('view_map')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/emergency')} className="text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 group transition-colors cursor-pointer">
            {t('safety_guide')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 3. Disaster Intelligence Grid (Mock Data) */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">{t('disaster_intelligence')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('disaster_intelligence_sub')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntelligenceItem 
            icon={CloudRain} 
            title={t('heavy_rainfall')} 
            severity={t('high')} 
            severityColor="text-orange-400"
            score="78"
            description={t('heavy_rainfall_desc')}
            time={`10 mins ago`}
            effectType="rainfall"
            onSimulate={() => setActiveSimulation('rainfall')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem 
            icon={Waves} 
            title={t('flood_risk')} 
            severity={t('high')} 
            severityColor="text-orange-400"
            score="82"
            description={t('flood_warning_desc')}
            time={`15 mins ago`}
            effectType="flood"
            onSimulate={() => setActiveSimulation('flood')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem 
            icon={Zap} 
            title={t('lightning_activity')} 
            severity={t('moderate')} 
            severityColor="text-yellow-500"
            score="56"
            description={t('lightning_desc')}
            time={`4 mins ago`}
            effectType="lightning"
            onSimulate={() => setActiveSimulation('lightning')}
            onView={() => navigate('/map')}
          />
          <IntelligenceItem 
            icon={Tornado} 
            title={t('cyclone_system')} 
            severity={t('low')} 
            severityColor="text-green-500"
            score="18"
            description={t('cyclone_desc')}
            time={`1 hour ago`}
            effectType="cyclone"
            onSimulate={() => setActiveSimulation('cyclone')}
            onView={() => navigate('/map')}
          />
        </div>
      </section>

      {/* 4. AI Insight (Mock Data) */}
      <section className="bg-navy-800 p-8 rounded-2xl border border-glass-border">
        <div className="flex items-center gap-2 text-accent-blue font-semibold mb-4">
          <Bot size={18} /> {t('weathergpt_insight')}
        </div>
        <p className="text-lg text-white leading-relaxed max-w-4xl mb-6">
          &quot;{t('weathergpt_insight_text')}&quot;
        </p>
        <div className="text-sm text-gray-400 mb-6 border-b border-glass-border pb-6">
          {t('based_on')}
        </div>
        <button onClick={() => navigate('/ai')} className="text-sm text-accent-blue hover:text-accent-blue-hover font-medium flex items-center gap-1 group transition-colors cursor-pointer">
          {t('ask_weathergpt')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
      className="card-3d p-6 flex flex-col justify-between group relative overflow-hidden border border-glass-border cursor-pointer hover:border-accent-blue/40 transition-all duration-300"
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
