import React, { useState } from 'react';
import { validatePlusCode } from '../utils/plusCode';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Truck, 
  Navigation, 
  ChevronRight, 
  Clock, 
  ShieldCheck,
  Info,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  Utensils,
  Pill,
  ShoppingBag,
  Shirt,
  Smartphone,
  AlertTriangle,
  Box,
  PlusCircle,
  Calendar,
  Zap,
  CreditCard,
  Wallet,
  Building,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Download,
  Share2,
  Check,
  Copy,
  X,
  Sparkles,
  User,
  Star,
  QrCode,
  Sliders,
  Send,
  HelpCircle,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
export interface ParcelBooking {
  id: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  receiverName: string;
  receiverPhone: string;
  dropAddress: string;
  parcelType: string;
  weight: string;
  dimensions?: string;
  declaredValue: number;
  specialInstructions?: string;
  pickupType: 'instant' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  deliverySpeed: 'standard' | 'express' | 'sameday' | 'nextday';
  paymentMethod: string;
  fareBreakdown: {
    baseFare: number;
    distanceCharge: number;
    weightCharge: number;
    speedSurge: number;
    discount: number;
    total: number;
  };
  couponCode?: string;
  status: 'confirmed' | 'rider_assigned' | 'picked_up' | 'on_the_way' | 'near_destination' | 'delivered';
  otp: string;
  rider?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    vehicleNumber: string;
    photo: string;
  };
  createdAt: string;
  estimatedMinutes: number;
}

const PARCEL_TYPES = [
  { id: 'documents', label: 'Documents', icon: FileText, desc: 'Papers, Letters, ID Cards', basePrice: 35 },
  { id: 'food', label: 'Food Items', icon: Utensils, desc: 'Hot Tiffin, Sweets, Bakery', basePrice: 45 },
  { id: 'medicines', label: 'Medicines', icon: Pill, desc: 'Pharma & Emergency Care', basePrice: 40 },
  { id: 'groceries', label: 'Groceries', icon: ShoppingBag, desc: 'Daily Staples, Supplies', basePrice: 50 },
  { id: 'clothes', label: 'Clothes', icon: Shirt, desc: 'Apparel & Fabrics', basePrice: 40 },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, desc: 'Gadgets, Accessories', basePrice: 60 },
  { id: 'fragile', label: 'Fragile Items', icon: AlertTriangle, desc: 'Glassware, Crockery', basePrice: 70 },
  { id: 'large', label: 'Large Package', icon: Box, desc: 'Heavy / Bulky Boxes', basePrice: 90 },
  { id: 'custom', label: 'Custom Item', icon: PlusCircle, desc: 'Anything else under 20kg', basePrice: 50 },
];

const WEIGHT_OPTIONS = [
  { id: 'under_1kg', label: 'Under 1 kg', multiplier: 1 },
  { id: '1_5kg', label: '1 kg - 5 kg', multiplier: 1.3 },
  { id: '5_10kg', label: '5 kg - 10 kg', multiplier: 1.8 },
  { id: '10_20kg', label: '10 kg - 20 kg', multiplier: 2.5 },
];

const DELIVERY_SPEEDS = [
  { id: 'standard', label: 'Standard Delivery', time: '1 - 2 Hours', extra: 0, tag: 'Most Popular' },
  { id: 'express', label: 'Express Delivery', time: '25 - 35 Mins', extra: 30, tag: 'Super Fast ⚡' },
  { id: 'sameday', label: 'Same Day Evening', time: 'By 7:00 PM', extra: -10, tag: 'Saver' },
  { id: 'nextday', label: 'Scheduled Next Day', time: 'Tomorrow Slot', extra: -15, tag: 'Planned' },
];

const SAVED_ADDRESSES = [
  { id: 'a1', title: 'Home (Lalipur)', address: 'House No. 42, Ward 12, Lalipur, Mandla' },
  { id: 'a2', title: 'Office (Main Market)', address: 'Shop 14, Commercial Complex, Main Market, Mandla' },
  { id: 'a3', title: 'Store (Binjhiya)', address: 'Near Bus Stand, Binjhiya Square, Mandla' },
];

