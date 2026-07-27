import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ArrowLeft, 
  ShoppingCart,
  Heart,
  Clock,
  Zap,
  Tag,
  Copy,
  Check,
  Sparkles,
  X,
  Mic,
  Camera,
  Flame,
  Store,
  ChevronRight,
  RefreshCw,
  Gift
} from 'lucide-react';
import { DashboardDrawer } from './DashboardDrawer';
import { LocationSelector } from './LocationSelector';
import { NotificationBell } from './NotificationBell';
import { SearchBar } from './SearchBar';
import { AdBanner } from './AdBanner';
import { BottomNav } from './BottomNav';
import { CategoryMenu } from './CategoryMenu';
import { ProfileEditor } from './ProfileEditor';
import { SellerForm } from './SellerForm';
import { RiderForm } from './RiderForm';
import { CartScreen } from './CartScreen';
import { WalletScreen } from './WalletScreen';
import { ParcelScreen } from './ParcelScreen';
import { FilterModal, FilterState } from './FilterModal';
import { NotificationCenter } from './NotificationCenter';
import { MapScreen } from './MapScreen';
import { SupportScreen } from './SupportScreen';
import { SettingsScreen } from './SettingsScreen';
import { UdharScreen } from './UdharScreen';
import { ProductDetail } from './ProductDetail';
import { ShopPage } from './ShopPage';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { BiometricGuard } from './BiometricGuard';
import { motion, AnimatePresence } from 'motion/react';
import { Shop } from '../types';

