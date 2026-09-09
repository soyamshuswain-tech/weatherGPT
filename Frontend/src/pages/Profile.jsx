import { useState } from 'react';
import { Bell, MapPin, Globe, LogIn } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userLocation } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <h1 className="text-3xl font-bold text-white mb-6">User Profile & Settings</h1>
      
      {/* Profile Header */}
      <div className="glass-panel p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-blue to-purple-600 p-1 relative z-10 flex-shrink-0">
          <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center border-4 border-navy-900">
            <span className="text-3xl font-bold text-white">{userLocation?.name ? userLocation.name.charAt(0).toUpperCase() : 'U'}</span>
          </div>
        </div>
        
        <div className="flex-1 relative z-10">
          <h2 className="text-2xl font-bold text-white">{userLocation?.name || 'User'}</h2>
          <p className="text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1">
            <MapPin size={16} /> {userLocation?.address || 'Location not set'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-navy-800 text-accent-blue text-xs font-bold rounded-full border border-glass-border">{userLocation?.role || 'Citizen'}</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full border border-green-500/30">Verified: {userLocation?.mobile || 'N/A'}</span>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate('/login')} className="px-5 py-2 bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue font-bold rounded-lg transition-colors border border-accent-blue/30 flex items-center gap-2 cursor-pointer text-sm">
            <LogIn size={16} /> Switch Account
          </button>
          <button onClick={() => navigate('/setup')} className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-lg transition-colors border border-glass-border flex items-center gap-2 cursor-pointer text-sm">
            Edit Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Nav */}
        <div className="glass-panel p-4 h-fit">
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-accent-blue/10 text-accent-blue rounded-lg font-medium text-sm transition-colors border border-accent-blue/20">
              <Bell size={18} /> Alert Preferences
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-navy-800 hover:text-white rounded-lg font-medium text-sm transition-colors">
              <Globe size={18} /> Language & Region
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 glass-panel p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-glass-border pb-4">Smart Notification Preferences</h3>
          
          <div className="space-y-6">
            <ToggleOption title="Cyclone Warnings" desc="Receive push notifications for cyclone formation and paths." defaultChecked={true} />
            <ToggleOption title="Flood Alerts" desc="Get notified when river levels rise in your area." defaultChecked={true} />
            <ToggleOption title="Heavy Rain & Thunderstorms" desc="Alerts for severe localized rainfall." defaultChecked={true} />
            <ToggleOption title="Lightning Strikes" desc="Real-time alerts for lightning activity nearby." defaultChecked={true} />
            
            <div className="pt-6 border-t border-glass-border">
              <h4 className="font-bold text-white mb-4">Voice Alerts</h4>
              <ToggleOption title="Enable AI Voice Alarms" desc="Critical emergencies will play an audible warning even in silent mode." defaultChecked={true} />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button className="px-6 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-medium transition-colors border border-accent-blue/20">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ title, desc, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-sm text-gray-400 mt-1 leading-snug">{desc}</div>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors flex-shrink-0 ${checked ? 'bg-accent-blue' : 'bg-gray-600'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}
