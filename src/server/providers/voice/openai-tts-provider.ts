import { IVoiceProvider, VoiceGenerateOptions, VoiceGenerationResult } from '../types';

export class OpenAIVoiceProvider implements IVoiceProvider {
  name = 'OpenAI';

  async generateSpeech(text: string, options: VoiceGenerateOptions): Promise<VoiceGenerationResult> {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDurationSec = Math.max(3, Math.round((wordCount / 150) * 60));
    // OpenAI tts-1 is $0.015 per 1k characters (~0.01€ per standard ad script)
    const estimatedCostEur = parseFloat(((text.length / 1000) * 0.014).toFixed(4));

    return {
      audioUrl: 'https://images.unsplash.com/audio-mock/openai-tts-preview.mp3',
      durationSec: estimatedDurationSec,
      provider: 'OpenAI',
      estimatedCostEur
    };
  }
}
