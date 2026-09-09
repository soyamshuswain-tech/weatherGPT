import { useState } from 'react';
import { BellIcon, SearchIcon, MenuIcon, Activity, Clock, Crosshair, ChevronDown, MapPin, Search, LogIn } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useLocation } from '../contexts/LocationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { userLocation, setUserLocation } = useLocation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.length > 2) {
      try {
        const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
        const res = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(val)}&api_key=${apiKey}`);
        const data = await res.json();
        const preds = data.predictions || [];
        setSuggestions(preds);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = async (queryOverride) => {
    const query = typeof queryOverride === 'string' ? queryOverride : searchQuery;
    if (!query.trim()) return;
    setIsSearching(true);
    setSuggestions([]); // clear suggestions
    try {
      const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
      const res = await fetch(`https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(query)}&api_key=${apiKey}`);
      const data = await res.json();
      
      // Ola Maps API typically returns results in `geocodingResults` or `results`
      const results = data.geocodingResults || data.results || (Array.isArray(data) ? data : []);
      
      if (results && results.length > 0) {
        const firstResult = results[0];
        // Handle various potential response structures (e.g. geometry.location or direct lat/lng)
        const locationObj = firstResult.geometry?.location || firstResult;
        const lat = locationObj.lat;
        const lng = locationObj.lng || locationObj.lon;
        
        setUserLocation({
          name: userLocation?.name || "User",
          mobile: userLocation?.mobile || "0000000000",
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          address: firstResult.formatted_address || query
        });
        setSearchQuery('');
        setIsLocationMenuOpen(false);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error with Ola Maps API:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let address = "Current Location";
          
          try {
            const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;
            const res = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`);
            const data = await res.json();
            const results = data.results || [];
            if (results && results.length > 0) {
              address = results[0].formatted_address || address;
            }
          } catch (err) {
            console.error("Reverse geocoding error:", err);
          }

          setUserLocation({
            name: userLocation?.name || "User",
            mobile: userLocation?.mobile || "0000000000",
            lat,
            lng,
            address
          });
          setIsLocationMenuOpen(false);
        },
        (err) => {
          alert("Could not get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <header className="h-16 border-b border-glass-border bg-navy-900 flex items-center px-4 md:px-6 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <MenuIcon size={24} />
        </button>
        
        {/* Live Location Indicator & Popover */}
        <div className="hidden lg:flex flex-col relative">
          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Location Context</div>
          <button 
            onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
            className="flex items-center gap-1 text-sm text-gray-200 font-medium hover:text-white transition-colors"
          >
            {userLocation?.address || "Bhubaneswar, Odisha"}
            <ChevronDown size={14} className={`transition-transform ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Location Popover Menu */}
          {isLocationMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-80 bg-navy-800 border border-glass-border rounded-xl shadow-2xl p-4 z-50">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search location..."
                    className="w-full bg-navy-900 border border-glass-border rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-accent-blue"
                  />
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-navy-900 border border-glass-border rounded-lg shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                      {suggestions.map((sugg, i) => (
                        <div 
                          key={i} 
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-navy-800 hover:text-white cursor-pointer border-b border-glass-border last:border-0"
                          onClick={() => {
                            setSearchQuery(sugg.description);
                            setSuggestions([]);
                            handleSearch(sugg.description);
                          }}
                        >
                          {sugg.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-3 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded-lg text-sm font-medium transition-colors"
                >
                  {isSearching ? '...' : 'Go'}
                </button>
              </div>
              
              <button 
                onClick={handleLocateMe}
                className="w-full flex items-center justify-center gap-2 p-2 bg-navy-900 hover:bg-navy-700 text-gray-300 border border-glass-border rounded-lg transition-colors text-sm"
              >
                <Crosshair size={16} className="text-accent-blue" /> Use Current Location
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        
        {/* Data Status */}
        <div className="hidden md:flex items-center gap-4 border-r border-glass-border pr-6 mr-2">
          <div className="text-xs text-gray-500">
            Last updated 2 min ago
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Live data
          </div>
        </div>

        <LanguageSelector />
        <ThemeToggle />
        
        {/* Notifications */}
        <button onClick={() => navigate('/alerts')} className="relative p-2 text-gray-400 hover:text-white transition-colors cursor-pointer" title="Alerts">
          <BellIcon size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Login Page Button in Navbar */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-blue/10 hover:bg-accent-blue/25 text-accent-blue hover:text-white border border-accent-blue/30 hover:border-accent-blue transition-all duration-200 text-xs md:text-sm font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(0,180,216,0.3)] cursor-pointer"
          title={userLocation?.isLoggedIn ? "Account / Switch Persona" : "Sign In to WeatherGPT"}
        >
          <LogIn size={15} />
          <span className="hidden sm:inline">{userLocation?.isLoggedIn ? t('login') : t('sign_in')}</span>
        </button>

        {/* Profile */}
        <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-navy-700 border border-glass-border flex items-center justify-center text-sm font-bold text-accent-blue hover:bg-navy-800 hover:border-accent-blue transition-all cursor-pointer" title="User Profile">
          {userLocation?.name ? userLocation.name.charAt(0).toUpperCase() : 'U'}
        </button>
      </div>
    </header>
  );
}

