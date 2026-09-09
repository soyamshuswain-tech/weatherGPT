import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlert } from '../contexts/AlertContext';
import { getAlerts } from '../services/alertService';
import { BellRing, ShieldAlert, Settings, MapPin, Activity, Filter, Info, CloudRain, Waves, Tornado } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Alerts() {
  const { t } = useLanguage();
  const { activateAlertLayer } = useAlert();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then(data => {
      const enrichedAlerts = data.map(a => ({
        ...a,
        severity: a.type === 'FLOOD WARNING' ? 'HIGH' : a.type === 'HEAVY RAINFALL' ? 'MODERATE' : 'LOW',
        category: a.type.includes('FLOOD') ? 'Flood' : a.type.includes('RAIN') ? 'Weather' : 'Cyclone',
        source: 'Official Disaster Authority',
        status: 'ACTIVE',
        validUntil: '08:30 PM Today'
      }));
      setAlerts(enrichedAlerts);
    });
  }, []);

  const handleViewMap = (alertType) => {
    activateAlertLayer(alertType);
    navigate('/map');
  };

  const filters = ['All', 'Critical', 'High', 'Moderate', 'Weather', 'Flood', 'Cyclone'];

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'All') return true;
    if (['Critical', 'High', 'Moderate'].includes(activeFilter)) return alert.severity.toUpperCase() === activeFilter.toUpperCase();
    return alert.category.toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-glass-border pb-4">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
            <Activity size={14} className="text-accent-blue" />
            {t('alert_center_title')}
          </div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
            {t('alerts')} Timeline
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {t('live_data')}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 border-r border-glass-border pr-4">
          <Filter size={16} /> {t('filter_all')}
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-navy-700 text-white border border-glass-border shadow-sm' 
                  : 'bg-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
          <div key={alert.id} className="card-3d p-0 overflow-hidden">
            
            {/* Top row */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-navy-900/50">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSeverityTextColor(alert.severity)} bg-navy-900 border border-white/10`}>
                  {alert.severity}
                </span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-gray-400" />
                  {alert.type}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Status: <span className="text-gray-300 font-medium">{alert.status}</span>
              </div>
            </div>

            {/* Main content */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">{alert.message}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InfoBlock label={t('location_context')} value={alert.location} icon={MapPin} />
                <InfoBlock label={t('updated')} value={alert.time} icon={Activity} />
                <InfoBlock label="Source" value={alert.source} icon={Info} />
                <InfoBlock label="Valid until" value={alert.validUntil} icon={BellRing} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleViewMap(alert.type.includes('FLOOD') ? 'flood' : 'rainfall')}
                  className="text-sm text-accent-blue hover:text-accent-blue-hover font-medium flex items-center gap-1 group transition-colors"
                >
                  <MapPin size={14} /> {t('view_map')} <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
                </button>
                <button 
                  onClick={() => navigate('/emergency')}
                  className="text-sm text-accent-blue hover:text-accent-blue-hover font-medium flex items-center gap-1 group transition-colors"
                >
                  <ShieldAlert size={14} /> {t('safety_guide')} <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center flex flex-col items-center justify-center card-3d">
             <Activity size={32} className="text-gray-600 mb-4" />
             <div className="text-base font-medium text-gray-400 mb-2">No active alerts</div>
             <div className="text-sm text-gray-500">Weather conditions are currently being monitored. System status is normal.</div>
          </div>
        )}
      </div>

    </div>
  );
}

function getSeverityTextColor(severity) {
  switch (severity) {
    case 'CRITICAL': return 'text-red-400';
    case 'HIGH': return 'text-orange-400';
    case 'MODERATE': return 'text-yellow-500';
    default: return 'text-green-500';
  }
}

function InfoBlock({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
        <Icon size={12} className="text-gray-400" /> {label}
      </div>
      <div className="text-sm text-gray-300">{value}</div>
    </div>
  );
}
