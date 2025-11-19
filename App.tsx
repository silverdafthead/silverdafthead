import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import IdeaValidator from './components/IdeaValidator';
import StoreOptimizer from './components/StoreOptimizer';
import LaunchChecklist from './components/LaunchChecklist';
import PolicyGenerator from './components/PolicyGenerator';
import InterstitialAd from './components/InterstitialAd';
import { adManager } from './services/AdManager';
import { AppStep, Language } from './types';
import { Menu, Mountain } from 'lucide-react';

// Simple translation dictionary
const translations = {
    en: {
        nav: { 
            idea: 'Concept Validator', 
            dev: 'Dev Roadmap', 
            aso: 'ASO Studio', 
            policy: 'Privacy Policy', 
            launch: 'Launch Center' 
        },
        badges: {
            novice: 'Novice',
            strategist: 'Strategist',
            architect: 'Architect',
            builder: 'Builder',
            commander: 'Commander',
            legend: 'Legend'
        },
        idea: { 
            title: 'Validate Your App Idea', 
            desc: 'Describe your application idea, and our AI will analyze its market viability, suggest features, and identify potential competitors.', 
            label: 'App Concept', 
            btn: 'Analyze Idea', 
            btnLoading: 'Analyzing Market...', 
            placeholder: 'e.g., An app that helps people learn Turkish through daily 5-minute news summaries...',
            projections: 'Market Projections',
            chartPlaceholder: 'Start an analysis to view data',
            chart: { market: 'Market Size', comp: 'Competition', complex: 'Complexity', potential: 'Potential' }
        },
        aso: {
            title: 'ASO Studio',
            desc: 'Generate professional, keyword-optimized store listings for Google Play in seconds.',
            appName: 'App Name',
            concept: 'Core Features',
            lang: 'Target Language',
            btn: 'Generate Listing',
            keywords: 'High Value Keywords',
            preview: 'Mobile Preview',
            placeholder: 'Describe what your app does...'
        },
        policy: {
            title: 'Privacy Policy Generator',
            desc: 'Every app on the Play Store needs a valid privacy policy URL. Generate a compliant template here.',
            appName: 'App Name',
            appType: 'Category',
            btn: 'Generate Document',
            generating: 'Drafting...',
            placeholder: 'Enter details to generate your policy document',
            types: { utility: 'Utility / Tool', game: 'Game', social: 'Social Networking', shopping: 'Shopping', education: 'Education' }
        },
        checklist: {
            title: 'Launch Control',
            desc: 'Track your progress from concept to production rollout.',
            ready: 'Ready to Launch',
            resources: 'Developer Resources',
            start: 'Start',
            legend: 'Legend',
            steps: [
                { title: 'Create Developer Account', desc: 'Sign up for Google Play Console ($25 one-time fee).' },
                { title: 'Prepare Store Graphics', desc: 'Icon (512x512), Feature Graphic (1024x500), Screenshots.' },
                { title: 'Create App in Console', desc: 'Configure language, app type, and pricing model.' },
                { title: 'Content Rating (IARC)', desc: 'Complete the content rating questionnaire.' },
                { title: 'Privacy Policy', desc: 'Link your privacy policy URL in App Content.' },
                { title: 'Upload App Bundle', desc: 'Build signed .aab and upload to Production track.' },
                { title: 'Target Audience', desc: 'Define age groups and family policy settings.' },
                { title: 'Start Rollout', desc: 'Review warnings and start production rollout.' }
            ]
        },
        dev: {
            title: 'Development Roadmap',
            intro: 'Before you can publish, you need a solid build. Recommended stack for 2024:',
            native: 'Native Android',
            nativeDesc: 'Maximum performance, platform specific.',
            cross: 'Cross-Platform',
            crossDesc: 'Single codebase for Android & iOS.',
            reqTitle: 'Production Requirements',
            req1: 'Target SDK 34+ (Android 14)',
            req2: 'App Bundle (.aab) format',
            req3: 'Play App Signing enabled'
        }
    },
    tr: {
        nav: { 
            idea: 'Konsept Analizi', 
            dev: 'Yazılım Rotası', 
            aso: 'ASO Stüdyosu', 
            policy: 'Gizlilik Politikası', 
            launch: 'Yayın Merkezi' 
        },
        badges: {
            novice: 'Çaylak',
            strategist: 'Stratejist',
            architect: 'Mimar',
            builder: 'İnşaatçı',
            commander: 'Komutan',
            legend: 'Efsane'
        },
        idea: { 
            title: 'Fikir Doğrulama', 
            desc: 'Uygulama fikrinizi anlatın, yapay zeka pazar potansiyelini ve rekabeti analiz etsin.', 
            label: 'Uygulama Konsepti', 
            btn: 'Analiz Et', 
            btnLoading: 'Pazar Taranıyor...', 
            placeholder: 'Örn: İnsanların günlük 5 dakikada Türkçe öğrenmesini sağlayan bir haber uygulaması...',
            projections: 'Pazar Öngörüleri',
            chartPlaceholder: 'Verileri görmek için analiz başlatın',
            chart: { market: 'Pazar Hacmi', comp: 'Rekabet', complex: 'Zorluk', potential: 'Potansiyel' }
        },
        aso: {
            title: 'ASO Stüdyosu',
            desc: 'Google Play için saniyeler içinde profesyonel, SEO uyumlu mağaza girişleri oluşturun.',
            appName: 'Uygulama Adı',
            concept: 'Temel Özellikler',
            lang: 'Hedef Dil',
            btn: 'Listeleme Oluştur',
            keywords: 'Değerli Anahtar Kelimeler',
            preview: 'Mobil Önizleme',
            placeholder: 'Uygulamanızın ne işe yaradığını anlatın...'
        },
        policy: {
            title: 'Gizlilik Politikası',
            desc: 'Play Store yayınları için zorunlu olan gizlilik politikasını otomatik oluşturun.',
            appName: 'Uygulama Adı',
            appType: 'Kategori',
            btn: 'Belge Oluştur',
            generating: 'Yazılıyor...',
            placeholder: 'Politika oluşturmak için detayları girin',
            types: { utility: 'Araç / Yardımcı', game: 'Oyun', social: 'Sosyal Ağ', shopping: 'Alışveriş', education: 'Eğitim' }
        },
        checklist: {
            title: 'Yayın Kontrol Merkezi',
            desc: 'Fikirden yayına kadar olan süreci takip edin ve rütbe kazanın.',
            ready: 'Yayınlamaya Hazır',
            resources: 'Geliştirici Kaynakları',
            start: 'Başlangıç',
            legend: 'Efsane',
            steps: [
                { title: 'Geliştirici Hesabı', desc: 'Google Play Console hesabı açın (25$ tek seferlik).' },
                { title: 'Mağaza Görselleri', desc: 'İkon (512px), Feature Graphic (1024px) ve SS\'ler.' },
                { title: 'Uygulama Kurulumu', desc: 'Dil, kategori ve ücretlendirme ayarlarını yapın.' },
                { title: 'İçerik Derecelendirme', desc: 'IARC anketini doldurarak yaş sınırını belirleyin.' },
                { title: 'Gizlilik Politikası', desc: 'Politika URL\'nizi konsola ekleyin.' },
                { title: 'AAB Yüklemesi', desc: 'İmzalı App Bundle (.aab) dosyasını üretime yükleyin.' },
                { title: 'Hedef Kitle', desc: 'Yaş grupları ve aile politikası ayarlarını yapın.' },
                { title: 'Üretime Gönder', desc: 'Uyarıları kontrol edip yayına gönderin.' }
            ]
        },
        dev: {
            title: 'Yazılım Yol Haritası',
            intro: 'Başarılı bir yayın için sağlam bir altyapı şart. İşte güncel teknoloji önerileri:',
            native: 'Native Android',
            nativeDesc: 'Maksimum performans, platforma özel.',
            cross: 'Cross-Platform',
            crossDesc: 'Tek kodla Android & iOS çıktısı.',
            reqTitle: 'Üretim Gereksinimleri',
            req1: 'Target SDK 34+ (Android 14)',
            req2: 'App Bundle (.aab) formatı',
            req3: 'Play App Signing aktif'
        }
    }
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.IDEA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('tr'); 

  const t = translations[language];

  const handleStepChange = (step: AppStep) => {
    setCurrentStep(step);
    adManager.trackAction();
  };

  const renderContent = () => {
    switch (currentStep) {
      case AppStep.IDEA:
        return <IdeaValidator lang={language} t={t} />;
      case AppStep.STORE_LISTING:
        return <StoreOptimizer lang={language} t={t} />;
      case AppStep.PUBLISH:
        return <LaunchChecklist lang={language} t={t} />;
      case AppStep.POLICY:
        return <PolicyGenerator lang={language} t={t} />;
      case AppStep.DEV_GUIDE:
        return (
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">{t.dev.title}</h2>
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 space-y-8">
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {t.dev.intro}
                    </p>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 border-2 border-slate-100 rounded-2xl bg-slate-50 hover:border-indigo-100 transition-colors group">
                            <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{t.dev.native}</h3>
                            <p className="text-sm text-slate-500 mb-4 font-medium">{t.dev.nativeDesc}</p>
                            <ul className="text-sm space-y-2 text-slate-700">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Kotlin (Recommended)</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Jetpack Compose</li>
                            </ul>
                        </div>
                        <div className="p-6 border-2 border-slate-100 rounded-2xl bg-slate-50 hover:border-indigo-100 transition-colors group">
                            <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{t.dev.cross}</h3>
                            <p className="text-sm text-slate-500 mb-4 font-medium">{t.dev.crossDesc}</p>
                            <ul className="text-sm space-y-2 text-slate-700">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>React Native (TypeScript)</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Flutter (Dart)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                         <h3 className="font-bold text-slate-900 mb-4">{t.dev.reqTitle}</h3>
                         <div className="grid gap-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-slate-700 font-medium">{t.dev.req1}</span>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">API 34</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-slate-700 font-medium">{t.dev.req2}</span>
                                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">.AAB</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-slate-700 font-medium">{t.dev.req3}</span>
                                <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">SECURE</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        );
      default:
        return <IdeaValidator lang={language} t={t} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <InterstitialAd />
      
      <Sidebar 
        currentStep={currentStep} 
        setStep={handleStepChange} 
        isMobileOpen={isMobileMenuOpen}
        toggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        lang={language}
        setLang={setLanguage}
        t={t}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10"></div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                   <Mountain className="text-white w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-lg tracking-tight">DevSherpa</span>
            </div>
          </div>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg"
          >
            {language === 'en' ? 'TR' : 'EN'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 custom-scrollbar">
            {renderContent()}
            <div className="h-20"></div> {/* Bottom Spacer */}
        </div>
      </main>
    </div>
  );
};

export default App;