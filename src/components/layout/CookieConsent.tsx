'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for better UX (doesn't jar the user instantly on load)
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-[400px] z-[9999] bg-white border border-gold/30 shadow-2xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center text-navy font-serif text-xl">
                <Cookie className="w-5 h-5 mr-2 text-gold" />
                Privacy & Cookies
              </div>
              <button 
                onClick={handleDecline}
                className="text-navy/40 hover:text-navy transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-navy/70 leading-relaxed mb-6">
              We use cookies to analyze site traffic and enable personalized advertising (via Google AdSense) to help keep this educational archive free. 
              Read our <Link href="/privacy" className="text-gold font-medium hover:underline">Privacy Policy</Link> for details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-navy text-ivory text-[10px] font-bold tracking-widest uppercase py-3 px-4 hover:bg-gold transition-colors text-center"
              >
                Accept All
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 bg-transparent border border-navy/20 text-navy text-[10px] font-bold tracking-widest uppercase py-3 px-4 hover:bg-navy/5 transition-colors text-center"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
