import React from 'react';
import logoImg from '../assets/logo.jpg';

export const IndianFlag = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden flex items-center justify-center shrink-0 ${className}`}>
    <img 
      src={logoImg} 
      alt="Apna Mandla Logo" 
      className="w-full h-full object-cover rounded-md shadow-sm border border-amber-500/20"
      referrerPolicy="no-referrer"
    />
  </div>
);

