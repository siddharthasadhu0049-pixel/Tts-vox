import React from 'react';
import { History, Play, Download, Trash2, Mic, Clock, Sparkles } from 'lucide-react';
import { AudioTake } from '../types/tts';

interface TakeHistoryProps {
  takes: AudioTake[];
  currentTakeId: string | null;
  onSelectTake: (take: AudioTake) => void;
  onDeleteTake: (id: string) => void;
  onClearAll: () => void;
}

export const TakeHistory: React.FC<TakeHistoryProps> = ({
  takes,
  currentTakeId,
  onSelectTake,
  onDeleteTake,
  onClearAll,
}) => {
  if (takes.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Audio Takes & Session History ({takes.length})
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {takes.map((take) => {
          const isSelected = take.id === currentTakeId;
          const dateStr = new Date(take.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={take.id}
              onClick={() => onSelectTake(take)}
              className={`cursor-pointer p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/40 shadow-sm shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300">
                    {take.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-mono">{dateStr}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTake(take.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      title="Delete take"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-bengali">
                  {take.textPreview}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-medium font-mono">
                    {take.mode === 'dialogue' ? 'Dual Spk' : take.voiceName}
                  </span>
                  <span className="text-slate-500 uppercase">{take.genre}</span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-medium">
                  <Play className="h-3 w-3 fill-cyan-400" />
                  <span>{isSelected ? 'Loaded' : 'Play'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
