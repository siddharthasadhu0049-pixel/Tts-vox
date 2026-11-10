import React, { useState } from 'react';
import { LANGUAGES, LanguageOption } from '../data/languages';
import { Globe, Search, Star } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredLanguages = LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase());

    const matchesRegion =
      selectedRegion === 'all' ||
      (selectedRegion === 'featured' && lang.featured) ||
      (selectedRegion === 'bengali' && lang.code === 'bn-BD') ||
      lang.region.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesRegion;
  });

  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span>Narration Language</span>
        </label>
        <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400" />
          Native Bengali (বাংলা) Supported
        </span>
      </div>

      {/* Quick Access Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => {
            setSelectedRegion('all');
            onSelectLanguage('bn-IN');
          }}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            selectedLanguage === 'bn-IN'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
          }`}
          title="Indian Bengali (West Bengal / Kolkata standard) with crystal clear pronunciation"
        >
          <span>🇮🇳 বাংলা (ভারত - প্রমিত)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRegion('all');
            onSelectLanguage('bn-BD');
          }}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            selectedLanguage === 'bn-BD'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>🇧🇩 বাংলা (বাংলাদেশ)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectLanguage('en-US')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedLanguage === 'en-US'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🇺🇸 English
        </button>

        <button
          type="button"
          onClick={() => onSelectLanguage('hi-IN')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedLanguage === 'hi-IN'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🇮🇳 हिन्दी
        </button>

        <button
          type="button"
          onClick={() => onSelectLanguage('es-ES')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedLanguage === 'es-ES'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🇪🇸 Español
        </button>

        <button
          type="button"
          onClick={() => onSelectLanguage('ja-JP')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
            selectedLanguage === 'ja-JP'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🇯🇵 日本語
        </button>
      </div>

      {/* Select Dropdown & Search */}
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onSelectLanguage(e.target.value)}
          aria-label="Select Narration Language"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-white py-1">
              {lang.name} — {lang.nativeName} ({lang.region})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
