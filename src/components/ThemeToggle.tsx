import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const { t } = useTranslation('en-US');
  
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}