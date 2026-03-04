'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function BookingForm({ language, onComplete }: { language: 'en' | 'ar', onComplete: (details: string) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateType: 'exact' as 'exact' | 'range',
    date: '',
    dateEnd: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = formData.dateType === 'exact' 
      ? `Date: ${formData.date}` 
      : `Date Range: ${formData.date} to ${formData.dateEnd}`;
    
    const summary = `Appointment Booking:
Name: ${formData.name}
Phone: ${formData.phone}
${dateStr}
Details: ${formData.details}`;
    
    onComplete(summary);
  };

  return (
    <div className="w-full mt-4 bg-white rounded-2xl border border-[#e5e1da] overflow-hidden shadow-sm">
      <div className="bg-[#1a1a1a] p-3 text-white flex items-center gap-2">
        <Calendar size={16} className="text-[#f5f2ed]" />
        <span className="font-serif text-sm tracking-wide">
          {language === 'ar' ? 'حجز موعد' : 'Book Appointment'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-1">
          <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-30" />
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-2.5 pl-9 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm ${language === 'ar' ? 'text-right pr-9 pl-2.5' : ''}`}
            />
            {language === 'ar' && <User size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-30" />}
          </div>
        </div>

        <div className="space-y-1">
          <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-30" />
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-2.5 pl-9 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm ${language === 'ar' ? 'text-right pr-9 pl-2.5' : ''}`}
            />
            {language === 'ar' && <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-30" />}
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'نوع التاريخ' : 'Date Type'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, dateType: 'exact' })}
              className={`p-2 text-xs rounded-lg border transition-all ${formData.dateType === 'exact' ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-[#f5f2ed] border-[#e5e1da] text-[#1a1a1a]'}`}
            >
              {language === 'ar' ? 'تاريخ محدد' : 'Exact Date'}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, dateType: 'range' })}
              className={`p-2 text-xs rounded-lg border transition-all ${formData.dateType === 'range' ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-[#f5f2ed] border-[#e5e1da] text-[#1a1a1a]'}`}
            >
              {language === 'ar' ? 'نطاق تاريخ' : 'Date Range'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {formData.dateType === 'exact' ? (language === 'ar' ? 'التاريخ' : 'Date') : (language === 'ar' ? 'من تاريخ' : 'From Date')}
            </label>
            <input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm"
            />
          </div>
          {formData.dateType === 'range' && (
            <div className="space-y-1">
              <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
              </label>
              <input
                required
                type="date"
                value={formData.dateEnd}
                onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                className="w-full p-2.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm"
              />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className={`text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-50 block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}
          </label>
          <textarea
            rows={3}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className={`w-full p-2.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm ${language === 'ar' ? 'text-right' : ''}`}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-serif text-sm hover:bg-[#333] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <CheckCircle2 size={16} />
          {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}
