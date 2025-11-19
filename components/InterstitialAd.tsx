import React, { useEffect, useState } from 'react';
import { adManager } from '../services/AdManager';
import { X, ShieldCheck, Info, Star } from 'lucide-react';

const InterstitialAd: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const unsubscribe = adManager.subscribe((show) => {
      if (show) {
        setIsVisible(true);
        setCanClose(false);
        setTimeLeft(3); 
      } else {
        setIsVisible(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isVisible && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (isVisible && timeLeft === 0) {
      setCanClose(true);
    }
    return () => clearTimeout(timer);
  }, [isVisible, timeLeft]);

  const handleClose = () => {
    if (canClose) {
      adManager.dismissAd();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Ad Container */}
      <div className="w-full h-full md:h-auto md:max-w-sm md:rounded-3xl bg-white flex flex-col relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Top Bar */}
        <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200 px-1.5 rounded">Ad</span>
          {canClose ? (
             <button 
                onClick={handleClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full p-1 transition-colors"
             >
                <X size={18} />
             </button>
          ) : (
             <div className="text-slate-400 text-xs font-medium tabular-nums">
                {timeLeft}s
             </div>
          )}
        </div>

        {/* Ad Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl relative z-10 rotate-3 transform">
                    <Star size={40} className="text-white fill-white" />
                </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-2">Level Up Your App!</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Join millions of developers who trust Google AdMob to monetize their apps effectively.
            </p>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transform transition-all active:scale-95 flex items-center justify-center gap-2">
                Install Now
            </button>
            
            <div className="mt-6 flex items-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck size={12} />
                <span>Verified by Google Play Protect</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;