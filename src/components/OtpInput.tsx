import React, { useState, useRef } from 'react';

interface OtpInputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export const OtpInput = ({ onFocus, onBlur }: OtpInputProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 bg-white rounded-xl shadow-sm border-2 border-transparent focus:border-[#4CAF50] focus:ring-0 outline-none text-center text-2xl font-bold text-[#1A1A1A] transition-all"
          placeholder="-"
        />
      ))}
    </div>
  );
};
