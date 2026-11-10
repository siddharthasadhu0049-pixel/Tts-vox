import React from 'react';
import { X, BookOpen, Sparkles, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';
import { SampleScript } from '../types/tts';
import { SAMPLE_SCRIPTS } from '../data/languages';

interface BengaliGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScript: (script: SampleScript) => void;
}

export const BengaliGuideModal: React.FC<BengaliGuideModalProps> = ({
  isOpen,
  onClose,
  onLoadScript,
}) => {
  if (!isOpen) return null;

  const bengaliScripts = SAMPLE_SCRIPTS.filter(
    (s) => s.language === 'bn-IN' || s.language === 'bn-BD'
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                বাংলা ভয়েসওভার ও প্রমিত উচ্চারণ গাইড
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Bengali (Indian & Global) Guide
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mastering crystal clear Indian Bengali (পশ্চিমবঙ্গ প্রমিত বাংলা) & natural narration with Gemini 3.8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>🇮🇳 ভারতীয় প্রমিত উচ্চারণ (Indian Bengali)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              পশ্চিমবঙ্গ/কলকাতা ও আকাশবাণীর মান্য প্রমিত বাংলায় যুক্তাক্ষর, শ-ষ-স এর সঠিক উচ্চারণ এবং স্বরসঙ্গতির সুস্পষ্ট প্রয়োগ নিশ্চিত করে।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>যুক্তবর্ণের স্পষ্ট রূপ (Phonetics)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              'ক্ষ' (ক্‌খ), 'জ্ঞ' (গ্‌যঁ), 'হ্ম' (মূহ) এবং য-ফলাযুক্ত শব্দগুলো একদম মানুষের মতো পরিষ্কার ও নিখুঁতভাবে উচ্চারিত হয়।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>স্বাভাবিক শ্বাসপ্রশ্বাস (&lt;breath&gt;)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              লম্বা বাক্যের শুরুতে বা কমার পরে <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">&lt;breath&gt;</code> ট্যাগ ব্যবহার করলে কথক মানুষের মতো দম নিয়ে কথা বলে।
            </p>
          </div>
        </div>

        {/* Ready-to-test Bengali Scripts */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>প্রস্তুত বাংলা স্ক্রিপ্ট নমুনা (Ready Bengali Presets)</span>
          </h3>

          <div className="space-y-2.5">
            {bengaliScripts.map((script) => (
              <div
                key={script.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {script.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {script.language === 'bn-IN' ? '🇮🇳 ভারত (India)' : '🇧🇩 বাংলাদেশ'}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {script.genre}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      Voice: {script.suggestedVoice}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 font-bengali">
                    {script.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLoadScript(script);
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                >
                  <span>স্টুডিওতে লোড করুন</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practice Tips */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1">
          <p className="font-bold text-amber-300">💡 প্রমিত বাংলা উচ্চারণের সেরা টিপস:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
            <li>দাঁড়ি (।) এবং কমার (,) সঠিক ব্যবহারে কণ্ঠের ওঠানামা এবং বিরতি সবচেয়ে স্বাভাবিক শোনায়।</li>
            <li>পডকাস্টের ক্ষেত্রে দুটি বক্তার সংলাপ তৈরি করতে 'Dual-Speaker Dialogue' মোড ব্যবহার করুন।</li>
            <li>কোর (Kore) কণ্ঠটি যেকোনো অডিওবুক বা বর্ণনামূলক কাজে চমৎকার মানিয়ে যায়, এবং ক্যারন (Charon) ডকুমেন্টারির জন্য আদর্শ।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
