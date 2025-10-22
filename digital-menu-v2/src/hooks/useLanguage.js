import { useState, useEffect } from 'react';
import translations from '../data/translations.json';

/**
 * Custom hook for managing language selection and translations
 * Persists language choice to localStorage
 * @returns {Object} { language, setLanguage, t }
 */
export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('dm_language');
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  // Persist language preference
  useEffect(() => {
    try {
      localStorage.setItem('dm_language', language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, [language]);

  // Get translations for current language
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fi' : 'en');
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t
  };
}
