import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Wand2,
  Wind,
  Smile,
  AlertCircle,
  Clock,
  FileText,
  Volume2,
  Languages,
  RotateCcw,
  Sliders,
  Layers,
  ChevronDown
} from 'lucide-react';
import { STYLE_PRESETS } from '../data/voices';
import { NarrationGenre } from '../types/tts';

interface ScriptEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  style: string;
  onChangeStyle: (style: string) => void;
  genre: NarrationGenre;
  onChangeGenre: (genre: NarrationGenre) => void;
  selectedLanguage: string;
  onGenerateAudio: () => void;
  isGenerating: boolean;
  onEnhanceScript: (action: string) => Promise<void>;
  isEnhancing: boolean;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  onChangeText,
  style,
  onChangeStyle,
  genre,
  onChangeGenre,
  selectedLanguage,
  onGenerateAudio,
  isGenerating,
  onEnhanceScript,
  isEnhancing,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showStylePresets, setShowStylePresets] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Insert a tag at current cursor position
  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChangeText(text + ' ' + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + tag + text.substring(end);
    onChangeText(newText);

    // Reset cursor position after inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  // Word count & duration estimate
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((words / 140) * 60);
  const isBengali = selectedLanguage === 'bn-BD' || /[\u0980-\u09FF]/.test(text);

  return (
    <div className="space-y-4">
      {/* Top Controls: Genre & Pacing stats */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Narration Type:
          </span>
          {(
            [
              ['audiobook', 'Audiobook'],
              ['documentary', 'Documentary'],
              ['bengali_heritage', 'বাংলা সাহিত্য/আলাপ'],
              ['commercial', 'Commercial'],
              ['news', 'News Broadcast'],
              ['poetry', 'Poetry & Meditation'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => onChangeGenre(val)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                genre === val
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <strong className="text-slate-200">{words}</strong> words ({text.length} chars)
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Est. <strong className="text-slate-200">~{estimatedSeconds}s</strong>
          </span>
        </div>
      </div>

      {/* Vocal Bursts & Breathing Expression Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Wind className="h-3 w-3" />
            Natural Vocal Bursts:
          </span>
          <button
            type="button"
            onClick={() => insertTag('<breath> ')}
            className="px-2 py-1 text-xs rounded-md bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 transition-all font-mono flex items-center gap-1"
            title="Inserts natural breathing pause before sentences"
          >
            <span>&lt;breath&gt;</span>
            <span className="text-[10px] text-cyan-400/70 font-sans">Inhale</span>
          </button>
          <button
            type="button"
            onClick={() => insertTag('<laugh> ')}
            className="px-2 py-1 text-xs rounded-md bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 transition-all font-mono flex items-center gap-1"
            title="Inserts human laughter or chuckle"
          >
            <span>&lt;laugh&gt;</span>
            <span className="text-[10px] text-amber-400/70 font-sans">Laughter</span>
          </button>
          <button
            type="button"
            onClick={() => insertTag('<gasp> ')}
            className="px-2 py-1 text-xs rounded-md bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-all font-mono flex items-center gap-1"
            title="Inserts sharp gasp or shock"
          >
            <span>&lt;gasp&gt;</span>
            <span className="text-[10px] text-rose-400/70 font-sans">Gasp</span>
          </button>
          <button
            type="button"
            onClick={() => insertTag('<sigh> ')}
            className="px-2 py-1 text-xs rounded-md bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/60 transition-all font-mono flex items-center gap-1"
            title="Inserts wistful or relieved sigh"
          >
            <span>&lt;sigh&gt;</span>
            <span className="text-[10px] text-purple-400/70 font-sans">Sigh</span>
          </button>
          <button
            type="button"
            onClick={() => insertTag('|yeah| ')}
            className="px-2 py-1 text-xs rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-all font-mono flex items-center gap-1"
            title="Conversational backchannel: yeah"
          >
            <span>|yeah|</span>
          </button>
          <button
            type="button"
            onClick={() => insertTag('|mhm| ')}
            className="px-2 py-1 text-xs rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-all font-mono flex items-center gap-1"
            title="Conversational backchannel: mhm"
          >
            <span>|mhm|</span>
          </button>
        </div>

        {/* AI Script Director actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedLanguage === 'bn-IN' ? (
            <>
              <button
                type="button"
                disabled={isEnhancing || !text.trim()}
                onClick={() => onEnhanceScript('indian_bengali_pronunciation')}
                className="px-2.5 py-1 text-xs rounded-md bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-500/50 font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                title="Polish script for crystal clean & clear Indian Bengali (Kolkata/West Bengal) pronunciation"
              >
                <span>🇮🇳</span>
                <span>স্পষ্ট ভারতীয় উচ্চারণ (Clean Diction)</span>
              </button>

              <button
                type="button"
                disabled={isEnhancing || !text.trim()}
                onClick={() => onEnhanceScript('translate_indian_bengali')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-medium transition-all flex items-center gap-1 disabled:opacity-50"
                title="Translate into standard Indian Bengali"
              >
                <Languages className="h-3 w-3 text-amber-400" />
                <span>ভারতীয় বাংলায় রূপান্তর</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isEnhancing || !text.trim()}
              onClick={() => onEnhanceScript('translate_bengali')}
              className="px-2.5 py-1 text-xs rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-all flex items-center gap-1 disabled:opacity-50"
              title="Convert script to natural spoken Bengali"
            >
              <Languages className="h-3 w-3 text-amber-400" />
              <span>বাঙলায় রূপান্তর</span>
            </button>
          )}

          <button
            type="button"
            disabled={isEnhancing || !text.trim()}
            onClick={() => onEnhanceScript('inject_vocal_bursts')}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 disabled:opacity-50"
            title="Automatically inject natural breathing pauses and expression cues"
          >
            <Wand2 className="h-3 w-3 text-cyan-400" />
            <span>Auto-Breath</span>
          </button>

          <button
            type="button"
            disabled={isEnhancing || !text.trim()}
            onClick={() => onEnhanceScript('pacing_punctuation')}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 disabled:opacity-50"
            title="Optimize punctuation for speech synthesis pacing"
          >
            <Sliders className="h-3 w-3 text-emerald-400" />
            <span>Pace Cadence</span>
          </button>
        </div>
      </div>

      {/* Indian Bengali Pronunciation Quality Indicator */}
      {selectedLanguage === 'bn-IN' && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-sm">🇮🇳</span>
            <span className="font-semibold text-amber-300">
              বাংলা (ভারত - প্রমিত): Clean & Clear Indian Bengali Pronunciation
            </span>
          </div>
          <span className="text-[11px] text-amber-300/80 hidden sm:inline">
            Akashvani Kolkata & Shantiniketan standard phonetic articulation
          </span>
        </div>
      )}

      {/* Script Textarea */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={
            isBengali
              ? 'এখানে আপনার বাংলা চিত্রনাট্য বা বিবরণ লিখুন... (যেমন: সন্ধ্যা নেমে আসছে পদ্মার ওপারে। <breath> মৃদু বাতাসে কাশবনের ঢেউ বয়ে যায় দিগন্তের দিকে...)'
              : 'Type or paste your narration script here. Insert <breath>, <laugh>, or <sigh> to bring natural human breathing and emotional expression to life...'
          }
          rows={7}
          className={`w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-white text-base leading-relaxed placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y ${
            isBengali ? 'font-bengali text-lg leading-loose' : 'font-sans'
          }`}
        />
        {isEnhancing && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-cyan-400 text-sm font-medium">
            <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Enhancing script with natural cadence & cues...</span>
          </div>
        )}
      </div>

      {/* Voice Persona / Style Prompt Config */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span>Speech Persona & Style Prompt (Gemini speechMetadata.style)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowStylePresets(!showStylePresets)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Style Presets</span>
            <ChevronDown className={`h-3 w-3 transform transition-transform ${showStylePresets ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Style Presets Tray */}
        {showStylePresets && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1.5 pb-2 border-b border-slate-800">
            {STYLE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChangeStyle(p.style);
                  setShowStylePresets(false);
                }}
                className="text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-200">{p.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{p.style}</div>
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={style}
            onChange={(e) => onChangeStyle(e.target.value)}
            placeholder="e.g. Warm and engaging audiobook narrator with subtle emotional depth, slow pacing"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          {style && (
            <button
              type="button"
              onClick={() => onChangeStyle('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Generate Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Outputs complete 24kHz Studio Unary WAV file directly from Gemini</span>
        </div>

        <button
          type="button"
          disabled={isGenerating || !text.trim()}
          onClick={onGenerateAudio}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:from-cyan-400 hover:via-indigo-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
              <span>Synthesizing Studio Audio...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 fill-slate-950" />
              <span>Generate Natural Audio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
