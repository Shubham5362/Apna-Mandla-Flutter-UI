import React, { useState } from 'react';
import { 
  Menu, 
  Bike, 
  Package, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Bell,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { DashboardDrawer } from './DashboardDrawer';
import { NotificationCenter } from './NotificationCenter';
import { SettingsScreen } from './SettingsScreen';

interface RiderDashboardProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const RiderDashboard = ({ onLogout, onSwitchRole }: RiderDashboardProps) => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isViewingSettings, setIsViewingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');

  const earnings = [
    { label: 'Today', value: '₹450', icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { label: 'Deliveries', value: '12', icon: <Package className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Distance', value: '42 km', icon: <Navigation className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Rating', value: '4.9', icon: <Clock className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
  ];

  const renderContent = () => {
    if (isViewingSettings) {
      return <SettingsScreen onBack={() => setIsViewingSettings(false)} />;
    }

    switch (activeTab) {
      case 'requests':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Nearby Requests</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parcel Delivery</p>
                        <h3 className="font-bold text-gray-900">₹{120 + i * 10} • 3.2 km</h3>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">New</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="w-0.5 flex-1 bg-gray-100" />
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                          <p className="text-sm font-bold text-gray-900">Lalipur, Mandla</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Drop</p>
                          <p className="text-sm font-bold text-gray-900">Binjhiya, Mandla</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Reject</button>
                    <button className="flex-1 bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'active':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Active Delivery</h2>
            <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Current Task</p>
                    <h3 className="text-2xl font-black mt-1">Pickup from Shop</h3>
                  </div>
                  <Navigation className="w-8 h-8 text-[#1DB954]" />
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Destination</p>
                      <p className="font-bold">Sharma Electronics, Katra</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-900/20">
                  Arrived at Pickup
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>
        );
      case 'earnings':
      default:
        return (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">My Earnings</h2>
              <p className="text-gray-500 text-sm font-bold">Great job today, {user?.displayName || 'Rider'}!</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {earnings.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions for Rider */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Bell />, label: 'Nearby', tab: 'requests', color: 'bg-blue-50 text-blue-600' },
                { icon: <Package />, label: 'Active', tab: 'active', color: 'bg-green-50 text-green-600' },
                { icon: <Navigation />, label: 'Nav', tab: 'active', color: 'bg-purple-50 text-purple-600' },
                { icon: <DollarSign />, label: 'Earnings', tab: 'earnings', color: 'bg-orange-50 text-orange-600' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveTab(action.tab)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                    {React.cloneElement(action.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">{action.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-[40px] border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">Recent History</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">Delivery #{i+100}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">2 hours ago</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 text-sm">+₹45</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-30">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Rider Dashboard</span>
          <h1 className="text-lg font-black text-gray-900">APNA MANDLA</h1>
        </div>
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderContent()}
      </div>

      {/* Bottom Nav for Rider */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40">
        {[
          { id: 'requests', icon: <Bell />, label: 'Requests' },
          { id: 'active', icon: <Navigation />, label: 'Active' },
          { id: 'earnings', icon: <DollarSign />, label: 'Earnings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-gray-400'
            }`}
          >
            {React.cloneElement(tab.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <DashboardDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onLogout={onLogout}
        onOpenMiniWebsite={() => {}}
        onBecomeSeller={() => {}}
        onBecomeRider={() => {}}
        onOpenWallet={() => {}}
        onOpenMap={() => {}}
        onOpenSupport={() => {}}
        onOpenSettings={() => setIsViewingSettings(true)}
        onSwitchToSeller={() => onSwitchRole('seller')}
        onSwitchToRider={() => onSwitchRole('rider')}
        onOpenAdminDashboard={() => onSwitchRole('admin')}
        user={user}
      />

      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
};
