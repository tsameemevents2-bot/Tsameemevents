'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, Plus, Minus, Calculator, Sparkles } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  nameAr: string;
  price: number;
}

interface Category {
  id: string;
  title: string;
  titleAr: string;
  options: Option[];
}

const CATEGORIES: Category[] = [
  {
    id: 'service',
    title: 'Main Service',
    titleAr: 'الخدمة الرئيسية',
    options: [
      { id: 'wedding', name: 'Full Wedding Planning', nameAr: 'تخطيط زفاف كامل', price: 50000 },
      { id: 'stage', name: 'Wedding Stage (Kosha)', nameAr: 'منصة الزفاف (الكوشة)', price: 15000 },
      { id: 'event', name: 'Corporate/Private Event', nameAr: 'فعالية مؤسسية/خاصة', price: 25000 },
      { id: 'house', name: 'House Decoration', nameAr: 'زينة المنزل', price: 8000 },
      { id: 'hospitality', name: 'Hospitality (Gahwa/Service)', nameAr: 'ضيافة (قهوة/خدمة)', price: 5000 },
      { id: 'catering', name: 'Catering Services', nameAr: 'خدمات البوفيه', price: 12000 },
      { id: 'invitation', name: 'Invitation Cards', nameAr: 'بطاقات الدعوة', price: 3000 },
      { id: 'rentals', name: 'Furniture/Event Rentals', nameAr: 'تأجير أثاث ومعدات', price: 4000 },
    ]
  },
  {
    id: 'floral',
    title: 'Floral & Decor Level',
    titleAr: 'مستوى الزهور والديكور',
    options: [
      { id: 'silk', name: 'Premium Silk', nameAr: 'حرير فاخر', price: 0 },
      { id: 'fresh', name: 'Fresh Flowers', nameAr: 'زهور طبيعية', price: 10000 },
      { id: 'luxury', name: 'Luxury Exotic Decor', nameAr: 'ديكور فاخر ونادر', price: 25000 },
    ]
  },
  {
    id: 'hospitality_addon',
    title: 'Hospitality Add-ons',
    titleAr: 'إضافات الضيافة',
    options: [
      { id: 'none', name: 'None', nameAr: 'لا يوجد', price: 0 },
      { id: 'standard', name: 'Standard Service', nameAr: 'خدمة قياسية', price: 3000 },
      { id: 'vip', name: 'VIP Hospitality', nameAr: 'ضيافة VIP', price: 8000 },
    ]
  }
];

export default function QuoteBuilder({ language, onComplete }: { language: 'en' | 'ar', onComplete: (total: number, summary: string) => void }) {
  const [selections, setSelections] = useState<Record<string, string>>({
    service: 'wedding',
    floral: 'silk',
    hospitality_addon: 'none',
  });

  const totalPrice = useMemo(() => {
    return Object.entries(selections).reduce((sum, [catId, optId]) => {
      const category = CATEGORIES.find(c => c.id === catId);
      const option = category?.options.find(o => o.id === optId);
      return sum + (option?.price || 0);
    }, 0);
  }, [selections]);

  const handleSelect = (catId: string, optId: string) => {
    setSelections(prev => ({ ...prev, [catId]: optId }));
  };

  const getSummary = () => {
    return Object.entries(selections).map(([catId, optId]) => {
      const cat = CATEGORIES.find(c => c.id === catId);
      const opt = cat?.options.find(o => o.id === optId);
      return `${cat?.title}: ${opt?.name}`;
    }).join(', ');
  };

  return (
    <div className="w-full mt-4 bg-white rounded-2xl border border-[#e5e1da] overflow-hidden shadow-sm">
      <div className="bg-[#1a1a1a] p-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-[#f5f2ed]" />
          <span className="font-serif text-sm tracking-wide">
            {language === 'ar' ? 'مصمم الميزانية' : 'Quote Builder'}
          </span>
        </div>
        <div className="text-xs opacity-60">
          {language === 'ar' ? 'تقدير فوري' : 'Instant Estimate'}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <h4 className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? cat.titleAr : cat.title}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {cat.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(cat.id, opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs ${
                    selections[cat.id] === opt.id
                      ? 'border-[#1a1a1a] bg-[#f5f2ed] ring-1 ring-[#1a1a1a]'
                      : 'border-[#e5e1da] hover:border-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selections[cat.id] === opt.id ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'border-[#e5e1da]'
                    }`}>
                      {selections[cat.id] === opt.id && <Check size={10} className="text-white" />}
                    </div>
                    <span className={language === 'ar' ? 'font-serif' : ''}>
                      {language === 'ar' ? opt.nameAr : opt.name}
                    </span>
                  </div>
                  <span className="opacity-60">
                    {opt.price === 0 ? (language === 'ar' ? 'مشمول' : 'Included') : `+${opt.price.toLocaleString()} AED`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-[#e5e1da] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-semibold text-[#1a1a1a]">
              {language === 'ar' ? 'المجموع التقديري' : 'Estimated Total'}
            </span>
            <motion.span 
              key={totalPrice}
              initial={{ scale: 1.1, color: '#1a1a1a' }}
              animate={{ scale: 1, color: '#1a1a1a' }}
              className="text-xl font-bold text-[#1a1a1a]"
            >
              {totalPrice.toLocaleString()} AED
            </motion.span>
          </div>
          
          <button 
            onClick={() => onComplete(totalPrice, getSummary())}
            className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-serif text-sm hover:bg-[#333] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles size={16} />
            {language === 'ar' ? 'تأكيد وحفظ الميزانية' : 'Confirm & Save Quote'}
          </button>
          
          <p className="text-[9px] text-center text-[#1a1a1a] opacity-40 italic">
            {language === 'ar' 
              ? '* الأسعار تقريبية وتخضع للتغيير بناءً على التصميم النهائي وموقع الحفل.' 
              : '* Prices are estimates and subject to change based on final design and venue location.'}
          </p>
        </div>
      </div>
    </div>
  );
}
