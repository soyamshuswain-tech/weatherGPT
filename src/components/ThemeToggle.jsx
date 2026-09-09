import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-glass-bg transition-colors relative overflow-hidden"
      title="Toggle Theme"
    >
      <div className={`transition-transform duration-500 ${theme === 'dark' ? 'rotate-0' : '-rotate-90 opacity-0'}`}>
        <Moon size={20} />
      </div>
      <div className={`absolute top-2 left-2 transition-transform duration-500 ${theme === 'light' ? 'rotate-0' : 'rotate-90 opacity-0'}`}>
        <Sun size={20} />
      </div>
    </button>
  );
}
