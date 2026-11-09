import { IVoiceProvider, VoiceGenerateOptions, VoiceGenerationResult } from '../types';
import { r2Storage } from '@/server/storage/r2-client';

/**
 * OpenAI TTS Voice Provider
 * Features:
 * - Real neural speech generation via OpenAI Audio API (tts-1 / tts-1-hd)
 * - Binary stream upload directly to Cloudflare R2
 * - Transparent zero-cost fallback notice if OPENAI_API_KEY is not configured
 */
export class OpenAIVoiceProvider implements IVoiceProvider {
  name = 'OpenAI';

  async generateSpeech(text: string, options: VoiceGenerateOptions): Promise<VoiceGenerationResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDurationSec = Math.max(3, Math.round((wordCount / 150) * 60));

    // 1. Transparent Zero-Cost Mock Notice if API Key is not provided
    if (!apiKey) {
      return {
        audioUrl: 'https://images.unsplash.com/audio-mock/openai-tts-preview.mp3',
        durationSec: estimatedDurationSec,
        provider: 'OpenAI',
        estimatedCostEur: 0,
        isMock: true,
        notice: 'Clé OPENAI_API_KEY non configurée. Génération simulée sans débit.'
      };
    }

    // 2. Real Neural Audio Generation via OpenAI API
    try {
      const model = options.stability && options.stability > 0.8 ? 'tts-1-hd' : 'tts-1';
      const voice = options.voiceId || 'alloy';

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          input: text,
          voice,
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API HTTP ${response.status}: ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Upload Binary MP3 directly to Cloudflare R2
      const timestamp = Date.now();
      const r2Key = `studio/voice/openai-${voice}-${timestamp}.mp3`;
      const uploadRes = await r2Storage.uploadFile(r2Key, buffer, 'audio/mpeg');

      // Cost for tts-1 is $0.015 per 1,000 characters (~0.014 €)
      const costPerChar = model === 'tts-1-hd' ? 0.00003 : 0.000015;
      const estimatedCostEur = parseFloat((text.length * costPerChar * 0.92).toFixed(4));

      return {
        audioUrl: uploadRes.url,
        r2Key: uploadRes.key,
        durationSec: estimatedDurationSec,
        provider: 'OpenAI',
        estimatedCostEur,
        isMock: false
      };
    } catch (err: any) {
      console.error('[OpenAI TTS] Generation error:', err.message);
      return {
        audioUrl: 'https://images.unsplash.com/audio-mock/openai-tts-preview.mp3',
        durationSec: estimatedDurationSec,
        provider: 'OpenAI',
        estimatedCostEur: 0,
        isMock: true,
        notice: `Erreur de génération OpenAI (${err.message}).`
      };
    }
  }
}
