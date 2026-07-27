import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface BiometricGuardProps {
  children: React.ReactNode;
  onCancel: () => void;
  title?: string;
}

export const BiometricGuard = ({ children, onCancel, title = 'Verify Identity' }: BiometricGuardProps) => {
  const { isBiometricEnabled } = useSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(!isBiometricEnabled);
  const [scanStep, setScanStep] = useState<'prompt' | 'scanning' | 'success' | 'failed'>('prompt');

  useEffect(() => {
    // If biometric is not enabled, we are instantly authenticated
    if (!isBiometricEnabled) {
      setIsAuthenticated(true);
    }
  }, [isBiometricEnabled]);

  const startVerification = () => {
    setScanStep('scanning');
    setTimeout(() => {
      // Simulate highly success probability (95%)
      if (Math.random() > 0.05) {
        setScanStep('success');
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1000);
      } else {
        setScanStep('failed');
      }
    }, 1800);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-zinc-950 z-[100] flex flex-col justify-between p-6 transition-colors duration-300">
      {/* Top Margin */}
      <div className="h-10" />

      {/* Main Body */}
      <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-8">
        {scanStep === 'prompt' && (
          <>
            <div className="w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 shadow-sm border border-gray-100 dark:border-zinc-800">
              <Fingerprint className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-gray-950 dark:text-zinc-50 uppercase tracking-widest">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed px-4">
                Biometric Lock is enabled. Please authenticate using fingerprint or Face ID to access secure details.
              </p>
            </div>
            <button
              onClick={startVerification}
              className="w-full max-w-xs bg-[#1DB954] hover:bg-[#1aa34a] text-white text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg transition-all"
            >
              Verify with Biometrics
            </button>
          </>
        )}

        {scanStep === 'scanning' && (
          <>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-green-500/20"
              />
              <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-[#1DB954] shadow-inner">
                <Fingerprint className="w-12 h-12 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">Scanning...</h3>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Hold your finger against the sensor</p>
            </div>
          </>
        )}

        {scanStep === 'success' && (
          <>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-500 border border-green-200 dark:border-green-900/30 shadow-lg shadow-green-500/10"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1DB954] uppercase tracking-widest">Access Granted</h3>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Redirecting securely...</p>
            </div>
          </>
        )}

        {scanStep === 'failed' && (
          <>
            <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 border border-red-200 dark:border-red-900/30 shadow-lg">
              <ShieldAlert className="w-12 h-12 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-red-500 uppercase tracking-widest">Verification Failed</h3>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Please try again</p>
            </div>
            <button
              onClick={startVerification}
              className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-colors shadow-md"
            >
              Retry
            </button>
          </>
        )}
      </div>

      {/* Footer Back Button */}
      <div className="flex justify-center pb-6">
        <button
          onClick={onCancel}
          className="text-xs font-black text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 uppercase tracking-widest transition-colors py-2 px-4"
        >
          Cancel & Go Back
        </button>
      </div>
    </div>
  );
};
