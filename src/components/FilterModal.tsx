import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw, Filter as FilterIcon } from 'lucide-react';

export interface FilterState {
  category: string;
  priceRange: string;
  rating: string;
  distance: string;
  availability: string;
  offers: string;
  deliveryTime: string;
  brand: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters?: FilterState;
  onApplyFilters?: (filters: FilterState) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  priceRange: 'All',
  rating: 'All',
  distance: 'All',
  availability: 'All',
  offers: 'All',
  deliveryTime: 'All',
  brand: 'All'
};

export const FilterModal = ({ isOpen, onClose, activeFilters = DEFAULT_FILTERS, onApplyFilters }: FilterModalProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(activeFilters);

  const filterSections = [
    {
      key: 'category' as keyof FilterState,
      title: 'Category',
      options: ['All', 'Vegetables', 'Dairy & Milk', 'Grocery', 'Bakery', 'Pharmacy', 'Electronics', 'Fashion']
    },
    {
      key: 'priceRange' as keyof FilterState,
      title: 'Price Range',
      options: ['All', 'Under ₹100', '₹100 - ₹500', '₹500 - ₹2000', 'Above ₹2000']
    },
    {
      key: 'rating' as keyof FilterState,
      title: 'Customer Rating',
      options: ['All', '⭐ 4.5 & Above', '⭐ 4.0 & Above', '⭐ 3.5 & Above']
    },
    {
      key: 'distance' as keyof FilterState,
      title: 'Distance from Mandla Center',
      options: ['All', 'Within 1 km', 'Within 3 km', 'Within 5 km']
    },
    {
      key: 'availability' as keyof FilterState,
      title: 'Availability & Shop Status',
      options: ['All', 'In Stock Only', 'Open Shops Now', 'Express Delivery Active']
    },
    {
      key: 'offers' as keyof FilterState,
      title: 'Offers & Discounts',
      options: ['All', 'Discounts > 20%', 'Buy 1 Get 1', 'Free Home Delivery', 'Active Coupons']
    },
    {
      key: 'deliveryTime' as keyof FilterState,
      title: 'Delivery Speed',
      options: ['All', 'Under 30 Mins', '30-45 Mins', 'Same Day Delivery']
    },
    {
      key: 'brand' as keyof FilterState,
      title: 'Brand / Manufacturer',
      options: ['All', 'Amul', 'Tata Tea', 'Britannia', 'Cadbury', 'Nestlé', 'Local Mandla Produce']
    }
  ];

  const handleSelectOption = (key: keyof FilterState, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? 'All' : value
    }));
  };

  const handleReset = () => {
    setSelectedFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(selectedFilters);
    }
    onClose();
  };

  const activeCount = Object.values(selectedFilters).filter(v => v !== 'All').length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-zinc-900 z-[70] rounded-t-[36px] max-h-[85vh] flex flex-col shadow-2xl border-t border-gray-100 dark:border-zinc-800"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-[#1DB954]" />
                <h2 className="text-lg font-black text-gray-900 dark:text-zinc-100">Refine Search & Marketplace</h2>
                {activeCount > 0 && (
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-[#1DB954] text-xs font-black px-2 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
              {filterSections.map((section) => (
                <div key={section.key} className="space-y-2">
                  <h3 className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{section.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {section.options.map((opt) => {
                      const isSelected = selectedFilters[section.key] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(section.key, opt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#1DB954] text-white shadow-sm shadow-emerald-200 dark:shadow-none'
                              : 'bg-gray-50 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 border border-gray-200/80 dark:border-zinc-700/60 hover:bg-gray-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex items-center gap-3">
              <button 
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] bg-[#1DB954] hover:bg-emerald-600 text-white py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all"
              >
                Apply Filters ({activeCount})
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
