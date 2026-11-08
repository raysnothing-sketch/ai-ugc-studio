import { IVoiceProvider, VoiceGenerateOptions, VoiceGenerationResult } from '../types';
import { r2Storage } from '@/server/storage/r2-client';

export class ElevenLabsVoiceProvider implements IVoiceProvider {
  name = 'ElevenLabs';

  async generateSpeech(text: string, options: VoiceGenerateOptions): Promise<VoiceGenerationResult> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDurationSec = Math.max(3, Math.round((wordCount / 150) * 60));
    // ~$0.30 per 1,000 characters -> ~0.02€ per 30s UGC script
    const estimatedCostEur = parseFloat(((text.length / 1000) * 0.28).toFixed(4));

    // 1. If API key is not configured, return explicit mock notice with zero billed cost
    if (!apiKey) {
      return {
        audioUrl: 'https://images.unsplash.com/audio-mock/elevenlabs-preview.mp3',
        durationSec: estimatedDurationSec,
        provider: 'ElevenLabs',
        estimatedCostEur: 0,
        isMock: true,
        notice: 'Clé ELEVENLABS_API_KEY absente. Audio de prévisualisation studio généré sans coût.'
      };
    }

    // 2. Perform Real ElevenLabs API Call
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API HTTP ${response.status}: ${errText || response.statusText}`);
      }

      // 3. Receive Real Binary MP3 Audio Stream
      const audioBuffer = Buffer.from(await response.arrayBuffer());
      const r2Key = `studio/voice/elevenlabs-${Date.now()}-${options.voiceId.slice(0, 8)}.mp3`;

      // 4. Store Real MP3 in Cloudflare R2
      const uploadRes = await r2Storage.uploadFile(r2Key, audioBuffer, 'audio/mpeg');

      return {
        audioUrl: uploadRes.url,
        durationSec: estimatedDurationSec,
        provider: 'ElevenLabs',
        estimatedCostEur,
        r2Key,
        isMock: false
      };
    } catch (err: any) {
      console.error('[ElevenLabs Provider] Real generation failed:', err.message);
      // Fallback with explicit error notification
      return {
        audioUrl: 'https://images.unsplash.com/audio-mock/elevenlabs-preview.mp3',
        durationSec: estimatedDurationSec,
        provider: 'ElevenLabs',
        estimatedCostEur: 0,
        isMock: true,
        notice: `Erreur ElevenLabs (${err.message}). Audio de secours utilisé.`
      };
    }
  }
}
