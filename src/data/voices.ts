import { VoiceProfile } from '../types/tts';

export const GEMINI_VOICES: VoiceProfile[] = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Female',
    timbre: 'Warm, articulate, balanced & natural',
    bestFor: 'Audiobooks, documentaries, clear explainer videos, educational content',
    avatarColor: 'from-amber-500 to-rose-500',
    previewDescription: 'Calm, approachable, and crystalline clarity across all languages including Bengali.',
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Male',
    timbre: 'Energetic, dynamic, youthful & narrative',
    bestFor: 'Podcasts, high-energy commercials, YouTube voiceovers, character dialogues',
    avatarColor: 'from-cyan-500 to-blue-600',
    previewDescription: 'Lively, spirited cadence with great range for conversational pacing.',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Male',
    timbre: 'Deep, calm, baritone & authoritative',
    bestFor: 'Historical documentaries, dramatic audiobooks, cinematic trailers, serious journalism',
    avatarColor: 'from-indigo-600 to-slate-900',
    previewDescription: 'Resonant low-end, dignified gravitas, commanding presence.',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Male',
    timbre: 'Resonant, grounded, cinematic & powerful',
    bestFor: 'Epic storytelling, fantasy narration, dramatic poetry, intense scenes',
    avatarColor: 'from-emerald-600 to-teal-800',
    previewDescription: 'Rich, intense timbre that carries heavy dramatic weight and suspense.',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Neutral',
    timbre: 'Soft, gentle, serene & soothing',
    bestFor: 'Bedtime stories, guided meditation, introspective poetry, gentle tutorials',
    avatarColor: 'from-purple-500 to-pink-500',
    previewDescription: 'Silky, soothing warmth designed for relaxation and peaceful listening.',
  },
];

export const STYLE_PRESETS = [
  {
    label: 'Audiobook Narrator',
    style: 'Warm, engaging, nuanced storytelling with natural expressive pauses',
    genre: 'audiobook',
  },
  {
    label: 'Documentary Voiceover',
    style: 'Authoritative, clear, dignified, and insightful cadence',
    genre: 'documentary',
  },
  {
    label: 'Indian Bengali (পশ্চিমবঙ্গ প্রমিত)',
    style: 'পশ্চিমবঙ্গ প্রমিত বাংলা, আকাশবাণী ও শান্তিনিকেতনের মার্জিত ও পরিষ্কার উচ্চারণ, নিখুঁত স্বরসঙ্গতি ও স্বাভাবিক শ্বাসপ্রশ্বাস (Crystal clear Indian Bengali enunciation with Akashvani standard diction)',
    genre: 'bengali_heritage',
  },
  {
    label: 'Kolkata Mystery / Drama (রহস্য রোমাঞ্চ)',
    style: 'কলকাতার রহস্য উপন্যাসের গম্ভীর কথক, তীক্ষ্ণ ও নিখুঁত যুক্তবর্ণ উচ্চারণ, নাটকীয় বিরতি (Crisp, dramatic Indian Bengali detective mystery narration)',
    genre: 'audiobook',
  },
  {
    label: 'Bengali Orator (বাংলা কথক)',
    style: 'প্রমিত ও মাধুর্যপূর্ণ বাচনভঙ্গি, গভীর অনুভূতি ও স্বাভাবিক শ্বাসপ্রশ্বাস (Natural, melodic Bengali orator with emotional warmth)',
    genre: 'bengali_heritage',
  },
  {
    label: 'Podcast Host',
    style: 'Casual, energetic, friendly, and conversational with upbeat momentum',
    genre: 'podcast',
  },
  {
    label: 'Bedtime Whisper',
    style: 'Soft, soothing, intimate, gently paced bedtime storyteller',
    genre: 'poetry',
  },
  {
    label: 'Commercial Broadcast',
    style: 'Crisp, punchy, persuasive, confident, and energetic radio/TV style',
    genre: 'commercial',
  },
  {
    label: 'Dramatic Suspense',
    style: 'Tense, breathy, deliberate, building anticipation with slow cinematic beats',
    genre: 'audiobook',
  },
  {
    label: 'News Anchor',
    style: 'Fast-paced, objective, articulate, professional news broadcast delivery',
    genre: 'news',
  },
];
