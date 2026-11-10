import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, BookOpen, Mic, Film, Radio } from 'lucide-react';
import { SampleScript, NarrationGenre } from '../types/tts';
import { SAMPLE_SCRIPTS } from '../data/languages';

interface SampleScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScript: (script: SampleScript) => void;
}

export const SampleScriptModal: React.FC<SampleScriptModalProps> = ({
  isOpen,
  onClose,
  onLoadScript,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  if (!isOpen) return null;

  const filteredScripts = SAMPLE_SCRIPTS.filter((s) => {
    return selectedGenre === 'all' || s.genre === selectedGenre;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Narration Script Library
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Curated Presets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ready-to-narrate audiobooks, documentaries, and dialogues in Bengali, English, Hindi, and Spanish
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold uppercase">Filter Genre:</span>
          {['all', 'audiobook', 'documentary', 'podcast', 'commercial', 'poetry'].map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition-colors ${
                selectedGenre === genre
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {genre === 'all' ? 'All Genres' : genre}
            </button>
          ))}
        </div>

        {/* Script Cards */}
        <div className="space-y-3">
          {filteredScripts.map((script) => (
            <div
              key={script.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {script.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {script.genre}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {script.language === 'bn-BD' ? '🇧🇩 Bengali' : script.language}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Voice: {script.suggestedVoice}
                  </span>
                  {script.isDialogue && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                      Dual-Speaker
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-bengali">
                  {script.text}
                </p>

                <p className="text-[11px] text-slate-500 italic">
                  Suggested Style: {script.suggestedStyle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLoadScript(script);
                  onClose();
                }}
                className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
              >
                <span>Load Script</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
