import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OtpInput } from './OtpInput';
import { Eye, EyeOff, Lock, User, Smartphone } from 'lucide-react';
import { authApi } from '../api/authApi';

interface SignUpProps {
  mobileNumber: string;
  handleMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: () => void;
  resendTimer: number;
  setIsFocused: (focused: boolean) => void;
  onLoginClick: () => void;
  onSignUpSuccess: () => void;
}

export const SignUp = ({
  mobileNumber,
  handleMobileChange,
  handleSendOtp,
  resendTimer,
  setIsFocused,
  onLoginClick,
  onSignUpSuccess,
}: SignUpProps) => {
  const [signupStep, setSignupStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);
    try {
      await authApi.register({
        fullName,
        mobile: mobileNumber,
        password,
        role: 'customer'
      });
      onLoginClick();
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.status === 400) {
        setError('Mobile number already registered');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const onSendOtp = () => {
    handleSendOtp();
    setSignupStep('otp');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md flex flex-col z-10"
    >
      <h2 className="text-4xl font-bold text-[#1A1A1A] text-center mb-3">Sign Up</h2>
      <p className="text-[#666666] text-center mb-10 text-lg">
        {signupStep === 'form' ? 'Create your account to get started' : 'Verify your mobile number'}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {signupStep === 'form' ? (
          <>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
                <User className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-white h-16 pl-16 pr-6 rounded-full shadow-sm border-none focus:ring-2 focus:ring-green-500/20 outline-none text-lg placeholder:text-gray-400 transition-all"
              />
            </div>

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
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
                <Lock className="w-6 h-6" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
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
            </div>

            <button 
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full h-16 mt-4 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white font-bold text-xl rounded-full shadow-lg shadow-orange-500/30 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isRegistering ? 'Registering...' : 'Create Account'}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <OtpInput 
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
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
            <button 
              onClick={() => {
                console.error('OTP verification is not yet implemented in the backend.');
              }}
              className="w-full h-16 bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white font-bold text-xl rounded-full shadow-lg shadow-orange-500/30 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Verify & Register
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-lg">
        <span className="text-[#666666]">Already have an account? </span>
        <button 
          onClick={onLoginClick}
          className="text-[#4CAF50] font-bold hover:underline"
        >
          Log In
        </button>
      </div>
    </motion.div>
  );
};
