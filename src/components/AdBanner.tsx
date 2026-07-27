import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ads = [
  {
    id: 1,
    shopId: 'ts1',
    image: 'https://picsum.photos/seed/ad1/800/400',
    title: 'Fresh Groceries',
    subtitle: 'Get 20% off on your first order',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 2,
    shopId: 'ts2',
    image: 'https://picsum.photos/seed/ad2/800/400',
    title: 'New Fashion Arrival',
    subtitle: 'Explore the latest trends in Mandla',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 3,
    shopId: 'ts3',
    image: 'https://picsum.photos/seed/ad3/800/400',
    title: 'Electronics Sale',
    subtitle: 'Up to 50% off on mobile accessories',
    color: 'from-orange-500 to-red-600'
  }
];

interface AdBannerProps {
  onAdClick?: (shop: any) => void;
}

export const AdBanner = ({ onAdClick }: AdBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleAdClick = () => {
    if (onAdClick) {
      const currentAd = ads[currentIndex];
      onAdClick({
        id: currentAd.shopId,
        name: currentAd.title,
        image: currentAd.image,
        rating: 4.5,
        category: 'Featured'
      });
    }
  };

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(slideNext, 3000);
    return () => clearInterval(timer);
  }, [slideNext]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="px-6 py-2">
      <div className="relative h-44 w-full rounded-3xl overflow-hidden shadow-lg group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) slidePrev();
              else if (info.offset.x < -100) slideNext();
            }}
            onClick={handleAdClick}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${ads[currentIndex].color} opacity-90`} />
            <img 
              src={ads[currentIndex].image} 
              alt={ads[currentIndex].title}
              className="w-full h-full object-cover mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80"
              >
                Limited Time Offer
              </motion.span>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-black mb-1"
              >
                {ads[currentIndex].title}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium opacity-90"
              >
                {ads[currentIndex].subtitle}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Controls */}
        <button 
          onClick={(e) => { e.stopPropagation(); slidePrev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); slideNext(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {ads.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
