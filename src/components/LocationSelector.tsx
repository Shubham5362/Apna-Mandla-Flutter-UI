import React, { useState } from 'react';
import { MapPin, Loader2, ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from '../context/LocationContext';

export const LocationSelector = () => {
  const { district, selectedArea, areas, setSelectedArea, detectLocation } = useLocation();
  const [isListOpen, setIsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetect = async () => {
    setIsLoading(true);
    await detectLocation();
    setIsLoading(false);
    setIsListOpen(true);
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-gray-900 dark:text-zinc-100 tracking-tight">APNA</span>
          <button
            type="button"
            onClick={() => setIsListOpen(true)}
            className="flex items-center gap-1 bg-green-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-green-100 dark:border-emerald-800/60 hover:bg-green-100 dark:hover:bg-emerald-900/60 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="text-sm font-black text-[#1DB954] uppercase tracking-wider">
              {selectedArea?.name || 'Select Area'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#1DB954]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isListOpen && (
          <div className="fixed inset-0 z-[999] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div 
              key="location-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsListOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Bottom Sheet Modal */}
            <motion.div 
              key="location-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md mx-auto bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 z-[1000] rounded-t-[32px] p-6 shadow-2xl max-h-[80vh] flex flex-col border-t border-gray-100 dark:border-zinc-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100">Select Delivery Area</h3>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">In {district} District</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsListOpen(false)} 
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* GPS Button */}
              <button 
                type="button"
                onClick={handleDetect}
                className="w-full bg-emerald-50 dark:bg-emerald-950/50 text-[#1DB954] py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mb-4 border border-emerald-200 dark:border-emerald-800/60 active:scale-98 transition-all shrink-0 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                <span>Detect My Live GPS Location</span>
              </button>

              {/* List of Mandla Areas */}
              <div className="flex-1 overflow-y-auto space-y-2.5 no-scrollbar pr-1 pb-4">
                <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">Available Local Areas ({areas.length})</span>
                {areas.map((area) => {
                  const isSelected = selectedArea?.id === area.id;
                  return (
                    <button
                      type="button"
                      key={area.id}
                      onClick={() => {
                        setSelectedArea(area);
                        setIsListOpen(false);
                      }}
                      className={`w-full p-4 rounded-2xl text-left font-black text-sm transition-all flex items-center justify-between cursor-pointer active:scale-98 ${
                        isSelected 
                          ? 'bg-[#1DB954] text-white shadow-md shadow-emerald-200 dark:shadow-none' 
                          : 'bg-gray-50 dark:bg-zinc-800/80 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#1DB954]'}`} />
                        <span>{area.name}</span>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Selected</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">Tap to select</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

