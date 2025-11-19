import React, { useState } from 'react';
import { generateAppAnalysis } from '../services/gemini';
import { GeminiLoadingState, Language } from '../types';
import { Sparkles, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface IdeaValidatorProps {
    lang: Language;
    t: any;
}

const IdeaValidator: React.FC<IdeaValidatorProps> = ({ lang, t }) => {
  const [concept, setConcept] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [status, setStatus] = useState<GeminiLoadingState>('idle');

  const mockChartData = [
    { name: t.idea.chart.market, value: 85, color: '#34d399' },
    { name: t.idea.chart.comp, value: 65, color: '#f87171' },
    { name: t.idea.chart.complex, value: 40, color: '#60a5fa' },
    { name: t.idea.chart.potential, value: 90, color: '#fbbf24' },
  ];

  const handleAnalyze = async () => {
    if (!concept.trim()) return;
    setStatus('loading');
    try {
      const result = await generateAppAnalysis(concept, lang);
      setAnalysis(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.idea.title}</h2>
        <p className="text-slate-600">
          {t.idea.desc}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.idea.label}
            </label>
            {/* Changed textarea to be dark background with white text as requested */}
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full h-32 p-4 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none placeholder-slate-400"
              placeholder={t.idea.placeholder}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={status === 'loading' || !concept.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.idea.btnLoading}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {t.idea.btn}
                  </>
                )}
              </button>
            </div>
          </div>

          {status === 'error' && (
             <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
               <AlertCircle size={20} />
               <p>Something went wrong. Please ensure your API key is valid and try again.</p>
             </div>
          )}

          {status === 'success' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Analysis Results</h3>
              </div>
              <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold">
               <BarChart3 size={20} className="text-emerald-500" />
               <span>{t.idea.projections}</span>
            </div>
            
            {status === 'success' ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData} layout="vertical" margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={80}
                        tick={{fontSize: 11, fill: '#64748b'}}
                      />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {mockChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    * Metrics are simulated.
                  </p>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                    <BarChart3 size={48} className="mb-3 opacity-20" />
                    <p className="text-sm text-center">{t.idea.chartPlaceholder}</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaValidator;