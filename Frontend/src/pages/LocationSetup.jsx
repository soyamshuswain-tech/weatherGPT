import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Save, Globe, Moon, Sun } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function LocationSetup() {
  const { setUserLocation } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [position, setPosition] = useState({ lat: 20.2961, lng: 85.8245 }); // Default Bhubaneswar
  const [map, setMap] = useState(null);

  const handleSave = async () => {
    if (!name || !mobile) {
      alert("Please fill in Name and Mobile Number");
      return;
    }

    let address = "Bhubaneswar, Odisha";
    try {
      const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
      const res = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${position.lat},${position.lng}&api_key=${apiKey}`);
      const data = await res.json();
      const results = data.results || [];
      if (results && results.length > 0) {
        address = results[0].formatted_address || address;
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }

    setUserLocation({
      name,
      mobile,
      lat: position.lat,
      lng: position.lng,
      address
    });
    navigate('/');
  };



  return (
    <div className="min-h-screen bg-navy-900 text-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 border border-glass-border">
        
        {/* Left Form Panel */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
              <span className="text-accent-blue">Weather</span>GPT
            </h1>
            <p className="text-gray-400">{t('location_setup_title')} - Personalize your alerts.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('name')}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-navy-800 border border-glass-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('mobile_number')}</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-glass-border bg-navy-800 text-gray-400">
                  +91
                </span>
                <input 
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl bg-navy-800 border border-glass-border text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('select_language')}</label>
              <div className="grid grid-cols-3 gap-3">
                {['en', 'hi', 'or'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`py-2 px-4 rounded-xl border font-medium text-sm transition-all ${
                      language === lang 
                        ? 'bg-accent-blue/20 border-accent-blue text-white' 
                        : 'bg-navy-800 border-glass-border text-gray-400 hover:bg-navy-700'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6">
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center gap-2"
              >
                <Save size={20} /> {t('save_location')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="w-full lg:w-1/2 bg-navy-800 p-8 flex flex-col border-l border-glass-border">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <MapPin size={20} className="text-accent-blue" /> {t('select_location')}
             </h3>
             <button onClick={toggleTheme} className="p-2 rounded-lg bg-navy-900 border border-glass-border text-gray-400">
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>
          
          <div className={`flex-1 rounded-xl overflow-hidden border border-glass-border shadow-lg relative min-h-[300px] ${theme === 'dark' ? 'map-tiles-dark' : ''}`}>
             <MapContainer 
               center={position} 
               zoom={8} 
               style={{ height: '100%', width: '100%' }}
               ref={setMap}
             >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OSM contributors'
                />
                <LocationMarker position={position} setPosition={setPosition} />
             </MapContainer>
             
             <div className="absolute bottom-4 left-4 right-4 bg-navy-900/90 backdrop-blur-md p-3 rounded-lg border border-glass-border z-[1000] text-sm">
                <div className="font-bold text-white mb-1">Selected Coordinates:</div>
                <div className="text-gray-400 flex justify-between font-mono">
                   <span>Lat: {position.lat.toFixed(4)}</span>
                   <span>Lng: {position.lng.toFixed(4)}</span>
                </div>
             </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
             Click anywhere on the map to drop a pin.
          </p>
        </div>
      </div>
    </div>
  );
}
