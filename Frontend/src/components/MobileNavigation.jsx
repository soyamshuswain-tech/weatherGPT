import { NavLink } from 'react-router-dom';
import { Home, CloudRain, Bot, Map as MapIcon, BellRing } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MobileNavigation() {
  const { t } = useLanguage();

  const navItems = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('weather'), path: '/weather', icon: CloudRain },
    { name: t('ai'), path: '/ai', icon: Bot },
    { name: t('map'), path: '/map', icon: MapIcon },
    { name: t('alerts'), path: '/alerts', icon: BellRing },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-navy-900/90 backdrop-blur-lg border-t border-glass-border flex items-center justify-around px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors ${
            isActive ? 'text-accent-blue' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <item.icon size={20} className="mb-1" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}
