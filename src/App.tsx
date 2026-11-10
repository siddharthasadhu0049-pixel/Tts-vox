import React, { useState, useEffect } from 'react';
import {
  Mic2,
  Users,
  Sparkles,
  Volume2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Sliders,
  Radio,
  CheckCircle2,
  FileAudio
} from 'lucide-react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { ScriptEditor } from './components/ScriptEditor';
import { DialogueEditor } from './components/DialogueEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { TakeHistory } from './components/TakeHistory';
import { BengaliGuideModal } from './components/BengaliGuideModal';
import { SampleScriptModal } from './components/SampleScriptModal';
import {
  VoiceName,
  TTSModel,
  NarrationGenre,
  SpeakerConfig,
  DialogueTurn,
  AudioTake,
  SampleScript
} from './types/tts';
import { SAMPLE_SCRIPTS } from './data/languages';

const DEFAULT_BENGALI_SCRIPT = SAMPLE_SCRIPTS[0];

export default function App() {
  // Studio Mode: Single Narrator or Dual-Speaker Screenplay
  const [mode, setMode] = useState<'single' | 'dialogue'>('single');
  const [model, setModel] = useState<TTSModel>('gemini-3.8-flash-lite-tts');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Kore');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('bn-IN');
  const [genre, setGenre] = useState<NarrationGenre>('bengali_heritage');

  // Single Speaker Text & Style
  const [text, setText] = useState<string>(DEFAULT_BENGALI_SCRIPT.text);
  const [style, setStyle] = useState<string>(DEFAULT_BENGALI_SCRIPT.suggestedStyle);

  // Dual-Speaker Dialogue Config (Kolkata Coffee House / College Street style default)
  const [speakers, setSpeakers] = useState<[SpeakerConfig, SpeakerConfig]>([
    { name: 'সৌম্য', voiceName: 'Puck', defaultStyle: 'কলকাতার পরিশীলিত তরুণ বুদ্ধিজীবীর স্পষ্ট কণ্ঠ' },
    { name: 'শ্রীপর্ণা', voiceName: 'Kore', defaultStyle: 'সাবলীল ও উজ্জ্বল প্রমিত বাংলা বাচনভঙ্গি' },
  ]);

  const [dialogueTurns, setDialogueTurns] = useState<DialogueTurn[]>([
    {
      id: '1',
      speaker: 'সৌম্য',
      text: 'শুভ সন্ধ্যা শ্রীপর্ণা! <breath> কলেজ স্ট্রিটের বইমেলা ঘুরে এই কফি হাউসের টেবিলে বসলে ক্লান্তিটা নিমেষেই উবে যায়, তাই না?',
      style: 'কলকাতার পরিশীলিত তরুণ বুদ্ধিজীবীর স্পষ্ট কণ্ঠ',
    },
    {
      id: '2',
      speaker: 'শ্রীপর্ণা',
      text: 'একদম ঠিক বলেছ সৌম্য! |yeah| নতুন বইয়ের গন্ধ আর এই ধোঁয়া ওঠা কফি—এর কোনো বিকল্প হয় না।',
      style: 'সাবলীল, স্পষ্ট ও উজ্জ্বল প্রমিত বাংলা বাচনভঙ্গি',
    },
    {
      id: '3',
      speaker: 'সৌম্য',
      text: 'আর আজকের এই অডিও রেকর্ডিংয়ে আমাদের ভারতীয় প্রমিত বাংলার উচ্চারণটাও কী পরিষ্কার শোনাচ্ছে দেখেছ? <laugh> প্রতিটি অক্ষর যেন জীবন্ত!',
      style: 'উচ্ছ্বসিত ও আনন্দিত',
    },
  ]);

  // Audio Take History & Current Playing Take
  const [takes, setTakes] = useState<AudioTake[]>(() => {
    try {
      const saved = localStorage.getItem('voxstudio_takes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentTake, setCurrentTake] = useState<AudioTake | null>(null);

  // Loading & Error States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showBengaliGuide, setShowBengaliGuide] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  // Persist takes
  useEffect(() => {
    try {
      localStorage.setItem('voxstudio_takes', JSON.stringify(takes.slice(0, 15)));
    } catch (e) {
      console.warn('LocalStorage limit reached for takes:', e);
    }
  }, [takes]);

  // Load an initial take if available
  useEffect(() => {
    if (!currentTake && takes.length > 0) {
      setCurrentTake(takes[0]);
    }
  }, [takes]);

  // Handle Audio Generation
  const handleGenerateAudio = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      let payload: any = {};

      if (mode === 'dialogue') {
        payload = {
          mode: 'dialogue',
          model: 'gemini-3.8-flash-tts',
          speakers,
          dialogueTurns,
          language: selectedLanguage,
        };
      } else {
        payload = {
          mode: 'single',
          model,
          voice: selectedVoice,
          text,
          style,
          language: selectedLanguage,
        };
      }

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.audioBase64) {
        throw new Error(data.error || 'Failed to synthesize speech.');
      }

      const newTake: AudioTake = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        title:
          mode === 'dialogue'
            ? `${speakers[0].name} & ${speakers[1].name} Dialogue`
            : `${selectedVoice} - ${genre.replace('_', ' ')}`,
        textPreview: mode === 'dialogue' ? dialogueTurns[0]?.text || '' : text.slice(0, 120),
        mode,
        model: mode === 'dialogue' ? 'gemini-3.8-flash-tts' : model,
        voiceName: mode === 'single' ? selectedVoice : undefined,
        speakers: mode === 'dialogue' ? speakers : undefined,
        language: selectedLanguage,
        genre,
        audioBase64: data.audioBase64,
        style,
      };

      setTakes((prev) => [newTake, ...prev]);
      setCurrentTake(newTake);
    } catch (err: any) {
      console.error('Audio Generation Error:', err);
      setError(err?.message || 'An error occurred during audio generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Script Enhancement via Gemini
  const handleEnhanceScript = async (action: string) => {
    setIsEnhancing(true);
    setError(null);

    try {
      const res = await fetch('/api/script/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text,
          targetLanguage: selectedLanguage,
          genre,
          speakerCount: {
            name1: speakers[0].name,
            name2: speakers[1].name,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Script enhancement failed');
      }

      if (data.enhancedText) {
        setText(data.enhancedText);
        if (action === 'translate_indian_bengali' || action === 'indian_bengali_pronunciation') {
          setSelectedLanguage('bn-IN');
        } else if (action === 'translate_bengali') {
          setSelectedLanguage('bn-BD');
        }
      }
    } catch (err: any) {
      console.error('Script Enhancement Error:', err);
      setError(err?.message || 'Script enhancement failed.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Load sample preset script
  const handleLoadScript = (script: SampleScript) => {
    if (script.isDialogue && script.dialogueTurns) {
      setMode('dialogue');
      setModel('gemini-3.8-flash-tts');
      setSelectedLanguage(script.language);
      setGenre(script.genre);

      const uniqueSpeakers = Array.from(new Set(script.dialogueTurns.map((t) => t.speaker)));
      if (uniqueSpeakers.length >= 2) {
        setSpeakers([
          { name: uniqueSpeakers[0], voiceName: 'Puck', defaultStyle: 'Podcast Host' },
          { name: uniqueSpeakers[1], voiceName: 'Kore', defaultStyle: 'Co-Host / Guest' },
        ]);
      }

      setDialogueTurns(
        script.dialogueTurns.map((t, idx) => ({
          id: String(idx + 1),
          speaker: t.speaker,
          text: t.text,
          style: t.style,
        }))
      );
    } else {
      setMode('single');
      setText(script.text);
      setSelectedVoice(script.suggestedVoice);
      setSelectedLanguage(script.language);
      setGenre(script.genre);
      setStyle(script.suggestedStyle);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        currentModel={model}
        onModelChange={(m) => setModel(m)}
        onOpenBengaliGuide={() => setShowBengaliGuide(true)}
        onOpenSampleModal={() => setShowSampleModal(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-300">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Generation Notice</p>
                <p className="text-xs text-rose-200/90 leading-relaxed mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Master Audio Deck (Top Viewport Presence) */}
        <AudioPlayer currentTake={currentTake} />

        {/* Studio Production Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Voice & Language Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Mode Switcher */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'single'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic2 className="h-3.5 w-3.5" />
                <span>Single Narrator</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('dialogue');
                  setModel('gemini-3.8-flash-tts'); // Flagship model required for dual speaker
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'dialogue'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Dual-Speaker Dialogue</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={(code) => setSelectedLanguage(code)}
              />
            </div>

            {/* Voice Casting for Single Mode */}
            {mode === 'single' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onSelectVoice={(v) => setSelectedVoice(v)}
                />
              </div>
            )}

            {/* Bengali Feature Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-950 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🇮🇳</span>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  বাংলা (ভারত) - পরিচ্ছন্ন ও স্পষ্ট উচ্চারণ
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-bengali">
                পশ্চিমবঙ্গ প্রমিত চলিত বাংলা, আকাশবাণী ও শান্তিনিকেতনের মার্জিত শৈলী এবং নিখুঁত যুক্তবর্ণ উচ্চারণ (ক্ষ, জ্ঞ, ঙ্গ, শ্র, ত্র)।
              </p>
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowBengaliGuide(true)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>উচ্চারণ নির্দেশিকা ও রবীন্দ্রনাথের স্ক্রিপ্ট →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Script & Screenplay Production Console (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
              {mode === 'single' ? (
                <ScriptEditor
                  text={text}
                  onChangeText={setText}
                  style={style}
                  onChangeStyle={setStyle}
                  genre={genre}
                  onChangeGenre={setGenre}
                  selectedLanguage={selectedLanguage}
                  onGenerateAudio={handleGenerateAudio}
                  isGenerating={isGenerating}
                  onEnhanceScript={handleEnhanceScript}
                  isEnhancing={isEnhancing}
                />
              ) : (
                <DialogueEditor
                  speakers={speakers}
                  onChangeSpeakers={setSpeakers}
                  turns={dialogueTurns}
                  onChangeTurns={setDialogueTurns}
                  onGenerateAudio={handleGenerateAudio}
                  isGenerating={isGenerating}
                />
              )}
            </div>

            {/* Session Takes & Audio History */}
            <TakeHistory
              takes={takes}
              currentTakeId={currentTake?.id || null}
              onSelectTake={(t) => setCurrentTake(t)}
              onDeleteTake={(id) => setTakes((prev) => prev.filter((t) => t.id !== id))}
              onClearAll={() => {
                setTakes([]);
                setCurrentTake(null);
                localStorage.removeItem('voxstudio_takes');
              }}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <BengaliGuideModal
        isOpen={showBengaliGuide}
        onClose={() => setShowBengaliGuide(false)}
        onLoadScript={handleLoadScript}
      />

      <SampleScriptModal
        isOpen={showSampleModal}
        onClose={() => setShowSampleModal(false)}
        onLoadScript={handleLoadScript}
      />
    </div>
  );
}
