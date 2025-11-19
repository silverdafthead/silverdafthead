import React, { useState, useEffect } from 'react';
import { ChecklistItem, Language } from '../types';
import { Check, ChevronRight, ExternalLink, Trophy, Medal, Crown, Zap, Compass, Hammer } from 'lucide-react';

interface LaunchChecklistProps {
    lang: Language;
    t: any;
}

const LaunchChecklist: React.FC<LaunchChecklistProps> = ({ lang, t }) => {
  const [steps, setSteps] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    setSteps([
        { id: '1', title: t.checklist.steps[0].title, description: t.checklist.steps[0].desc, completed: false },
        { id: '2', title: t.checklist.steps[1].title, description: t.checklist.steps[1].desc, completed: false },
        { id: '3', title: t.checklist.steps[2].title, description: t.checklist.steps[2].desc, completed: false },
        { id: '4', title: t.checklist.steps[3].title, description: t.checklist.steps[3].desc, completed: false },
        { id: '5', title: t.checklist.steps[4].title, description: t.checklist.steps[4].desc, completed: false },
        { id: '6', title: t.checklist.steps[5].title, description: t.checklist.steps[5].desc, completed: false },
        { id: '7', title: t.checklist.steps[6].title, description: t.checklist.steps[6].desc, completed: false },
        { id: '8', title: t.checklist.steps[7].title, description: t.checklist.steps[7].desc, completed: false },
    ]);
  }, [lang, t]);

  const toggleStep = (id: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const progress = steps.length > 0 ? Math.round((steps.filter(s => s.completed).length / steps.length) * 100) : 0;

  // Gamification Logic
  const getBadge = (progress: number) => {
      if (progress === 100) return { title: t.badges.legend, icon: <Crown size={32} className="text-yellow-400" />, color: "from-yellow-400 to-orange-500" };
      if (progress >= 75) return { title: t.badges.commander, icon: <Medal size={32} className="text-purple-400" />, color: "from-purple-400 to-pink-500" };
      if (progress >= 50) return { title: t.badges.builder, icon: <Hammer size={32} className="text-blue-400" />, color: "from-blue-400 to-indigo-500" };
      if (progress >= 25) return { title: t.badges.architect, icon: <Compass size={32} className="text-emerald-400" />, color: "from-emerald-400 to-teal-500" };
      if (progress > 0) return { title: t.badges.strategist, icon: <Zap size={32} className="text-amber-400" />, color: "from-amber-400 to-orange-500" };
      return { title: t.badges.novice, icon: <Trophy size={32} className="text-slate-400" />, color: "from-slate-400 to-slate-500" };
  };

  const currentBadge = getBadge(progress);
  
  // Find next threshold
  const thresholds = [25, 50, 75, 100];
  const nextThreshold = thresholds.find(th => th > progress) || 100;

  return (
    <div className="max-w-3xl mx-auto">
        <header className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">{t.checklist.title}</h2>
            <p className="text-slate-600 mt-2">{t.checklist.desc}</p>
        </header>

        {/* Gamified Progress Card */}
        <div className="mb-8 bg-slate-900 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentBadge.color} opacity-10 blur-3xl rounded-full -mr-16 -mt-16`}></div>
            
            <div className="relative z-10 flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-slate-700 shadow-inner`}>
                    {currentBadge.icon}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">Current Rank</span>
                            <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentBadge.color}`}>
                                {currentBadge.title}
                            </h3>
                        </div>
                        <div className="text-right">
                             <span className="text-3xl font-bold">{progress}%</span>
                             <span className="text-slate-500 text-sm ml-1">XP</span>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                        <div 
                            className={`h-full bg-gradient-to-r ${currentBadge.color} transition-all duration-700 ease-out relative`}
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>{t.checklist.start}</span>
                        {progress < 100 && (
                            <span>Next Rank at {nextThreshold}%</span>
                        )}
                        <span>{t.checklist.legend}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {steps.map((step) => (
                <div 
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`group bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                        step.completed 
                        ? 'border-emerald-200 bg-emerald-50/30' 
                        : 'border-slate-200 hover:border-emerald-200'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            step.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white scale-110' 
                            : 'border-slate-300 text-transparent group-hover:border-emerald-400'
                        }`}>
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-semibold text-lg ${step.completed ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>
                                {step.title}
                            </h3>
                            <p className={`mt-1 text-sm ${step.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <ExternalLink size={18} />
                {t.checklist.resources}
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
                <li>
                    <a href="#" className="hover:underline">Google Play Console Login &rarr;</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Android App Bundle Documentation &rarr;</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Developer Policy Center &rarr;</a>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default LaunchChecklist;