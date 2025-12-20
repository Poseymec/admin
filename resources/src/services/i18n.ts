// src/services/i18n.ts
import { createI18n } from 'vue-i18n';

// 1. Importe les traductions JSON
import en from '../locales/en'
import fr from '../locales/fr'

// 2. Typage correct pour vue-i18n
type MessageSchema = typeof en;

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}

// 3. Définis les messages avec typage explicite
const messages = {
  en,
  fr,
} as const;

// 4. Récupère la locale sauvegardée ou utilise 'en' par défaut
const savedLocale = (localStorage.getItem('locale') as 'en' | 'fr') || 'en';

// 5. Crée l'instance i18n avec typage explicite
const i18n = createI18n<[MessageSchema], 'en' | 'fr'>({
  legacy: false,
  globalInjection: true,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
