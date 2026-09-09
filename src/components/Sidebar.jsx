import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudRain,
  Map as MapIcon,
  Tornado,
  BellRing,
  Bot,
  ShieldAlert,
  User,
  Calendar,
  LogIn
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '../contexts/LanguageContext';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { t } = useLanguage();

  const sections = [
    {
      title: "INTELLIGENCE",
      items: [
        { name: t('home'), path: '/', icon: LayoutDashboard },
        { name: t('forecast'), path: '/forecast', icon: Calendar },
        { name: "WeatherGPT", path: '/ai', icon: Bot },
      ]
    },
    {
      title: "DISASTER MONITORING",
      items: [
        { name: "Impact Map", path: '/map', icon: MapIcon },
        { name: t('disaster'), path: '/disaster', icon: Tornado },
      ]
    },
    {
      title: "SAFETY & ALERTS",
      items: [
        { name: t('emergency'), path: '/emergency', icon: ShieldAlert, danger: true },
        { name: t('alerts'), path: '/alerts', icon: BellRing },
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { name: t('login'), path: '/login', icon: LogIn },
        { name: t('profile'), path: '/profile', icon: User },
      ]
    }
  ];

  return (
    <div className="w-64 border-r border-glass-border hidden md:flex flex-col bg-navy-900 h-full">
      <div className="p-6 flex items-center gap-3 border-b border-glass-border bg-navy-900">
        <img src="/logo.png" alt="WeatherGPT" className="h-28 w-auto rounded-xl shadow-lg" />
      </div>

      <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-3 text-[11px] font-semibold text-gray-500 tracking-wider">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm font-medium relative",
                    isActive
                      ? "bg-navy-800 text-white"
                      : "text-gray-400 hover:text-gray-200 hover:bg-navy-800/50"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {/* Professional vertical accent line for active state */}
                      {isActive && (
                        <div className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 rounded-r-md",
                          item.danger ? "bg-red-500" : "bg-accent-blue"
                        )} />
                      )}
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "transition-colors",
                          isActive
                            ? (item.danger ? "text-red-400" : "text-accent-blue")
                            : (item.danger ? "group-hover:text-red-400/80" : "group-hover:text-accent-blue/80")
                        )}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

