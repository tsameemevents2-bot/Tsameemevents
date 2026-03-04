'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  titleAr: string;
  image: string;
  description: string;
  descriptionAr: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: 'Royal Gold Stage',
    titleAr: 'منصة الذهب الملكية',
    image: 'https://picsum.photos/seed/wedding-gold/800/600',
    description: 'Luxurious gold accents with premium floral arrangements.',
    descriptionAr: 'لمسات ذهبية فاخرة مع تنسيقات زهور راقية.'
  },
  {
    id: 2,
    title: 'Minimalist White Floral',
    titleAr: 'تنسيق الزهور البيضاء البسيط',
    image: 'https://picsum.photos/seed/wedding-white/800/600',
    description: 'Clean, elegant white theme for a modern look.',
    descriptionAr: 'ثيم أبيض نظيف وأنيق لمظهر عصري.'
  },
  {
    id: 3,
    title: 'Modern Mirror Stage',
    titleAr: 'منصة المرايا العصرية',
    image: 'https://picsum.photos/seed/wedding-mirror/800/600',
    description: 'Reflective surfaces with contemporary lighting.',
    descriptionAr: 'أسطح عاكسة مع إضاءة معاصرة.'
  },
  {
    id: 4,
    title: 'Classic Red Velvet',
    titleAr: 'المخمل الأحمر الكلاسيكي',
    image: 'https://picsum.photos/seed/wedding-red/800/600',
    description: 'Timeless red velvet backdrop with crystal chandeliers.',
    descriptionAr: 'خلفية مخملية حمراء خالدة مع ثريات كريستالية.'
  }
];

export default function PortfolioCarousel({ language }: { language: 'en' | 'ar' }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % PORTFOLIO_ITEMS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length);
  };

  const item = PORTFOLIO_ITEMS[currentIndex];

  return (
    <div className="w-full mt-4 overflow-hidden rounded-2xl border border-[#e5e1da] bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={item.image}
          alt={language === 'ar' ? item.titleAr : item.title}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button 
            onClick={prev}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {PORTFOLIO_ITEMS.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className={`font-serif text-lg font-semibold text-[#1a1a1a] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {language === 'ar' ? item.titleAr : item.title}
        </h3>
        <p className={`text-xs text-[#1a1a1a] opacity-60 mt-1 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {language === 'ar' ? item.descriptionAr : item.description}
        </p>
        
        <button className="w-full mt-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-xs uppercase tracking-widest rounded-lg hover:bg-[#1a1a1a] hover:text-white transition-all">
          {language === 'ar' ? 'اطلب هذا التصميم' : 'Enquire about this design'}
        </button>
      </div>
    </div>
  );
}
