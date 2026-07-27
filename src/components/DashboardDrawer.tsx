import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Store, 
  Bike, 
  Settings, 
  LogOut, 
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  Wallet,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Handshake
} from 'lucide-react';

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenMiniWebsite: () => void;
  onBecomeSeller: () => void;
  onBecomeRider: () => void;
  onOpenWallet: () => void;
  onOpenMap: () => void;
  onOpenSupport: () => void;
  onOpenSettings: () => void;
  onOpenUdhar?: () => void;
  onSwitchToSeller?: () => void;
  onSwitchToRider?: () => void;
  onOpenAdminDashboard?: () => void;
  user: any;
}

export const DashboardDrawer = ({ 
  isOpen, 
  onClose, 
  onLogout, 
  onOpenMiniWebsite, 
  onBecomeSeller,
  onBecomeRider,
  onOpenWallet,
  onOpenMap,
  onOpenSupport,
  onOpenSettings,
  onOpenUdhar,
  onSwitchToSeller,
  onSwitchToRider,
  onOpenAdminDashboard,
  user
}: DashboardDrawerProps) => {
  
  const [isPartnerExpanded, setIsPartnerExpanded] = useState(true);

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller' || user?.isSellerApproved;
  const isRider = user?.role === 'rider' || user?.isRiderApproved;

  // Seller / Rider Dynamic Items
  const partnerItems = [];
  
  if (isSeller) {
    partnerItems.push({
      icon: <Store className="w-4 h-4 text-emerald-600" />,
      label: 'Seller Dashboard',
      sub: 'Manage products, orders & shop',
      onClick: onSwitchToSeller,
    });
  } else {
    partnerItems.push({
      icon: <Store className="w-4 h-4 text-emerald-600" />,
      label: 'Become a Seller',
      sub: 'Start selling to Mandla customers',
      onClick: onBecomeSeller,
    });
  }

  if (isRider) {
    partnerItems.push({
      icon: <Bike className="w-4 h-4 text-blue-600" />,
      label: 'Rider Dashboard',
      sub: 'Manage deliveries & earnings',
      onClick: onSwitchToRider,
    });
  } else {
    partnerItems.push({
      icon: <Bike className="w-4 h-4 text-blue-600" />,
      label: 'Become a Rider',
      sub: 'Earn by delivering orders',
      onClick: onBecomeRider,
    });
  }

  const standardMenuItems = [
    { 
      icon: <User className="w-5 h-5" />, 
      label: 'My Profile & Mini Website', 
      sub: 'Customize public business card & bio',
      onClick: onOpenMiniWebsite
    },
    { 
      icon: <Wallet className="w-5 h-5" />, 
      label: 'My Wallet', 
      sub: 'Check balance & instant cashbacks',
      onClick: onOpenWallet
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      label: 'My Udhar / Khata Book', 
      sub: 'Manage shop credit & monthly bills',
      onClick: onOpenUdhar
    },
    { 
      icon: <Globe className="w-5 h-5" />, 
      label: 'Explore Shops on Map', 
      sub: 'Locate nearby local stores in Mandla',
      onClick: onOpenMap
    },
    ...(isAdmin ? [{
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      label: 'Admin Control Center',
      sub: 'Manage platform users, shops & riders',
      onClick: onOpenAdminDashboard
    }] : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[82%] max-w-sm bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 z-50 shadow-2xl flex flex-col border-r border-gray-100 dark:border-zinc-900"
          >
            {/* User Header */}
            <div className="bg-gradient-to-br from-[#1DB954] to-[#15803d] p-6 pt-10 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center text-[#1DB954] text-2xl font-bold shadow-lg shrink-0 border-2 border-white/20">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    (user?.displayName?.[0] || 'U')
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-lg font-black truncate leading-tight">{user?.displayName || 'Mandla Customer'}</h3>
                  <p className="text-white/80 text-xs truncate mt-0.5">{user?.email || user?.mobile || '+91 98765 43210'}</p>
                  <span className="inline-block bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-1.5">
                    {user?.role === 'admin' ? 'System Admin' : isSeller && isRider ? 'Seller & Rider' : isSeller ? 'Verified Seller' : isRider ? 'Delivery Partner' : 'Customer Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4 overflow-y-auto no-scrollbar space-y-4 px-4">
              
              {/* Standard Account Navigation */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-1">Account & Services</p>
                {standardMenuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-[#1DB954] transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-xs truncate">{item.label}</p>
                      <p className="text-[10px] text-gray-500 truncate">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1DB954]" />
                  </motion.button>
                ))}
              </div>

              {/* Become a Partner Accordion (Placed directly ABOVE App Settings) */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setIsPartnerExpanded(!isPartnerExpanded)}
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-emerald-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1DB954] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-xs">Become a Partner</h4>
                      <p className="text-[10px] text-emerald-700 font-bold">Earn as Seller or Rider in Mandla</p>
                    </div>
                  </div>
                  {isPartnerExpanded ? (
                    <ChevronDown className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                  )}
                </button>

                {/* Sub-Items inside Become a Partner */}
                <AnimatePresence>
                  {isPartnerExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3 space-y-1.5 pt-1 border-t border-emerald-200/50"
                    >
                      {partnerItems.map((item, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (item.onClick) item.onClick();
                            onClose();
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 transition-colors group text-left shadow-2xs"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-xs truncate">{item.label}</p>
                            <p className="text-[10px] text-gray-500 truncate">{item.sub}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* System Settings & Help */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <button
                  onClick={() => { onOpenSettings(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-800 text-xs flex-1">App Settings & Languages</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  onClick={() => { onOpenSupport(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                  <span className="font-bold text-gray-800 text-xs flex-1">Help & Customer Support</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              </div>

            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors font-black text-xs uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Account
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
