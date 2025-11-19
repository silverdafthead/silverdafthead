import React, { useState } from 'react';
import { generateStoreListing } from '../services/gemini';
import { StoreListingData, GeminiLoadingState, Language } from '../types';
import { Copy, RefreshCw, Smartphone, Check, Search, Battery, Wifi, Signal, Shield } from 'lucide-react';

interface StoreOptimizerProps {
    lang: Language;
    t: any;
}

const StoreOptimizer: React.FC<StoreOptimizerProps> = ({ lang, t }) => {
  const [appName, setAppName] = useState('');
  const [details, setDetails] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [listing, setListing] = useState<StoreListingData | null>(null);
  const [status, setStatus] = useState<GeminiLoadingState>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!appName || !details) return;
    setStatus('loading');
    try {
      const result = await generateStoreListing(appName, details, targetLanguage);
      setListing(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{t.aso.title}</h2>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          {t.aso.desc}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
             {/* Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.aso.appName}</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
                  placeholder="e.g. FitTrack Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.aso.concept}</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full h-40 px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all text-slate-700"
                  placeholder={t.aso.placeholder}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t.aso.lang}</label>
                <div className="relative">
                    <select 
                        value={targetLanguage} 
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white appearance-none font-medium text-slate-700 cursor-pointer"
                    >
                        <option value="English">English (US)</option>
                        <option value="Turkish">Turkish (Türkçe)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="German">German (Deutsch)</option>
                        <option value="French">French (Français)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={status === 'loading' || !appName || !details}
                className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/30 active:scale-[0.98]"
              >
                {status === 'loading' ? (
                  <RefreshCw className="animate-spin" size={22} />
                ) : (
                  <Search size={22} />
                )}
                {t.aso.btn}
              </button>
            </div>
          </div>
          
          {listing && (
             <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-500/5">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                    {t.aso.keywords}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {listing.keywords.map((k, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-indigo-100">
                            #{k}
                        </span>
                    ))}
                </div>
             </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-7 flex justify-center">
          {status === 'idle' || status === 'loading' ? (
             <div className="relative w-[320px] h-[650px] bg-slate-100 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center text-slate-400">
                <div className="text-center p-6">
                    <div className="w-20 h-20 bg-slate-200 rounded-3xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                        <Smartphone size={32} className="opacity-40" />
                    </div>
                    <p className="font-medium">{t.aso.preview}</p>
                    {status === 'loading' && <p className="text-sm mt-2 text-indigo-500 font-semibold animate-pulse">Generating magic...</p>}
                </div>
             </div>
          ) : listing ? (
            <div className="relative w-[320px] h-[650px] bg-white rounded-[3rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
              
              {/* Status Bar */}
              <div className="h-10 bg-white flex justify-between items-end px-5 pb-1 text-[10px] font-bold text-slate-900">
                <span>9:41</span>
                <div className="flex gap-1">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={12} />
                </div>
              </div>

              {/* Play Store Header */}
              <div className="bg-white px-4 pt-2 pb-4 z-10 border-b border-slate-50">
                 <div className="flex gap-4 mb-4">
                     <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-md shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                         {appName.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0 pt-1">
                        <h1 className="text-lg font-bold text-slate-900 truncate leading-tight mb-1">{listing.title}</h1>
                        <p className="text-indigo-600 font-semibold text-xs mb-2">DevSherpa Inc.</p>
                     </div>
                 </div>
                 <button className="w-full bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg shadow-md shadow-indigo-200">
                     Install
                 </button>
              </div>

              {/* Content Scroll */}
              <div className="flex-1 overflow-y-auto bg-slate-50 scrollbar-hide">
                 {/* Copy Actions */}
                 <div className="p-4 grid grid-cols-3 gap-2">
                    <button onClick={() => copyToClipboard(listing.title, 'title')} className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 active:bg-slate-100">Copy Title</button>
                    <button onClick={() => copyToClipboard(listing.shortDescription, 'short')} className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 active:bg-slate-100">Copy Short</button>
                    <button onClick={() => copyToClipboard(listing.fullDescription, 'full')} className="bg-white p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 active:bg-slate-100">Copy Full</button>
                 </div>

                 <div className="px-5 space-y-6 pb-10">
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm">About this app</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{listing.shortDescription}</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 text-sm">Data safety</h3>
                        <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                            <div className="flex gap-3 items-start">
                                <div className="mt-1"><Shield size={14} className="text-slate-400"/></div>
                                <p className="text-xs text-slate-500">Safety starts with understanding how developers collect and share your data.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm">Description</h3>
                        <div 
                            className="text-xs text-slate-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: listing.fullDescription.replace(/\n/g, '<br/>') }}
                        />
                    </div>
                 </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full"></div>
            </div>
          ) : (
            <div className="text-red-500">Error</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOptimizer;