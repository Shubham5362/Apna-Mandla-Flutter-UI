import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Navigation, 
  Layers, 
  Locate,
  Store,
  Bike,
  Star,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MapScreenProps {
  onBack: () => void;
}

export const MapScreen = ({ onBack }: MapScreenProps) => {
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const nearbyShops = [
    { id: 1, name: 'Sharma Electronics', category: 'Electronics', rating: 4.8, distance: '0.8 km', lat: 22.59, lng: 80.37 },
    { id: 2, name: 'Mandla Grocery', category: 'Grocery', rating: 4.5, distance: '1.2 km', lat: 22.60, lng: 80.38 },
    { id: 3, name: 'Fresh Fruits', category: 'Food', rating: 4.9, distance: '1.5 km', lat: 22.58, lng: 80.36 },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-[#e5e7eb] overflow-hidden">
        {/* Simulated Map Grid */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
        
        {/* Simulated Shop Markers */}
        {nearbyShops.map(shop => (
          <motion.button
            key={shop.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setSelectedShop(shop)}
            className="absolute p-2 bg-white rounded-full shadow-xl border-2 border-[#1DB954] z-10"
            style={{ 
              left: `${50 + (shop.lng - 80.37) * 500}%`, 
              top: `${50 - (shop.lat - 22.59) * 500}%` 
            }}
          >
            <Store className="w-6 h-6 text-[#1DB954]" />
          </motion.button>
        ))}

        {/* Simulated Rider Marker */}
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 p-2 bg-blue-500 rounded-full shadow-xl border-2 border-white z-20"
        >
          <Bike className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Header Overlay */}
      <div className="relative px-6 pt-12 pb-4 flex gap-4 z-30">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search shops or areas..."
            className="w-full h-12 bg-white rounded-2xl pl-12 pr-4 shadow-xl font-bold text-gray-900 outline-none"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-6 top-32 flex flex-col gap-3 z-30">
        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-gray-600">
          <Layers className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-blue-600">
          <Locate className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Sheet / Shop Info */}
      <div className="mt-auto relative z-30 p-6">
        <AnimatePresence>
          {selectedShop ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#1DB954]">
                    <Store className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{selectedShop.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-black text-gray-900">{selectedShop.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold text-gray-500">{selectedShop.category}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedShop(null)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5 rotate-90" />
                </button>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" /> Directions
                </button>
                <button className="flex-1 bg-[#1DB954] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-100">
                  Visit Shop
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl"
            >
              <h3 className="font-black text-gray-900 mb-4">Nearby Shops</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {nearbyShops.map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => setSelectedShop(shop)}
                    className="min-w-[200px] bg-gray-50 p-4 rounded-3xl flex items-center gap-4 text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1DB954] shadow-sm">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{shop.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{shop.distance}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
