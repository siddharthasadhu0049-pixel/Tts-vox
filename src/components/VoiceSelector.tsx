import React from 'react';
import { GEMINI_VOICES } from '../data/voices';
import { VoiceName } from '../types/tts';
import { Check, Mic, Sparkles } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  label?: string;
  compact?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  label = 'Voice Casting',
  compact = false,
}) => {
  if (compact) {
    return (
      <div>
        {label && <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {GEMINI_VOICES.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onSelectVoice(voice.id)}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`h-6 w-6 rounded-lg bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow`}>
                    {voice.name[0]}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {voice.name}
                    <span className="text-[10px] text-slate-400 font-normal">({voice.gender})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{voice.timbre}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5 text-cyan-400" />
          <span>{label} (Gemini 3.8 Prebuilt Voices)</span>
        </label>
        <span className="text-[11px] text-slate-400">All 5 voices fluently support Bengali & world languages</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {GEMINI_VOICES.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice.id)}
              className={`cursor-pointer rounded-xl p-3 border transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {voice.name[0]}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {voice.gender}
                    </span>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 shadow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {voice.name}
                </h3>
                <p className="text-xs text-cyan-200/80 font-medium mb-1">
                  {voice.timbre}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  {voice.bestFor}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 mt-auto flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                  24kHz Studio Output
                </span>
                <span className={`text-[10px] font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
