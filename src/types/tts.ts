export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export type TTSModel = 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';

export type NarrationGenre =
  | 'audiobook'
  | 'documentary'
  | 'podcast'
  | 'commercial'
  | 'news'
  | 'poetry'
  | 'bengali_heritage';

export interface VoiceProfile {
  id: VoiceName;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  timbre: string;
  bestFor: string;
  avatarColor: string;
  previewDescription: string;
}

export interface DialogueTurn {
  id: string;
  speaker: string;
  text: string;
  style?: string;
}

export interface SpeakerConfig {
  name: string;
  voiceName: VoiceName;
  defaultStyle?: string;
}

export interface AudioTake {
  id: string;
  timestamp: number;
  title: string;
  textPreview: string;
  mode: 'single' | 'dialogue';
  model: TTSModel;
  voiceName?: VoiceName;
  speakers?: SpeakerConfig[];
  language: string;
  genre: NarrationGenre;
  audioBase64: string;
  durationSeconds?: number;
  style?: string;
}

export interface SampleScript {
  id: string;
  title: string;
  language: string;
  genre: NarrationGenre;
  suggestedVoice: VoiceName;
  suggestedStyle: string;
  text: string;
  isDialogue?: boolean;
  dialogueTurns?: Array<{ speaker: string; text: string; style?: string }>;
}
