import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationBellProps {
  onClick: () => void;
  unreadCount?: number;
}

export const NotificationBell = ({ onClick, unreadCount = 2 }: NotificationBellProps) => {
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </motion.button>
    </div>
  );
};
