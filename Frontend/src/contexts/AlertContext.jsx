import { createContext, useState, useContext } from 'react';

export const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [activeLayer, setActiveLayer] = useState(null);

  // Activates a map layer from an alert and stores it in context
  const activateAlertLayer = (alertType) => {
    switch (alertType.toLowerCase()) {
      case 'flood':
      case 'flood watch':
      case 'flood warning':
        setActiveLayer('flood');
        break;
      case 'cyclone':
      case 'cyclone warning':
        setActiveLayer('cyclone');
        break;
      case 'heavy rain':
      case 'rainfall':
        setActiveLayer('rainfall');
        break;
      case 'lightning':
        setActiveLayer('lightning');
        break;
      default:
        setActiveLayer(null);
    }
  };

  const clearActiveLayer = () => setActiveLayer(null);

  return (
    <AlertContext.Provider value={{ activeLayer, activateAlertLayer, clearActiveLayer }}>
      {children}
    </AlertContext.Provider>
  );
}
