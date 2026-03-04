'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, MessageCircle, Phone, Calendar, MapPin, DollarSign, CheckCircle2, Image as ImageIcon, Calculator, Sparkles, Clock } from 'lucide-react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import PortfolioCarousel from './PortfolioCarousel';
import QuoteBuilder from './QuoteBuilder';
import BookingForm from './BookingForm';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  showPortfolio?: boolean;
  showQuoteBuilder?: boolean;
  showBookingForm?: boolean;
};

type Language = 'en' | 'ar' | null;

const SYSTEM_INSTRUCTION_EN = `You are the official WhatsApp AI assistant for Tsameem Events, a premium wedding planning and wedding stage decoration company based in Dubai, UAE.

Tone: Elegant, professional, warm.
SERVICES:
- Full Wedding Planning
- Wedding Stage Decoration (Kosha)
- Engagement Setup
- Invitation Cards
- Hospitality (Gahwa/Service)
- Catering Services
- House Decorations
- Wedding & Event Rentals

RULES:
1. Continue ONLY in English.
2. Keep replies SHORT (maximum 3 lines).
3. Always ask one question at a time.
4. Always guide toward collecting event details.
5. If user asks for price, budget, or cost: Say: "Our wedding stage setups start from 15,000 AED depending on design." Then offer the Quote Builder tool.
6. If user asks about designs, portfolio, or options: Use the showPortfolio tool to display our work.
7. If user wants a quote, price estimate, or to build their budget: Use the showQuoteBuilder tool.
8. If user wants to book an appointment, schedule a meeting, or visit: Use the showBookingForm tool.
9. Collect: Name, Event date, Venue/location, Budget range.
10. After collecting details say: "Thank you 🤍 Our team will contact you shortly."
11. Always end with a question until details are complete.
12. Never: Send long paragraphs, Mention AI, Discuss competitors, Exceed 3 short paragraphs.
13. If user provides date + budget + venue → treat as HOT LEAD and respond more warmly.`;

const SYSTEM_INSTRUCTION_AR = `أنت المساعد الذكي الرسمي لشركة "تصاميم إيفنتس" (Tsameem Events)، وهي شركة رائدة في تخطيط حفلات الزفاف وتصميم منصات الأفراح في دبي، الإمارات العربية المتحدة.

Tone: راقي، احترافي، ودود.
الخدمات:
- تخطيط زفاف كامل
- تصميم منصة الزفاف (الكوشة)
- تجهيز خطوبة
- بطاقات الدعوة
- ضيافة (قهوة/خدمة)
- خدمات البوفيه
- زينة المنزل
- تأجير معدات الأفراح والفعاليات

RULES:
1. استمر فقط باللغة العربية.
2. اجعل الردود قصيرة جداً (بحد أقصى 3 أسطر).
3. اطرح سؤالاً واحداً فقط في كل مرة.
4. وجه العميل دائماً نحو تقديم تفاصيل المناسبة.
5. إذا سأل العميل عن السعر أو التكلفة: قل: "تبدأ أسعار منصات الزفاف من 15,000 درهم حسب التصميم." ثم اعرض أداة "مصمم الميزانية".
6. إذا سأل العميل عن التصاميم أو معرض الأعمال: استخدم أداة showPortfolio لعرض أعمالنا.
7. إذا أراد العميل عرض سعر أو تقدير للميزانية: استخدم أداة showQuoteBuilder.
8. إذا أراد العميل حجز موعد أو مقابلة أو زيارة: استخدم أداة showBookingForm.
9. قم بجمع: الاسم، تاريخ المناسبة، موقع الحفل، الميزانية التقريبية.
10. بعد جمع التفاصيل قل: "شكراً لك 🤍 سيقوم فريقنا بالتواصل معك قريباً."
11. اسأل سؤال واحد فقط في كل رسالة حتى تكتمل التفاصيل.
12. لا تقم أبداً بـ: إرسال فقرات طويلة، ذكر أنك ذكاء اصطناعي، مناقشة المنافسين، تجاوز 3 فقرات قصيرة.
13. إذا قدم المستخدم التاريخ + الميزانية + الموقع -> تعامل معه كعميل مهتم جداً (HOT LEAD) واستجب بحفاوة أكبر.`;

