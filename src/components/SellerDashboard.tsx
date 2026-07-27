import React, { useState } from 'react';
import { 
  Menu, 
  Package, 
  ShoppingBag, 
  BarChart2, 
  Layout, 
  Plus, 
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Bell,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { DashboardDrawer } from './DashboardDrawer';
import { NotificationCenter } from './NotificationCenter';
import { SettingsScreen } from './SettingsScreen';
import { ShopEditor } from './ShopEditor';
import { Shop, UdharRequest, UdharAccount } from '../types';
import { useUdhar } from '../context/UdharContext';

interface SellerDashboardProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const SellerDashboard = ({ onLogout, onSwitchRole }: SellerDashboardProps) => {
  const { user } = useAuth();
  const { requests, accounts, approveRequest, rejectRequest, getRequestsForShop, getAccountsForShop } = useUdhar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isViewingSettings, setIsViewingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState<UdharRequest | null>(null);

  const [shopData, setShopData] = useState<Shop>({
    id: 's1',
    name: 'Sharma Electronics',
    logo: 'https://picsum.photos/seed/shop1/200/200',
    rating: 4.5,
    category: 'Electronics',
    location: 'Lalipur, Mandla',
    description: 'We provide the best electronics products in Lalipur including mobiles, chargers, and accessories.',
    banners: [
      'https://picsum.photos/seed/shop_slide1/800/400',
      'https://picsum.photos/seed/shop_slide2/800/400',
    ],
    gallery: [
      'https://picsum.photos/seed/g1/300/300',
      'https://picsum.photos/seed/g2/300/300',
      'https://picsum.photos/seed/g3/300/300',
    ],
    offers: [
      { id: 'o1', code: 'ELECTRO10', description: '10% off on mobiles', discountType: 'percentage', value: 10 },
      { id: 'o2', code: 'FREESHIP', description: 'Free delivery above ₹500', discountType: 'fixed', value: 0, minOrder: 500 },
    ],
    products: [
      { id: 'p1', name: 'Smartphone X', price: 15999, rating: 4.8, image: 'https://picsum.photos/seed/p1/200/200', category: 'Mobiles' },
      { id: 'p2', name: 'Wireless Earbuds', price: 1999, rating: 4.5, image: 'https://picsum.photos/seed/p2/200/200', category: 'Accessories' },
    ],
    phone: '+91 98765 43210',
    address: 'Main Market, Lalipur, Mandla',
    hasActiveSubscription: true // Set to true for testing
  });

  const shopRequests = getRequestsForShop(shopData.id);
  const shopAccounts = getAccountsForShop(shopData.id);

  const stats = [
    { label: 'Total Sales', value: '₹45,230', icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: '128', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Products', value: shopData.products.length.toString(), icon: <Package className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Visitors', value: '1.2k', icon: <Users className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
  ];

  const renderContent = () => {
    if (isViewingSettings) {
      return <SettingsScreen onBack={() => setIsViewingSettings(false)} />;
    }

    switch (activeTab) {
      case 'products':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">My Products</h2>
              <button 
                onClick={() => setActiveTab('customization')}
                className="bg-[#1DB954] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-100"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
            <div className="space-y-4">
              {shopData.products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">₹{product.price}</p>
                    <button 
                      onClick={() => setActiveTab('customization')}
                      className="text-xs font-bold text-[#1DB954] uppercase tracking-widest mt-1"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order #AM-2024-{i}</p>
                      <h3 className="font-bold text-gray-900 mt-1">Rahul Sharma</h3>
                    </div>
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <p className="text-sm font-bold text-gray-500">3 Items • ₹1,240</p>
                    <button className="text-sm font-black text-[#1DB954] uppercase tracking-widest">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'customization':
        return (
          <ShopEditor 
            shop={shopData} 
            onSave={(updated) => {
              setShopData(updated);
              setActiveTab('overview');
            }}
            onBack={() => setActiveTab('overview')}
          />
        );
      case 'udhar':
        if (!shopData.hasActiveSubscription) {
          return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Premium Feature</h2>
              <p className="text-gray-500 max-w-xs font-bold">Udhar / Khata system is only available for premium subscribers. Upgrade your plan to enable this.</p>
              <button className="mt-8 bg-[#1DB954] text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-100">
                Upgrade Now
              </button>
            </div>
          );
        }
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">Udhar / Khata</h2>
              <div className="flex gap-2">
                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Settings</button>
              </div>
            </div>

            {/* Requests Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-orange-500" />
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">New Requests ({shopRequests.filter(r => r.status === 'pending').length})</h3>
              </div>
              <div className="space-y-4">
                {shopRequests.filter(r => r.status === 'pending').map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-gray-900">{req.customerName}</h4>
                        <p className="text-xs text-gray-400 font-bold">{req.phoneNumber}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(req.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-2xl italic">"{req.message}"</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="flex-1 bg-[#1DB954] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-50"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => rejectRequest(req.id)}
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {shopRequests.filter(r => r.status === 'pending').length === 0 && (
                  <p className="text-center py-8 text-gray-400 text-sm font-bold bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">No pending requests</p>
                )}
              </div>
            </div>

            {/* Active Customers Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-500" />
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Active Khata Customers ({shopAccounts.length})</h3>
              </div>
              <div className="space-y-4">
                {shopAccounts.map((acc) => (
                  <div key={acc.id} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                      {acc.customerName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900">{acc.customerName}</h4>
                      <p className="text-xs text-gray-400 font-bold">Limit: ₹{acc.limit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-red-600">₹{acc.balance}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Due: {new Date(acc.dueDate).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                ))}
                {shopAccounts.length === 0 && (
                  <p className="text-center py-8 text-gray-400 text-sm font-bold bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">No active customers</p>
                )}
              </div>
            </div>

            {/* Approval Modal */}
            <AnimatePresence>
              {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white w-full max-w-md rounded-[40px] p-8"
                  >
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Configure Khata</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Credit Limit (₹)</label>
                        <input id="limit" type="number" defaultValue="3000" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Min Order (₹)</label>
                        <input id="minOrder" type="number" defaultValue="50" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Interest (%)</label>
                          <input id="interest" type="number" defaultValue="2" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Period (Days)</label>
                          <input id="period" type="number" defaultValue="30" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <input type="checkbox" id="interestEnabled" defaultChecked className="w-5 h-5 rounded-lg accent-[#1DB954]" />
                        <label htmlFor="interestEnabled" className="text-sm font-bold text-gray-700">Enable Interest</label>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8">
                      <button 
                        onClick={() => setSelectedRequest(null)}
                        className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          const limit = Number((document.getElementById('limit') as HTMLInputElement).value);
                          const minOrder = Number((document.getElementById('minOrder') as HTMLInputElement).value);
                          const interestRate = Number((document.getElementById('interest') as HTMLInputElement).value);
                          const paymentPeriod = Number((document.getElementById('period') as HTMLInputElement).value);
                          const interestEnabled = (document.getElementById('interestEnabled') as HTMLInputElement).checked;
                          
                          approveRequest(selectedRequest.id, {
                            shopName: shopData.name,
                            limit,
                            minOrder,
                            interestRate,
                            interestEnabled,
                            paymentPeriod
                          });
                          setSelectedRequest(null);
                        }}
                        className="flex-1 bg-[#1DB954] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100"
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'ads':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Ads Manager</h2>
            <div className="bg-white p-6 rounded-[40px] border border-gray-100 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Active Ads</h3>
              <p className="text-sm text-gray-500">You have 2 active ad campaigns running.</p>
            </div>
            <button className="w-full bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100">
              Create New Ad
            </button>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Shop Overview</h2>
              <p className="text-gray-500 text-sm font-bold">Welcome back, {user?.displayName || 'Seller'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions for Seller */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Plus />, label: 'Add Product', tab: 'customization', color: 'bg-green-50 text-green-600' },
                { icon: <Package />, label: 'Products', tab: 'products', color: 'bg-blue-50 text-blue-600' },
                { icon: <ShoppingBag />, label: 'Orders', tab: 'orders', color: 'bg-purple-50 text-purple-600' },
                { icon: <Layout />, label: 'Shop', tab: 'customization', color: 'bg-orange-50 text-orange-600' },
                { icon: <TrendingUp />, label: 'Ads', tab: 'ads', color: 'bg-red-50 text-red-600' },
                { icon: <Settings />, label: 'Settings', tab: 'customization', color: 'bg-gray-50 text-gray-600' },
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

            <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden mb-8">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Performance Boost</h3>
                <p className="text-white/60 text-sm font-bold mb-6">Run ads to reach 5x more customers in Mandla.</p>
                <button className="bg-[#1DB954] text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-900/20">
                  Create Ad
                </button>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 w-48 h-48 text-white/5" />
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
          <span className="text-[10px] font-black text-[#1DB954] uppercase tracking-[0.2em]">Seller Dashboard</span>
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

      {/* Bottom Nav for Seller */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40">
        {[
          { id: 'overview', icon: <BarChart2 />, label: 'Stats' },
          { id: 'products', icon: <Package />, label: 'Items' },
          { id: 'orders', icon: <ShoppingBag />, label: 'Orders' },
          { id: 'udhar', icon: <BookOpen />, label: 'Khata' },
          { id: 'customization', icon: <Layout />, label: 'Shop' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-[#1DB954] scale-110' : 'text-gray-400'
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
        onOpenMiniWebsite={() => setActiveTab('customization')}
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
