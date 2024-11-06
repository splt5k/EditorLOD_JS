import { translations } from '../i18n/translations';

type LocaleKey = keyof typeof translations;
type TranslationKey = keyof typeof translations['en-US'];

export function useTranslation(locale: string) {
  const safeLocale = (locale as LocaleKey) in translations 
    ? (locale as LocaleKey) 
    : 'en-US';

  const t = (key: TranslationKey) => {
    return translations[safeLocale][key];
  };

  return { t };
}