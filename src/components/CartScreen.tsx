import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart, 
  CreditCard, CheckCircle2, Package, MapPin, Tag, Clock, Sparkles, 
  Store, Flame, ChevronRight, Star, ShieldCheck, Truck, Zap 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUdhar } from '../context/UdharContext';
import { useSettings } from '../context/SettingsContext';
import { BiometricGuard } from './BiometricGuard';

interface CartScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToParcel?: () => void;
  onProductClick?: (product: any) => void;
  onShopClick?: (shop: any) => void;
}

// Sample Data for Discovery in Empty Cart
const TODAYS_DEALS = [
  {
    id: 'td1',
    name: 'Fortune Soyabean Oil (1L)',
    price: 135,
    originalPrice: 160,
    discount: '15% OFF',
    rating: 4.6,
    shopId: 'ns1',
    shopName: 'Mahakaal Kirana Mart',
    image: 'https://picsum.photos/seed/oil1/200/200',
    badge: 'DEAL OF DAY'
  },
  {
    id: 'td2',
    name: 'Farm Fresh Eggs (12 Pcs)',
    price: 84,
    originalPrice: 105,
    discount: '20% OFF',
    rating: 4.7,
    shopId: 'ns1',
    shopName: 'Mahakaal Kirana Mart',
    image: 'https://picsum.photos/seed/eggs1/200/200',
    badge: 'FRESH STOCK'
  },
  {
    id: 'td3',
    name: '12W LED Energy Saving Bulb',
    price: 99,
    originalPrice: 180,
    discount: '45% OFF',
    rating: 4.8,
    shopId: 'ns4',
    shopName: 'Guptaji Electronics',
    image: 'https://picsum.photos/seed/bulb1/200/200',
    badge: 'SUPER SAVER'
  },
  {
    id: 'td4',
    name: 'Stainless Steel Bottle (1L)',
    price: 249,
    originalPrice: 450,
    discount: '44% OFF',
    rating: 4.7,
    shopId: 'ns1',
    shopName: 'Mahakaal Kirana Mart',
    image: 'https://picsum.photos/seed/bottle1/200/200',
    badge: 'HOT DEAL'
  }
];

