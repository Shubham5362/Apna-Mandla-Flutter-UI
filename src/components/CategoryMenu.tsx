import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Camera, 
  ShoppingCart, 
  ChevronRight, 
  LayoutGrid, 
  Star, 
  Mic, 
  Bell, 
  MapPin, 
  SlidersHorizontal, 
  Sparkles, 
  Truck, 
  Wrench, 
  ShieldCheck, 
  Heart, 
  Plus, 
  Minus, 
  Check, 
  Zap, 
  Tag, 
  ArrowRight, 
  Store, 
  Phone, 
  Award, 
  Filter, 
  Flame, 
  Clock, 
  RefreshCw, 
  X,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { FilterModal, FilterState } from './FilterModal';

// Categories Definition
const CATEGORIES = [
  { id: 'grocery', name: 'Grocery', icon: '🛒', isNew: false },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦', isNew: false },
  { id: 'fruits', name: 'Fruits', icon: '🍎', isNew: false },
  { id: 'dairy', name: 'Dairy', icon: '🥛', isNew: false },
  { id: 'medicines', name: 'Medicines', icon: '💊', isNew: true },
  { id: 'electronics', name: 'Electronics', icon: '🎧', isNew: false },
  { id: 'fashion', name: 'Fashion', icon: '👕', isNew: false },
  { id: 'mobiles', name: 'Mobiles', icon: '📱', isNew: false },
  { id: 'home', name: 'Home', icon: '🏠', isNew: false },
  { id: 'furniture', name: 'Furniture', icon: '🪑', isNew: false },
  { id: 'beauty', name: 'Beauty', icon: '💄', isNew: false },
  { id: 'kids', name: 'Kids', icon: '🧸', isNew: false },
  { id: 'services', name: 'Services', icon: '🛠️', isNew: true },
  { id: 'parcel', name: 'Parcel', icon: '🚚', isNew: false },
];

// Promotional Banners
const HERO_BANNERS = [
  {
    id: 'b1',
    title: 'Grocery Super Savings',
    subtitle: 'Fresh Staples, Oils & Pulses',
    tag: 'Up to 40% OFF',
    bg: 'from-emerald-900 via-emerald-800 to-green-950',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
    cta: 'Shop Grocery',
    catId: 'grocery'
  },
  {
    id: 'b2',
    title: '24x7 Emergency Medicines',
    subtitle: 'Doorstep Express Delivery in Mandla',
    tag: '20 Min Express ⚡',
    bg: 'from-blue-900 via-indigo-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    cta: 'Order Meds',
    catId: 'medicines'
  },
  {
    id: 'b3',
    title: 'Verified Mandla Merchants',
    subtitle: 'Support Genuine Local Shops & Bazaars',
    tag: '100% Genuine',
    bg: 'from-purple-900 via-indigo-900 to-purple-950',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&auto=format&fit=crop&q=60',
    cta: 'Explore Shops',
    catId: 'grocery'
  },
  {
    id: 'b4',
    title: 'Apna Mandla Parcel Express',
    subtitle: 'Pick up & drop documents, tiffins, parcels',
    tag: 'From ₹35 Only',
    bg: 'from-amber-900 via-orange-900 to-amber-950',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
    cta: 'Book Parcel',
    catId: 'parcel'
  },
  {
    id: 'b5',
    title: 'Mandla Festival Special Deals',
    subtitle: 'Sweets, Clothing, Home Decor & Electronics',
    tag: 'Festival Offers 💥',
    bg: 'from-rose-900 via-red-800 to-pink-950',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60',
    cta: 'View Offers',
    catId: 'fashion'
  },
  {
    id: 'b6',
    title: 'Sahu Sweets & Bakery (Sponsored)',
    subtitle: 'Fresh Hot Jalebis & Rabdi delivered hot!',
    tag: '10% OFF Today',
    bg: 'from-yellow-900 via-amber-800 to-orange-950',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60',
    cta: 'Order Sweets',
    catId: 'dairy'
  }
];

