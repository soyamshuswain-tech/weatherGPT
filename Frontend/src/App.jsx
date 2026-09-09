import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AlertProvider } from './contexts/AlertContext';

import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';

// Code-split pages for performance & optimized chunk sizes
const Home = lazy(() => import('./pages/Home'));
const Weather = lazy(() => import('./pages/Weather'));
const ImpactMap = lazy(() => import('./pages/ImpactMap'));
const Disaster = lazy(() => import('./pages/Disaster'));
const Alerts = lazy(() => import('./pages/Alerts'));
const WeatherGPT = lazy(() => import('./pages/WeatherGPT'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Forecast = lazy(() => import('./pages/Forecast'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const LocationSetup = lazy(() => import('./pages/LocationSetup'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
        <span className="text-xs text-gray-400 tracking-wider uppercase">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <AlertProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/setup" element={<LocationSetup />} />
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="weather" element={<Weather />} />
                    <Route path="forecast" element={<Forecast />} />
                    <Route path="map" element={<ImpactMap />} />
                    <Route path="disaster" element={<Disaster />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="ai" element={<WeatherGPT />} />
                    <Route path="emergency" element={<Emergency />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </AlertProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

