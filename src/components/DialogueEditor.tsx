import React from 'react';
import { Plus, Trash2, Mic, Users, Wind, Volume2, Sparkles, Wand2 } from 'lucide-react';
import { DialogueTurn, SpeakerConfig, VoiceName } from '../types/tts';
import { GEMINI_VOICES } from '../data/voices';

interface DialogueEditorProps {
  speakers: [SpeakerConfig, SpeakerConfig];
  onChangeSpeakers: (speakers: [SpeakerConfig, SpeakerConfig]) => void;
  turns: DialogueTurn[];
  onChangeTurns: (turns: DialogueTurn[]) => void;
  onGenerateAudio: () => void;
  isGenerating: boolean;
}

export const DialogueEditor: React.FC<DialogueEditorProps> = ({
  speakers,
  onChangeSpeakers,
  turns,
  onChangeTurns,
  onGenerateAudio,
  isGenerating,
}) => {
  const updateSpeaker = (index: 0 | 1, key: keyof SpeakerConfig, val: any) => {
    const updated: [SpeakerConfig, SpeakerConfig] = [...speakers];
    updated[index] = { ...updated[index], [key]: val };
    onChangeSpeakers(updated);
  };

  const addTurn = () => {
    const lastTurn = turns[turns.length - 1];
    const nextSpeaker = lastTurn?.speaker === speakers[0].name ? speakers[1].name : speakers[0].name;
    const newTurn: DialogueTurn = {
      id: Math.random().toString(36).substring(7),
      speaker: nextSpeaker,
      text: '',
    };
    onChangeTurns([...turns, newTurn]);
  };

  const updateTurn = (id: string, updates: Partial<DialogueTurn>) => {
    onChangeTurns(
      turns.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeTurn = (id: string) => {
    if (turns.length <= 1) return;
    onChangeTurns(turns.filter((t) => t.id !== id));
  };

  const insertBurst = (turnId: string, burst: string) => {
    const turn = turns.find((t) => t.id === turnId);
    if (!turn) return;
    updateTurn(turnId, { text: (turn.text ? turn.text + ' ' : '') + burst + ' ' });
  };

  return (
    <div className="space-y-5">
      {/* Speaker Configuration Deck */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Dual-Speaker Casting (Gemini 3.8 Flash TTS Multi-Speaker)
            </h3>
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium">
            Requires exactly 2 distinct speakers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speaker 1 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Speaker 1
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Channel A</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Character Name</label>
                <input
                  type="text"
                  value={speakers[0].name}
                  onChange={(e) => updateSpeaker(0, 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Voice Timbre</label>
                <select
                  value={speakers[0].voiceName}
                  onChange={(e) => updateSpeaker(0, 'voiceName', e.target.value as VoiceName)}
                  aria-label="Speaker 1 Voice Timbre"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {GEMINI_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender} - {v.timbre.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Default Persona / Style</label>
              <input
                type="text"
                value={speakers[0].defaultStyle || ''}
                onChange={(e) => updateSpeaker(0, 'defaultStyle', e.target.value)}
                placeholder="e.g. Enthusiastic, bright podcast host"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Speaker 2 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Speaker 2
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Channel B</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Character Name</label>
                <input
                  type="text"
                  value={speakers[1].name}
                  onChange={(e) => updateSpeaker(1, 'name', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Voice Timbre</label>
                <select
                  value={speakers[1].voiceName}
                  onChange={(e) => updateSpeaker(1, 'voiceName', e.target.value as VoiceName)}
                  aria-label="Speaker 2 Voice Timbre"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {GEMINI_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender} - {v.timbre.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Default Persona / Style</label>
              <input
                type="text"
                value={speakers[1].defaultStyle || ''}
                onChange={(e) => updateSpeaker(1, 'defaultStyle', e.target.value)}
                placeholder="e.g. Curious, articulate co-host"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Screenplay Dialogue Turns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Screenplay Dialogue ({turns.length} lines)
            </span>
            <span className="text-[11px] text-slate-500">
              Supports backchannels like |yeah|, |mhm| and bursts like &lt;laugh&gt;
            </span>
          </div>
          <button
            type="button"
            onClick={addTurn}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Dialogue Line</span>
          </button>
        </div>

        {turns.map((turn, idx) => {
          const isSpeaker1 = turn.speaker === speakers[0].name;
          const isBengali = /[\u0980-\u09FF]/.test(turn.text);

          return (
            <div
              key={turn.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isSpeaker1
                  ? 'border-cyan-500/40 bg-cyan-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <select
                    value={turn.speaker}
                    onChange={(e) => updateTurn(turn.id, { speaker: e.target.value })}
                    aria-label={`Speaker for line ${idx + 1}`}
                    className={`text-xs font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                      isSpeaker1
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <option value={speakers[0].name}>{speakers[0].name} (Spk 1)</option>
                    <option value={speakers[1].name}>{speakers[1].name} (Spk 2)</option>
                  </select>

                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Vocal Burst shortcuts */}
                  <button
                    type="button"
                    onClick={() => insertBurst(turn.id, '<breath>')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-800"
                    title="Insert breath"
                  >
                    &lt;breath&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBurst(turn.id, '<laugh>')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800"
                    title="Insert laughter"
                  >
                    &lt;laugh&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBurst(turn.id, '|yeah|')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800"
                    title="Insert backchannel yeah"
                  >
                    |yeah|
                  </button>
                  <button
                    type="button"
                    onClick={() => insertBurst(turn.id, '|mhm|')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 hover:bg-slate-800 border border-slate-800"
                    title="Insert backchannel mhm"
                  >
                    |mhm|
                  </button>

                  <button
                    type="button"
                    disabled={turns.length <= 1}
                    onClick={() => removeTurn(turn.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition-colors ml-1"
                    title="Delete turn"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Turn Textarea */}
              <textarea
                value={turn.text}
                onChange={(e) => updateTurn(turn.id, { text: e.target.value })}
                placeholder={`Dialogue spoken by ${turn.speaker}... (e.g. "Welcome back! <breath> Today we have an incredible episode...")`}
                rows={2}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 ${
                  isBengali ? 'font-bengali text-base' : 'font-sans'
                }`}
              />

              {/* Turn Style Override */}
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 shrink-0">Line Expression:</span>
                <input
                  type="text"
                  value={turn.style || ''}
                  onChange={(e) => updateTurn(turn.id, { style: e.target.value })}
                  placeholder="Optional line emotion, e.g. 'Amused chuckle', 'Enthusiastic', 'Curious and hesitant'"
                  className="w-full bg-slate-900/60 border border-slate-800/80 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addTurn}
          className="w-full py-2.5 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 rounded-xl text-xs text-slate-400 hover:text-slate-200 font-medium transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add Next Dialogue Line</span>
        </button>
      </div>

      {/* Generate Button for Dialogue */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>Synthesizes unified 2-speaker audio using Gemini 3.8 Flash TTS multi-speaker</span>
        </div>

        <button
          type="button"
          disabled={isGenerating || turns.some((t) => !t.text.trim())}
          onClick={onGenerateAudio}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:from-amber-400 hover:via-rose-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
              <span>Generating Dual-Speaker Narration...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 fill-slate-950" />
              <span>Generate Dual-Speaker Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
