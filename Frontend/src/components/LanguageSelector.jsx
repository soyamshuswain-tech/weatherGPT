import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <div className="flex items-center gap-1 cursor-pointer bg-navy-800/80 border border-glass-border rounded-full px-3 py-1.5 hover:bg-navy-700 transition-colors">
        <Globe size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-200">
          {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'} ▼
        </span>
      </div>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-32 bg-navy-800 border border-glass-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-blue hover:text-white transition-colors ${language === 'en' ? 'text-accent-blue font-bold' : 'text-gray-300'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('hi')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-blue hover:text-white transition-colors ${language === 'hi' ? 'text-accent-blue font-bold' : 'text-gray-300'}`}
        >
          हिंदी
        </button>
        <button 
          onClick={() => setLanguage('or')}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-blue hover:text-white transition-colors ${language === 'or' ? 'text-accent-blue font-bold' : 'text-gray-300'}`}
        >
          ଓଡ଼ିଆ
        </button>
      </div>
    </div>
  );
}
