import { I18nManager } from 'react-native'; // Correct import for RTL
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js'; // i18n-js for translation handling
import en from '../config/translation/en';
import ar from '../config/translation/ar';
import Languages from '../config/language';

// Setting up translations
i18n.translations = {
  en,
  ar,
};

// Enabling fallbacks and setting default locale
i18n.fallbacks = true;
i18n.defaultLocale = 'en';
i18n.locale = 'en';

// Function to set locale and handle RTL
export const setLocale = (language, direction) => {
  const isRTL = direction === 'rtl';
  i18n.locale = language; // Set the language
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL); // Force RTL if necessary
  }
};

// Function to set the default locale from AsyncStorage
export const setDefaultLocale = async () => {
  const code = await AsyncStorage.getItem('language'); // Retrieve language from AsyncStorage
  const lang = Languages.find(item => item.code === code); // Find matching language

  if (lang) {
    setLocale(code, lang.direction); // Set the language and RTL direction
  }
};

// Translation helper
export const __ = (key, params = {}) => i18n.t(key, { ...params, defaultValue: key });

export default i18n;