export const CartScreen: React.FC<CartScreenProps> = ({
  onNavigateToHome,
  onNavigateToParcel,
  onProductClick,
  onShopClick
}) => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart, addToCart } = useCart();
  const { accounts, addTransaction } = useUdhar();
  const { isBiometricEnabled, t } = useSettings();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMethod, setSuccessMethod] = useState<'cash' | 'udhar' | null>(null);
  const [requiresBiometric, setRequiresBiometric] = useState(false);
  const [pendingMethod, setPendingMethod] = useState<'cash' | 'udhar' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const groupedItems = items.reduce((acc, item) => {
    const shopName = item.shopName || 'Unknown Shop';
    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const canPayWithUdhar = Object.keys(groupedItems).every(shopName => 
    accounts.some(acc => acc.shopName === shopName)
  ) && items.length > 0;

  const handleCheckoutInitiate = (method: 'cash' | 'udhar') => {
    if (isBiometricEnabled) {
      setPendingMethod(method);
      setRequiresBiometric(true);
    } else {
      processCheckout(method);
    }
  };

  const processCheckout = (method: 'cash' | 'udhar') => {
    if (method === 'udhar') {
      Object.entries(groupedItems).forEach(([shopName, shopItems]) => {
        const amount = shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const account = accounts.find(acc => acc.shopName === shopName);
        if (account) {
          addTransaction({
            accountId: account.id,
            amount: amount,
            type: 'purchase'
          });
        }
      });
    }

    setSuccessMethod(method);
    setShowSuccessModal(true);
    clearCart();
  };

  if (requiresBiometric && pendingMethod) {
    return (
      <BiometricGuard 
        onCancel={() => {
          setRequiresBiometric(false);
          setPendingMethod(null);
        }}
        title={pendingMethod === 'udhar' ? 'Authorize Udhar Payment' : 'Confirm Order Checkout'}
      >
        <div className="hidden">
          {(() => {
            setRequiresBiometric(false);
            processCheckout(pendingMethod);
            setPendingMethod(null);
            return null;
          })()}
        </div>
      </BiometricGuard>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY CART SCREEN
  // --------------------------------------------------------------------------
  if (items.length === 0 && !showSuccessModal) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 min-h-screen relative pb-32">
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-bold backdrop-blur-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <header className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#1DB954]" />
            <h1 className="text-xl font-black text-gray-900 dark:text-zinc-50">{t('cart')}</h1>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            0 Items
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-6">
          
          {/* Main Empty Cart Illustration & Hero Message */}
          <div className="px-6 pt-6 pb-4 text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-28 h-28 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-4 text-[#1DB954] shadow-inner relative"
            >
              <ShoppingCart className="w-14 h-14" />
              <span className="absolute bottom-1 right-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-zinc-950 shadow-xs">
                0
              </span>
            </motion.div>

            <h2 className="text-xl font-black text-gray-900 dark:text-zinc-50 mb-1">
              Your cart is empty
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium max-w-xs mb-5 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore local shops & everyday essentials in Mandla!
            </p>

            {/* Prominent Continue Shopping Button */}
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={onNavigateToHome}
              className="w-full max-w-xs bg-[#1DB954] hover:bg-emerald-600 text-white py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Store className="w-4 h-4" />
              Continue Shopping
            </motion.button>
          </div>

          {/* PROMOTIONAL CARD: NEED TO SEND A PARCEL? */}
          <section className="px-5">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between gap-3">
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Package className="w-4 h-4 text-yellow-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Apna Mandla Parcel</span>
                </div>
                <h3 className="text-sm font-black leading-tight">Need to send a Parcel?</h3>
                <p className="text-[10px] text-emerald-100 mt-1 max-w-[200px]">Pick up & Drop anywhere in Mandla in 30 mins! Documents, tiffin, gifts & packages.</p>
                <button 
                  onClick={onNavigateToParcel}
                  className="mt-3 px-3.5 py-1.5 bg-white text-emerald-800 text-[11px] font-black rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
                >
                  Book Parcel Service →
                </button>
              </div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                <Truck className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
          </section>

          {/* DISABLED PLACEHOLDERS: ADDRESS, COUPON & ESTIMATED TIMING */}
          <section className="px-5 space-y-2.5">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Delivery & Checkout Options</h3>

            {/* Address Placeholder */}
            <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-xl text-gray-500 dark:text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Delivery Address</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate max-w-[220px]">
                    Lal Bahadur Shastri Ward, Mandla
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black bg-gray-200 dark:bg-zinc-800 text-gray-500 px-2 py-0.5 rounded-md">Default</span>
            </div>

            {/* Coupon Placeholder */}
            <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-400 rounded-xl">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Coupon Code</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">Add items to apply discounts</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-400">Apply</span>
            </div>

            {/* Timings & Delivery Fee Badge */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500">
              <div className="bg-gray-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Est. Delivery: 20-30 Mins</span>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Delivery Fee: <strong className="text-emerald-600">FREE</strong></span>
              </div>
            </div>
          </section>

          {/* SECTION 4: TODAY'S DEALS */}
          <section className="px-5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-wide">Today's Deals</h3>
              </div>
              <span className="text-[9px] font-black text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200">
                DISCOUNTS UP TO 50%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TODAYS_DEALS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 p-2.5 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between group"
                >
                  <div 
                    onClick={() => onProductClick?.(item)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-square bg-purple-50/50 dark:bg-purple-950/20 rounded-xl overflow-hidden mb-2 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      <span className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-tight truncate">{item.shopName}</p>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-zinc-100 leading-tight line-clamp-2 min-h-[2rem]">{item.name}</h4>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <div>
                      <p className="text-xs font-black text-purple-900 dark:text-purple-300 leading-none">₹{item.price}</p>
                      <p className="text-[9px] text-gray-400 line-through leading-none mt-0.5">₹{item.originalPrice}</p>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          shopId: item.shopId,
                          shopName: item.shopName
                        });
                        showToast(`Added ${item.name} to Cart 🛒`);
                      }}
                      className="p-1.5 bg-purple-600 text-white rounded-xl shadow-2xs hover:bg-purple-700 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* STICKY BOTTOM SUMMARY BAR (DISABLED STATE) */}
        <div className="fixed bottom-16 left-0 right-0 z-20 max-w-md mx-auto px-4 pb-2">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-3xl shadow-[0_-5px_25px_rgba(0,0,0,0.08)] border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Subtotal</p>
              <p className="text-base font-black text-gray-900 dark:text-zinc-100">0 Items | ₹0</p>
            </div>
            <button 
              disabled={true}
              className="bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider cursor-not-allowed flex items-center gap-2"
            >
              Cart is Empty
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // NON-EMPTY CART SCREEN WITH ACTIVE ITEMS
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300 relative pb-28">
      <header className="bg-white dark:bg-zinc-950 px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-50 dark:border-zinc-900 transition-colors duration-300">
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">{t('cart')}</h1>
        <div className="bg-green-50 dark:bg-green-950/20 text-[#1DB954] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          {totalItems} Items
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {Object.entries(groupedItems).map(([shopName, shopItems]) => (
          <div key={shopName} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#1DB954] rounded-full" />
              <h3 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{shopName}</h3>
            </div>
            <div className="space-y-4">
              {shopItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-[32px] flex gap-4 items-center transition-colors duration-300"
                >
                  <div className="w-20 h-20 bg-white dark:bg-zinc-850 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100 leading-tight mb-1">{item.name}</h3>
                    <p className="text-lg font-black text-gray-900 dark:text-zinc-50">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-zinc-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-black w-4 text-center text-gray-900 dark:text-zinc-100">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-xl text-gray-600 dark:text-zinc-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-950 p-6 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-4 border-t border-gray-50 dark:border-zinc-900 transition-colors duration-300">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-bold text-gray-400 dark:text-zinc-500">
            <span>Subtotal</span>
            <span className="text-gray-900 dark:text-zinc-100">₹{totalPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-gray-400 dark:text-zinc-500">
            <span>Delivery Fee</span>
            <span className="text-[#1DB954]">FREE</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-zinc-900">
            <span className="text-gray-900 dark:text-zinc-100 font-bold">{t('total_amount')}</span>
            <span className="text-2xl font-black text-gray-900 dark:text-zinc-50">₹{totalPrice}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleCheckoutInitiate('cash')}
            className="flex-1 bg-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-5 rounded-[32px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-gray-100 dark:shadow-none active:scale-95 transition-transform"
          >
            Cash
            <ArrowRight className="w-5 h-5" />
          </button>
          {canPayWithUdhar && (
            <button 
              onClick={() => handleCheckoutInitiate('udhar')}
              className="flex-1 bg-[#1DB954] hover:bg-[#1aa34a] text-white py-5 rounded-[32px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-100 dark:shadow-none active:scale-95 transition-transform"
            >
              Udhar
              <CreditCard className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative bg-white dark:bg-zinc-900 p-8 rounded-[36px] w-full max-w-sm text-center space-y-6 shadow-2xl border border-gray-100 dark:border-zinc-800 z-10"
            >
              <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center text-[#1DB954] mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-zinc-50 uppercase tracking-widest">Order Confirmed!</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed px-2">
                  {successMethod === 'udhar' 
                    ? 'Your order has been booked successfully using your Udhar account ledger!' 
                    : 'Your order has been placed successfully. Please pay the rider upon delivery.'}
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-md"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
