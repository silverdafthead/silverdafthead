import React, { useState } from 'react';
import { generatePrivacyPolicy } from '../services/gemini';
import { GeminiLoadingState, Language } from '../types';
import { FileText, Download, Copy, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PolicyGeneratorProps {
    lang: Language;
    t: any;
}

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ lang, t }) => {
    const [appName, setAppName] = useState('');
    const [appType, setAppType] = useState('Utility');
    const [policy, setPolicy] = useState('');
    const [status, setStatus] = useState<GeminiLoadingState>('idle');

    const handleGenerate = async () => {
        if (!appName) return;
        setStatus('loading');
        try {
            const text = await generatePrivacyPolicy(appName, appType, lang);
            setPolicy(text);
            setStatus('success');
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.policy.title}</h2>
                <p className="text-slate-600">
                    {t.policy.desc}
                </p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.policy.appName}</label>
                                <input 
                                    type="text" 
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="My Awesome App"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.policy.appType}</label>
                                <select 
                                    value={appType}
                                    onChange={(e) => setAppType(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none bg-white"
                                >
                                    <option value="Utility">{t.policy.types.utility}</option>
                                    <option value="Game">{t.policy.types.game}</option>
                                    <option value="Social">{t.policy.types.social}</option>
                                    <option value="E-commerce">{t.policy.types.shopping}</option>
                                    <option value="Education">{t.policy.types.education}</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={status === 'loading' || !appName}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                {status === 'loading' ? t.policy.generating : t.policy.btn}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    {policy ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <ShieldCheck size={18} className="text-emerald-500"/>
                                    <span className="font-medium text-sm">Privacy Policy Template</span>
                                </div>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(policy)}
                                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm"
                                >
                                    <Copy size={16} /> Copy
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 prose prose-sm max-w-none custom-scrollbar">
                                <ReactMarkdown>{policy}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                            <div className="text-center p-6">
                                <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                <p>{t.policy.placeholder}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolicyGenerator;