import React, { useState } from 'react';
import { 
  Menu, 
  Users, 
  Store, 
  Bike, 
  ShoppingBag, 
  Layout, 
  Settings, 
  Bell,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Package,
  Truck,
  Image as ImageIcon,
  Wallet,
  MapPin,
  ListTree,
  MessageSquare,
  Send,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Ban,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { DashboardDrawer } from './DashboardDrawer';
import { NotificationCenter } from './NotificationCenter';
import { SettingsScreen } from './SettingsScreen';

const orderData = [
  { name: 'Mon', orders: 45 },
  { name: 'Tue', orders: 52 },
  { name: 'Wed', orders: 38 },
  { name: 'Thu', orders: 65 },
  { name: 'Fri', orders: 48 },
  { name: 'Sat', orders: 85 },
  { name: 'Sun', orders: 72 },
];

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
];

const registrationData = [
  { name: 'Week 1', users: 120 },
  { name: 'Week 2', users: 150 },
  { name: 'Week 3', users: 180 },
  { name: 'Week 4', users: 210 },
];

interface AdminDashboardProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const AdminDashboard = ({ onLogout, onSwitchRole }: AdminDashboardProps) => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isViewingSettings, setIsViewingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Revenue', value: '₹12.4L', icon: <DollarSign />, color: 'bg-green-50 text-green-600' },
    { label: 'Total Users', value: '8.5k', icon: <Users />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Sellers', value: '450', icon: <Store />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Riders', value: '120', icon: <Bike />, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Shops', value: '380', icon: <Store />, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Products', value: '12.2k', icon: <ShoppingBag />, color: 'bg-pink-50 text-pink-600' },
    { label: 'Total Orders', value: '45.8k', icon: <Package />, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Parcel Deliveries', value: '2.4k', icon: <Truck />, color: 'bg-teal-50 text-teal-600' },
    { label: 'Active Ads', value: '24', icon: <ImageIcon />, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'New Registrations', value: '156', icon: <UserPlus />, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const menuItems = [
    { id: 'overview', icon: <Layout />, label: 'Overview' },
    { id: 'users', icon: <Users />, label: 'Users' },
    { id: 'sellers', icon: <Store />, label: 'Sellers' },
    { id: 'riders', icon: <Bike />, label: 'Riders' },
    { id: 'shops', icon: <Store />, label: 'Shops' },
    { id: 'products', icon: <ShoppingBag />, label: 'Products' },
    { id: 'orders', icon: <Package />, label: 'Orders' },
    { id: 'parcel', icon: <Truck />, label: 'Parcel' },
    { id: 'ads', icon: <ImageIcon />, label: 'Ads' },
    { id: 'wallet', icon: <Wallet />, label: 'Wallet' },
    { id: 'locations', icon: <MapPin />, label: 'Locations' },
    { id: 'categories', icon: <ListTree />, label: 'Categories' },
    { id: 'support', icon: <MessageSquare />, label: 'Support' },
    { id: 'notifications', icon: <Send />, label: 'Notify' },
    { id: 'settings', icon: <Settings />, label: 'Settings' },
  ];

  const renderContent = () => {
    if (isViewingSettings) {
      return <SettingsScreen onBack={() => setIsViewingSettings(false)} />;
    }

    switch (activeTab) {
      case 'users':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">User Management</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm font-bold outline-none w-48"
                  />
                </div>
                <button className="p-2 bg-gray-100 rounded-xl"><Filter className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Shubham Yadav', email: 'shubham@example.com', role: 'Admin', status: 'Active' },
                { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Seller', status: 'Active' },
                { name: 'Priya Singh', email: 'priya@example.com', role: 'Customer', status: 'Active' },
                { name: 'Amit Kumar', email: 'amit@example.com', role: 'Rider', status: 'Blocked' },
                { name: 'Sneha Gupta', email: 'sneha@example.com', role: 'Customer', status: 'Active' },
              ].map((user, i) => (
                <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-500">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>{user.status}</span>
                    <button className="p-1 text-gray-400"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'sellers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Seller Management</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-purple-50 p-6 rounded-[32px] mb-4">
                <h3 className="text-purple-900 font-black mb-2">Pending Applications</h3>
                <p className="text-purple-700 text-sm font-bold">5 new sellers waiting for approval</p>
              </div>
              {[
                { shop: 'Mandla Electronics', owner: 'Rajesh Kumar', location: 'Katra', status: 'Pending', sales: '₹0' },
                { shop: 'Fresh Veggies', owner: 'Suresh Patel', location: 'Lalipur', status: 'Active', sales: '₹45,200' },
                { shop: 'Royal Fashion', owner: 'Anjali Verma', location: 'Binjhiya', status: 'Active', sales: '₹1,20,500' },
              ].map((seller, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden">
                        <img src={`https://picsum.photos/seed/s${i+10}/200/200`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{seller.shop}</h3>
                        <p className="text-xs text-gray-500">{seller.owner} • {seller.location}</p>
                        <p className="text-[10px] font-black text-purple-600 mt-1 uppercase tracking-widest">Sales: {seller.sales}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      seller.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>{seller.status}</span>
                  </div>
                  <div className="flex gap-3">
                    {seller.status === 'Pending' ? (
                      <>
                        <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button className="flex-1 bg-green-50 text-green-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          <Ban className="w-4 h-4" /> Suspend
                        </button>
                        <button className="flex-1 bg-purple-50 text-purple-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" /> Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'riders':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Rider Management</h2>
            <div className="space-y-4">
              {[
                { name: 'Vikram Singh', phone: '9876543210', vehicle: 'Bike', status: 'Active', earnings: '₹12,400' },
                { name: 'Arjun Kumar', phone: '8765432109', vehicle: 'Scooter', status: 'Pending', earnings: '₹0' },
              ].map((rider, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden">
                        <img src={`https://picsum.photos/seed/r${i}/200/200`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{rider.name}</h3>
                        <p className="text-xs text-gray-500">{rider.phone} • {rider.vehicle}</p>
                        <p className="text-[10px] font-black text-orange-600 mt-1 uppercase tracking-widest">Earnings: {rider.earnings}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      rider.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>{rider.status}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">History</button>
                    <button className="flex-1 bg-purple-50 text-purple-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'shops':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Shop Management</h2>
              <button className="p-2 bg-gray-100 rounded-xl"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Mandla Grocery', category: 'Groceries', rating: 4.8, products: 156 },
                { name: 'Tech World', category: 'Electronics', rating: 4.5, products: 89 },
                { name: 'Fashion Hub', category: 'Clothing', rating: 4.2, products: 234 },
              ].map((shop, i) => (
                <div key={i} className="bg-white p-4 rounded-[32px] border border-gray-100">
                  <div className="aspect-video w-full bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                    <img src={`https://picsum.photos/seed/shop${i}/800/400`} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-900 shadow-sm"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-gray-900">{shop.name}</h3>
                      <p className="text-xs text-gray-500">{shop.category} • {shop.products} Products</p>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-[10px] font-black">{shop.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Monitoring</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
              {['All', 'Pending', 'Preparing', 'Out for delivery', 'Delivered'].map(status => (
                <button key={status} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap">
                  {status}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { id: '#ORD-9821', customer: 'Priya Singh', shop: 'Mandla Grocery', total: '₹450', status: 'Pending' },
                { id: '#ORD-9820', customer: 'Rahul Sharma', shop: 'Tech World', total: '₹1,200', status: 'Out for delivery' },
                { id: '#ORD-9819', customer: 'Sneha Gupta', shop: 'Fashion Hub', total: '₹890', status: 'Delivered' },
              ].map((order, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-gray-900">{order.id}</h3>
                      <p className="text-xs text-gray-500">{order.customer} • {order.shop}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                      order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-gray-900">{order.total}</p>
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-50 text-gray-600 rounded-xl"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Product Moderation</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm font-bold outline-none w-40"
                  />
                </div>
                <button className="p-2 bg-gray-100 rounded-xl"><Filter className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Organic Tomatoes', shop: 'Mandla Grocery', price: '₹40/kg', status: 'Approved' },
                { name: 'Wireless Mouse', shop: 'Tech World', price: '₹899', status: 'Pending' },
                { name: 'Cotton T-Shirt', shop: 'Fashion Hub', price: '₹599', status: 'Approved' },
                { name: 'Fresh Milk', shop: 'Dairy Fresh', price: '₹60/L', status: 'Approved' },
              ].map((product, i) => (
                <div key={i} className="bg-white p-3 rounded-[32px] border border-gray-100">
                  <div className="aspect-square w-full bg-gray-100 rounded-2xl mb-3 overflow-hidden relative">
                    <img src={`https://picsum.photos/seed/p${i+50}/200/200`} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-900 shadow-sm"><Edit3 className="w-3 h-3" /></button>
                      <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 shadow-sm"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs truncate">{product.name}</h3>
                  <p className="text-[10px] text-gray-500 mb-1">{product.shop}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-purple-600">{product.price}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      product.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>{product.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'parcel':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Parcel Deliveries</h2>
            <div className="space-y-4">
              {[
                { id: '#PRL-102', from: 'Lalipur', to: 'Katra', status: 'Searching Rider', rider: 'Unassigned' },
                { id: '#PRL-101', from: 'Binjhiya', to: 'Padmi', status: 'In Transit', rider: 'Vikram Singh' },
              ].map((parcel, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-gray-900">{parcel.id}</h3>
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Status: {parcel.status}</p>
                    </div>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-xl"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <p className="text-xs font-bold text-gray-600">Pickup: {parcel.from}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <p className="text-xs font-bold text-gray-600">Drop: {parcel.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-600">{parcel.rider}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Assign</button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-xl"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ads':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Ad Management</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Ad
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Summer Sale Banner', shop: 'Fashion Hub', duration: '7 Days', status: 'Active', clicks: 450 },
                { title: 'New Store Launch', shop: 'Tech World', duration: '14 Days', status: 'Expired', clicks: 1200 },
              ].map((ad, i) => (
                <div key={i} className="bg-white p-4 rounded-[32px] border border-gray-100">
                  <div className="aspect-[21/9] w-full bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                    <img src={`https://picsum.photos/seed/ad${i}/800/300`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{ad.title}</h3>
                      <p className="text-xs text-gray-500">{ad.shop} • {ad.duration}</p>
                      <p className="text-[10px] font-black text-blue-600 mt-1 uppercase tracking-widest">{ad.clicks} Clicks</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      ad.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>{ad.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Wallet & Payouts</h2>
            <div className="bg-gray-900 p-8 rounded-[40px] text-white mb-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Platform Balance</p>
                <h3 className="text-4xl font-black mb-6">₹42.85L</h3>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Seller Payouts</p>
                    <p className="text-lg font-black">₹12.4L</p>
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-3xl">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Rider Payouts</p>
                    <p className="text-lg font-black">₹2.8L</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            
            <h3 className="font-black text-gray-900 mb-4">Pending Withdrawals</h3>
            <div className="space-y-4">
              {[
                { seller: 'Mandla Electronics', amount: '₹15,000', date: '2h ago' },
                { seller: 'Fresh Veggies', amount: '₹4,500', date: '5h ago' },
              ].map((payout, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{payout.seller}</h4>
                    <p className="text-xs text-gray-500">{payout.date}</p>
                    <p className="text-sm font-black text-purple-600 mt-1">{payout.amount}</p>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100">Approve</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'locations':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Area Management</h2>
              <button className="p-2 bg-gray-100 rounded-xl"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {['Lalipur', 'Katra', 'Binjhiya', 'Hirdenagar', 'Padmi'].map(area => (
                <div key={area} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-900">{area}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400"><Edit3 className="w-4 h-4" /></button>
                    <button className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Categories</h2>
              <button className="p-2 bg-gray-100 rounded-xl"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Groceries', 'Electronics', 'Food', 'Clothing', 'Medicines', 'Mobiles'].map(cat => (
                <div key={cat} className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <ListTree className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{cat}</span>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400"><Edit3 className="w-3 h-3" /></button>
                    <button className="p-1 text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Support Tickets</h2>
            <div className="space-y-4">
              {[
                { user: 'Priya Singh', subject: 'Order not delivered', date: '1h ago', status: 'Open' },
                { user: 'Rahul Sharma', subject: 'Payment issue', date: '3h ago', status: 'In Progress' },
                { user: 'Amit Kumar', subject: 'App crashing', date: '1d ago', status: 'Closed' },
              ].map((ticket, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{ticket.subject}</h4>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      ticket.status === 'Open' ? 'bg-red-50 text-red-600' : 
                      ticket.status === 'Closed' ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-600'
                    }`}>{ticket.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{ticket.user} • {ticket.date}</p>
                  <button className="w-full py-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest">Respond</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Announcements</h2>
            <div className="bg-white p-6 rounded-[40px] border border-gray-100 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Target Audience</label>
                  <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none">
                    <option>All Users</option>
                    <option>Customers Only</option>
                    <option>Sellers Only</option>
                    <option>Riders Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Message Title</label>
                  <input type="text" placeholder="Enter title..." className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Message Body</label>
                  <textarea rows={4} placeholder="Enter message..." className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-900 outline-none resize-none" />
                </div>
                <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-100 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Send Notification
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">System Control</h2>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Pricing</h3>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">0–2 km</span>
                    <input type="text" defaultValue="₹20" className="w-20 p-2 bg-gray-50 rounded-xl text-center font-black text-purple-600 outline-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">2–5 km</span>
                    <input type="text" defaultValue="₹40" className="w-20 p-2 bg-gray-50 rounded-xl text-center font-black text-purple-600 outline-none" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Security & Verification</h3>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Biometric Login</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Fingerprint/FaceID</p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Aadhaar Verification</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Required for Sellers/Riders</p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Subscription & Ads</h3>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Seller Pro Plan</span>
                    <input type="text" defaultValue="₹999/mo" className="w-24 p-2 bg-gray-50 rounded-xl text-center font-black text-purple-600 outline-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Ad Banner (7d)</span>
                    <input type="text" defaultValue="₹499" className="w-24 p-2 bg-gray-50 rounded-xl text-center font-black text-purple-600 outline-none" />
                  </div>
                </div>
              </section>

              <button 
                onClick={() => setIsViewingSettings(true)}
                className="w-full p-6 bg-purple-50 text-purple-600 rounded-[32px] flex items-center justify-between font-black uppercase tracking-widest text-xs"
              >
                <span>Platform App Settings</span>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Platform Overview</h2>
              <p className="text-gray-500 text-sm font-bold">Real-time system insights</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.slice(0, 4).map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
                    {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8 mb-8">
              <section className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Daily Orders</h3>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Growth</h3>
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">New Registrations</h3>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="stepAfter" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden mb-8">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Platform Health</h3>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm font-bold">All services online</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 mt-4">
                    <span>Server Load</span>
                    <span>24%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[24%] h-full bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Admin Panel</span>
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

      {/* Internal Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[88px] z-20 overflow-x-auto no-scrollbar px-4 py-3 flex gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === item.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-3 h-3' })}
              {item.label}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderContent()}
      </div>

      {/* Bottom Nav for Admin - Simplified to main sections */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40">
        {[
          { id: 'overview', icon: <Layout />, label: 'Stats' },
          { id: 'users', icon: <Users />, label: 'Users' },
          { id: 'sellers', icon: <Store />, label: 'Sellers' },
          { id: 'orders', icon: <Package />, label: 'Orders' },
          { id: 'settings', icon: <Settings />, label: 'System' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-purple-600 scale-110' : 'text-gray-400'
            }`}
          >
            {React.cloneElement(tab.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
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
        onOpenWallet={() => setActiveTab('wallet')}
        onOpenMap={() => setActiveTab('locations')}
        onOpenSupport={() => setActiveTab('support')}
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
