import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  CloudLightning, 
  Compass, 
  Sparkles, 
  Radio, 
  AlertTriangle,
  Building,
  LogOut
} from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export default function Login() {
  const { userLocation, loginUser, logoutUser } = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    identifier: '', // email or phone
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen',
    city: 'Bhubaneswar, Odisha'
  });

  // Preset Demo Personas for instant 1-click testing
  const demoPersonas = [
    {
      id: 'citizen',
      role: 'Citizen Resident',
      name: 'Soyam Patra',
      email: 'soyam.patra@odisha.gov.in',
      mobile: '9861023456',
      address: 'Bhubaneswar, Odisha',
      lat: 20.2961,
      lng: 85.8245,
      icon: User,
      badge: 'Local Resident',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Hyper-local weather warnings, AQI & precipitation alerts'
    },
    {
      id: 'responder',
      role: 'NDRF Disaster Commander',
      name: 'Capt. Rajesh Mohanty',
      email: 'rajesh.ndrf@disastermgmt.in',
      mobile: '9437012345',
      address: 'Puri Coastal Command, Odisha',
      lat: 19.8135,
      lng: 85.8312,
      icon: AlertTriangle,
      badge: 'First Responder',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      description: 'Emergency shelter maps, cyclone tracking & evacuation radar'
    },
    {
      id: 'analyst',
      role: 'Chief Climate Analyst',
      name: 'Dr. Ananya Ray',
      email: 'ananya.ray@imd.gov.in',
      mobile: '9777088990',
      address: 'Cuttack Meteorology Unit, Odisha',
      lat: 20.4625,
      lng: 85.8828,
      icon: CloudLightning,
      badge: 'IMD Specialist',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Numerical forecast models, radar telemetry & AI simulation'
    }
  ];

  const handleSignIn = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    
    if (!signInData.identifier || !signInData.password) {
      setErrorMessage('Please provide your email/phone and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isEmail = signInData.identifier.includes('@');
      loginUser({
        name: isEmail ? signInData.identifier.split('@')[0] : 'Resident User',
        email: isEmail ? signInData.identifier : 'user@weathergpt.live',
        mobile: isEmail ? '9876543210' : signInData.identifier,
        role: 'Citizen',
        address: 'Bhubaneswar, Odisha',
        lat: 20.2961,
        lng: 85.8245
      });
      setSuccessMessage('Authentication successful! Initializing weather dashboard...');
      setTimeout(() => navigate('/'), 1200);
    }, 800);
  };

  const handleSignUp = (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!signUpData.name || !signUpData.email || !signUpData.password) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser({
        name: signUpData.name,
        email: signUpData.email,
        mobile: signUpData.mobile || '9876543210',
        role: signUpData.role,
        address: signUpData.city,
        lat: 20.2961,
        lng: 85.8245
      });
      setSuccessMessage('Account created successfully! Welcome to WeatherGPT.');
      setTimeout(() => navigate('/'), 1200);
    }, 900);
  };

  const handleDemoLogin = (persona) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      loginUser({
        name: persona.name,
        email: persona.email,
        mobile: persona.mobile,
        role: persona.role,
        address: persona.address,
        lat: persona.lat,
        lng: persona.lng
      });
      setSuccessMessage(`Authenticated as ${persona.role}! Launching command center...`);
      setTimeout(() => navigate('/'), 1000);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 animate-in fade-in duration-500">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-blue mb-1">
            <Radio size={14} className="animate-pulse text-accent-blue" />
            Security & Authentication Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">WeatherGPT Access Gateway</h1>
        </div>

        {/* Current Active Session Status */}
        {userLocation?.isLoggedIn && (
          <div className="flex items-center gap-3 px-4 py-2 bg-navy-800/80 border border-glass-border rounded-xl backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="text-xs">
              <span className="text-gray-400">Active session: </span>
              <span className="text-white font-semibold">{userLocation.name}</span>
            </div>
            <button
              onClick={() => {
                logoutUser();
                setSuccessMessage('Signed out successfully.');
                setTimeout(() => setSuccessMessage(''), 2500);
              }}
              className="ml-2 p-1.5 hover:bg-navy-700 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Container (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-glass-border shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            {/* Mode Switcher Tabs */}
            <div className="relative flex p-1.5 bg-navy-900/90 rounded-xl border border-glass-border mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(0,180,216,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Lock size={15} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(0,180,216,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User size={15} />
                Create Account
              </button>
            </div>

            {/* Notifications / Alerts */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-sm flex items-center gap-3 animate-in fade-in">
                <AlertTriangle size={18} className="flex-shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signInData.identifier}
                      onChange={(e) => setSignInData({ ...signInData, identifier: e.target.value })}
                      placeholder="e.g. user@domain.com or 9861023456"
                      className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered contact.')}
                      className="text-xs text-accent-blue hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    />
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-navy-900 border-glass-border text-accent-blue focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Remember this browser session</span>
                  </label>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-400" /> 256-Bit SSL
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-accent-blue-hover hover:from-accent-blue hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,180,216,0.35)] hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Command Center</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* CREATE ACCOUNT FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        placeholder="Soyam Patra"
                        className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                      />
                      <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Role / Purpose
                    </label>
                    <select
                      value={signUpData.role}
                      onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                      className="w-full bg-navy-900/90 border border-glass-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                    >
                      <option value="Citizen">Resident Citizen</option>
                      <option value="Disaster Management">Emergency / NDRF Responder</option>
                      <option value="Meteorology Specialist">Meteorologist / Researcher</option>
                      <option value="Local Authority">Govt Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                      />
                      <Mail size={15} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={signUpData.mobile}
                        onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })}
                        placeholder="9876543210"
                        className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                      />
                      <Phone size={15} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                      />
                      <Lock size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                      />
                      <Lock size={15} className="absolute left-3.5 top-3 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Primary City / District
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signUpData.city}
                      onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })}
                      placeholder="e.g. Bhubaneswar, Odisha"
                      className="w-full bg-navy-900/90 border border-glass-border rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-blue transition-all"
                    />
                    <Building size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-accent-blue to-accent-blue-hover text-white font-bold text-sm shadow-[0_0_20px_rgba(0,180,216,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Register & Set Location Context</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Access Bar */}
            <div className="mt-8 pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent-blue" />
                Want quick demo testing? Click any preset persona on the right.
              </span>
              <button
                onClick={() => navigate('/setup')}
                className="text-accent-blue hover:underline whitespace-nowrap cursor-pointer"
              >
                Configure Map Location &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Demo Personas & Security Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick 1-Click Demo Personas */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-accent-blue" />
                  1-Click Demo Personas
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Instant sign-in for evaluation and presentations
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                Instant Access
              </span>
            </div>

            <div className="space-y-3">
              {demoPersonas.map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => handleDemoLogin(persona)}
                    className="w-full text-left p-3.5 rounded-xl bg-navy-900/70 hover:bg-navy-700/80 border border-glass-border hover:border-accent-blue/40 transition-all duration-200 group flex items-start gap-3.5 cursor-pointer"
                  >
                    <div className="p-2.5 rounded-xl bg-navy-800 text-accent-blue group-hover:scale-110 transition-transform flex-shrink-0 border border-glass-border">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors truncate">
                          {persona.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                          {persona.badge}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-medium truncate mt-0.5">
                        {persona.role}
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                        {persona.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Security & Intelligence Specs */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border relative overflow-hidden">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Intelligence Gateway Safeguards
            </h4>
            
            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <Compass size={16} className="text-accent-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Geofenced Risk Feeds:</span> Alerts automatically calibrate to your authenticated coordinates.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CloudLightning size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">IMD & Doppler Radar:</span> Encrypted sync with live atmospheric telemetry.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Radio size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Emergency Broadcast:</span> Automated alerts dispatched via SMS & voice sirens.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-glass-border flex items-center justify-between text-[11px] text-gray-500">
              <span>WeatherGPT Intelligence v2.4</span>
              <span>Encrypted Node #IND-OD</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
