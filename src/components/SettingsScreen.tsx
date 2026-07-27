import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Fingerprint, 
  ChevronRight, 
  Languages, 
  Shield, 
  Bell, 
  Info, 
  X, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface SettingsScreenProps {
  onBack: () => void;
}

type ModalType = null | 'language' | 'biometric_scan' | 'privacy' | 'notification_permission' | 'update_check';

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    language: selectedLanguage, 
    changeLanguage: setSelectedLanguage, 
    isBiometricEnabled, 
    setBiometricEnabled: setIsBiometricEnabled, 
    isPushEnabled, 
    setPushEnabled: setIsPushEnabled,
    t
  } = useSettings();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [scanStep, setScanStep] = useState<'prompt' | 'scanning' | 'success'>('prompt');
  const [updateStep, setUpdateStep] = useState<'checking' | 'latest'>('checking');
  
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { ...prev, visible: false } : prev);
    }, 3000);
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    showToast(`Dark Mode ${!isDarkMode ? 'Activated 🌙' : 'Deactivated ☀️'}`);
  };

  const handleToggleBiometric = () => {
    if (!isBiometricEnabled) {
      setScanStep('prompt');
      setActiveModal('biometric_scan');
    } else {
      setIsBiometricEnabled(false);
      showToast('Biometric lock disabled.');
    }
  };

  const startBiometricVerification = () => {
    setScanStep('scanning');
    setTimeout(() => {
      setScanStep('success');
      setTimeout(() => {
        setIsBiometricEnabled(true);
        setActiveModal(null);
        showToast('Biometric lock enabled successfully! 🔒');
      }, 1200);
    }, 1800);
  };

  const handleSelectLanguage = (lang: any) => {
    setSelectedLanguage(lang);
    setActiveModal(null);
    
    let toastMsg = 'Language updated successfully!';
    if (lang === 'Hindi (हिन्दी)') {
      toastMsg = 'सफलतापूर्वक भाषा हिन्दी में बदल दी गई है! ✨';
    } else if (lang === 'Gondi (गोंडी)') {
      toastMsg = 'सफलतापूर्वक गोंडी भासा बदलत कीय! 🏹';
    }
    showToast(toastMsg);
  };

  const handleTogglePushNotifications = () => {
    if (!isPushEnabled) {
      setActiveModal('notification_permission');
    } else {
      setIsPushEnabled(false);
      showToast('Notifications muted 🔕');
    }
  };

  const handleAllowNotifications = () => {
    setIsPushEnabled(true);
    setActiveModal(null);
    showToast('Notifications enabled successfully! 🔔');
  };

  const handleCheckForUpdates = () => {
    setUpdateStep('checking');
    setActiveModal('update_check');
    setTimeout(() => {
      setUpdateStep('latest');
    }, 2000);
  };

  const settingsGroups = [
    {
      title: t('preferences') || 'Preferences',
      items: [
        {
          id: 'btn-setting-language',
          icon: <Languages className="w-5 h-5 text-blue-500" />,
          label: t('language') || 'Language',
          value: selectedLanguage,
          onClick: () => setActiveModal('language'),
        },
        {
          id: 'btn-setting-darkmode',
          icon: isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-purple-500" />,
          label: t('dark_mode') || 'Dark Mode',
          isToggle: true,
          value: isDarkMode,
          onToggle: handleToggleDarkMode,
        },
      ]
    },
    {
      title: t('security') || 'Security',
      items: [
        {
          id: 'btn-setting-biometric',
          icon: <Fingerprint className="w-5 h-5 text-green-500" />,
          label: t('biometric_lock') || 'Biometric Lock',
          sub: 'Use Fingerprint or Face ID',
          isToggle: true,
          value: isBiometricEnabled,
          onToggle: handleToggleBiometric,
        },
        {
          id: 'btn-setting-privacy',
          icon: <Shield className="w-5 h-5 text-red-500" />,
          label: t('privacy_policy') || 'Privacy Policy',
          onClick: () => setActiveModal('privacy'),
        },
      ]
    },
    {
      title: t('notifications') || 'Notifications',
      items: [
        {
          id: 'btn-setting-push',
          icon: <Bell className="w-5 h-5 text-orange-500" />,
          label: t('push_notifications') || 'Push Notifications',
          isToggle: true,
          value: isPushEnabled,
          onToggle: handleTogglePushNotifications,
        },
      ]
    },
    {
      title: t('about') || 'About',
      items: [
        {
          id: 'btn-setting-version',
          icon: <Info className="w-5 h-5 text-gray-500" />,
          label: t('app_version') || 'App Version',
          value: '1.0.4 (Build 2024)',
          onClick: handleCheckForUpdates,
        },
      ]
    }
  ];

  return (
    <div id="settings-container" className="fixed inset-0 bg-white dark:bg-zinc-950 z-[60] flex flex-col overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 px-6 pt-12 pb-4 flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
        <button 
          id="settings-back-btn"
          onClick={onBack} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-900 dark:text-zinc-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-gray-900 dark:text-zinc-50 uppercase tracking-widest">{t('settings')}</h2>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {settingsGroups.map((group, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-2">
              {group.title}
            </h3>
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden transition-colors duration-300">
              {group.items.map((item, j) => (
                <div 
                  key={j}
                  id={item.id}
                  onClick={!item.isToggle ? item.onClick : undefined}
                  className={`flex items-center gap-4 p-5 transition-colors ${
                    !item.isToggle ? 'hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer' : ''
                  } ${j !== group.items.length - 1 ? 'border-b border-gray-200/50 dark:border-zinc-800/50' : ''}`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{item.label}</p>
                    {item.sub && <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">{item.sub}</p>}
                  </div>
                  {item.isToggle ? (
                    <button 
                      id={`${item.id}-toggle`}
                      onClick={item.onToggle}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        item.value ? 'bg-[#1DB954]' : 'bg-gray-300 dark:bg-zinc-700'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: item.value ? 24 : 4 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.value && <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">{item.value}</span>}
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 pb-8 text-center">
          <p className="text-[10px] font-black text-gray-300 dark:text-zinc-700 uppercase tracking-widest">
            Made with ❤️ in Mandla
          </p>
        </div>
      </div>

      {/* Floating Animated Toast Alert */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            id="settings-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-6 right-6 bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl z-[100] flex items-center justify-center text-center border border-zinc-800"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal Overlays */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[32px] p-6 space-y-6 shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-zinc-800"
            >
              {/* Close Handle / Button */}
              <div className="flex justify-between items-center">
                <span className="w-12 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full sm:hidden absolute top-3 left-1/2 -translate-x-1/2" />
                <h4 className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                  {activeModal === 'language' && 'Select Language'}
                  {activeModal === 'biometric_scan' && 'Biometric Verification'}
                  {activeModal === 'privacy' && 'Privacy & Terms'}
                  {activeModal === 'notification_permission' && 'Push Permission'}
                  {activeModal === 'update_check' && 'Software Update'}
                </h4>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 dark:text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Selector content */}
              {activeModal === 'language' && (
                <div className="space-y-3 pt-2">
                  {[
                    { code: 'en', name: 'English', detail: 'Standard Interface' },
                    { code: 'hi', name: 'Hindi (हिन्दी)', detail: 'मुख्य राज्य भाषा' },
                    { code: 'go', name: 'Gondi (गोंडी)', detail: 'मंडला आदिवासी बोली' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        selectedLanguage === lang.name
                          ? 'border-[#1DB954] bg-green-50/50 dark:bg-green-950/20'
                          : 'border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{lang.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">{lang.detail}</p>
                      </div>
                      {selectedLanguage === lang.name && (
                        <div className="w-5 h-5 rounded-full bg-[#1DB954] flex items-center justify-center text-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Biometric Verification content */}
              {activeModal === 'biometric_scan' && (
                <div className="flex flex-col items-center text-center p-4 space-y-6">
                  {scanStep === 'prompt' && (
                    <>
                      <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                        <Fingerprint className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-base font-black text-gray-900 dark:text-zinc-100">Setup Biometric Unlock</h5>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                          Secure your transactions, order details, and vendor ledgers using fingerprint or face verification.
                        </p>
                      </div>
                      <button
                        onClick={startBiometricVerification}
                        className="w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg transition-colors"
                      >
                        Start Verification
                      </button>
                    </>
                  )}

                  {scanStep === 'scanning' && (
                    <>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          className="absolute inset-0 rounded-full bg-green-500/20"
                        />
                        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-[#1DB954]">
                          <Fingerprint className="w-10 h-10 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-base font-black text-gray-900 dark:text-zinc-100">Scanning Fingerprint...</h5>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          Please hold your finger against your device's fingerprint scanner.
                        </p>
                      </div>
                    </>
                  )}

                  {scanStep === 'success' && (
                    <>
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-500"
                      >
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>
                      <div className="space-y-2">
                        <h5 className="text-base font-black text-[#1DB954]">Success!</h5>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          Your biometrics have been authenticated and activated.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Notification Permission Box */}
              {activeModal === 'notification_permission' && (
                <div className="p-4 space-y-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-blue-500 mx-auto">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-base font-black text-gray-900 dark:text-zinc-100">Enable Push Notifications</h5>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                      Stay updated with instant push alerts for shop order approvals, rider location movements, and Udhar payments.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest py-3.5 rounded-2xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Later
                    </button>
                    <button
                      onClick={handleAllowNotifications}
                      className="flex-1 bg-[#1DB954] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-2xl hover:bg-[#1aa34a] transition-colors shadow-md"
                    >
                      Allow
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Policy */}
              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 text-left no-scrollbar">
                    <p className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase">Last Updated: July 2026</p>
                    <p className="text-xs text-gray-600 dark:text-zinc-350 leading-relaxed">
                      Welcome to <strong>Apna Mandla</strong>, a localized hyper-commerce application built strictly to assist and digitize shops, riders, and customers of Mandla district, Madhya Pradesh.
                    </p>
                    <div className="space-y-2">
                      <h6 className="text-xs font-bold text-gray-900 dark:text-zinc-100">1. Customer Data Protection</h6>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                        We collect your phone number and delivery location coordinates solely to process delivery routes and fulfill merchant orders. Your transaction details are encrypted and never sold.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h6 className="text-xs font-bold text-gray-900 dark:text-zinc-100">2. Merchant Ledgers & Udhar</h6>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                        Udhar request states and account ledgers are private relationships managed directly between local shops and registered consumers. Apna Mandla stores this data with secure cloud endpoints.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h6 className="text-xs font-bold text-gray-900 dark:text-zinc-100">3. Real-Time Coordinates</h6>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                        To enable seamless parcel deliveries, rider locations are monitored live. These locations are only visible to the active consumer and merchant involved in the current delivery.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-gray-900 text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-colors"
                  >
                    I Agree & Accept
                  </button>
                </div>
              )}

              {/* Update Check Modal */}
              {activeModal === 'update_check' && (
                <div className="p-4 text-center space-y-6">
                  {updateStep === 'checking' ? (
                    <>
                      <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/30 rounded-full flex items-center justify-center mx-auto text-[#1DB954]">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-base font-black text-gray-900 dark:text-zinc-100">Checking for updates</h5>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Contacting Apna Mandla App Store servers...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-base font-black text-gray-900 dark:text-zinc-100">App Up to Date</h5>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">
                          You are currently running the latest stable build: <strong className="text-gray-900 dark:text-zinc-200">v1.0.4</strong>.
                        </p>
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl text-left text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed mt-4 space-y-1 border border-gray-100 dark:border-zinc-800">
                          <p className="font-bold text-gray-800 dark:text-zinc-300">Changelog v1.0.4:</p>
                          <p>• Added support for Hindi (हिन्दी) & Gondi (गोंडी) translations</p>
                          <p>• Enhanced Biometric fingerprint scanning simulation</p>
                          <p>• Polished high-contrast dark theme mode toggling</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveModal(null)}
                        className="w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white text-xs font-black uppercase tracking-widest py-3.5 rounded-2xl transition-colors shadow-md"
                      >
                        Great, Thanks!
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
