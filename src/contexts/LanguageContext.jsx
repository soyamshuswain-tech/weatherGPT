import { createContext, useState, useEffect, useContext } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';
import or from '../locales/or';

const translations = { en, hi, or };

export const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('weathergpt_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('weathergpt_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