const INITIAL_DELIVERIES: ParcelBooking[] = [
  {
    id: 'PK-9821',
    senderName: 'Shubham Yadav',
    senderPhone: '+91 98765 43210',
    pickupAddress: 'Lalipur, Mandla',
    receiverName: 'Amit Verma',
    receiverPhone: '+91 98123 45678',
    dropAddress: 'Binjhiya Square, Mandla',
    parcelType: 'Documents',
    weight: 'Under 1 kg',
    declaredValue: 500,
    pickupType: 'instant',
    deliverySpeed: 'express',
    paymentMethod: 'UPI',
    fareBreakdown: { baseFare: 35, distanceCharge: 20, weightCharge: 0, speedSurge: 30, discount: 15, total: 70 },
    status: 'on_the_way',
    otp: '4821',
    rider: {
      name: 'Ramesh Kumar',
      phone: '+91 99887 76655',
      rating: 4.9,
      vehicle: 'TVS XL100 (Express Parcel Bike)',
      vehicleNumber: 'MP-51-AB-4321',
      photo: 'https://picsum.photos/seed/rider1/200/200'
    },
    createdAt: 'Today, 10:15 AM',
    estimatedMinutes: 18
  },
  {
    id: 'PK-8712',
    senderName: 'Shubham Yadav',
    senderPhone: '+91 98765 43210',
    pickupAddress: 'District Hospital Road, Mandla',
    receiverName: 'Pooja Sharma',
    receiverPhone: '+91 97654 32109',
    dropAddress: 'Nainpur Road, Mandla',
    parcelType: 'Medicines',
    weight: 'Under 1 kg',
    declaredValue: 1200,
    pickupType: 'instant',
    deliverySpeed: 'standard',
    paymentMethod: 'Wallet',
    fareBreakdown: { baseFare: 40, distanceCharge: 25, weightCharge: 0, speedSurge: 0, discount: 10, total: 55 },
    status: 'delivered',
    otp: '9102',
    rider: {
      name: 'Sunil Patel',
      phone: '+91 98111 22233',
      rating: 4.8,
      vehicle: 'Hero Splendor',
      vehicleNumber: 'MP-51-CD-8899',
      photo: 'https://picsum.photos/seed/rider2/200/200'
    },
    createdAt: 'Yesterday, 4:30 PM',
    estimatedMinutes: 0
  }
];

