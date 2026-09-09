import { ShieldAlert, Home, PhoneCall, Route, Volume2, AlertTriangle, Hospital, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlert } from '../contexts/AlertContext';
import { useLocation } from '../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

export default function Emergency() {
  const { t } = useLanguage();
  const { activateAlertLayer } = useAlert();
  const { userLocation } = useLocation();
  const navigate = useNavigate();

  const handleAction = (type) => {
    activateAlertLayer('flood'); 
    navigate('/map');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-16">
      
      {/* Header & Risk */}
      <div className="flex flex-col md:flex-row gap-8 items-start border-b border-glass-border pb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={20} className="text-red-500" />
            <h1 className="text-3xl font-semibold text-white">Emergency Assistance</h1>
          </div>
          <p className="text-gray-400 text-sm mt-2 max-w-lg">Quick access to critical information and nearby emergency resources.</p>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-lg flex items-center gap-6">
          <div>
            <div className="text-xs text-red-400/80 uppercase tracking-widest font-semibold mb-1">Your Current Risk</div>
            <div className="text-2xl font-semibold text-red-500">High</div>
          </div>
          <div className="h-10 w-px bg-red-500/20"></div>
          <div className="text-sm text-gray-300 font-medium">
            <MapPin size={14} className="text-red-400 inline mr-1" /> {userLocation?.address || "Bhubaneswar, Odisha"}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PriorityButton 
          icon={Home} 
          title="Find safe shelter" 
          desc="Locate government shelters"
          color="text-blue-400" 
          onClick={() => handleAction('shelter')}
        />
        <PriorityButton 
          icon={Hospital} 
          title="Find hospital" 
          desc="Nearby medical facilities"
          color="text-purple-400" 
          onClick={() => handleAction('hospital')}
        />
        <PriorityButton 
          icon={Route} 
          title="View safe route" 
          desc="Evacuation paths"
          color="text-green-400" 
          onClick={() => handleAction('route')}
        />
        <PriorityButton 
          icon={Volume2} 
          title="Official instructions" 
          desc="Listen to local broadcasts"
          color="text-orange-400" 
          onClick={() => {}}
        />
        <PriorityButton 
          icon={PhoneCall} 
          title="Emergency contacts" 
          desc="NDRF, Police, Fire"
          color="text-red-400" 
          onClick={() => {}}
        />
      </div>

      {/* Immediate Instructions */}
      <div className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-glass-border">
          <AlertTriangle className="text-red-500" size={20} />
          <h2 className="text-lg font-semibold text-white">Critical directives</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <InstructionItem text="Move to higher ground immediately. Do not wait for conditions to worsen." />
          <InstructionItem text="Do not attempt to cross flowing water on foot or in vehicles." />
          <InstructionItem text="Turn off main power switches and gas valves in your property." />
          <InstructionItem text="Keep emergency kit, flashlight, and official documents in a waterproof bag." />
        </div>
      </div>

    </div>
  );
}

function PriorityButton({ icon: Icon, title, desc, color, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="glass-panel p-6 flex flex-col items-start text-left gap-4 hover:bg-navy-700 transition-colors border border-glass-border"
    >
      <div className={`p-3 rounded-lg bg-navy-900 border border-glass-border ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </button>
  );
}

function InstructionItem({ text }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="text-red-500 shrink-0 mt-0.5">
        <AlertTriangle size={16} />
      </div>
      <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
    </div>
  );
}
