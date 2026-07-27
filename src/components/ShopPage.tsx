import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, MapPin, Phone, Share2, ShoppingCart, Search, 
  ChevronLeft, ChevronRight, Tag, Info, Image as ImageIcon, MessageCircle, 
  Clock, ShieldCheck, Heart, Navigation, QrCode, Check, Copy, X, Sparkles, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Shop, Product } from '../types';
import { UdharRequestForm } from './UdharRequestForm';
import { useUdhar } from '../context/UdharContext';

interface ShopPageProps {
  shop: Shop;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export const ShopPage = ({ shop, onClose, onProductClick }: ShopPageProps) => {
  const { addToCart } = useCart();
  const { getAccountForShop } = useUdhar();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRequestingUdhar, setIsRequestingUdhar] = useState(false);
  
  // Interactive Local States
  const [isFollowing, setIsFollowing] = useState(false);
  const [inShopSearchQuery, setInShopSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about' | 'gallery'>('products');

  const udharAccount = getAccountForShop(shop.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const banners = shop.banners?.length > 0 ? shop.banners : [
    'https://picsum.photos/seed/shop_slide1/800/400',
    'https://picsum.photos/seed/shop_slide2/800/400',
  ];

  const gallery = shop.gallery?.length > 0 ? shop.gallery : [
    'https://picsum.photos/seed/g1/300/300',
    'https://picsum.photos/seed/g2/300/300',
    'https://picsum.photos/seed/g3/300/300',
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextSlide, 4000);
      return () => clearInterval(timer);
    }
  }, [nextSlide, banners.length]);

  // Handle Share / QR
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on Apna Mandla!`,
        url: window.location.href,
      }).catch(() => {
        setIsQrModalOpen(true);
      });
    } else {
      setIsQrModalOpen(true);
    }
  };

  // Filter products by search and category
  const products = shop.products || [];
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General').filter(Boolean)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = !inShopSearchQuery || product.name.toLowerCase().includes(inShopSearchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
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

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-3 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center flex-1 px-2 overflow-hidden text-center">
          <h2 className="text-base font-black text-gray-900 truncate w-full">{shop.name}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{shop.category || 'General Store'}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsQrModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <QrCode className="w-5 h-5" />
          </button>
          <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* Large Image Banner Carousel */}
        <div className="relative h-48 w-full overflow-hidden group bg-gray-900">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentSlide}
              src={banners[currentSlide]}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Status Badges on Banner */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-emerald-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Open Now (Closes 9:30 PM)
            </span>
          </div>

          {banners.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Shop Info Card Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-white relative">
          <div className="flex items-start justify-between gap-3 -mt-10">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md z-10 bg-white shrink-0">
              <img src={shop.logo || shop.image} alt={shop.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="flex items-center gap-2 pt-10">
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  showToast(isFollowing ? 'Unfollowed shop' : 'Following shop updates! 🔔');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 ${
                  isFollowing 
                    ? 'bg-emerald-50 text-[#1DB954] border border-emerald-200' 
                    : 'bg-[#1DB954] text-white hover:bg-emerald-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current' : ''}`} />
                <span>{isFollowing ? 'Following ✓' : 'Follow Shop'}</span>
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-50 text-[#1DB954] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3" /> Verified Local Merchant
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Star className="w-3 h-3 text-amber-500 fill-current" />
                <span className="text-gray-900 text-xs font-black">{shop.rating || 4.8}</span>
              </div>
            </div>

            <h1 className="text-xl font-black text-gray-900 tracking-tight">{shop.name}</h1>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-snug">
              {shop.description || `Leading local merchant in Mandla district offering quality products with 30-min express home delivery.`}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2 my-3 py-2 bg-gray-50/80 rounded-2xl border border-gray-100 text-center">
              <div>
                <p className="text-xs font-black text-gray-900">25-35m</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Delivery ETA</p>
              </div>
              <div className="border-x border-gray-200/60">
                <p className="text-xs font-black text-gray-900">1.2 km</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Distance</p>
              </div>
              <div className="border-r border-gray-200/60">
                <p className="text-xs font-black text-gray-900">1,280+</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Orders</p>
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">2021</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Est. Year</p>
              </div>
            </div>

            {/* Action Bar: Call, WhatsApp, Directions, Chat */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              <a 
                href={`tel:${shop.phone || '+919876543210'}`} 
                className="flex flex-col items-center justify-center p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200/60 transition-colors"
              >
                <Phone className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase">Call Shop</span>
              </a>

              <a 
                href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(shop.name)},%20I%20have%20an%20inquiry%20from%20Apna%20Mandla.`} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl border border-green-200/60 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase">WhatsApp</span>
              </a>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(shop.address || shop.location || 'Mandla Madhya Pradesh')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl border border-blue-200/60 transition-colors"
              >
                <Navigation className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase">Directions</span>
              </a>

              <button 
                onClick={() => showToast('Instant Chat Connected! 💬')}
                className="flex flex-col items-center justify-center p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl border border-purple-200/60 transition-colors"
              >
                <Sparkles className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-black uppercase">Direct Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Khata / Udhar Request Banner */}
        <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <p className="text-xs font-black text-gray-900">Monthly Udhar / Khata Book</p>
              <p className="text-[10px] text-gray-500 font-bold">Buy now, pay at month end safely</p>
            </div>
          </div>
          {udharAccount ? (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-200">
              Khata Active ✓
            </span>
          ) : (
            <button 
              onClick={() => setIsRequestingUdhar(true)}
              className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-xs hover:bg-amber-600 transition-colors"
            >
              Apply Credit
            </button>
          )}
        </div>

        <AnimatePresence>
          {isRequestingUdhar && (
            <UdharRequestForm 
              shopId={shop.id} 
              shopName={shop.name} 
              onClose={() => setIsRequestingUdhar(false)} 
            />
          )}
        </AnimatePresence>

        {/* Exclusive Coupons */}
        {shop.offers && shop.offers.length > 0 && (
          <div className="px-5 py-4 border-b border-gray-100 bg-white">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-500" /> Exclusive Shop Coupons
            </p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {shop.offers.map((offer, i) => (
                <div key={i} className="min-w-[220px] p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black bg-purple-200 px-2 py-0.5 rounded-md text-purple-800">{offer.code}</span>
                    <p className="text-[10px] font-bold text-purple-700 mt-1">{offer.description}</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(offer.code);
                      showToast(`Copied coupon ${offer.code}! 🎉`);
                    }}
                    className="p-2 bg-white rounded-xl shadow-2xs text-purple-600 hover:bg-purple-100"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Tabs: Products, Reviews, About, Gallery */}
        <div className="flex border-b border-gray-200 sticky top-[61px] bg-white z-40 px-5">
          {[
            { id: 'products', label: 'Products' },
            { id: 'reviews', label: 'Reviews (4.8★)' },
            { id: 'about', label: 'Shop Info' },
            { id: 'gallery', label: 'Photos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-[#1DB954] text-[#1DB954]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="p-5 bg-gray-50/50">
            {/* Search within shop */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${shop.name}...`}
                value={inShopSearchQuery}
                onChange={(e) => setInShopSearchQuery(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-gray-200 focus:outline-none focus:border-[#1DB954]"
              />
              {inShopSearchQuery && (
                <button onClick={() => setInShopSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#1DB954] text-white shadow-2xs'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onProductClick({
                      ...product,
                      shopName: shop.name,
                      shopId: shop.id,
                    })}
                    className="bg-white p-3 rounded-3xl shadow-2xs border border-gray-100 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-2 relative">
                        <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          In Stock
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2">{product.name}</h3>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-sm font-black text-gray-900">₹{product.price}</p>
                        <span className="text-[9px] text-gray-400 font-bold">30 min del.</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...product, shopName: shop.name, shopId: shop.id });
                          showToast(`Added ${product.name} to Cart 🛒`);
                        }}
                        className="p-2 bg-emerald-50 text-[#1DB954] hover:bg-[#1DB954] hover:text-white rounded-xl transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-3xl p-6 border border-gray-100">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-600">No products matching filters</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Try clearing your search query</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="p-5 space-y-4">
            <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900">4.8 <span className="text-xs text-gray-500 font-bold">/ 5</span></p>
                <div className="flex text-amber-400 text-xs my-0.5">
                  {'★'.repeat(5)}
                </div>
                <p className="text-[10px] text-gray-500 font-bold">Based on 142 Mandla customer reviews</p>
              </div>
              <button 
                onClick={() => showToast('Review form opened!')}
                className="bg-[#1DB954] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs"
              >
                Write Review
              </button>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-3">
              {[
                { name: 'Ramesh Patel', rating: 5, date: 'Yesterday', text: 'Fastest delivery in Main Market! Milk & Ghee quality is top notch.', verified: true },
                { name: 'Sunita Sharma', rating: 5, date: '3 days ago', text: 'Very polite shopkeeper and accurate billing. Udhar book option is super convenient.', verified: true },
                { name: 'Aman Verma', rating: 4, date: '1 week ago', text: 'Fresh fruits and organic items delivered in 25 mins.', verified: true },
              ].map((rev, i) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs flex items-center justify-center">
                        {rev.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-none">{rev.name}</p>
                        <span className="text-[9px] text-emerald-600 font-bold">Verified Buyer ✓</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 text-xs my-1">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: About Shop */}
        {activeTab === 'about' && (
          <div className="p-5 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Business Details</h3>
              
              <div className="space-y-2 text-xs font-medium text-gray-600">
                <p><strong className="text-gray-900">Address:</strong> {shop.address || shop.location || 'Main Market Road, Mandla, MP'}</p>
                <p><strong className="text-gray-900">Working Hours:</strong> 8:00 AM – 9:30 PM (Mon-Sun)</p>
                <p><strong className="text-gray-900">Delivery Radius:</strong> Up to 8 km in Mandla district</p>
                <p><strong className="text-gray-900">Minimum Order:</strong> ₹50</p>
                <p><strong className="text-gray-900">Payment Modes:</strong> UPI (PhonePe/GPay), Cash on Delivery, Udhar Credit</p>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/80 space-y-2">
              <h3 className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1DB954]" /> Verification & Licenses
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-700">
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">FSSAI License: <span className="text-emerald-600">Verified ✓</span></div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">GST Registration: <span className="text-emerald-600">Active ✓</span></div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">Identity Check: <span className="text-emerald-600">Passed ✓</span></div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">Local Merchant ID: <span className="text-gray-900">MN-9821</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Gallery */}
        {activeTab === 'gallery' && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-2xs border border-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share QR Code Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl relative">
              <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400">
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="font-black text-gray-900 text-base">{shop.name} QR</h3>
              <p className="text-[10px] text-gray-500 font-bold mb-4">Scan to view mini website & order</p>

              <div className="bg-gray-50 p-4 rounded-2xl inline-block border border-gray-200 mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.href)}`} 
                  alt="Shop QR" 
                  className="w-40 h-40 mx-auto"
                />
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Shop link copied to clipboard! 📋');
                  setIsQrModalOpen(false);
                }}
                className="w-full py-2.5 bg-[#1DB954] text-white text-xs font-black rounded-xl uppercase tracking-wider"
              >
                Copy Direct Link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
