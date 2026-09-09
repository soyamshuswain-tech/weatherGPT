import { AlertTriangle, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function AlertCard({ alert }) {
  let bgColor = "bg-green-500/10";
  let borderColor = "border-green-500/50";
  let iconColor = "text-green-500";
  
  if (alert.level === "HIGH") {
    bgColor = "bg-orange-500/10";
    borderColor = "border-orange-500/50";
    iconColor = "text-orange-500";
  } else if (alert.level === "CRITICAL") {
    bgColor = "bg-red-500/10";
    borderColor = "border-red-500/50";
    iconColor = "text-red-500";
  }

  return (
    <div className={`card-3d p-6 relative overflow-hidden backdrop-blur-md`}>
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${alert.level === 'CRITICAL' ? 'bg-red-500/20' : alert.level === 'HIGH' ? 'bg-orange-500/20' : 'bg-green-500/20'} ${iconColor} flex-shrink-0 animate-pulse`}>
          <AlertTriangle size={28} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🚨 ACTIVE {alert.type}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1"><MapPin size={14} /> {alert.location}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {alert.time}</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${borderColor} ${iconColor}`}>
              Risk Level: {alert.riskLevel}
            </div>
          </div>
          
          <p className="text-gray-200 mt-3 mb-4 leading-relaxed">
            "{alert.message}"
          </p>
          
          <div className="text-xs text-gray-400 mb-4 font-mono">
            Source: {alert.source}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2 ${alert.level === 'CRITICAL' ? 'bg-red-600 hover:bg-red-700' : alert.level === 'HIGH' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
              View Impact Map <ArrowRight size={16} />
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-navy-800 hover:bg-navy-700 border border-glass-border transition-colors">
              Safety Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
