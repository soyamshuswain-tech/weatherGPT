import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../contexts/LocationContext';
import { useAlert } from '../contexts/AlertContext';
import { useTheme } from '../contexts/ThemeContext';
import { getMapData } from '../services/mapService';
import { Layers, CloudRain, Zap, Tornado, Waves, ShieldAlert, Activity, MapPin } from 'lucide-react';
import AnimatedWeatherLayer from '../components/map/AnimatedWeatherLayer';
import SafetyAvatar from '../components/map/SafetyAvatar';
import 'leaflet/dist/leaflet.css';

// Component to dynamically change map view based on user location
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], 9);
    }
  }, [center, map]);
  return null;
}

export default function ImpactMap() {
  const { userLocation } = useLocation();
  const { activeLayer, clearActiveLayer } = useAlert();
  const { theme } = useTheme();
  
  const [mapData, setMapData] = useState(null);
  
  // Local state for layers if not driven by alert context
  const [layers, setLayers] = useState({
    rainfall: false,
    lightning: false,
    cyclone: false,
    flood: false
  });

  // Sync context alert layer with local layer state
  useEffect(() => {
    if (activeLayer) {
      setLayers({
        rainfall: activeLayer === 'rainfall',
        lightning: activeLayer === 'lightning',
        cyclone: activeLayer === 'cyclone',
        flood: activeLayer === 'flood'
      });
      clearActiveLayer();
    }
  }, [activeLayer, clearActiveLayer]);

  useEffect(() => {
    getMapData().then(data => setMapData(data));
  }, []);

  const defaultCenter = userLocation ? [userLocation.lat, userLocation.lng] : [20.2961, 85.8245];

  const toggleLayer = (layerName) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const getActiveLayerNames = () => {
    const active = [];
    if (layers.rainfall) active.push('Rainfall');
    if (layers.lightning) active.push('Lightning');
    if (layers.cyclone) active.push('Cyclone');
    if (layers.flood) active.push('Flood Risk');
    return active;
  };

  const activeLayerNames = getActiveLayerNames();

  return (
    <div className={`h-[calc(100vh-8rem)] w-full rounded-2xl overflow-hidden relative border border-glass-border shadow-lg ${theme === 'dark' ? 'map-tiles-dark' : ''}`}>
      {/* MAP HEADER */}
      <div className="absolute top-0 left-0 w-full p-4 z-[1000] pointer-events-none flex justify-center">
        <div className="bg-navy-900/90 backdrop-blur-md border border-glass-border px-5 py-2 rounded-lg flex items-center gap-4 shadow-sm pointer-events-auto">
          <div className="flex items-center gap-2 border-r border-glass-border pr-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-200">Disaster Intelligence Map</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} />
            Bhubaneswar Region
          </div>
        </div>
      </div>

      <MapContainer center={defaultCenter} zoom={9} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OSM contributors'
        />
        
        {userLocation && <ChangeView center={userLocation} />}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup className="custom-popup">
              <div className="font-bold text-navy-900">📍 You are here</div>
              <div className="text-xs">{userLocation.address}</div>
            </Popup>
          </Marker>
        )}

        {/* --- GEOGRAPHIC BOUNDED ANIMATED LAYERS --- */}
        
        {/* Cyclone Track Layer */}
        {layers.cyclone && mapData?.cycloneTrack && (
          <>
            <Polyline 
              positions={mapData.cycloneTrack.map(p => [p.lat, p.lng])} 
              color="#ef4444" 
              weight={4} 
              dashArray="10, 10" 
            />
            {mapData.cycloneTrack.map((point, idx) => (
              <Circle 
                key={idx} 
                center={[point.lat, point.lng]} 
                radius={30000} 
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
              >
                <Popup>{point.time}</Popup>
              </Circle>
            ))}
            {/* Animate on the expected landfall point (index 2 in mock data) */}
            <AnimatedWeatherLayer 
              type="cyclone" 
              center={[mapData.cycloneTrack[2].lat, mapData.cycloneTrack[2].lng]} 
              radius={80000} 
              intensity="high" 
              active={layers.cyclone} 
            />
          </>
        )}

        {/* Flood Risk Layer */}
        {layers.flood && userLocation && (
          <>
            <Circle 
              center={[userLocation.lat + 0.1, userLocation.lng - 0.1]} 
              radius={15000} 
              pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.2, weight: 2 }}
            >
               <Popup>High Flood Risk Zone</Popup>
            </Circle>
            <AnimatedWeatherLayer 
              type="flood" 
              center={[userLocation.lat + 0.1, userLocation.lng - 0.1]} 
              radius={15000} 
              intensity="moderate" 
              active={layers.flood} 
            />
          </>
        )}

        {/* Rainfall Layer */}
        {layers.rainfall && userLocation && (
          <>
            <Circle 
              center={[userLocation.lat, userLocation.lng]} 
              radius={50000} 
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 1 }}
            />
            <AnimatedWeatherLayer 
              type="rain" 
              center={[userLocation.lat, userLocation.lng]} 
              radius={50000} 
              intensity="high" 
              active={layers.rainfall} 
            />
          </>
        )}

        {/* Lightning Layer */}
        {layers.lightning && userLocation && (
          <>
            <Circle 
              center={[userLocation.lat - 0.15, userLocation.lng + 0.1]} 
              radius={20000} 
              pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.1, weight: 1 }}
            >
               <Popup>⚡ Lightning Strike Detected</Popup>
            </Circle>
            <AnimatedWeatherLayer 
              type="lightning" 
              center={[userLocation.lat - 0.15, userLocation.lng + 0.1]} 
              radius={20000} 
              intensity="high" 
              active={layers.lightning} 
            />
          </>
        )}

        {/* Emergency Shelters */}
        {mapData?.shelters.map(shelter => (
          <Circle 
            key={shelter.id} 
            center={[shelter.lat, shelter.lng]} 
            radius={1000} 
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.8, weight: 2 }}
          >
             <Popup>{shelter.name} (Shelter)</Popup>
          </Circle>
        ))}

        {/* Hospitals */}
        {mapData?.hospitals.map(hospital => (
          <Circle 
            key={hospital.id} 
            center={[hospital.lat, hospital.lng]} 
            radius={800} 
            pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.8, weight: 2 }}
          >
             <Popup>{hospital.name} (Hospital)</Popup>
          </Circle>
        ))}

      </MapContainer>

      {/* Floating Map Controls - Left Panel */}
      <div className="absolute top-20 left-4 z-[1000] bg-navy-900/90 backdrop-blur-md p-5 rounded-xl border border-glass-border shadow-sm flex flex-col gap-5 w-60">

        <h3 className="text-white font-medium text-sm flex items-center gap-2 pb-3 border-b border-glass-border">
          <Layers size={16} className="text-gray-400" /> Map layers
        </h3>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-500 font-medium mb-3">Weather Intelligence</div>
          <LayerToggle icon={CloudRain} label="Rainfall" active={layers.rainfall} onClick={() => toggleLayer('rainfall')} color="text-blue-400" />
          <LayerToggle icon={Zap} label="Lightning" active={layers.lightning} onClick={() => toggleLayer('lightning')} color="text-yellow-500" />
        </div>

        <div className="space-y-2 pt-3 border-t border-glass-border">
          <div className="text-xs text-gray-500 font-medium mb-3">Disaster Intelligence</div>
          <LayerToggle icon={Tornado} label="Cyclone track" active={layers.cyclone} onClick={() => toggleLayer('cyclone')} color="text-purple-400" />
          <LayerToggle icon={Waves} label="Flood risk" active={layers.flood} onClick={() => toggleLayer('flood')} color="text-orange-400" />
        </div>
      </div>

      {/* Live Active Layers Legend */}
      {activeLayerNames.length > 0 && (
        <div className="absolute bottom-8 left-4 z-[1000] bg-navy-900/90 backdrop-blur-md p-4 rounded-xl border border-glass-border shadow-2xl min-w-[200px]">
          <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-3 text-red-500">
            <Activity size={14} className="animate-pulse" /> Live Activity
          </h3>
          <div className="space-y-2">
            {activeLayerNames.map(name => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-medium">{name}</span>
                <span className="text-xs font-bold text-green-400 px-2 py-0.5 bg-green-500/20 rounded border border-green-500/30 animate-pulse">
                  LIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Risk Panel - Right Panel */}
      {userLocation && (
        <div className="absolute top-20 right-4 z-[1000] bg-navy-900/90 backdrop-blur-md p-6 rounded-xl border border-glass-border shadow-sm w-[320px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-medium text-sm mb-1 flex items-center gap-2">
                Local risk
              </h3>
              <p className="text-sm text-gray-400">{userLocation.address}</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-glass-border">
            <span className="font-semibold text-orange-400 text-3xl">82</span>
            <span className="text-gray-500 text-sm">/ 100</span>
            <span className="text-sm px-2 py-0.5 ml-2 border border-orange-400/30 text-orange-400 rounded">High risk</span>
          </div>
          
          <div className="space-y-4 mb-6">
             <RiskRow icon={CloudRain} label="Rainfall" level="High" color="text-orange-400" />
             <RiskRow icon={Waves} label="Flood" level="High" color="text-orange-400" />
             <RiskRow icon={Zap} label="Lightning" level="Moderate" color="text-yellow-500" />
             <RiskRow icon={Tornado} label="Cyclone" level="Low" color="text-green-500" />
          </div>

          <div className="pt-4 border-t border-glass-border">
            <div className="text-sm text-gray-500 font-medium mb-2">AI recommendation</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">"Avoid low-lying roads during heavy rainfall."</p>
            
            <button className="text-accent-blue hover:text-accent-blue-hover text-sm font-medium flex items-center gap-1 group transition-colors">
              View safety guide <Activity size={14} className="group-hover:translate-x-1 transition-transform ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Animated Safety Avatar */}
      <div className="mt-8">
        <SafetyAvatar layers={layers} />
      </div>
    </div>
  );
}

function LayerToggle({ icon: Icon, label, active, onClick, color }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        active ? 'bg-navy-700 border border-glass-border text-white' : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-navy-800'
      }`}
    >
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${active ? color : 'text-gray-500'}`}>
        <Icon size={16} />
      </div>
      <span className="font-medium">{label}</span>
      <div className={`ml-auto w-3 h-3 rounded-full ${active ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-gray-600'}`}></div>
    </button>
  );
}

function RiskRow({ icon: Icon, label, level, color }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-gray-300">
        <Icon size={14} className={color} /> {label}
      </div>
      <div className={`font-bold ${color}`}>{level}</div>
    </div>
  );
}
