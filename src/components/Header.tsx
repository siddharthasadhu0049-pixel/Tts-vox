import React from 'react';
import { Volume2, Sparkles, BookOpen, Mic2, Radio, Info } from 'lucide-react';
import { TTSModel } from '../types/tts';

interface HeaderProps {
  currentModel: TTSModel;
  onModelChange: (model: TTSModel) => void;
  onOpenBengaliGuide: () => void;
  onOpenSampleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onModelChange,
  onOpenBengaliGuide,
  onOpenSampleModal,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mic2 className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                VoxStudio <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">TTS Studio</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Audio
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Natural Voice Narration & Audiobooks • Multilingual including <span className="text-amber-400 font-medium">বাংলা (Bengali)</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Model Switch */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Bengali Guide Button */}
          <button
            onClick={onOpenBengaliGuide}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Bengali Narration & Pronunciation Guide"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>বাংলা গাইড (Bengali Guide)</span>
          </button>

          {/* Sample Scripts Button */}
          <button
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Sample Scripts</span>
          </button>

          {/* Model Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => onModelChange('gemini-3.8-flash-lite-tts')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentModel === 'gemini-3.8-flash-lite-tts'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Fast, standard TTS model for books, articles, and voiceover"
            >
              Flash Lite TTS
            </button>
            <button
              onClick={() => onModelChange('gemini-3.8-flash-tts')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentModel === 'gemini-3.8-flash-tts'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Flagship TTS model for Voice Design, dual-speaker screenplays, & expressive bursts"
            >
              Flash TTS (Flagship)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
