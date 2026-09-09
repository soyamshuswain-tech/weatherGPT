import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CloudRain, Zap, Tornado, Waves, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';
import DisasterCardEffect from '../components/DisasterCardEffect';
import FullScreenDisasterSimulation from '../components/FullScreenDisasterSimulation';

export default function Disaster() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { activateAlertLayer } = useAlert();
  const [activeSimulation, setActiveSimulation] = useState(null);

  const handleViewDetails = (e, type) => {
    e.stopPropagation();
    activateAlertLayer(type);
    navigate('/map');
  };

  const handleCardClick = (type) => {
    setActiveSimulation(type);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto relative">
      {/* 10-second Fullscreen Disaster Simulation */}
      {activeSimulation && (
        <FullScreenDisasterSimulation
          type={activeSimulation}
          onClose={() => setActiveSimulation(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('disaster_intelligence')}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Click any disaster card to launch an interactive 10-second full-screen simulation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Heavy Rainfall */}
        <div 
          onClick={() => handleCardClick('rainfall')}
          className="card-3d p-6 relative overflow-hidden group cursor-pointer border border-glass-border hover:border-blue-500/40 transition-all duration-300"
          title="Click to view 10s full-screen rainfall simulation"
        >
          <DisasterCardEffect type="rainfall" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300 shadow-lg">
                  <CloudRain size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{t('heavy_rainfall')}</h2>
                  <span className="text-[11px] text-blue-400 flex items-center gap-1 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                    <Play size={10} className="fill-current" /> Click for 10s Fullscreen
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                {t('high')}
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-gray-400 text-sm">{t('risk_score')}:</span>
              <span className="text-2xl font-bold text-white">75/100</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {t('heavy_rainfall_desc')}
            </p>
            
            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
              <span className="text-gray-400 text-xs">{t('updated')}: 10 mins ago</span>
              <button 
                onClick={(e) => handleViewDetails(e, 'rainfall')}
                className="text-blue-400 font-semibold flex items-center gap-1 hover:text-blue-300 transition-colors group/btn cursor-pointer"
              >
                [ {t('view_details')} ] <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Lightning */}
        <div 
          onClick={() => handleCardClick('lightning')}
          className="card-3d p-6 relative overflow-hidden group cursor-pointer border border-glass-border hover:border-yellow-500/40 transition-all duration-300"
          title="Click to view 10s full-screen lightning simulation"
        >
          <DisasterCardEffect type="lightning" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl group-hover:scale-110 group-hover:bg-yellow-500/30 transition-all duration-300 shadow-lg">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">{t('lightning')}</h2>
                  <span className="text-[11px] text-yellow-400 flex items-center gap-1 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                    <Play size={10} className="fill-current" /> Click for 10s Fullscreen
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                {t('moderate')}
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-gray-400 text-sm">{t('risk_score')}:</span>
              <span className="text-2xl font-bold text-white">45/100</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {t('lightning_desc')}
            </p>
            
            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
              <span className="text-gray-400 text-xs">{t('updated')}: 1 hour ago</span>
              <button 
                onClick={(e) => handleViewDetails(e, 'lightning')}
                className="text-yellow-400 font-semibold flex items-center gap-1 hover:text-yellow-300 transition-colors group/btn cursor-pointer"
              >
                [ {t('view_details')} ] <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Cyclone */}
        <div 
          onClick={() => handleCardClick('cyclone')}
          className="card-3d p-6 relative overflow-hidden group cursor-pointer border border-glass-border hover:border-purple-500/40 transition-all duration-300"
          title="Click to view 10s full-screen cyclone simulation"
        >
          <DisasterCardEffect type="cyclone" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/30 transition-all duration-300 shadow-lg">
                  <Tornado size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{t('cyclone_risk')}</h2>
                  <span className="text-[11px] text-purple-400 flex items-center gap-1 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                    <Play size={10} className="fill-current" /> Click for 10s Fullscreen
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                {t('critical')}
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-gray-400 text-sm">{t('risk_score')}:</span>
              <span className="text-2xl font-bold text-white">92/100</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {t('cyclone_desc')}
            </p>
            
            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
              <span className="text-gray-400 text-xs">{t('updated')}: Just now</span>
              <button 
                onClick={(e) => handleViewDetails(e, 'cyclone')}
                className="text-purple-400 font-semibold flex items-center gap-1 hover:text-purple-300 transition-colors group/btn cursor-pointer"
              >
                [ {t('view_details')} ] <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Flood */}
        <div 
          onClick={() => handleCardClick('flood')}
          className="card-3d p-6 relative overflow-hidden group cursor-pointer border border-glass-border hover:border-cyan-500/40 transition-all duration-300"
          title="Click to view 10s full-screen flood water rise simulation"
        >
          <DisasterCardEffect type="flood" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 text-red-400 rounded-xl group-hover:scale-110 group-hover:bg-red-500/30 transition-all duration-300 shadow-lg">
                  <Waves size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{t('flood_risk')}</h2>
                  <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                    <Play size={10} className="fill-current" /> Click for 10s Water Rise
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                {t('high')}
              </div>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-gray-400 text-sm">{t('risk_score')}:</span>
              <span className="text-2xl font-bold text-white">82/100</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {t('flood_warning_desc')}
            </p>
            
            <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
              <span className="text-gray-400 text-xs">{t('updated')}: 20 mins ago</span>
              <button 
                onClick={(e) => handleViewDetails(e, 'flood')}
                className="text-red-400 font-semibold flex items-center gap-1 hover:text-red-300 transition-colors group/btn cursor-pointer"
              >
                [ {t('view_details')} ] <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
