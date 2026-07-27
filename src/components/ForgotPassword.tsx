import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OtpInput } from './OtpInput';

interface ForgotPasswordProps {
  mobileNumber: string;
  handleMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendOtp: () => void;
  resendTimer: number;
  setIsFocused: (focused: boolean) => void;
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

export const ForgotPassword = ({
  mobileNumber,
  handleMobileChange,
  handleSendOtp,
  resendTimer,
  setIsFocused,
  onBackToLogin,
  onResetSuccess,
}: ForgotPasswordProps) => {
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'form' | 'otp'>('form');

  const onSendOtp = () => {
    handleSendOtp();
    setForgotPasswordStep('otp');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md flex flex-col z-10"
    >
      <h2 className="text-4xl font-bold text-[#1A1A1A] text-center mb-3">Reset Password</h2>
      <p className="text-[#666666] text-center mb-10 text-lg">
        {forgotPasswordStep === 'form' ? 'Enter your mobile number to receive an OTP' : 'Verify OTP to reset password'}
      </p>

      <div className="space-y-5">
        {forgotPasswordStep === 'form' ? (
          <>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-medium border-r border-gray-300 pr-3">
                +91
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={handleMobileChange}
                placeholder="Mobile Number"
                className="w-full bg-white h-16 pl-20 pr-6 rounded-full shadow-sm border-none focus:ring-2 focus:ring-green-500/20 outline-none text-lg"
              />
            </div>
            <button 
              onClick={onSendOtp}
              className="w-full h-16 mt-4 bg-[#4CAF50] text-white font-bold text-xl rounded-full shadow-lg shadow-green-500/30 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Send OTP
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
              onClick={onResetSuccess}
              className="w-full h-16 bg-[#4CAF50] text-white font-bold text-xl rounded-full shadow-lg shadow-green-500/30 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Verify & Reset
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-lg">
        <button 
          onClick={onBackToLogin}
          className="text-[#666666] font-bold hover:underline"
        >
          Back to Login
        </button>
      </div>
    </motion.div>
  );
};
