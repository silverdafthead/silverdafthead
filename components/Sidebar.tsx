import React from 'react';
import { AppStep, Language } from '../types';
import { Lightbulb, Code2, ShoppingBag, Shield, Rocket, Globe, Mountain, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, setStep, isMobileOpen, toggleMobile, lang, setLang, t }) => {
  const navItems = [
    { id: AppStep.IDEA, label: t.nav.idea, icon: <Lightbulb size={20} /> },
    { id: AppStep.DEV_GUIDE, label: t.nav.dev, icon: <Code2 size={20} /> },
    { id: AppStep.STORE_LISTING, label: t.nav.aso, icon: <ShoppingBag size={20} /> },
    { id: AppStep.POLICY, label: t.nav.policy, icon: <Shield size={20} /> },
    { id: AppStep.PUBLISH, label: t.nav.launch, icon: <Rocket size={20} /> },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:translate-x-0 shadow-2xl";
  const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleMobile}
        />
      )}

      <aside className={`${baseClasses} ${mobileClasses} flex flex-col h-full border-r border-slate-800/50`}>
        {/* Premium Logo Section */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mountain className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
               <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                DevSherpa
               </h1>
               <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Pro Studio</p>
            </div>
          </div>
        </div>

        <div className="px-6 mb-6">
            <button 
                onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
                className="group w-full flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-all border border-slate-700/50 hover:border-indigo-500/50"
            >
                <div className="flex items-center gap-2">
                    <Globe size={14} />
                    <span>{lang === 'en' ? 'Language' : 'Dil'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-white">{lang.toUpperCase()}</span>
                </div>
            </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => {
            const isActive = currentStep === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setStep(item.id);
                  if (window.innerWidth < 1024) toggleMobile();
                }}
                className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-200" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <p className="text-[10px] font-bold text-indigo-400 mb-1 uppercase tracking-wider">AI System</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-white">Gemini Pro Ready</span>
                </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-4">v2.4.0 Production Build</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;