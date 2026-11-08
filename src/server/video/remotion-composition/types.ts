export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
}

export interface SubtitleCue {
  text: string;
  startFrame: number;
  endFrame: number;
  words?: WordTiming[];
}

export interface UgcCompositionProps {
  avatarUrl: string;
  bRollMediaUrls?: string[];
  scriptText: string;
  subtitles: SubtitleCue[];
  ctaText: string;
  brandName?: string;
  brandLogoUrl?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  primaryColor?: string;
  accentColor?: string;
}