export const ParcelScreen: React.FC = () => {
  // Navigation State inside Parcel Module
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'tracking' | 'history'>('home');
  const [bookingStep, setBookingStep] = useState<number>(1);

  // Active Deliveries State
  const [deliveries, setDeliveries] = useState<ParcelBooking[]>(INITIAL_DELIVERIES);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<ParcelBooking | null>(INITIAL_DELIVERIES[0]);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<ParcelBooking | null>(null);

  // Form State
  const [pickupAddress, setPickupAddress] = useState('House 42, Lalipur, Mandla');
  const [pickupPlusCode, setPickupPlusCode] = useState('7J4V+3M Mandla');
  const [pickupPlusCodeError, setPickupPlusCodeError] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('Shubham Yadav');
  const [senderPhone, setSenderPhone] = useState('+91 98765 43210');

  const [dropAddress, setDropAddress] = useState('');
  const [dropPlusCode, setDropPlusCode] = useState('');
  const [dropPlusCodeError, setDropPlusCodeError] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  const [selectedType, setSelectedType] = useState('documents');
  const [selectedWeight, setSelectedWeight] = useState('under_1kg');
  const [dimensions, setDimensions] = useState('Compact (Fits in bag)');
  const [declaredValue, setDeclaredValue] = useState<string>('500');
  const [instructions, setInstructions] = useState('');

  const [pickupType, setPickupType] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('Today');
  const [scheduledTime, setScheduledTime] = useState('2:00 PM - 3:00 PM');
  const [selectedSpeed, setSelectedSpeed] = useState<'standard' | 'express' | 'sameday' | 'nextday'>('express');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Interactive UI States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Fare Calculation Function
  const calculateFare = () => {
    const pType = PARCEL_TYPES.find(t => t.id === selectedType) || PARCEL_TYPES[0];
    const wType = WEIGHT_OPTIONS.find(w => w.id === selectedWeight) || WEIGHT_OPTIONS[0];
    const sType = DELIVERY_SPEEDS.find(s => s.id === selectedSpeed) || DELIVERY_SPEEDS[0];

    const baseFare = pType.basePrice;
    const distanceCharge = 25; // fixed estimated distance charge inside Mandla town
    const weightCharge = Math.round(baseFare * (wType.multiplier - 1));
    const speedSurge = sType.extra;
    const discount = appliedCoupon === 'PARCEL50' ? 50 : appliedCoupon === 'EXPRESS20' ? 20 : 0;
    
    const subtotal = baseFare + distanceCharge + weightCharge + speedSurge;
    const total = Math.max(20, subtotal - discount);

    return { baseFare, distanceCharge, weightCharge, speedSurge, discount, total };
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'PARCEL50' || couponCode.toUpperCase() === 'EXPRESS20') {
      setAppliedCoupon(couponCode.toUpperCase());
      showToast(`Coupon ${couponCode.toUpperCase()} applied! 🎉`);
    } else {
      showToast('Invalid Coupon Code. Try PARCEL50 or EXPRESS20');
    }
  };

  const handleCreateBooking = () => {
    const fare = calculateFare();
    const newBooking: ParcelBooking = {
      id: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: senderName || 'Shubham Yadav',
      senderPhone: senderPhone || '+91 98765 43210',
      pickupAddress: pickupAddress || 'Lalipur, Mandla',
      receiverName: receiverName || 'Local Receiver',
      receiverPhone: receiverPhone || '+91 98000 11122',
      dropAddress: dropAddress || 'Main Market, Mandla',
      parcelType: PARCEL_TYPES.find(t => t.id === selectedType)?.label || 'Document',
      weight: WEIGHT_OPTIONS.find(w => w.id === selectedWeight)?.label || 'Under 1 kg',
      dimensions,
      declaredValue: Number(declaredValue) || 500,
      specialInstructions: instructions,
      pickupType,
      scheduledDate,
      scheduledTime,
      deliverySpeed: selectedSpeed,
      paymentMethod,
      fareBreakdown: fare,
      couponCode: appliedCoupon || undefined,
      status: 'confirmed',
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      rider: {
        name: 'Vikas Kushwaha',
        phone: '+91 98222 33344',
        rating: 4.9,
        vehicle: 'Hero Splendor (Local Express)',
        vehicleNumber: 'MP-51-EF-1234',
        photo: 'https://picsum.photos/seed/rider3/200/200'
      },
      createdAt: 'Just Now',
      estimatedMinutes: selectedSpeed === 'express' ? 25 : 45
    };

    setDeliveries(prev => [newBooking, ...prev]);
    setActiveTrackingBooking(newBooking);
    setActiveTab('tracking');
    setBookingStep(1);
    showToast(`Parcel Booking Confirmed! ID: ${newBooking.id} 🚚`);
  };

  // Repeat Booking Helper
  const handleRepeatBooking = (booking: ParcelBooking) => {
    setPickupAddress(booking.pickupAddress);
    setDropAddress(booking.dropAddress);
    setReceiverName(booking.receiverName);
    setReceiverPhone(booking.receiverPhone);
    setActiveTab('booking');
    setBookingStep(3);
    showToast(`Re-booking shipment to ${booking.receiverName}!`);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/50 pb-28 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar Navigation inside Parcel */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-30 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-50 text-[#1DB954] rounded-2xl flex items-center justify-center font-black">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-gray-900 leading-none">Apna Mandla Logistics</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">District Parcel Delivery</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'home' ? 'bg-white text-[#1DB954] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'booking' ? 'bg-[#1DB954] text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            + Book
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all relative ${
              activeTab === 'tracking' ? 'bg-white text-[#1DB954] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Live Track
            {deliveries.some(d => d.status !== 'delivered') && (
              <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-1 right-1 animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'history' ? 'bg-white text-[#1DB954] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* TAB 1: PARCEL HOME */}
      {activeTab === 'home' && (
        <div className="p-5 space-y-5">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-[240px]">
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-400/30 mb-2 inline-block">
                ⚡ 30-Min Local Parcel Express
              </span>
              <h2 className="text-xl font-black tracking-tight leading-tight mb-2">Send Anything Anywhere in Mandla</h2>
              <p className="text-white/70 text-xs font-medium mb-4">Documents, Tiffins, Medicines & Packages picked up from your doorstep in 10 mins.</p>
              
              <button
                onClick={() => setActiveTab('booking')}
                className="bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md uppercase tracking-wider active:scale-95 transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Book Parcel Now</span>
              </button>
            </div>

            <Truck className="absolute -right-6 -bottom-6 w-44 h-44 text-white/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2.5">
            <button 
              onClick={() => { setActiveTab('booking'); setBookingStep(1); }}
              className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col items-center text-center hover:border-emerald-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1DB954] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-gray-900">Send Parcel</span>
            </button>

            <button 
              onClick={() => { setActiveTab('booking'); setBookingStep(2); }}
              className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col items-center text-center hover:border-blue-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-gray-900">Request Pickup</span>
            </button>

            <button 
              onClick={() => { setActiveTab('tracking'); }}
              className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col items-center text-center hover:border-purple-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-gray-900">Live Track</span>
            </button>

            <button 
              onClick={() => setActiveTab('history')}
              className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col items-center text-center hover:border-amber-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-gray-900">History</span>
            </button>
          </div>

          {/* Active Live Shipment Shortcut Card */}
          {activeTrackingBooking && (
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-3xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live Delivery in Progress
                </span>
                <span className="text-xs font-black text-emerald-900">ETA: {activeTrackingBooking.estimatedMinutes} mins</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 font-black shadow-2xs">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-xs truncate">To: {activeTrackingBooking.receiverName}</p>
                  <p className="text-[10px] text-gray-500 truncate font-bold">{activeTrackingBooking.dropAddress}</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Status: On The Way with Rider</p>
                </div>
                <button 
                  onClick={() => setActiveTab('tracking')}
                  className="bg-[#1DB954] text-white px-3 py-2 rounded-xl text-xs font-black shadow-xs shrink-0"
                >
                  Track Map →
                </button>
              </div>
            </div>
          )}

          {/* Parcel Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">What are you sending?</h2>
              <span className="text-[10px] text-gray-400 font-bold">Standard rates starting ₹35</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PARCEL_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setActiveTab('booking');
                      setBookingStep(3);
                    }}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs flex flex-col items-center text-center hover:border-emerald-400 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center mb-1.5 group-hover:bg-emerald-50 group-hover:text-[#1DB954] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-gray-900 text-xs leading-tight">{type.label}</p>
                    <p className="text-[9px] font-bold text-emerald-600 mt-0.5">From ₹{type.basePrice}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Offers for Parcel */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-3xl shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Parcel Coupon</span>
              <h3 className="text-sm font-black">Get Flat ₹50 OFF on 1st Delivery</h3>
              <p className="text-[10px] text-purple-100 font-medium">Use code <strong className="underline">PARCEL50</strong> at checkout</p>
            </div>
            <button 
              onClick={() => {
                setCouponCode('PARCEL50');
                setAppliedCoupon('PARCEL50');
                showToast('Applied PARCEL50 coupon code!');
              }}
              className="bg-white text-purple-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-xs hover:bg-purple-50"
            >
              Apply Code
            </button>
          </div>

          {/* Saved Addresses */}
          <div>
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3">Saved Addresses</h2>
            <div className="space-y-2">
              {SAVED_ADDRESSES.map((addr) => (
                <div key={addr.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{addr.title}</p>
                      <p className="text-[10px] text-gray-500 font-bold truncate max-w-[220px]">{addr.address}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPickupAddress(addr.address);
                      setActiveTab('booking');
                      showToast(`Selected ${addr.title} as pickup!`);
                    }}
                    className="text-[10px] font-black text-[#1DB954] bg-emerald-50 px-2.5 py-1 rounded-lg"
                  >
                    Use Pickup
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BOOK PARCEL (STEP-BY-STEP FLOW) */}
      {activeTab === 'booking' && (
        <div className="p-5 space-y-5">
          
          {/* Step Progress Indicator */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <button
                  onClick={() => s <= bookingStep && setBookingStep(s)}
                  className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                    bookingStep === s 
                      ? 'bg-[#1DB954] text-white shadow-xs' 
                      : s < bookingStep 
                      ? 'bg-emerald-100 text-[#1DB954]' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {s < bookingStep ? '✓' : s}
                </button>
                {s < 5 && <div className={`w-4 h-0.5 ${s < bookingStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* STEP 1: PICKUP ADDRESS & SENDER */}
          {bookingStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Step 1: Pickup Address & Sender Details
                </h2>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pickup Address</label>
                  <textarea
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter complete pickup address in Mandla..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Google Maps Plus Code <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[9px] text-emerald-600 font-bold">Pinpoint Location</span>
                  </div>
                  <input
                    type="text"
                    value={pickupPlusCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPickupPlusCode(val);
                      const res = validatePlusCode(val);
                      setPickupPlusCodeError(res.isValid ? null : res.message || 'Invalid code');
                    }}
                    placeholder="e.g. 7J4V+3M Mandla or 8FVC+7W"
                    className={`w-full bg-gray-50 border ${
                      pickupPlusCodeError ? 'border-rose-500' : 'border-gray-200'
                    } rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]`}
                  />
                  {pickupPlusCodeError && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">{pickupPlusCodeError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sender Name</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sender Mobile</label>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                {/* Quick Pick Saved Addresses */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Or Choose Saved Pickup:</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {SAVED_ADDRESSES.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setPickupAddress(a.address)}
                        className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 whitespace-nowrap hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        📍 {a.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookingStep(2)}
                className="w-full bg-[#1DB954] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md"
              >
                Next: Dropoff Location →
              </button>
            </motion.div>
          )}

          {/* STEP 2: RECEIVER ADDRESS & RECEIVER DETAILS */}
          {bookingStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-rose-500" /> Step 2: Receiver & Dropoff Details
                </h2>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Receiver Address in Mandla</label>
                  <textarea
                    rows={2}
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                    placeholder="Enter complete dropoff address in Mandla..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Receiver Google Plus Code <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[9px] text-rose-500 font-bold">Exact Dropoff</span>
                  </div>
                  <input
                    type="text"
                    value={dropPlusCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDropPlusCode(val);
                      const res = validatePlusCode(val);
                      setDropPlusCodeError(res.isValid ? null : res.message || 'Invalid code');
                    }}
                    placeholder="e.g. 7J4V+3M Mandla or 8FVC+7W"
                    className={`w-full bg-gray-50 border ${
                      dropPlusCodeError ? 'border-rose-500' : 'border-gray-200'
                    } rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]`}
                  />
                  {dropPlusCodeError && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">{dropPlusCodeError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Receiver Name</label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Receiver's Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Receiver Mobile</label>
                    <input
                      type="text"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="+91 Mobile Number"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setBookingStep(3)}
                  className="flex-[2] bg-[#1DB954] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Next: Parcel Item Details →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PARCEL ITEM DETAILS & WEIGHT */}
          {bookingStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" /> Step 3: Parcel Item & Package Specifications
                </h2>

                {/* Parcel Category Selector */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Item Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PARCEL_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          selectedType === t.id
                            ? 'bg-emerald-50 border-[#1DB954] text-[#1DB954] font-black'
                            : 'bg-gray-50 border-gray-200 text-gray-600 font-bold'
                        }`}
                      >
                        <p className="text-xs">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight Selector */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Package Weight</label>
                  <div className="grid grid-cols-2 gap-2">
                    {WEIGHT_OPTIONS.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWeight(w.id)}
                        className={`p-2.5 rounded-2xl border text-xs font-bold text-center transition-all ${
                          selectedWeight === w.id
                            ? 'bg-[#1DB954] text-white font-black border-[#1DB954]'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Package Value & Special Instructions */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Package Value (₹)</label>
                    <input
                      type="number"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Dimensions / Shape</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. Shoe box size"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Special Handling Instructions</label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Keep upright, fragile glass inside"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingStep(2)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setBookingStep(4)}
                  className="flex-[2] bg-[#1DB954] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Next: Schedule & Speed →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PICKUP SCHEDULE & DELIVERY SPEED */}
          {bookingStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Step 4: Pickup Schedule & Delivery Speed
                </h2>

                {/* Pickup Type */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPickupType('instant')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      pickupType === 'instant' 
                        ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-xs' 
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <Zap className="w-4 h-4" /> Instant Pickup (10 mins)
                  </button>

                  <button
                    onClick={() => setPickupType('scheduled')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      pickupType === 'scheduled' 
                        ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-xs' 
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4" /> Schedule Pickup
                  </button>
                </div>

                {pickupType === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pickup Date</label>
                      <select
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="Day After">Day After Tomorrow</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Time Slot</label>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-bold text-gray-900"
                      >
                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                        <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                        <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Delivery Speeds */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Delivery Speed</label>
                  <div className="space-y-2">
                    {DELIVERY_SPEEDS.map((speed) => (
                      <div
                        key={speed.id}
                        onClick={() => setSelectedSpeed(speed.id as any)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedSpeed === speed.id 
                            ? 'bg-emerald-50/80 border-[#1DB954] shadow-xs' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 text-xs">{speed.label}</span>
                            <span className="bg-emerald-100 text-[#1DB954] text-[9px] font-black px-2 py-0.5 rounded-md">
                              {speed.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold mt-0.5">Est. Delivery: {speed.time}</p>
                        </div>

                        <span className="text-xs font-black text-gray-900">
                          {speed.extra > 0 ? `+₹${speed.extra}` : speed.extra < 0 ? `-₹${Math.abs(speed.extra)}` : 'Included'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingStep(3)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setBookingStep(5)}
                  className="flex-[2] bg-[#1DB954] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Next: Fare & Checkout →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: FARE BREAKDOWN, COUPON & PAYMENT METHOD */}
          {bookingStep === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              
              {/* Summary Card */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Step 5: Final Checkout & Fare Calculation
                </h2>

                {/* Route Overview */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/60 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Pickup Location</p>
                      <p className="text-xs font-bold text-gray-900">{pickupAddress}</p>
                      <p className="text-[10px] text-gray-500">{senderName} ({senderPhone})</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200/60 pt-2 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Dropoff Location</p>
                      <p className="text-xs font-bold text-gray-900">{dropAddress || 'Binjhiya, Mandla'}</p>
                      <p className="text-[10px] text-gray-500">{receiverName || 'Receiver'} ({receiverPhone || '+91 98000 11122'})</p>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code (e.g. PARCEL50)"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-purple-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-2xs"
                  >
                    Apply
                  </button>
                </div>

                {/* Live Fare Breakdown */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs font-bold text-gray-600">
                  <div className="flex justify-between">
                    <span>Base Delivery Fare</span>
                    <span>₹{calculateFare().baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Charge (~3.5 km)</span>
                    <span>₹{calculateFare().distanceCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight & Handling</span>
                    <span>₹{calculateFare().weightCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed Surge ({selectedSpeed})</span>
                    <span>₹{calculateFare().speedSurge}</span>
                  </div>
                  {calculateFare().discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-black">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{calculateFare().discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total Amount Payable</span>
                    <span className="text-[#1DB954]">₹{calculateFare().total}</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / GPay' },
                      { id: 'Cash', label: 'Cash on Pickup' },
                      { id: 'Wallet', label: 'Apna Wallet' },
                      { id: 'Cards', label: 'Credit/Debit' },
                      { id: 'NetBanking', label: 'Net Banking' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-2.5 rounded-2xl border text-xs font-black text-center transition-all ${
                          paymentMethod === pm.id
                            ? 'bg-[#1DB954] text-white border-[#1DB954]'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingStep(4)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-wider"
                >
                  ← Back
                </button>
                <button
                  onClick={handleCreateBooking}
                  className="flex-[2] bg-[#1DB954] hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all"
                >
                  Confirm & Pay ₹{calculateFare().total} →
                </button>
              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* TAB 3: LIVE MAP TRACKING */}
      {activeTab === 'tracking' && activeTrackingBooking && (
        <div className="p-5 space-y-4">
          
          {/* Animated Interactive Map Simulation Banner */}
          <div className="h-44 bg-slate-900 rounded-3xl overflow-hidden relative shadow-md flex items-center justify-center border border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(#1DB954_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            {/* Animated Route Line */}
            <div className="absolute inset-x-8 top-1/2 h-1 bg-emerald-500/30 rounded-full">
              <motion.div 
                animate={{ x: ['0%', '80%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-1 bg-emerald-400 rounded-full shadow-[0_0_10px_#1DB954]"
              />
            </div>

            {/* Pickup Marker */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-xs mx-auto shadow-md">
                P
              </div>
              <span className="text-[9px] text-white/80 font-bold mt-1 block">Lalipur</span>
            </div>

            {/* Drop Marker */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-center">
              <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-xs mx-auto shadow-md">
                D
              </div>
              <span className="text-[9px] text-white/80 font-bold mt-1 block">Binjhiya</span>
            </div>

            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black border border-white/10">
              📍 Live GPS Tracking • ETA {activeTrackingBooking.estimatedMinutes} Mins
            </div>
          </div>

          {/* Rider Info Card */}
          {activeTrackingBooking.rider && (
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0">
                    <img src={activeTrackingBooking.rider.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm leading-tight">{activeTrackingBooking.rider.name}</h3>
                    <p className="text-[10px] text-gray-500 font-bold">{activeTrackingBooking.rider.vehicle} • {activeTrackingBooking.rider.vehicleNumber}</p>
                    <span className="text-[10px] text-amber-500 font-black flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-current" /> {activeTrackingBooking.rider.rating} Verified Delivery Partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions: Call, Chat, WhatsApp */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <a
                  href={`tel:${activeTrackingBooking.rider.phone}`}
                  className="flex items-center justify-center gap-1.5 p-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-black border border-emerald-200/60"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
                </a>
                <button
                  onClick={() => showToast(`Direct Chat with ${activeTrackingBooking.rider?.name} opened! 💬`)}
                  className="flex items-center justify-center gap-1.5 p-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-black border border-blue-200/60"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-blue-600" /> In-App Chat
                </button>
                <a
                  href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(activeTrackingBooking.rider.name)},%20I%20have%20an%20update%20regarding%20Parcel%20${activeTrackingBooking.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-green-50 text-green-800 rounded-xl text-xs font-black border border-green-200/60"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-green-600" /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Delivery Timeline */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Shipment Status Timeline</h3>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
              {[
                { title: 'Order Confirmed', time: '10:15 AM', done: true },
                { title: 'Rider Assigned', time: '10:17 AM', done: true },
                { title: 'Picked Up from Lalipur', time: '10:22 AM', done: true },
                { title: 'On The Way to Destination', time: 'In Progress', done: activeTrackingBooking.status === 'on_the_way' || activeTrackingBooking.status === 'delivered', current: true },
                { title: 'Near Destination (Binjhiya)', time: 'Pending', done: activeTrackingBooking.status === 'delivered' },
                { title: 'Delivered safely with OTP', time: 'Pending', done: activeTrackingBooking.status === 'delivered' },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 ${
                    step.done ? 'bg-emerald-500 border-white shadow-xs' : 'bg-white border-gray-300'
                  }`} />
                  <div>
                    <p className={`text-xs font-bold ${step.current ? 'text-[#1DB954] font-black' : 'text-gray-900'}`}>{step.title}</p>
                    <p className="text-[9px] text-gray-400">{step.time}</p>
                  </div>
                  {step.current && (
                    <span className="bg-emerald-100 text-[#1DB954] text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Proof & Security Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h4 className="font-black text-gray-900 text-xs uppercase">Delivery Verification OTP</h4>
              </div>
              <span className="text-lg font-black text-amber-900 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300">
                {activeTrackingBooking.otp}
              </span>
            </div>
            <p className="text-[10px] text-amber-800 font-bold">
              Share this 4-digit secret OTP with the delivery partner upon parcel handover to verify completed delivery.
            </p>
          </div>

        </div>
      )}

      {/* TAB 4: DELIVERY HISTORY & INVOICES */}
      {activeTab === 'history' && (
        <div className="p-5 space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Search parcel history..."
                className="w-full bg-white border border-gray-200 pl-9 pr-3 py-2.5 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#1DB954]"
              />
            </div>
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 text-xs font-black text-gray-700"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {deliveries
              .filter(d => {
                const matchesSearch = !searchHistoryQuery || d.receiverName.toLowerCase().includes(searchHistoryQuery.toLowerCase()) || d.id.toLowerCase().includes(searchHistoryQuery.toLowerCase());
                const matchesFilter = historyFilter === 'all' ? true : historyFilter === 'active' ? d.status !== 'delivered' : d.status === 'delivered';
                return matchesSearch && matchesFilter;
              })
              .map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-black text-xs text-gray-900">{b.id}</span>
                      <span className="text-[10px] text-gray-400 font-bold block">{b.createdAt}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      b.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status === 'delivered' ? 'Delivered ✓' : 'In Transit 🚚'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-gray-900">Package: {b.parcelType} ({b.weight})</p>
                    <p className="text-gray-500 text-[11px]">To: <strong>{b.receiverName}</strong> - {b.dropAddress}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm font-black text-gray-900">₹{b.fareBreakdown.total} ({b.paymentMethod})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => handleRepeatBooking(b)}
                        className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-2xs"
                      >
                        Repeat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Invoice / Receipt Download Modal */}
      <AnimatePresence>
        {selectedInvoiceBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl relative space-y-4">
              <button onClick={() => setSelectedInvoiceBooking(null)} className="absolute top-4 right-4 p-2 text-gray-400">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center border-b border-gray-100 pb-3">
                <h3 className="font-black text-gray-900 text-base">Apna Mandla Logistics</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Official Parcel Invoice • {selectedInvoiceBooking.id}</p>
              </div>

              <div className="space-y-2 text-xs font-bold text-gray-700">
                <div className="flex justify-between"><span>Sender:</span><span>{selectedInvoiceBooking.senderName}</span></div>
                <div className="flex justify-between"><span>Receiver:</span><span>{selectedInvoiceBooking.receiverName}</span></div>
                <div className="flex justify-between"><span>Parcel:</span><span>{selectedInvoiceBooking.parcelType}</span></div>
                <div className="flex justify-between"><span>Speed:</span><span className="uppercase">{selectedInvoiceBooking.deliverySpeed}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-gray-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#1DB954]">₹{selectedInvoiceBooking.fareBreakdown.total}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Downloaded receipt to device! 📄');
                  setSelectedInvoiceBooking(null);
                }}
                className="w-full py-3 bg-[#1DB954] text-white text-xs font-black rounded-2xl uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF Receipt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