// Local Services Data
const LOCAL_SERVICES = [
  { id: 's1', name: 'Electrician', icon: '⚡', provider: 'Verma Electricals', rating: 4.8, distance: '1.2 km', phone: '+91 98261 11223' },
  { id: 's2', name: 'Plumber', icon: '🪠', provider: 'Sharma Plumbing', rating: 4.9, distance: '0.8 km', phone: '+91 98261 44556' },
  { id: 's3', name: 'Mechanic', icon: '🔧', provider: 'A-1 Auto Garage', rating: 4.7, distance: '2.0 km', phone: '+91 98261 77889' },
  { id: 's4', name: 'Carpenter', icon: '🪚', provider: 'Sahu Woodcraft', rating: 4.6, distance: '1.5 km', phone: '+91 98261 99001' },
  { id: 's5', name: 'Painter', icon: '🖌️', provider: 'Color Craft Mandla', rating: 4.8, distance: '2.2 km', phone: '+91 98261 22334' },
  { id: 's6', name: 'Cleaning', icon: '🧹', provider: 'CleanHome Mandla', rating: 4.9, distance: '1.1 km', phone: '+91 98261 55667' },
  { id: 's7', name: 'Gas Delivery', icon: '🔥', provider: 'Indane Gas Agency', rating: 4.7, distance: '3.0 km', phone: '+91 98261 88990' },
  { id: 's8', name: 'Water Supplier', icon: '🚰', provider: 'Narmada Water Supply', rating: 4.8, distance: '0.5 km', phone: '+91 98261 33445' },
  { id: 's9', name: 'Milk Delivery', icon: '🥛', provider: 'Mandla Fresh Dairy', rating: 4.9, distance: '0.6 km', phone: '+91 98261 66778' },
  { id: 's10', name: 'Courier', icon: '📦', provider: 'DTDC Courier Mandla', rating: 4.6, distance: '1.8 km', phone: '+91 98261 99112' },
];

// Rich Featured Shops Data
const FEATURED_SHOPS = [
  {
    id: 'shop_1',
    type: 'shop',
    name: 'Mandla Fresh Grocery',
    category: 'Grocery',
    rating: 4.9,
    reviews: 320,
    distance: 1.2,
    deliveryTime: '15-20 min',
    isOpen: true,
    isFreeDelivery: true,
    isVerified: true,
    image: 'https://picsum.photos/seed/shopg1/200/200',
    address: 'Main Market Road, Mandla'
  },
  {
    id: 'shop_2',
    type: 'shop',
    name: 'Apollo Medical Hall',
    category: 'Medicines',
    rating: 4.8,
    reviews: 210,
    distance: 0.8,
    deliveryTime: '10-15 min',
    isOpen: true,
    isFreeDelivery: true,
    isVerified: true,
    image: 'https://picsum.photos/seed/shopmed/200/200',
    address: 'Hospital Square, Mandla'
  },
  {
    id: 'shop_3',
    type: 'shop',
    name: 'Tech Hub Electronics',
    category: 'Electronics',
    rating: 4.7,
    reviews: 145,
    distance: 2.5,
    deliveryTime: '30-45 min',
    isOpen: true,
    isFreeDelivery: false,
    isVerified: true,
    image: 'https://picsum.photos/seed/shopelect/200/200',
    address: 'Bus Stand Complex, Mandla'
  },
  {
    id: 'shop_4',
    type: 'shop',
    name: 'Sahu Dairy & Sweets',
    category: 'Dairy',
    rating: 4.9,
    reviews: 480,
    distance: 0.5,
    deliveryTime: '10-15 min',
    isOpen: true,
    isFreeDelivery: true,
    isVerified: true,
    image: 'https://picsum.photos/seed/shopsweets/200/200',
    address: 'Lalipur Chowk, Mandla'
  }
];

