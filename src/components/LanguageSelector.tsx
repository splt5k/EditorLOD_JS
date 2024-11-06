import React from 'react';

interface LanguageOption {
  code: string;
  flag: string;
  name: string;
}

const languages: LanguageOption[] = [
  { code: 'en-US', flag: '🇺🇸', name: 'English' },
  { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
  { code: 'fr-FR', flag: '🇫🇷', name: 'Français' },
  { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
  { code: 'ru-RU', flag: '🇷🇺', name: 'Русский' }
];

interface LanguageSelectorProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export function LanguageSelector({ currentLocale, onLocaleChange }: LanguageSelectorProps) {
  return (
    <select
      value={currentLocale}
      onChange={(e) => onLocaleChange(e.target.value)}
      className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                rounded-md text-gray-900 dark:text-gray-100 cursor-pointer hover:border-gray-400 
                dark:hover:border-gray-500 transition-colors"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}