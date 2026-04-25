'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, CheckCircle2, Loader2 } from 'lucide-react';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export default function MaintenanceMode({ children }: MaintenanceModeProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'legacy2026';

  useEffect(() => {
    const authStatus = localStorage.getItem('cla_authorized');
    if (authStatus === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      localStorage.setItem('cla_authorized', 'true');
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: subError } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (subError) {
        if (subError.code === '23505') {
          setError('This email is already subscribed!');
        } else {
          throw subError;
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-tropical-green/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl w-full px-6 py-12 text-center">
        {/* Logo/Title Area */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-full mb-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">Coming Soon</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-ivory mb-6 leading-tight">
            Caribbean <span className="text-gold italic">Legacy</span> Archive
          </h1>
          <p className="text-ivory/60 text-lg md:text-xl leading-relaxed font-light">
            We are currently digitizing and verifying centuries of Caribbean history. 
            Our comprehensive archive of historically documented figures will be live shortly.
          </p>
        </div>

        {/* Subscription Form */}
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-16">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email for early access..." 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ivory/5 border border-ivory/20 text-ivory py-4 px-12 rounded-sm focus:outline-none focus:border-gold transition-all"
              />
              <Mail className="absolute left-4 top-4 h-5 w-5 text-ivory/40" />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 w-full bg-gold text-navy py-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-gold-light transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Notify Me'}
              </button>
            </div>
            {error && !showLogin && <p className="mt-4 text-red-400 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-16 p-8 border border-gold/20 bg-gold/5 rounded-sm">
            <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-ivory font-serif text-xl mb-2">You're on the list!</h3>
            <p className="text-ivory/60 text-sm">We'll notify you as soon as the archive opens to the public.</p>
          </div>
        )}

        {/* Footer / Login Access */}
        <div className="pt-12 border-t border-ivory/10">
          {!showLogin ? (
            <button 
              onClick={() => setShowLogin(true)}
              className="text-ivory/40 hover:text-gold text-xs uppercase tracking-widest transition-colors flex items-center mx-auto"
            >
              <Lock className="h-3 w-3 mr-2" /> Admin Access
            </button>
          ) : (
            <form onSubmit={handleLogin} className="max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-gold text-[10px] uppercase tracking-widest mb-4">Enter Password</h3>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory py-2 px-4 rounded-sm text-sm focus:outline-none focus:border-gold"
                />
                <button 
                  type="submit"
                  className="bg-ivory/10 text-ivory px-4 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-ivory/20 transition-all"
                >
                  Enter
                </button>
              </div>
              {error && <p className="mt-2 text-red-400 text-[10px]">{error}</p>}
              <button 
                type="button"
                onClick={() => setShowLogin(false)}
                className="mt-4 text-ivory/20 hover:text-ivory/40 text-[10px] uppercase"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