interface CustomerDashboardProps {
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

// Sample Categories
const CATEGORIES = [
  { id: 'cat1', name: 'Vegetables', icon: '🥦', items: '120+ items', color: 'bg-green-50 text-green-700' },
  { id: 'cat2', name: 'Dairy & Milk', icon: '🥛', items: '45+ items', color: 'bg-blue-50 text-blue-700' },
  { id: 'cat3', name: 'Bakery', icon: '🍩', items: '60+ items', color: 'bg-amber-50 text-amber-700' },
  { id: 'cat4', name: 'Pharmacy', icon: '💊', items: '200+ items', color: 'bg-rose-50 text-rose-700' },
  { id: 'cat5', name: 'Electronics', icon: '📱', items: '80+ items', color: 'bg-purple-50 text-purple-700' },
  { id: 'cat6', name: 'Fashion', icon: '👕', items: '150+ items', color: 'bg-indigo-50 text-indigo-700' },
  { id: 'cat7', name: 'Hardware', icon: '🔨', items: '90+ items', color: 'bg-orange-50 text-orange-700' },
  { id: 'cat8', name: 'Grocery', icon: '🛒', items: '500+ items', color: 'bg-emerald-50 text-emerald-700' },
];

// Featured Brands
const BRANDS = [
  { id: 'b1', name: 'Amul', logo: '🧈', category: 'Dairy' },
  { id: 'b2', name: 'Tata Tea', logo: '☕', category: 'Grocery' },
  { id: 'b3', name: 'Cadbury', logo: '🍫', category: 'Sweets' },
  { id: 'b4', name: 'Nestlé', logo: '🥛', category: 'Food' },
  { id: 'b5', name: 'Britannia', logo: '🍞', category: 'Bakery' },
  { id: 'b6', name: 'Samsung', logo: '📱', category: 'Mobiles' },
];

// Flash Sale Items (Compact Version)
const FLASH_SALE_ITEMS = [
  {
    id: 'fs1',
    name: 'Fresh Farm Cow Milk (1L)',
    price: 52,
    originalPrice: 65,
    discount: '20% OFF',
    rating: 4.9,
    reviews: 128,
    shopId: 's1',
    shopName: 'Mandla Dairy',
    image: 'https://picsum.photos/seed/milk1/200/200',
    badge: 'FLASH'
  },
  {
    id: 'fs2',
    name: 'Organic Basmati Rice (5kg)',
    price: 490,
    originalPrice: 620,
    discount: '21% OFF',
    rating: 4.8,
    reviews: 210,
    shopId: 's2',
    shopName: 'Shree Grocery',
    image: 'https://picsum.photos/seed/rice5/200/200',
    badge: 'BESTSELLER'
  },
  {
    id: 'fs3',
    name: 'Alphonso Mangoes (1 Dozen)',
    price: 349,
    originalPrice: 500,
    discount: '30% OFF',
    rating: 4.7,
    reviews: 85,
    shopId: 's3',
    shopName: 'Local Fruit Mart',
    image: 'https://picsum.photos/seed/mangoes1/200/200',
    badge: 'HOT'
  },
  {
    id: 'fs4',
    name: 'Pure Desi Ghee (500g)',
    price: 340,
    originalPrice: 420,
    discount: '19% OFF',
    rating: 4.9,
    reviews: 95,
    shopId: 's1',
    shopName: 'Mandla Dairy',
    image: 'https://picsum.photos/seed/ghee2/200/200',
    badge: 'PURE'
  }
];

// Nearby Shops
const NEARBY_SHOPS: Partial<Shop>[] = [
  {
    id: 'ns1',
    name: 'Mahakaal Kirana Mart',
    rating: 4.8,
    category: 'General Grocery',
    location: 'Main Market, Mandla (0.5 km)',
    logo: 'https://picsum.photos/seed/shopm1/200/200',
    description: 'Fastest home delivery for daily essentials and snacks in Mandla.',
    hasActiveSubscription: true
  },
  {
    id: 'ns2',
    name: 'Shri Ram Sweets & Bakery',
    rating: 4.9,
    category: 'Sweets & Bakery',
    location: 'Bus Stand Road, Mandla (1.2 km)',
    logo: 'https://picsum.photos/seed/shops2/200/200',
    description: 'Fresh samosas, sweets, and celebration cakes baked daily.',
    hasActiveSubscription: true
  },
  {
    id: 'ns3',
    name: 'Mandla Medical Store',
    rating: 4.7,
    category: 'Pharmacy & Healthcare',
    location: 'District Hospital Square (0.8 km)',
    logo: 'https://picsum.photos/seed/shopmed3/200/200',
    description: 'Genuine medicines and wellness essentials available 24/7.',
    hasActiveSubscription: true
  },
  {
    id: 'ns4',
    name: 'Guptaji Electronics & Mobiles',
    rating: 4.8,
    category: 'Electronics & Accessories',
    location: 'Lal Bahadur Shastri Ward, Mandla (0.3 km)',
    logo: 'https://picsum.photos/seed/shopelec4/200/200',
    description: 'Mobile accessories, chargers, earbuds and home appliances at best prices.',
    hasActiveSubscription: true
  }
];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout, onSwitchRole }) => {
  const { user } = useAuth();
  const { detectLocation } = useLocation();
  const { addToCart } = useCart();
  
  // Dashboard Overlays & Screens
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Sub-screens
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isApplyingSeller, setIsApplyingSeller] = useState(false);
  const [isApplyingRider, setIsApplyingRider] = useState(false);
  const [isViewingWallet, setIsViewingWallet] = useState(false);
  const [isViewingMap, setIsViewingMap] = useState(false);
  const [isViewingSupport, setIsViewingSupport] = useState(false);
  const [isViewingSettings, setIsViewingSettings] = useState(false);
  const [isViewingUdhar, setIsViewingUdhar] = useState(false);
  
  // Search & Filter
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterChip, setActiveFilterChip] = useState('All');
  const [activeFilterState, setActiveFilterState] = useState<FilterState>({
    category: 'All',
    priceRange: 'All',
    rating: 'All',
    distance: 'All',
    availability: 'All',
    offers: 'All',
    deliveryTime: 'All',
    brand: 'All'
  });

  // Selected Items
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Dynamic States
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(['fs1']));
  const [followedShopIds, setFollowedShopIds] = useState<Set<string>>(new Set(['ns1']));
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFlashSaleDismissed, setIsFlashSaleDismissed] = useState(false);

  // Flash Sale Timer (Countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    showToast('Refreshing marketplace data... 🔄');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Marketplace updated! ✨');
    }, 1000);
  };

  const toggleWishlist = (id: string, name?: string) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Removed from Wishlist`);
      } else {
        next.add(id);
        showToast(`Added ${name || 'item'} to Wishlist ❤️`);
      }
      return next;
    });
  };

  const toggleFollowShop = (id: string, name?: string) => {
    setFollowedShopIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Unfollowed ${name || 'Shop'}`);
      } else {
        next.add(id);
        showToast(`Following ${name || 'Shop'}! 🔔`);
      }
      return next;
    });
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon code ${code} copied! 🎉`);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  const handleOpenShop = (partialShop: any) => {
    const fullShop: Shop = {
      id: partialShop.id || 's1',
      name: partialShop.name || 'Mandla Store',
      logo: partialShop.image || partialShop.logo || 'https://picsum.photos/seed/shop1/200/200',
      rating: partialShop.rating || 4.8,
      category: partialShop.category || 'General Store',
      location: partialShop.location || 'Main Market, Mandla',
      description: partialShop.description || `Welcome to ${partialShop.name || 'Mandla Store'}! We offer fresh local goods with express 30-min delivery in Mandla district.`,
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
        { id: 'o1', code: 'MANDLA20', description: '20% off on order above ₹200', discountType: 'percentage', value: 20 },
        { id: 'o2', code: 'FREESHIP', description: 'Free home delivery above ₹300', discountType: 'fixed', value: 0, minOrder: 300 },
      ],
      products: [
        { id: 'p1', name: 'Fresh Pure Cow Ghee (500g)', price: 349, rating: 4.9, image: 'https://picsum.photos/seed/ghee/200/200', category: 'Dairy' },
        { id: 'p2', name: 'Local Organic Honey (250g)', price: 199, rating: 4.7, image: 'https://picsum.photos/seed/honey/200/200', category: 'Grocery' },
        { id: 'p3', name: 'Handcrafted Bamboo Basket', price: 150, rating: 4.8, image: 'https://picsum.photos/seed/basket/200/200', category: 'Crafts' },
        { id: 'p4', name: 'Fresh Kodo Millet Flour (1kg)', price: 85, rating: 4.9, image: 'https://picsum.photos/seed/millet/200/200', category: 'Grains' },
      ],
      phone: '+91 98765 43210',
      address: 'Main Market, Mandla, Madhya Pradesh',
      hasActiveSubscription: true
    };
    setSelectedShop(fullShop);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  // Time Greeting Calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const renderContent = () => {
    if (isEditingProfile) return <ProfileEditor onBack={() => setIsEditingProfile(false)} />;
    if (isApplyingSeller) return <SellerForm onBack={() => setIsApplyingSeller(false)} />;
    if (isApplyingRider) return <RiderForm onBack={() => setIsApplyingRider(false)} />;
    if (isViewingWallet) {
      return (
        <BiometricGuard onCancel={() => setIsViewingWallet(false)} title="Verify Wallet Access">
          <WalletScreen onBack={() => setIsViewingWallet(false)} />
        </BiometricGuard>
      );
    }
    if (isViewingMap) return <MapScreen onBack={() => setIsViewingMap(false)} />;
    if (isViewingSupport) return <SupportScreen onBack={() => setIsViewingSupport(false)} />;
    if (isViewingSettings) return <SettingsScreen onBack={() => setIsViewingSettings(false)} />;

    if (isSearching) {
      const searchResults = [
        ...FLASH_SALE_ITEMS,
        { id: 's10', name: 'Organic Mustard Oil (1L)', price: 165, originalPrice: 190, discount: '13% OFF', rating: 4.6, shopId: 's1', shopName: 'Mahakaal Kirana', image: 'https://picsum.photos/seed/oil1/300/300' },
        { id: 's11', name: 'Fresh Green Peas (1kg)', price: 45, originalPrice: 60, discount: '25% OFF', rating: 4.8, shopId: 's2', shopName: 'Mandi Supermart', image: 'https://picsum.photos/seed/peas1/300/300' },
      ].filter(item => {
        const matchesQuery = !searchQuery || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.shopName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCatFilter = activeFilterState.category === 'All' || item.name.toLowerCase().includes(activeFilterState.category.toLowerCase());
        const matchesBrandFilter = activeFilterState.brand === 'All' || item.name.toLowerCase().includes(activeFilterState.brand.toLowerCase());

        return matchesQuery && matchesCatFilter && matchesBrandFilter;
      });

      return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-6 bg-gray-50/50">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => setIsSearching(false)} 
              className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-2xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marketplace Search</p>
              <h2 className="text-lg font-black text-gray-900 truncate">"{searchQuery || 'All Items'}"</h2>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-2.5 bg-[#1DB954] text-white rounded-2xl shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
            {['All', 'Under ₹199', '⭐ 4.5+', 'Free Delivery', 'Discounts > 20%'].map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveFilterChip(chip)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilterChip === chip
                    ? 'bg-[#1DB954] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map((item) => (
                <motion.div 
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-3 rounded-3xl border border-gray-100 shadow-2xs relative group flex flex-col justify-between"
                >
                  <div>
                    <div 
                      onClick={() => setSelectedProduct(item)}
                      className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-2 relative cursor-pointer"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {item.discount && (
                        <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-2xs">
                          {item.discount}
                        </span>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id, item.name);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-xl backdrop-blur-md shadow-2xs transition-all ${
                          wishlistIds.has(item.id) ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-600 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlistIds.has(item.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{item.shopName}</p>
                    <h3 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2 mt-0.5">{item.name}</h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-black text-gray-900">₹{item.price}</p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          shopId: item.shopId || 's1',
                          shopName: item.shopName
                        });
                        showToast(`Added ${item.name} to Cart 🛒`);
                      }}
                      className="p-2 bg-emerald-50 hover:bg-[#1DB954] text-[#1DB954] hover:text-white rounded-xl transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-base">No matching items found</h3>
              <p className="text-xs text-gray-500 mt-1">Try searching for 'Milk', 'Rice', 'Groceries', or 'Mandla'</p>
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'parcel':
        return <ParcelScreen />;
      case 'cart':
        return (
          <CartScreen 
            onNavigateToHome={() => setActiveTab('home')}
            onNavigateToParcel={() => setActiveTab('parcel')}
            onProductClick={setSelectedProduct}
            onShopClick={handleOpenShop}
          />
        );
      case 'menu':
        return <CategoryMenu onProductClick={setSelectedProduct} onShopClick={handleOpenShop} />;
      case 'home':
      default:
        return (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-28 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 relative">
            {/* Header */}
            <header className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-5 pt-8 pb-3 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100/80 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="p-2 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Center: APNA Area Selector */}
              <div className="flex flex-col items-center">
                <LocationSelector />
              </div>

              {/* Right: Notifications */}
              <div className="flex items-center gap-1.5">
                <NotificationBell onClick={() => setIsNotificationsOpen(true)} />
              </div>
            </header>

            {/* Search Bar with Filter */}
            <div className="px-5 py-2">
              <SearchBar 
                onFilterClick={() => setIsFilterOpen(true)} 
                onSearch={handleSearch}
                onVoiceSearch={() => setIsVoiceModalOpen(true)}
                onCameraSearch={() => setIsCameraModalOpen(true)}
              />
            </div>

            {/* Smart Search Tag Chips */}
            <div className="px-5 py-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Popular:</span>
              {['Milk & Dairy', 'Basmati Rice', 'Fresh Vegetables', 'Under ₹199', 'Sweets'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 text-gray-600 rounded-full text-[11px] font-bold whitespace-nowrap transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Main Ad Banner Carousel */}
            <div className="mt-2">
              <AdBanner onAdClick={handleOpenShop} />
            </div>

            {/* Categories Horizontal Scroll */}
            <section className="mt-4 py-3 bg-gray-50/70 border-y border-gray-100">
              <div className="px-5 flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#1DB954]" />
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Explore Categories</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('menu')} 
                  className="text-[11px] font-black text-[#1DB954] uppercase tracking-widest flex items-center gap-0.5 hover:underline"
                >
                  See All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5">
                {CATEGORIES.map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('menu')}
                    className="min-w-[92px] bg-white p-2.5 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col items-center cursor-pointer text-center group hover:border-[#1DB954] transition-colors"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <h3 className="font-bold text-gray-900 text-xs leading-tight">{cat.name}</h3>
                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">{cat.items}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* COMPACT Flash Sale Section (Dismissable / Ignorable) */}
            {!isFlashSaleDismissed && (
              <section className="px-5 mt-4">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-3.5 text-white shadow-sm relative overflow-hidden">
                  
                  {/* Ignore / Dismiss Button */}
                  <button 
                    onClick={() => setIsFlashSaleDismissed(true)}
                    className="absolute top-2.5 right-2.5 p-1 bg-black/20 hover:bg-black/40 text-white/90 rounded-full transition-colors z-20"
                    title="Ignore / Hide Flash Offers"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between mb-2.5 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-white/20 backdrop-blur-md rounded-lg">
                        <Zap className="w-4 h-4 text-yellow-200 fill-current" />
                      </span>
                      <div>
                        <h2 className="text-sm font-black tracking-wide leading-none">Flash Sale Today</h2>
                      </div>
                    </div>

                    {/* Compact Countdown Ticker */}
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                      <Clock className="w-3 h-3 text-amber-200" />
                      <span className="text-[11px] font-black tracking-wider">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Compact Flash Sale Carousel */}
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {FLASH_SALE_ITEMS.map((item) => (
                      <motion.div
                        key={item.id}
                        whileTap={{ scale: 0.96 }}
                        className="min-w-[130px] w-[130px] bg-white text-gray-900 p-2 rounded-2xl shadow-2xs relative shrink-0 flex flex-col justify-between"
                      >
                        <div>
                          <div 
                            onClick={() => setSelectedProduct(item)}
                            className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-1.5 relative cursor-pointer"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-black px-1 py-0.5 rounded-md shadow-2xs">
                              {item.discount}
                            </span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tight truncate">{item.shopName}</p>
                          <h3 className="font-bold text-[11px] text-gray-900 leading-tight truncate">{item.name}</h3>
                        </div>

                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-black text-gray-900 leading-none">₹{item.price}</p>
                            <p className="text-[8px] text-gray-400 line-through leading-none mt-0.5">₹{item.originalPrice}</p>
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
                              showToast(`Added to Cart! 🛒`);
                            }}
                            className="p-1 bg-[#1DB954] text-white rounded-lg shadow-2xs hover:bg-emerald-600 transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Coupons & Offers Banner Section */}
            <section className="px-5 mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Mandla Active Coupons</h2>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Tap to Copy</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div 
                  onClick={() => copyCouponCode('MANDLA100')}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 p-3 rounded-2xl cursor-pointer hover:border-purple-400 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-200/60 px-1.5 py-0.5 rounded-md">MANDLA100</span>
                    {copiedCoupon === 'MANDLA100' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900">Flat ₹100 OFF</p>
                  <p className="text-[9px] text-gray-500">Above ₹499 order</p>
                </div>

                <div 
                  onClick={() => copyCouponCode('FREESHIP')}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 p-3 rounded-2xl cursor-pointer hover:border-emerald-400 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-md">FREESHIP</span>
                    {copiedCoupon === 'FREESHIP' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900">Free Home Delivery</p>
                  <p className="text-[9px] text-gray-500">On first 3 orders</p>
                </div>
              </div>
            </section>

            {/* Featured Brands */}
            <section className="px-5 mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Featured Local Brands</h2>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleSearch(brand.name)}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200/70 hover:border-emerald-500 px-3 py-1.5 rounded-xl shrink-0 transition-colors"
                  >
                    <span className="text-base">{brand.logo}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 leading-none">{brand.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 mt-0.5">{brand.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Top Rated Nearby Shops */}
            <section className="px-5 mt-4 pb-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Top Rated Shops Near You</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('menu')} 
                  className="text-[11px] font-black text-[#1DB954] uppercase tracking-widest hover:underline"
                >
                  See All
                </button>
              </div>

              <div className="space-y-2.5">
                {NEARBY_SHOPS.map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between hover:border-emerald-300 transition-colors"
                  >
                    <div 
                      onClick={() => handleOpenShop(shop)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-gray-900 text-xs leading-tight">{shop.name}</h3>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" title="Open Now"></span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{shop.category}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-bold text-gray-400">
                          <span className="flex items-center gap-0.5 text-amber-500 font-black">
                            <Star className="w-3 h-3 fill-current" /> {shop.rating}
                          </span>
                          <span>•</span>
                          <span>{shop.location}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollowShop(shop.id!, shop.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        followedShopIds.has(shop.id!)
                          ? 'bg-emerald-50 text-[#1DB954] border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {followedShopIds.has(shop.id!) ? 'Following ✓' : '+ Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPACT Flash Sale Section (Dismissable / Ignorable) */}
            {!isFlashSaleDismissed && (
              <section className="px-5 mt-4">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-3.5 text-white shadow-sm relative overflow-hidden">
                  
                  {/* Ignore / Dismiss Button */}
                  <button 
                    onClick={() => setIsFlashSaleDismissed(true)}
                    className="absolute top-2.5 right-2.5 p-1 bg-black/20 hover:bg-black/40 text-white/90 rounded-full transition-colors z-20"
                    title="Ignore / Hide Flash Offers"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between mb-2.5 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-white/20 backdrop-blur-md rounded-lg">
                        <Zap className="w-4 h-4 text-yellow-200 fill-current" />
                      </span>
                      <div>
                        <h2 className="text-sm font-black tracking-wide leading-none">Flash Sale Today</h2>
                      </div>
                    </div>

                    {/* Compact Countdown Ticker */}
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                      <Clock className="w-3 h-3 text-amber-200" />
                      <span className="text-[11px] font-black tracking-wider">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Compact Flash Sale Carousel */}
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {FLASH_SALE_ITEMS.map((item) => (
                      <motion.div
                        key={item.id}
                        whileTap={{ scale: 0.96 }}
                        className="min-w-[130px] w-[130px] bg-white text-gray-900 p-2 rounded-2xl shadow-2xs relative shrink-0 flex flex-col justify-between"
                      >
                        <div>
                          <div 
                            onClick={() => setSelectedProduct(item)}
                            className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-1.5 relative cursor-pointer"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-black px-1 py-0.5 rounded-md shadow-2xs">
                              {item.discount}
                            </span>
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-tight truncate">{item.shopName}</p>
                          <h3 className="font-bold text-[11px] text-gray-900 leading-tight truncate">{item.name}</h3>
                        </div>

                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-black text-gray-900 leading-none">₹{item.price}</p>
                            <p className="text-[8px] text-gray-400 line-through leading-none mt-0.5">₹{item.originalPrice}</p>
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
                              showToast(`Added to Cart! 🛒`);
                            }}
                            className="p-1 bg-[#1DB954] text-white rounded-lg shadow-2xs hover:bg-emerald-600 transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Coupons & Offers Banner Section */}
            <section className="px-5 mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-purple-600" />
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Mandla Active Coupons</h2>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Tap to Copy</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div 
                  onClick={() => copyCouponCode('MANDLA100')}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 p-3 rounded-2xl cursor-pointer hover:border-purple-400 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-200/60 px-1.5 py-0.5 rounded-md">MANDLA100</span>
                    {copiedCoupon === 'MANDLA100' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900">Flat ₹100 OFF</p>
                  <p className="text-[9px] text-gray-500">Above ₹499 order</p>
                </div>

                <div 
                  onClick={() => copyCouponCode('FREESHIP')}
                  className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 p-3 rounded-2xl cursor-pointer hover:border-emerald-400 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded-md">FREESHIP</span>
                    {copiedCoupon === 'FREESHIP' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900">Free Home Delivery</p>
                  <p className="text-[9px] text-gray-500">On first 3 orders</p>
                </div>
              </div>
            </section>

            {/* Featured Brands */}
            <section className="px-5 mt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-wide">Featured Local Brands</h2>
              </div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                {BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleSearch(brand.name)}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200/70 hover:border-emerald-500 px-3 py-1.5 rounded-xl shrink-0 transition-colors"
                  >
                    <span className="text-base">{brand.logo}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 leading-none">{brand.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 mt-0.5">{brand.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  const hideBottomNav = isEditingProfile || isApplyingSeller || isApplyingRider || isViewingWallet || isViewingMap || isViewingSupport || isViewingSettings || selectedProduct || selectedShop;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden max-w-md mx-auto border-x border-gray-100 shadow-xl">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-4 py-2 rounded-2xl shadow-lg text-xs font-bold backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      {/* Voice Search Modal */}
      <AnimatePresence>
        {isVoiceModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsVoiceModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-20 h-20 bg-emerald-50 text-[#1DB954] rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                <Mic className="w-10 h-10" />
              </div>
              <h3 className="font-black text-gray-900 text-lg">Listening in Mandla...</h3>
              <p className="text-xs text-gray-500 mt-1">Speak item or shop name (e.g. "Pure Ghee in Mandla")</p>

              <button 
                onClick={() => {
                  setIsVoiceModalOpen(false);
                  handleSearch('Pure Ghee');
                }}
                className="mt-6 w-full py-3 bg-[#1DB954] text-white font-bold rounded-2xl text-xs shadow-md uppercase tracking-wider"
              >
                Simulate Voice: "Pure Ghee"
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Visual Search Modal */}
      <AnimatePresence>
        {isCameraModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsCameraModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <Camera className="w-10 h-10" />
              </div>
              <h3 className="font-black text-gray-900 text-lg">Visual Item Search</h3>
              <p className="text-xs text-gray-500 mt-1">Point camera or upload product photo to find instant local sellers in Mandla.</p>

              <button 
                onClick={() => {
                  setIsCameraModalOpen(false);
                  handleSearch('Grocery');
                }}
                className="mt-6 w-full py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs shadow-md uppercase tracking-wider"
              >
                Scan Photo Sample
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>
        {isViewingUdhar && (
          <BiometricGuard onCancel={() => setIsViewingUdhar(false)} title="Verify Udhar Book Access">
            <UdharScreen onBack={() => setIsViewingUdhar(false)} />
          </BiometricGuard>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onShopClick={handleOpenShop}
          />
        )}
        {selectedShop && (
          <ShopPage 
            shop={selectedShop} 
            onClose={() => setSelectedShop(null)}
            onProductClick={setSelectedProduct}
          />
        )}
      </AnimatePresence>

      {/* Drawer Component */}
      <DashboardDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onLogout={onLogout} 
        onOpenMiniWebsite={() => setIsEditingProfile(true)}
        onBecomeSeller={() => setIsApplyingSeller(true)}
        onBecomeRider={() => setIsApplyingRider(true)}
        onOpenWallet={() => setIsViewingWallet(true)}
        onOpenMap={() => setIsViewingMap(true)}
        onOpenSupport={() => setIsViewingSupport(true)}
        onOpenSettings={() => setIsViewingSettings(true)}
        onOpenUdhar={() => setIsViewingUdhar(true)}
        onSwitchToSeller={() => onSwitchRole('seller')}
        onSwitchToRider={() => onSwitchRole('rider')}
        onOpenAdminDashboard={() => onSwitchRole('admin')}
        user={user}
      />

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        activeFilters={activeFilterState}
        onApplyFilters={(filters) => {
          setActiveFilterState(filters);
          showToast('Filters applied! 🎯');
          if (filters.category !== 'All' || filters.brand !== 'All') {
            setIsSearching(true);
          }
        }}
      />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};
