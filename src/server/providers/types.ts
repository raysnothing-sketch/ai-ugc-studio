export interface VoiceGenerateOptions {
  voiceId: string;
  language?: string;
  speed?: number;
  pitch?: number;
  model?: string;
  stability?: number;
}

export interface VoiceGenerationResult {
  audioUrl: string;
  durationSec: number;
  provider: 'Studio-Free-Voice' | 'ElevenLabs' | 'OpenAI' | 'Kokoro';
  estimatedCostEur: number;
  r2Key?: string;
  isMock?: boolean;
  notice?: string;
}

export interface VideoGenerateOptions {
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSec?: number;
  resolution?: '720p' | '1080p' | '4k';
  referenceImageUrl?: string;
  avatarId?: string;
  voiceId?: string;
}

export interface VideoGenerationResult {
  jobId: string;
  videoUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'Studio-Free-Video' | 'ComfyUI-Local' | 'HeyGen' | 'Runway' | 'Luma' | 'Replicate';
  estimatedCostEur: number;
  r2Key?: string;
  isMock?: boolean;
  notice?: string;
}

export interface LipSyncOptions {
  videoUrl: string;
  audioUrl: string;
  useFloat16?: boolean;
}

export interface LipSyncResult {
  jobId: string;
  videoUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'MuseTalk-Serverless' | 'HeyGen';
  estimatedCostEur: number;
}

export interface ImageGenerateOptions {
  aspectRatio: '1:1' | '9:16' | '16:9';
  style?: string;
  brandPalette?: string[];
}

export interface ImageGenerationResult {
  imageUrl: string;
  provider: 'OpenAI-DALL-E' | 'ComfyUI-External' | 'Stability' | 'Studio-Free-Image' | 'ComfyUI-Local';
  estimatedCostEur: number;
  prompt?: string;
  notice?: string;
}

export interface IVoiceProvider {
  name: string;
  generateSpeech(text: string, options: VoiceGenerateOptions): Promise<VoiceGenerationResult>;
}

export interface IVideoProvider {
  name: string;
  generateVideo(prompt: string, options: VideoGenerateOptions): Promise<VideoGenerationResult>;
  checkJobStatus(jobId: string): Promise<VideoGenerationResult>;
}

export interface ILipSyncProvider {
  name: string;
  syncLips(options: LipSyncOptions): Promise<LipSyncResult>;
}

export interface IImageProvider {
  name: string;
  generateImage(prompt: string, options: ImageGenerateOptions): Promise<ImageGenerationResult>;
}
