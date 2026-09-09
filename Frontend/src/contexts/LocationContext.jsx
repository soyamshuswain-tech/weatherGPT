import { createContext, useState, useEffect, useContext } from 'react';

export const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('weathergpt_location');
    return saved ? JSON.parse(saved) : null; // null implies they need onboarding
  });

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('weathergpt_location', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  const loginUser = (userData) => {
    const updated = {
      ...(userLocation || {}),
      name: userData.name || userLocation?.name || 'Authorized User',
      email: userData.email || userLocation?.email || '',
      mobile: userData.mobile || userLocation?.mobile || '9876543210',
      role: userData.role || userLocation?.role || 'Citizen',
      address: userData.address || userLocation?.address || 'Bhubaneswar, Odisha',
      lat: userData.lat ?? userLocation?.lat ?? 20.2961,
      lng: userData.lng ?? userLocation?.lng ?? 85.8245,
      isLoggedIn: true,
      lastLogin: new Date().toISOString()
    };
    setUserLocation(updated);
    return updated;
  };

  const logoutUser = () => {
    setUserLocation((prev) => (prev ? { ...prev, isLoggedIn: false } : null));
    localStorage.removeItem('weathergpt_token');
  };

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation, loginUser, logoutUser }}>
      {children}
    </LocationContext.Provider>
  );
}

