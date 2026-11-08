export interface VoiceGenerateOptions {
  voiceId: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface VoiceGenerationResult {
  audioUrl: string;
  durationSec: number;
  provider: 'ElevenLabs' | 'OpenAI' | 'Kokoro';
  estimatedCostEur: number;
}

export interface VideoGenerateOptions {
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSec?: number;
  resolution?: '720p' | '1080p' | '4k';
  referenceImageUrl?: string;
}

export interface VideoGenerationResult {
  jobId: string;
  videoUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'HeyGen' | 'Runway' | 'Luma' | 'Replicate';
  estimatedCostEur: number;
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
  provider: 'OpenAI-DALL-E' | 'ComfyUI-External' | 'Stability';
  estimatedCostEur: number;
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
