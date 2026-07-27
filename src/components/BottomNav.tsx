import React, { useState } from 'react';
import { Home, Package, ShoppingCart, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const { totalItems } = useCart();
  const { t } = useSettings();
  
  const navItems = [
    { id: 'home', label: t('home'), icon: <Home className="w-6 h-6" /> },
    { id: 'parcel', label: t('parcel'), icon: <Package className="w-6 h-6" /> },
    { id: 'cart', label: t('cart'), icon: <ShoppingCart className="w-6 h-6" /> },
    { id: 'menu', label: t('menu'), icon: <LayoutGrid className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 px-6 py-3 pb-8 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center gap-1 group"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#4CAF50' : '#9CA3AF',
                }}
                className="relative z-10"
              >
                {item.icon}
                {item.id === 'cart' && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4CAF50] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950">
                    {totalItems}
                  </span>
                )}
              </motion.div>
              
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-[#4CAF50]' : 'text-gray-400 dark:text-zinc-500'}`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-10 h-1 bg-[#4CAF50] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
