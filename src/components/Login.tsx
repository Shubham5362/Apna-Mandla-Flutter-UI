import React, { useState } from 'react';
import { Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OtpInput } from './OtpInput';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  mobileNumber: string;
  handleMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: () => void;
  otpSent: boolean;
  resendTimer: number;
  setIsFocused: (focused: boolean) => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
  onLoginSuccess: () => void;
}

export const Login = ({
  mobileNumber,
  handleMobileChange,
  handleSendOtp,
  otpSent,
  resendTimer,
  setIsFocused,
  onSignUpClick,
  onForgotPasswordClick,
  onLoginSuccess,
}: LoginProps) => {
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    const trimmedMobile = mobileNumber.trim();
    const trimmedPassword = password.trim();

    if (!trimmedMobile || trimmedMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!trimmedPassword) {
      setError('Please enter your password');
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    try {
      if (loginMode === 'password') {
        await login({ mobile: trimmedMobile, password: trimmedPassword });
      } else {
        setError('OTP login is not yet implemented. Please use Password mode.');
        setIsLoggingIn(false);
        return;
      }
      onLoginSuccess();
    } catch (error: any) {
      console.error('Login error details:', error);
      if (error.response?.status === 401) {
        setError('Invalid mobile number or password. Please check your credentials.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(error.response?.data?.detail || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md flex flex-col z-10"
    >
      <h2 className="text-4xl font-bold text-[#1A1A1A] text-center mb-3">Log In</h2>
      <p className="text-[#666666] text-center mb-6 text-lg">
        Welcome back! Please enter your details
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="flex bg-gray-200/50 p-1 rounded-full mb-8 self-center w-64">
        <button 
          onClick={() => setLoginMode('password')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${loginMode === 'password' ? 'bg-white text-[#4CAF50] shadow-sm' : 'text-gray-500'}`}
        >
          Password
        </button>
        <button 
          onClick={() => setLoginMode('otp')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${loginMode === 'otp' ? 'bg-white text-[#4CAF50] shadow-sm' : 'text-gray-500'}`}
        >
          OTP
        </button>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-medium border-r border-gray-300 pr-3">
            +91
          </div>
          <input
            type="tel"
            value={mobileNumber}
            onChange={handleMobileChange}
            placeholder="Mobile Number"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-white h-16 pl-28 pr-6 rounded-full shadow-sm border-none focus:ring-2 focus:ring-green-500/20 outline-none text-lg placeholder:text-gray-400 transition-all"
          />
          {loginMode === 'otp' && !otpSent && (
            <button 
              onClick={handleSendOtp}
              disabled={mobileNumber.length !== 10}
              className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm px-4 py-2 rounded-full transition-colors ${mobileNumber.length === 10 ? 'text-[#4CAF50] bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
            >
              Get OTP
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loginMode === 'password' ? (
            <motion.div 
              key="password-field"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="relative group"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
                <Lock className="w-6 h-6" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-white h-16 pl-16 pr-16 rounded-full shadow-sm border-none focus:ring-2 focus:ring-green-500/20 outline-none text-lg placeholder:text-gray-400 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#666666] hover:text-gray-800 transition-colors"
              >
                {showPassword ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="otp-field"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col gap-4"
            >
              <OtpInput 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {otpSent && (
                <div className="flex justify-center items-center gap-2 h-6">
                  {resendTimer > 0 ? (
                    <span className="text-gray-500 text-sm">Resend in {resendTimer}s</span>
                  ) : (
                    <button 
                      onClick={handleSendOtp}
                      className="text-[#4CAF50] font-bold text-sm hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {loginMode === 'password' && (
          <div className="flex justify-end">
            <button 
              onClick={onForgotPasswordClick}
              className="text-[#4CAF50] font-semibold text-lg hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full h-16 mt-4 bg-gradient-to-r from-[#1DB954] to-[#4CAF50] text-white font-bold text-xl rounded-full shadow-lg shadow-green-500/30 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoggingIn ? 'Logging in...' : (loginMode === 'password' ? 'Log In' : 'Verify & Log In')}
        </button>
      </div>

      <div className="mt-10 text-center text-lg">
        <span className="text-[#666666]">Don't have an account? </span>
        <button 
          onClick={onSignUpClick}
          className="text-[#FF9800] font-bold hover:underline"
        >
          Sign Up
        </button>
      </div>
    </motion.div>
  );
};
