import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IndianFlag } from './IndianFlag';
import { AshokChakra } from './AshokChakra';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { LogIn } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen = ({ onLoginSuccess }: AuthScreenProps) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [isFocused, setIsFocused] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      setOtpSent(true);
      setResendTimer(60);
    } else {
      console.error('Invalid mobile number');
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const resetViews = (newView: 'login' | 'signup' | 'forgot-password') => {
    setView(newView);
    setOtpSent(false);
    setResendTimer(0);
  };

  return (
    <div className={`min-h-screen bg-[#FDF5E6] flex flex-col items-center px-6 transition-all duration-500 font-sans relative overflow-hidden ${isFocused ? 'justify-center' : 'pt-16'}`}>
      
      {/* Ashok Chakra Background Decoration */}
      <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none opacity-10 ${isFocused ? 'top-1/2 -translate-y-1/2 w-[800px] h-[800px]' : '-bottom-40 w-[600px] h-[600px]'}`}>
        <AshokChakra className="w-full h-full animate-[spin_60s_linear_infinite]" />
      </div>

      {/* Header / Logo */}
      <AnimatePresence>
        {!isFocused && (
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center mb-6 z-10"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <img 
                src={logoImg} 
                alt="Apna Mandla Logo" 
                className="w-10 h-10 object-cover rounded-xl shadow-md border border-green-100"
              />
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-[#1A1A1A]">APNA</span>{' '}
                <span className="text-[#4CAF50]">MANDLA</span>
              </h1>
            </div>
            <p className="text-[#4CAF50] text-lg font-medium text-center">
              अपने शहर के अपने लोग, अपना डिजिटल बाज़ार।
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <Login 
            mobileNumber={mobileNumber}
            handleMobileChange={handleMobileChange}
            handleSendOtp={handleSendOtp}
            otpSent={otpSent}
            resendTimer={resendTimer}
            setIsFocused={setIsFocused}
            onSignUpClick={() => resetViews('signup')}
            onForgotPasswordClick={() => resetViews('forgot-password')}
            onLoginSuccess={onLoginSuccess}
          />
        )}
        {view === 'signup' && (
          <SignUp 
            mobileNumber={mobileNumber}
            handleMobileChange={handleMobileChange}
            handleSendOtp={handleSendOtp}
            resendTimer={resendTimer}
            setIsFocused={setIsFocused}
            onLoginClick={() => resetViews('login')}
            onSignUpSuccess={onLoginSuccess}
          />
        )}
        {view === 'forgot-password' && (
          <ForgotPassword 
            mobileNumber={mobileNumber}
            handleMobileChange={handleMobileChange}
            handleSendOtp={handleSendOtp}
            resendTimer={resendTimer}
            setIsFocused={setIsFocused}
            onBackToLogin={() => resetViews('login')}
            onResetSuccess={onLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