// Categorized Products Data
const PRODUCTS_DATABASE: Record<string, any[]> = {
  grocery: [
    { id: 'g1', type: 'product', name: 'Fortune Mustard Oil (1L)', variant: '1 Litre Pouch', price: 145, originalPrice: 170, discount: 15, rating: 4.8, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/oil1/200/200', shop: 'Mandla Fresh Grocery' },
    { id: 'g2', type: 'product', name: 'Aashirvaad Shudh Atta (5kg)', variant: '5 kg Pack', price: 235, originalPrice: 275, discount: 14, rating: 4.9, distance: 1.1, isFastDelivery: true, image: 'https://picsum.photos/seed/atta1/200/200', shop: 'Mandla Fresh Grocery' },
    { id: 'g3', type: 'product', name: 'Tata Salt Vacuum Evaporated', variant: '1 kg Pack', price: 28, originalPrice: 30, discount: 6, rating: 4.9, distance: 0.5, isFastDelivery: true, image: 'https://picsum.photos/seed/salt1/200/200', shop: 'Daily Needs Store' },
    { id: 'g4', type: 'product', name: 'Madhur Pure Sugar', variant: '1 kg Pack', price: 48, originalPrice: 55, discount: 12, rating: 4.7, distance: 1.5, isFastDelivery: false, image: 'https://picsum.photos/seed/sugar1/200/200', shop: 'Mandla Fresh Grocery' },
    { id: 'g5', type: 'product', name: 'Basmati Premium Rice (5kg)', variant: '5 kg Bag', price: 490, originalPrice: 580, discount: 15, rating: 4.8, distance: 1.2, isFastDelivery: true, image: 'https://picsum.photos/seed/rice1/200/200', shop: 'Mandla Fresh Grocery' },
  ],
  vegetables: [
    { id: 'v1', type: 'product', name: 'Fresh Organic Tomatoes', variant: '1 kg Fresh', price: 35, originalPrice: 50, discount: 30, rating: 4.8, distance: 0.5, isFastDelivery: true, image: 'https://picsum.photos/seed/tomato/200/200', shop: 'Mandla Veggies Bazaar' },
    { id: 'v2', type: 'product', name: 'Desi Red Onions', variant: '1 kg Fresh', price: 25, originalPrice: 35, discount: 28, rating: 4.7, distance: 0.6, isFastDelivery: true, image: 'https://picsum.photos/seed/onion/200/200', shop: 'Mandla Veggies Bazaar' },
    { id: 'v3', type: 'product', name: 'New Crop Potatoes', variant: '1 kg Fresh', price: 20, originalPrice: 30, discount: 33, rating: 4.6, distance: 0.6, isFastDelivery: true, image: 'https://picsum.photos/seed/potato/200/200', shop: 'Mandla Veggies Bazaar' },
    { id: 'v4', type: 'product', name: 'Fresh Green Peas (Matar)', variant: '500g Pack', price: 40, originalPrice: 60, discount: 33, rating: 4.9, distance: 1.0, isFastDelivery: true, image: 'https://picsum.photos/seed/peas/200/200', shop: 'Mandla Veggies Bazaar' },
  ],
  fruits: [
    { id: 'fr1', type: 'product', name: 'Shimla Red Apples', variant: '1 kg Box', price: 160, originalPrice: 200, discount: 20, rating: 4.9, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/apple/200/200', shop: 'Fresh Fruit Corner' },
    { id: 'fr2', type: 'product', name: 'Fresh Bananas (Robusta)', variant: '1 Dozen', price: 45, originalPrice: 60, discount: 25, rating: 4.8, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/banana/200/200', shop: 'Fresh Fruit Corner' },
    { id: 'fr3', type: 'product', name: 'Nagpur Juicing Oranges', variant: '1 kg Pack', price: 80, originalPrice: 110, discount: 27, rating: 4.7, distance: 1.2, isFastDelivery: false, image: 'https://picsum.photos/seed/orange/200/200', shop: 'Fresh Fruit Corner' },
  ],
  dairy: [
    { id: 'd1', type: 'product', name: 'Amul Taaza Toned Milk (1L)', variant: '1 Litre Pouch', price: 54, originalPrice: 56, discount: 3, rating: 4.9, distance: 0.4, isFastDelivery: true, image: 'https://picsum.photos/seed/milk/200/200', shop: 'Sahu Dairy' },
    { id: 'd2', type: 'product', name: 'Fresh Malai Paneer', variant: '200g Pack', price: 90, originalPrice: 105, discount: 14, rating: 4.9, distance: 0.4, isFastDelivery: true, image: 'https://picsum.photos/seed/paneer/200/200', shop: 'Sahu Dairy' },
    { id: 'd3', type: 'product', name: 'Amul Butter Salted', variant: '100g Box', price: 58, originalPrice: 60, discount: 3, rating: 4.9, distance: 0.4, isFastDelivery: true, image: 'https://picsum.photos/seed/butter/200/200', shop: 'Sahu Dairy' },
  ],
  medicines: [
    { id: 'm1', type: 'product', name: 'Paracetamol 650mg Tablets', variant: 'Strip of 15', price: 32, originalPrice: 40, discount: 20, rating: 4.9, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/med1/200/200', shop: 'Apollo Medical Hall' },
    { id: 'm2', type: 'product', name: 'Volini Fast Pain Relief Gel', variant: '50g Tube', price: 135, originalPrice: 160, discount: 15, rating: 4.8, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/med2/200/200', shop: 'Apollo Medical Hall' },
    { id: 'm3', type: 'product', name: 'Dettol Antiseptic Liquid', variant: '250ml Bottle', price: 120, originalPrice: 140, discount: 14, rating: 4.9, distance: 0.8, isFastDelivery: true, image: 'https://picsum.photos/seed/dettol/200/200', shop: 'Apollo Medical Hall' },
  ],
  electronics: [
    { id: 'e1', type: 'product', name: 'Wireless Bluetooth Earbuds', variant: 'Black / TWS', price: 899, originalPrice: 1999, discount: 55, rating: 4.6, distance: 2.5, isFastDelivery: false, image: 'https://picsum.photos/seed/earbuds/200/200', shop: 'Tech Hub Electronics' },
    { id: 'e2', type: 'product', name: 'Fast Charging Power Bank 10000mAh', variant: '22.5W Fast', price: 999, originalPrice: 1799, discount: 44, rating: 4.7, distance: 2.5, isFastDelivery: false, image: 'https://picsum.photos/seed/powerbank/200/200', shop: 'Tech Hub Electronics' },
  ],
  mobiles: [
    { id: 'mob1', type: 'product', name: '5G Smartphone (6GB/128GB)', variant: 'Midnight Blue', price: 11999, originalPrice: 15999, discount: 25, rating: 4.7, distance: 2.5, isFastDelivery: false, image: 'https://picsum.photos/seed/phone/200/200', shop: 'Tech Hub Electronics' },
  ],
  fashion: [
    { id: 'f1', type: 'product', name: 'Cotton Men Shirt Casual', variant: 'Size L / Blue', price: 499, originalPrice: 999, discount: 50, rating: 4.5, distance: 1.8, isFastDelivery: false, image: 'https://picsum.photos/seed/shirt/200/200', shop: 'Mandla Fashion Point' },
  ]
};

interface CategoryMenuProps {
  onProductClick?: (product: any) => void;
  onShopClick?: (shop: any) => void;
  onNavigateParcel?: () => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  onProductClick, 
  onShopClick,
  onNavigateParcel 
}) => {
  const { selectedArea, detectLocation } = useLocation();
  const { items, addToCart, updateQuantity, totalPrice, totalItems } = useCart();

  // Navigation & Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('grocery');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby' | 'top_rated' | 'fast' | 'lowest' | 'discount'>('all');
  const [radiusFilter, setRadiusFilter] = useState<'all' | '3' | '5' | '10'>('all');
  
  // Refine Modal Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalFilters, setModalFilters] = useState<FilterState>({
    category: 'All',
    priceRange: 'All',
    rating: 'All',
    distance: 'All',
    availability: 'All',
    offers: 'All',
    deliveryTime: 'All',
    brand: 'All'
  });

  // Search Overlay States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Fresh Milk', 'Rice 5kg', 'Electrician', 'Paracetamol']);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Hero Banner Carousel State & Smooth Bidirectional Direction
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerDirection, setBannerDirection] = useState(1);

  // Fetch Location State
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Skeleton Loading Simulation state
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  // Banner Auto Scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerDirection(1);
      setCurrentBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const slideNextBanner = () => {
    setBannerDirection(1);
    setCurrentBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  const slidePrevBanner = () => {
    setBannerDirection(-1);
    setCurrentBannerIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  // Fetchable Location Handler
  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    await detectLocation();
    setIsFetchingLocation(false);
    setToastMsg("📍 GPS Location Fetched!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Category switch with skeleton feedback
  const handleCategoryChange = (catId: string) => {
    if (catId === 'parcel') {
      if (onNavigateParcel) onNavigateParcel();
      setSelectedCategory('parcel');
      return;
    }
    setIsLoadingCategory(true);
    setSelectedCategory(catId);
    setTimeout(() => setIsLoadingCategory(false), 200);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Search results helper across entire marketplace
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { products: [], shops: [], services: [] };
    const q = searchQuery.toLowerCase().trim();

    const allProducts = Object.values(PRODUCTS_DATABASE).flat();
    const products = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.variant?.toLowerCase().includes(q) ||
      p.shop?.toLowerCase().includes(q)
    );

    const shops = FEATURED_SHOPS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );

    const services = LOCAL_SERVICES.filter(srv =>
      srv.name.toLowerCase().includes(q) ||
      srv.provider.toLowerCase().includes(q)
    );

    return { products, shops, services };
  };

  // Filter items based on active filters, radius & refine modal
  const getFilteredProducts = () => {
    let list = PRODUCTS_DATABASE[selectedCategory] || PRODUCTS_DATABASE['grocery'];
    if (selectedCategory === 'all') {
      list = Object.values(PRODUCTS_DATABASE).flat();
    }

    // Radius filter (< 3 km, < 5 km, < 10 km)
    if (radiusFilter !== 'all') {
      const maxDistance = Number(radiusFilter);
      list = list.filter(p => p.distance <= maxDistance);
    }

    // Modal Filters: Distance
    if (modalFilters.distance !== 'All') {
      if (modalFilters.distance === 'Within 1 km') list = list.filter(p => p.distance <= 1);
      else if (modalFilters.distance === 'Within 3 km') list = list.filter(p => p.distance <= 3);
      else if (modalFilters.distance === 'Within 5 km') list = list.filter(p => p.distance <= 5);
    }

    // Modal Filters: Price Range
    if (modalFilters.priceRange !== 'All') {
      if (modalFilters.priceRange === 'Under ₹100') list = list.filter(p => p.price < 100);
      else if (modalFilters.priceRange === '₹100 - ₹500') list = list.filter(p => p.price >= 100 && p.price <= 500);
      else if (modalFilters.priceRange === '₹500 - ₹2000') list = list.filter(p => p.price >= 500 && p.price <= 2000);
      else if (modalFilters.priceRange === 'Above ₹2000') list = list.filter(p => p.price > 2000);
    }

    // Modal Filters: Rating
    if (modalFilters.rating !== 'All') {
      if (modalFilters.rating.includes('4.5')) list = list.filter(p => p.rating >= 4.5);
      else if (modalFilters.rating.includes('4.0')) list = list.filter(p => p.rating >= 4.0);
      else if (modalFilters.rating.includes('3.5')) list = list.filter(p => p.rating >= 3.5);
    }

    // Modal Filters: Availability
    if (modalFilters.availability !== 'All') {
      if (modalFilters.availability === 'In Stock Only' || modalFilters.availability === 'Open Shops Now') {
        list = list.filter(p => p.rating >= 4.0);
      } else if (modalFilters.availability === 'Express Delivery Active') {
        list = list.filter(p => p.isFastDelivery);
      }
    }

    // Modal Filters: Offers
    if (modalFilters.offers !== 'All') {
      if (modalFilters.offers.includes('> 20%')) list = list.filter(p => p.discount >= 20);
      else if (modalFilters.offers.includes('Free Home Delivery')) list = list.filter(p => p.distance <= 5);
    }

    // Modal Filters: Brand
    if (modalFilters.brand !== 'All') {
      const b = modalFilters.brand.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(b) || (p.shop && p.shop.toLowerCase().includes(b)));
    }

    // Sticky filter bar
    if (activeFilter === 'nearby') {
      list = [...list].sort((a, b) => a.distance - b.distance);
    } else if (activeFilter === 'top_rated') {
      list = [...list].filter(p => p.rating >= 4.8);
    } else if (activeFilter === 'fast') {
      list = [...list].filter(p => p.isFastDelivery);
    } else if (activeFilter === 'lowest') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (activeFilter === 'discount') {
      list = [...list].sort((a, b) => b.discount - a.discount);
    }

    return list;
  };

  // Filter shops based on radius & filters
  const getFilteredShops = () => {
    let list = FEATURED_SHOPS;
    if (radiusFilter !== 'all') {
      const maxDistance = Number(radiusFilter);
      list = list.filter(s => s.distance <= maxDistance);
    }
    if (modalFilters.distance !== 'All') {
      if (modalFilters.distance === 'Within 1 km') list = list.filter(s => s.distance <= 1);
      else if (modalFilters.distance === 'Within 3 km') list = list.filter(s => s.distance <= 3);
      else if (modalFilters.distance === 'Within 5 km') list = list.filter(s => s.distance <= 5);
    }
    if (activeFilter === 'top_rated') {
      list = list.filter(s => s.rating >= 4.7);
    } else if (activeFilter === 'nearby') {
      list = [...list].sort((a, b) => a.distance - b.distance);
    }
    return list;
  };

  // Helper to get item quantity in cart
  const getItemQuantity = (id: string) => {
    const item = items.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  // Voice Search Handler Mock
  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('Fresh Farm Milk');
      setIsSearchActive(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 overflow-hidden relative">
      
      {/* 1. TOP HEADER & DELIVERY LOCATION BAR (FETCHABLE GPS) */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100 shadow-2xs z-30 sticky top-0 space-y-2.5">
        
        {/* Row 1: Deliver to (Clickable / Fetchable Location) */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleFetchLocation}
            disabled={isFetchingLocation}
            className="flex items-center gap-2 min-w-0 text-left group active:scale-98 transition-all"
            title="Click to fetch live GPS location"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#1DB954] flex items-center justify-center shrink-0 border border-emerald-100/80 group-hover:scale-105 transition-transform">
              {isFetchingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1DB954]" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Deliver To (GPS)</p>
                <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                  {isFetchingLocation ? 'Fetching...' : 'Tap to Fetch'}
                </span>
              </div>
              <p className="text-xs font-black text-gray-900 truncate flex items-center gap-1">
                {selectedArea?.name || 'Main Market, Mandla'} <span className="text-[10px] text-[#1DB954] font-bold">(481001)</span>
              </p>
            </div>
          </button>

          {toastMsg && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-xs"
            >
              {toastMsg}
            </motion.span>
          )}
        </div>

        {/* Row 2: Search Bar with Camera & Mic Paired Together */}
        <div className="relative">
          <div className="relative flex items-center bg-gray-100 rounded-2xl px-3 py-2 border border-transparent focus-within:border-[#1DB954] focus-within:bg-white transition-all shadow-2xs">
            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchActive(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, shops, medicines, services..."
              className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600 mr-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Camera and Mic Buttons Paired Together */}
            <div className="flex items-center gap-1 shrink-0 ml-1 border-l border-gray-200 pl-1.5">
              <button 
                onClick={() => alert('📷 Barcode / QR Camera Scanner is ready!')}
                className="p-1.5 rounded-xl text-gray-500 hover:text-[#1DB954] hover:bg-gray-200/70 transition-all"
                title="Camera / Barcode Scanner"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button 
                onClick={handleVoiceSearch}
                className={`p-1.5 rounded-xl transition-all ${
                  isVoiceListening ? 'bg-rose-500 text-white animate-pulse' : 'text-gray-500 hover:text-[#1DB954] hover:bg-gray-200/70'
                }`}
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice listening status popover */}
          <AnimatePresence>
            {isVoiceListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-12 bg-gray-900 text-white p-3 rounded-2xl shadow-xl z-50 text-center text-xs font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Listening... Speak product name in Mandla (Hindi / English)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SEARCH LIVE OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <button onClick={() => setIsSearchActive(false)} className="p-2 rounded-full bg-gray-100">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-3 py-2 border focus-within:border-[#1DB954]">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search Mandla products, shops, services..."
                  className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none"
                />
                <div className="flex items-center gap-1 border-l border-gray-200 pl-1.5 ml-1">
                  <button 
                    onClick={() => alert('📷 Camera Scanner Active!')}
                    className="p-1 rounded-xl text-gray-500 hover:text-[#1DB954]"
                    title="Camera Scanner"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleVoiceSearch}
                    className="p-1 rounded-xl text-gray-500 hover:text-[#1DB954]"
                    title="Voice Search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 space-y-4 no-scrollbar">
              {searchQuery.trim().length > 0 ? (
                /* LIVE SEARCH RESULTS */
                <div className="space-y-4">
                  {(() => {
                    const { products, shops, services } = getSearchResults();
                    const totalResults = products.length + shops.length + services.length;

                    if (totalResults === 0) {
                      return (
                        <div className="text-center py-12 text-gray-400 space-y-2">
                          <p className="text-2xl">🔍</p>
                          <p className="text-xs font-bold">No results found for "{searchQuery}"</p>
                          <p className="text-[10px]">Try searching "Milk", "Rice", "Electrician" or "Apollo"</p>
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* Matching Products */}
                        {products.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Matching Products ({products.length})
                            </p>
                            <div className="grid grid-cols-2 gap-2.5">
                              {products.map((p) => {
                                const qty = getItemQuantity(p.id);
                                return (
                                  <div key={p.id} className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                                    <div className="flex gap-2 items-center mb-1.5">
                                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                                      <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-gray-900 text-xs truncate">{p.name}</h5>
                                        <p className="text-[9px] text-gray-400 font-bold truncate">{p.shop}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200/60 pt-1.5 mt-1">
                                      <span className="text-xs font-black text-gray-900">₹{p.price}</span>
                                      <button
                                        onClick={() => addToCart({ ...p, quantity: 1, shopName: p.shop })}
                                        className="bg-[#1DB954] text-white px-2.5 py-1 rounded-xl text-[10px] font-black uppercase"
                                      >
                                        + Add
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Matching Shops */}
                        {shops.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Matching Shops ({shops.length})
                            </p>
                            <div className="space-y-2">
                              {shops.map((s) => (
                                <div key={s.id} onClick={() => { onShopClick?.(s); setIsSearchActive(false); }} className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    <img src={s.image} alt={s.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                    <div>
                                      <h5 className="font-black text-gray-900 text-xs">{s.name}</h5>
                                      <p className="text-[10px] text-gray-500 font-bold">{s.address}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 px-2.5 py-1 rounded-xl">Visit Shop</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Matching Services */}
                        {services.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Matching Services ({services.length})
                            </p>
                            <div className="space-y-2">
                              {services.map((srv) => (
                                <div key={srv.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-xl">{srv.icon}</span>
                                    <div>
                                      <h5 className="font-black text-gray-900 text-xs">{srv.name}</h5>
                                      <p className="text-[10px] text-gray-500 font-bold">{srv.provider}</p>
                                    </div>
                                  </div>
                                  <a href={`tel:${srv.phone}`} className="p-2 rounded-xl bg-emerald-500 text-white">
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <>
                  {/* Recent Searches */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recent Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSearchQuery(s)}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-50 hover:text-[#1DB954]"
                        >
                          🕒 {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches in Mandla */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trending In Mandla</p>
                    <div className="flex flex-wrap gap-2">
                      {['🔥 Fresh Cow Milk', '🔥 Tiffin Delivery', '🔥 Electrician Service', '🔥 Organic Rice', '🔥 Express Parcel'].map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSearchQuery(t.replace('🔥 ', ''))}
                          className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-100"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT: LEFT CATEGORY RAIL + RIGHT CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* 2. LEFT CATEGORY NAVIGATION RAIL */}
        <div className="w-20 bg-white border-r border-gray-100 overflow-y-auto no-scrollbar h-full py-2 shrink-0 space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full py-3 px-1 flex flex-col items-center gap-1 transition-all relative ${
                  isSelected ? 'bg-emerald-50/60' : 'hover:bg-gray-50'
                }`}
              >
                {/* Highlight Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCatBar"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-[#1DB954] rounded-r-full"
                  />
                )}

                {/* New Badge */}
                {cat.isNew && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full uppercase scale-90">
                    NEW
                  </span>
                )}

                {/* Icon Box */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-transform ${
                  isSelected ? 'bg-[#1DB954] text-white shadow-xs scale-105' : 'bg-gray-100 text-gray-700'
                }`}>
                  {cat.icon}
                </div>

                <span className={`text-[9px] font-black text-center leading-tight tracking-tight uppercase ${
                  isSelected ? 'text-[#1DB954]' : 'text-gray-500'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. RIGHT CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar h-full bg-gray-50/50 pb-28 relative">
          {/* SLIDABLE HERO CAROUSEL AD BANNER SECTION (ALWAYS VISIBLE & SMOOTH SLIDABLE BOTH WAYS) */}
          <div className="relative rounded-3xl overflow-hidden shadow-md text-white group">
            <AnimatePresence mode="wait" custom={bannerDirection}>
              <motion.div
                key={currentBannerIndex}
                custom={bannerDirection}
                initial={{ opacity: 0, x: bannerDirection > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: bannerDirection > 0 ? -80 : 80 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 50) {
                    slidePrevBanner();
                  } else if (info.offset.x < -50) {
                    slideNextBanner();
                  }
                }}
                className={`bg-gradient-to-br ${HERO_BANNERS[currentBannerIndex].bg} p-5 relative min-h-[140px] flex flex-col justify-between cursor-grab active:cursor-grabbing select-none`}
              >
                <div className="relative z-10 max-w-[210px] space-y-1">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    {HERO_BANNERS[currentBannerIndex].tag}
                  </span>
                  <h3 className="text-base font-black tracking-tight leading-tight">
                    {HERO_BANNERS[currentBannerIndex].title}
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium line-clamp-1">
                    {HERO_BANNERS[currentBannerIndex].subtitle}
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryChange(HERO_BANNERS[currentBannerIndex].catId)}
                  className="bg-white text-gray-900 font-black text-[10px] px-3.5 py-2 rounded-xl shadow-md uppercase tracking-wider self-start mt-3 active:scale-95 transition-transform flex items-center gap-1 z-10"
                >
                  <span>{HERO_BANNERS[currentBannerIndex].cta}</span>
                  <ChevronRight className="w-3 h-3 text-[#1DB954]" />
                </button>

                {/* Banner Background Image Overlay */}
                <img
                  src={HERO_BANNERS[currentBannerIndex].image}
                  alt="Promo Banner"
                  className="absolute right-0 top-0 bottom-0 w-1/2 object-cover opacity-35 mix-blend-overlay pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev & Next Slide Arrows */}
            <button
              onClick={slidePrevBanner}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 z-20 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={slideNextBanner}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 z-20 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Banner Page Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
              {HERO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBannerDirection(idx > currentBannerIndex ? 1 : -1);
                    setCurrentBannerIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    currentBannerIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* NEARBY RADIUS FILTER */}
          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" /> Distance Filter
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Showing nearest shops first</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'all', label: 'All Mandla' },
                { id: '3', label: '< 3 km' },
                { id: '5', label: '< 5 km' },
                { id: '10', label: '< 10 km' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRadiusFilter(r.id as any)}
                  className={`py-1.5 text-[10px] font-black rounded-xl border transition-all ${
                    radiusFilter === r.id
                      ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-xs'
                      : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* STICKY FILTER BAR WITH FILTER MODAL BUTTON */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap border bg-emerald-50 dark:bg-emerald-950/60 text-[#1DB954] border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
              {Object.values(modalFilters).filter(v => v !== 'All').length > 0 && (
                <span className="w-4 h-4 bg-[#1DB954] text-white text-[9px] rounded-full flex items-center justify-center">
                  {Object.values(modalFilters).filter(v => v !== 'All').length}
                </span>
              )}
            </button>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'nearby', label: '📍 Nearby First' },
              { id: 'top_rated', label: '⭐ Top Rated (4.8+)' },
              { id: 'fast', label: '⚡ Fast Delivery' },
              { id: 'lowest', label: '🏷️ Lowest Price' },
              { id: 'discount', label: '💥 High Discount' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap border transition-all shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-gray-900 border-gray-900 dark:border-zinc-100 shadow-2xs'
                    : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* FEATURED SHOPS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" /> Featured Mandla Shops
              </h3>
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Verified Merchants</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {getFilteredShops().map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => onShopClick?.(shop)}
                  className="w-48 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs shrink-0 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600 transition-all space-y-2 group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      {shop.category}
                    </span>
                    {shop.isFreeDelivery && (
                      <span className="absolute bottom-1.5 right-1.5 bg-gray-900/90 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded-md">
                        Free Delivery
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-gray-900 text-xs truncate leading-tight">{shop.name}</h4>
                      {shop.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold mt-1">
                      <span className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-current mr-0.5" /> {shop.rating}
                      </span>
                      <span>📍 {shop.distance} km</span>
                      <span className="text-emerald-700">⏱️ {shop.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCAL SERVICES SECTION (If 'services' selected or showcased) */}
          {(selectedCategory === 'services' || selectedCategory === 'all') && (
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-600" /> Mandla Local Home Services
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">Book electricians, plumbers & technicians</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {LOCAL_SERVICES.map((srv) => (
                  <div key={srv.id} className="bg-gray-50 p-2.5 rounded-2xl border border-gray-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{srv.icon}</span>
                      <div>
                        <p className="font-black text-gray-900 text-xs leading-none">{srv.name}</p>
                        <p className="text-[9px] text-gray-500 font-bold mt-0.5">{srv.provider}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${srv.phone}`}
                      className="p-2 rounded-xl bg-emerald-500 text-white shadow-2xs hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS GRID (MAIN LISTINGS) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest capitalize">
                  {selectedCategory} Marketplace
                </h3>
                <p className="text-[10px] text-gray-400 font-bold">Top quality & doorstep delivery in Mandla</p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {getFilteredProducts().length} Items
              </span>
            </div>

            {isLoadingCategory ? (
              /* Skeleton Loading Grid */
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white p-3 rounded-2xl border border-gray-100 animate-pulse space-y-2">
                    <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {getFilteredProducts().map((product) => {
                  const qty = getItemQuantity(product.id);
                  const isWishlisted = !!wishlist[product.id];

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onProductClick?.(product)}
                      className="bg-white p-3 rounded-3xl border border-gray-100 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer relative group"
                    >
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full z-10 transition-colors ${
                          isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-gray-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      {/* Discount Tag */}
                      {product.discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase z-10">
                          {product.discount}% OFF
                        </span>
                      )}

                      {/* Product Image */}
                      <div className="aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden mb-2 border border-gray-100/80 p-2 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2">{product.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{product.variant}</p>

                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-gray-500 font-bold pt-1 border-t border-gray-100">
                          <span className="text-amber-500 flex items-center">
                            <Star className="w-2.5 h-2.5 fill-current mr-0.5" /> {product.rating}
                          </span>
                          <span>📍 {product.distance} km</span>
                        </div>
                      </div>

                      {/* Add Button or Quantity Stepper */}
                      <div className="mt-3 pt-2" onClick={(e) => e.stopPropagation()}>
                        {qty > 0 ? (
                          <div className="flex items-center justify-between bg-emerald-500 text-white p-1 rounded-xl shadow-xs">
                            <button
                              onClick={() => updateQuantity(product.id, qty - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-emerald-600 rounded-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black">{qty}</span>
                            <button
                              onClick={() => updateQuantity(product.id, qty + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-emerald-600 rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart({ ...product, quantity: 1, shopName: product.shop })}
                            className="w-full bg-[#1DB954] hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-16 left-4 right-4 z-40 bg-gray-900 text-white p-3.5 rounded-2xl shadow-xl border border-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1DB954] text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added</p>
                <p className="text-[10px] text-emerald-400 font-bold">Total: ₹{totalPrice}</p>
              </div>
            </div>

            <button
              onClick={() => {
                // Custom event or click to trigger cart screen
                const cartBtn = document.querySelector('[data-tab="cart"]') as HTMLElement;
                if (cartBtn) cartBtn.click();
              }}
              className="bg-[#1DB954] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REFINE FILTER MODAL */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilters={modalFilters}
        onApplyFilters={(updatedFilters) => setModalFilters(updatedFilters)}
      />
    </div>
  );
};