const showPortfolioTool: FunctionDeclaration = {
  name: "showPortfolio",
  parameters: {
    type: Type.OBJECT,
    description: "Displays the wedding stage decoration portfolio carousel to the user.",
    properties: {},
  },
};

const showQuoteBuilderTool: FunctionDeclaration = {
  name: "showQuoteBuilder",
  parameters: {
    type: Type.OBJECT,
    description: "Displays the interactive quote builder / budget estimator to the user.",
    properties: {},
  },
};

const showBookingFormTool: FunctionDeclaration = {
  name: "showBookingForm",
  parameters: {
    type: Type.OBJECT,
    description: "Displays the appointment booking form to the user.",
    properties: {},
  },
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial message
    setMessages([
      {
        id: 'initial',
        role: 'model',
        text: "Welcome to Tsameem Events 🤍\nPlease choose your language / يرجى اختيار اللغة:\n\n1️⃣ English\n2️⃣ العربية",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    const confirmMsg = lang === 'en' ? "English selected. How can we help you today?" : "تم اختيار اللغة العربية. كيف يمكننا مساعدتك اليوم؟";
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString() + '-user',
        role: 'user',
        text: lang === 'en' ? 'English' : 'العربية',
        timestamp: new Date(),
      },
      {
        id: Date.now().toString() + '-model',
        role: 'model',
        text: confirmMsg,
        timestamp: new Date(),
      }
    ]);

    // Initialize Gemini Chat (Optional, we do it in sendMessage)
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    // If language not selected, check if input is 1 or 2
    if (!language) {
      if (userText === '1' || userText.toLowerCase().includes('english')) {
        handleLanguageSelect('en');
        return;
      } else if (userText === '2' || userText.includes('عربي') || userText.includes('العربية')) {
        handleLanguageSelect('ar');
        return;
      } else {
        // Remind to select language
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date() },
          { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            text: "Please choose your language first / يرجى اختيار اللغة أولاً:\n1️⃣ English\n2️⃣ العربية", 
            timestamp: new Date() 
          }
        ]);
        return;
      }
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      // Construct history for context
      const history = messages
        .filter(m => m.id !== 'initial') // skip language selection prompt
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      // Add the current message
      history.push({ role: 'user', parts: [{ text: userText }] });

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction: language === 'en' ? SYSTEM_INSTRUCTION_EN : SYSTEM_INSTRUCTION_AR,
          temperature: 0.7,
          tools: [{ functionDeclarations: [showPortfolioTool, showQuoteBuilderTool, showBookingFormTool] }],
        }
      });

      let responseText = result.text || "";
      let showPortfolio = false;
      let showQuoteBuilder = false;
      let showBookingForm = false;

      if (result.functionCalls) {
        const portfolioCall = result.functionCalls.find(call => call.name === 'showPortfolio');
        const quoteCall = result.functionCalls.find(call => call.name === 'showQuoteBuilder');
        const bookingCall = result.functionCalls.find(call => call.name === 'showBookingForm');
        
        if (portfolioCall) {
          showPortfolio = true;
          if (!responseText) {
            responseText = language === 'en' 
              ? "Here are some of our premium designs:" 
              : "إليك بعض تصاميمنا الراقية:";
          }
        }
        
        if (quoteCall) {
          showQuoteBuilder = true;
          if (!responseText) {
            responseText = language === 'en' 
              ? "You can use our interactive tool to estimate your budget for various services:" 
              : "يمكنك استخدام أداتنا التفاعلية لتقدير ميزانيتك لمختلف الخدمات:";
          }
        }

        if (bookingCall) {
          showBookingForm = true;
          if (!responseText) {
            responseText = language === 'en' 
              ? "Please fill out this form to book an appointment with our team:" 
              : "يرجى ملء هذا النموذج لحجز موعد مع فريقنا:";
          }
        }
      }

      if (!responseText && !showPortfolio && !showQuoteBuilder && !showBookingForm) {
        responseText = language === 'en' 
          ? "I'm sorry, I couldn't process that. Could you please repeat?" 
          : "عذراً، لم أتمكن من معالجة طلبك. هل يمكنك المحاولة مرة أخرى؟";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date(),
          showPortfolio,
          showQuoteBuilder,
          showBookingForm,
        },
      ]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: language === 'en' ? "Connection error. Please try again." : "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl border-x border-[#e5e1da]">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-[#f5f2ed] p-4 flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f5f2ed] flex items-center justify-center text-[#1a1a1a]">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-wide">Tsameem Events</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Premium Wedding Planning</p>
          </div>
        </div>
        <div className="flex gap-4 opacity-70">
          <Phone size={18} className="cursor-pointer hover:opacity-100 transition-opacity" />
          <CheckCircle2 size={18} className="text-emerald-500" />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcfaf7] scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative ${
                  msg.role === 'user'
                    ? 'bg-[#1a1a1a] text-white rounded-tr-none'
                    : 'bg-white text-[#1a1a1a] border border-[#e5e1da] rounded-tl-none'
                }`}
              >
                <p className={`whitespace-pre-wrap text-sm leading-relaxed ${language === 'ar' ? 'text-right font-serif' : 'text-left'}`}>
                  {msg.text}
                </p>
                {msg.showPortfolio && language && (
                  <PortfolioCarousel language={language} />
                )}
                {msg.showQuoteBuilder && language && (
                  <QuoteBuilder 
                    language={language} 
                    onComplete={(total, summary) => {
                      const text = language === 'en' 
                        ? `I've built a quote for ${total.toLocaleString()} AED. Details: ${summary}`
                        : `لقد قمت بإنشاء عرض سعر بقيمة ${total.toLocaleString()} درهم. التفاصيل: ${summary}`;
                      setInput(text);
                    }}
                  />
                )}
                {msg.showBookingForm && language && (
                  <BookingForm 
                    language={language} 
                    onComplete={(details) => {
                      setInput(details);
                    }}
                  />
                )}
                <div className={`text-[9px] mt-1 opacity-40 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.role === 'user' && <CheckCircle2 size={8} className="text-emerald-400" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-[#e5e1da] p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-1 h-1 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-[#1a1a1a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Language Selection Buttons (Only visible if language not selected) */}
      {!language && (
        <div className="p-6 bg-white border-t border-[#e5e1da] flex flex-col gap-3">
          <p className="text-center text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-40 mb-2">Select Language / اختر اللغة</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageSelect('en')}
              className="py-4 px-4 bg-[#1a1a1a] text-white rounded-xl font-serif hover:bg-[#333] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              English
            </button>
            <button
              onClick={() => handleLanguageSelect('ar')}
              className="py-4 px-4 bg-[#1a1a1a] text-white rounded-xl font-serif hover:bg-[#333] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              العربية
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions (Only after language selection) */}
      {language && (
        <div className="px-4 py-2 bg-white border-t border-[#e5e1da] flex gap-2 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => {
              const text = language === 'en' ? "Can I see your designs?" : "هل يمكنني رؤية التصاميم؟";
              setInput(text);
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <ImageIcon size={12} /> {language === 'en' ? "View Designs" : "عرض التصاميم"}
          </button>
          <button 
            onClick={() => {
              const text = language === 'en' ? "What are your prices?" : "ما هي الأسعار؟";
              setInput(text);
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <DollarSign size={12} /> {language === 'en' ? "Pricing" : "الأسعار"}
          </button>
          <button 
            onClick={() => {
              const text = language === 'en' ? "I want to build a quote" : "أريد الحصول على عرض سعر";
              setInput(text);
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <Calculator size={12} /> {language === 'en' ? "Get a Quote" : "احصل على تسعيرة"}
          </button>
          <button 
            onClick={() => {
              const text = language === 'en' ? "I want to book an appointment" : "أريد حجز موعد";
              setInput(text);
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-[#f5f2ed] border border-[#e5e1da] rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <Clock size={12} /> {language === 'en' ? "Book Appointment" : "حجز موعد"}
          </button>
        </div>
      )}

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-[#e5e1da]">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'}
            className={`flex-1 p-3 bg-[#f5f2ed] border border-[#e5e1da] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className={language === 'ar' ? 'rotate-180' : ''} />
          </button>
        </form>
      </footer>

      {/* Quick Info Bar (Optional, for premium feel) */}
      <div className="bg-[#fcfaf7] px-4 py-2 border-t border-[#e5e1da] flex justify-between items-center text-[10px] text-[#1a1a1a] opacity-50 uppercase tracking-widest">
        <div className="flex items-center gap-1"><MapPin size={10} /> Dubai, UAE</div>
        <div className="flex items-center gap-1"><DollarSign size={10} /> Premium Quality</div>
      </div>
    </div>
  );
}
