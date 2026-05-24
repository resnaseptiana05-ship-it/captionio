export type Platform = 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'facebook';

export type Tone = 
  | 'professional' 
  | 'casual' 
  | 'inspiring' 
  | 'witty' 
  | 'persuasive' 
  | 'bold' 
  | 'informative' 
  | 'aesthetic';

export type CopywritingFramework = 'simple' | 'aida' | 'pas' | 'storytelling' | 'hook-body-cta';

export type CaptionLength = 'short' | 'medium' | 'long';

export type Language = 'id' | 'en';

export interface GenerationRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  framework: CopywritingFramework;
  length: CaptionLength;
  includeHashtags: boolean;
  hashtagCount: number;
  includeEmojis: boolean;
  language: Language;
}

export interface GeneratedCaption {
  id: string;
  text: string;
  hook: string;
  body: string;
  cta: string;
}

export interface GenerationResponse {
  captions: GeneratedCaption[];
  alternativeHooks: string[];
  alternativeCtas: string[];
  hashtags: string[];
}

export interface SavedCaption {
  id: string;
  topic: string;
  platform: Platform;
  tone: Tone;
  text: string;
  savedAt: string;
}
