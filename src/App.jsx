import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AlertProvider } from './contexts/AlertContext';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Weather from './pages/Weather';
import ImpactMap from './pages/ImpactMap';
import Disaster from './pages/Disaster'; // Replaces Cyclone and Flood
import Alerts from './pages/Alerts'; // Renamed from SmartAlerts
import WeatherGPT from './pages/WeatherGPT';
import Emergency from './pages/Emergency'; // Renamed from EmergencyCenter
import Forecast from './pages/Forecast'; // New Page
import Profile from './pages/Profile';
import Login from './pages/Login';
import LocationSetup from './pages/LocationSetup';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
            </Router>
          </AlertProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

