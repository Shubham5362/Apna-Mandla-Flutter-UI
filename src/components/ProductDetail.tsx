import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, Heart, ShoppingCart, Share2, ChevronRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    rating?: number;
    reviews?: number;
    shopId?: string;
    shopName?: string;
  };
  onClose: () => void;
  onShopClick?: (shop: any) => void;
}

export const ProductDetail = ({ product, onClose, onShopClick }: ProductDetailProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const rating = product.rating || 4.5;
  const reviews = product.reviews || 120;
  const shopName = product.shopName || 'Local Store';

  const handleShopClick = () => {
    if (onShopClick) {
      onShopClick({
        id: product.shopId,
        name: shopName,
      });
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-white z-[60] overflow-y-auto no-scrollbar pb-32"
    >
      {/* Header */}
      <div className="relative h-[450px]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
          <button onClick={onClose} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-100 border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{reviews} Reviews</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-400 text-sm font-bold mb-6">
            Sold by <button onClick={handleShopClick} className="text-[#1DB954] hover:underline">{shopName}</button>
          </p>

          <div className="flex items-center justify-between mb-8">
            <div className="text-3xl font-black text-gray-900">₹{product.price}</div>
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm"
              >
                -
              </button>
              <span className="font-black text-lg w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-100 mb-6">
            {['description', 'reviews', 'seller'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#1DB954] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[100px]">
            {activeTab === 'description' && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">Rahul S.</p>
                      <div className="flex text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-50 p-4 rounded-3xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <p className="text-[10px] font-black text-blue-700 uppercase leading-tight">Authentic<br/>Product</p>
          </div>
          <div className="bg-green-50 p-4 rounded-3xl flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-green-500" />
            <p className="text-[10px] font-black text-green-700 uppercase leading-tight">24/7<br/>Support</p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-50 flex gap-4">
        <button className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
          <MessageSquare className="w-6 h-6" />
        </button>
        <button 
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              shopId: product.shopId || 'default-shop',
              shopName: shopName,
              quantity: quantity
            });
            onClose();
          }}
          className="flex-1 bg-[#1DB954] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <ShoppingCart className="w-6 h-6" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};
