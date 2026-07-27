import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Package, ShoppingBag, Info, CheckCircle2, Clock } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const notifications = [
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order from Hotel Mandla has been delivered successfully.',
      time: '2 mins ago',
      type: 'success',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50'
    },
    {
      id: '2',
      title: 'Rider Assigned',
      message: 'A rider has been assigned to your parcel delivery request.',
      time: '15 mins ago',
      type: 'info',
      icon: <Package className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50'
    },
    {
      id: '3',
      title: 'Flash Sale!',
      message: 'Get 50% off on all groceries today at Mandla Supermart.',
      time: '1 hour ago',
      type: 'promo',
      icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-50'
    },
    {
      id: '4',
      title: 'Wallet Recharge',
      message: '₹500 has been added to your wallet successfully.',
      time: '3 hours ago',
      type: 'success',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Notifications</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stay updated</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${notif.bg} p-4 rounded-[32px] flex gap-4 border border-white/50`}
                >
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-gray-900 text-sm">{notif.title}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{notif.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
