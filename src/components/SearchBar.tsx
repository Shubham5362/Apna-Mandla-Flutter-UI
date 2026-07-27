import React from 'react';
import { Search, Mic, Camera, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  onFilterClick?: () => void;
  onSearch?: (query: string) => void;
  onVoiceSearch?: () => void;
  onCameraSearch?: () => void;
}

export const SearchBar = ({ onFilterClick, onSearch, onVoiceSearch, onCameraSearch }: SearchBarProps) => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <div className="flex items-center gap-3">
      <form onSubmit={handleSearch} className="flex-1 relative group">
        <button 
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1DB954] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, shops or categories..."
          className="w-full h-12 bg-gray-100 pl-12 pr-24 rounded-2xl border-none focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-sm font-bold"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <motion.button 
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onVoiceSearch}
            className="p-2 text-gray-400 hover:text-[#1DB954] hover:bg-white rounded-xl transition-all"
          >
            <Mic className="w-5 h-5" />
          </motion.button>
          <motion.button 
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onCameraSearch}
            className="p-2 text-gray-400 hover:text-[#1DB954] hover:bg-white rounded-xl transition-all"
          >
            <Camera className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
      
      <motion.button 
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onFilterClick}
        className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:text-[#1DB954] hover:bg-green-50 transition-all"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
