import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageType = 'English' | 'Hindi (हिन्दी)' | 'Gondi (गोंडी)';

interface SettingsContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
  isBiometricEnabled: boolean;
  setBiometricEnabled: (val: boolean) => void;
  isPushEnabled: boolean;
  setPushEnabled: (val: boolean) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations: Record<LanguageType, Record<string, string>> = {
  'English': {
    'home': 'Home',
    'parcel': 'Parcel',
    'cart': 'Cart',
    'menu': 'Menu',
    'settings': 'Settings',
    'wallet': 'Wallet',
    'udhar_book': 'Udhar Book',
    'profile': 'Profile',
    'search': 'Search',
    'search_placeholder': 'Search Shops or Products...',
    'categories': 'Categories',
    'featured_shops': 'Featured Shops',
    'active_deliveries': 'Active Deliveries',
    'apply_seller': 'Apply as Seller',
    'apply_rider': 'Apply as Rider',
    'logout': 'Logout',
    'customer': 'Customer',
    'seller': 'Seller',
    'rider': 'Rider',
    'admin': 'Admin',
    'support': 'Support',
    'udhar_request': 'Udhar Request',
    'wallet_balance': 'My Wallet Balance',
    'notifications': 'Notifications',
    'location': 'Location',
    'add_money': 'Add Money',
    'pay_merchant': 'Pay Merchant',
    'recent_transactions': 'Recent Transactions',
    'shop_owner': 'Shop Owner',
    'rider_dashboard': 'Rider Dashboard',
    'seller_dashboard': 'Seller Dashboard',
    'admin_dashboard': 'Admin Dashboard',
    'app_name': 'Apna Mandla',
    'slogan': 'Your local market guide',
    'pay_now': 'Pay Now',
    'payment_methods': 'Payment Methods',
    'total_amount': 'Total Amount',
    'checkout': 'Checkout',
    'orders': 'Orders',
    'add_to_cart': 'Add to Cart',
    'empty_cart': 'Your cart is empty',
    'preferences': 'Preferences',
    'security': 'Security',
    'dark_mode': 'Dark Mode',
    'biometric_lock': 'Biometric Lock',
    'privacy_policy': 'Privacy Policy',
    'push_notifications': 'Push Notifications',
    'about': 'About',
    'app_version': 'App Version',
    'language': 'Language',
  },
  'Hindi (हिन्दी)': {
    'home': 'मुख्य पृष्ठ',
    'parcel': 'पार्सल भेजें',
    'cart': 'सामान कार्ट',
    'menu': 'मेन्यू सूची',
    'settings': 'सेटिंग्स',
    'wallet': 'मेरा बटुआ',
    'udhar_book': 'उधार बहीखाता',
    'profile': 'प्रोफाइल संपादन',
    'search': 'खोजें',
    'search_placeholder': 'दुकानें या सामान खोजें...',
    'categories': 'श्रेणियां',
    'featured_shops': 'मंडला की प्रसिद्ध दुकानें',
    'active_deliveries': 'चल रही डिलीवरी',
    'apply_seller': 'विक्रेता के रूप में जुड़ें',
    'apply_rider': 'डिलिवरी राइडर बनें',
    'logout': 'लॉगआउट करें',
    'customer': 'ग्राहक',
    'seller': 'दुकानदार',
    'rider': 'डिलिवरी राइडर',
    'admin': 'मुख्य एडमिन',
    'support': 'मदद एवं सहायता',
    'udhar_request': 'उधार का अनुरोध',
    'wallet_balance': 'मेरे बटुए की राशि',
    'notifications': 'महत्वपूर्ण सूचनाएं',
    'location': 'वर्तमान स्थान',
    'add_money': 'पैसे जोड़ें',
    'pay_merchant': 'दुकानदार को भुगतान',
    'recent_transactions': 'हालिया लेन-देन विवरण',
    'shop_owner': 'दुकान के मालिक',
    'rider_dashboard': 'राइडर डैशबोर्ड',
    'seller_dashboard': 'विक्रेता डैशबोर्ड',
    'admin_dashboard': 'प्रशासक डैशबोर्ड',
    'app_name': 'अपना मंडला',
    'slogan': 'आपके जिले का अपना बाजार',
    'pay_now': 'अभी भुगतान करें',
    'payment_methods': 'भुगतान का माध्यम',
    'total_amount': 'कुल राशि',
    'checkout': 'ऑर्डर की पुष्टि',
    'orders': 'आपके ऑर्डर्स',
    'add_to_cart': 'कार्ट में जोड़ें',
    'empty_cart': 'आपकी कार्ट खाली है',
    'preferences': 'प्राथमिकताएं',
    'security': 'सुरक्षा सेटिंग्स',
    'dark_mode': 'डार्क मोड',
    'biometric_lock': 'बायोमेट्रिक लॉक',
    'privacy_policy': 'गोपनीयता नीति',
    'push_notifications': 'पुश नोटिफिकेशन',
    'about': 'ऐप के बारे में',
    'app_version': 'ऐप संस्करण',
    'language': 'भाषा',
  },
  'Gondi (गोंडी)': {
    'home': 'लोन (घर)',
    'parcel': 'पार्सल तंदा (पार्सल)',
    'cart': 'डब्बा (कार्ट)',
    'menu': 'सूची (मेन्यू)',
    'settings': 'गोठ (सेटिंग्स)',
    'wallet': 'थैली (बटुए)',
    'udhar_book': 'उधार बही (उधार)',
    'profile': 'मुसुर (प्रोफाइल)',
    'search': 'चारना (खोजें)',
    'search_placeholder': 'अंगड़ी या सामान चारना...',
    'categories': 'थारी (श्रेणियां)',
    'featured_shops': 'निटूर अंगड़ी (प्रसिद्ध दुकानें)',
    'active_deliveries': 'तंदा सियना (चल रही डिलीवरी)',
    'apply_seller': 'अंगड़ी पोयमाल (दुकानदार बनें)',
    'apply_rider': 'घाटो सियमाल (राइडर बनें)',
    'logout': 'बायगो सियना (लॉगआउट)',
    'customer': 'ग्राहक',
    'seller': 'अंगड़ीदार',
    'rider': 'डिलिवरी कोया',
    'admin': 'वडे (एडमिन)',
    'support': 'तोड़ो (सहायता)',
    'udhar_request': 'उधार कयना (उधार अनुरोध)',
    'wallet_balance': 'थैली ता टका (वॉलेट राशि)',
    'notifications': 'कबर (सूचनाएं)',
    'location': 'नाडो (स्थान)',
    'add_money': 'टका कूटकी (पैसे जोड़ें)',
    'pay_merchant': 'अंगड़ीदार टका सियना',
    'recent_transactions': 'टका गोठ (लेन-देन)',
    'shop_owner': 'अंगड़ी धनी',
    'rider_dashboard': 'राइडर गोठ',
    'seller_dashboard': 'अंगड़ी डैशबोर्ड',
    'admin_dashboard': 'वडे डैशबोर्ड',
    'app_name': 'मावा मंडला',
    'slogan': 'नीवा नाडो अंगड़ी (आपका बाजार)',
    'pay_now': 'टका सियना (भुगतान)',
    'payment_methods': 'टका मार्ग (भुगतान माध्यम)',
    'total_amount': 'सब्बो टका (कुल राशि)',
    'checkout': 'ऑर्डर पुख्ता',
    'orders': 'नीवा ऑर्डर्स',
    'add_to_cart': 'डब्बा ते कूटकी',
    'empty_cart': 'डब्बा खाली आंदु',
    'preferences': 'मर्जी (प्राथमिकताएं)',
    'security': 'बचाव (सुरक्षा)',
    'dark_mode': 'कड़का रूप (डार्क मोड)',
    'biometric_lock': 'फिंगरप्रिंट बंद (बायोमेट्रिक)',
    'privacy_policy': 'गोपनीय गोठ',
    'push_notifications': 'कबर गोठ (नोटिफिकेशन)',
    'about': 'ऐप गोठ (बारे में)',
    'app_version': 'संस्करण (वर्जन)',
    'language': 'भासा बदलत कीय',
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [language, setLanguage] = useState<LanguageType>(() => {
    return (localStorage.getItem('selected_language') as LanguageType) || 'English';
  });
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(() => {
    return localStorage.getItem('biometric_enabled') === 'true';
  });
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('push_enabled') !== 'false';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const changeLanguage = (lang: LanguageType) => {
    setLanguage(lang);
    localStorage.setItem('selected_language', lang);
  };

  const handleSetBiometricEnabled = (val: boolean) => {
    setIsBiometricEnabled(val);
    localStorage.setItem('biometric_enabled', val ? 'true' : 'false');
  };

  const handleSetPushEnabled = (val: boolean) => {
    setIsPushEnabled(val);
    localStorage.setItem('push_enabled', val ? 'true' : 'false');
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English, then literal key
    const engDict = translations['English'];
    return (engDict && engDict[key]) || key;
  };

  return (
    <SettingsContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      language,
      changeLanguage,
      isBiometricEnabled,
      setBiometricEnabled: handleSetBiometricEnabled,
      isPushEnabled,
      setPushEnabled: handleSetPushEnabled,
      t
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
