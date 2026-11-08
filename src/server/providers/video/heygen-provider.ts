import { IVideoProvider, VideoGenerateOptions, VideoGenerationResult } from '../types';

export class HeyGenVideoProvider implements IVideoProvider {
  name = 'HeyGen';

  async generateVideo(prompt: string, options: VideoGenerateOptions): Promise<VideoGenerationResult> {
    const apiKey = process.env.HEYGEN_API_KEY;
    const estimatedCostEur = 1.25;

    // 1. If no HeyGen API key configured, return explicit mock notice with zero billed cost
    if (!apiKey) {
      return {
        jobId: `heygen-mock-${Date.now()}`,
        videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        status: 'completed',
        provider: 'HeyGen',
        estimatedCostEur: 0,
        isMock: true,
        notice: 'Clé HEYGEN_API_KEY absente. Vidéo de prévisualisation studio générée sans coût.'
      };
    }

    // 2. Perform Real HeyGen v2 Video Generation Call
    try {
      const dimension = options.aspectRatio === '16:9'
        ? { width: 1920, height: 1080 }
        : { width: 1080, height: 1920 };

      const response = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: options.avatarId || 'default',
                avatar_style: 'normal'
              },
              voice: {
                type: 'text',
                input_text: prompt,
                voice_id: options.voiceId || '21m00Tcm4TlvDq8ikWAM'
              }
            }
          ],
          dimension
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HeyGen API HTTP ${response.status}: ${errText || response.statusText}`);
      }

      const json = await response.json();
      const videoId = json?.data?.video_id || `heygen-${Date.now()}`;

      return {
        jobId: videoId,
        status: 'processing',
        provider: 'HeyGen',
        estimatedCostEur,
        isMock: false
      };
    } catch (err: any) {
      console.error('[HeyGen Provider] Generation failed:', err.message);
      return {
        jobId: `heygen-err-${Date.now()}`,
        videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        status: 'failed',
        provider: 'HeyGen',
        estimatedCostEur: 0,
        isMock: true,
        notice: `Erreur HeyGen (${err.message}).`
      };
    }
  }

  async checkJobStatus(jobId: string): Promise<VideoGenerationResult> {
    const apiKey = process.env.HEYGEN_API_KEY;

    if (!apiKey || jobId.startsWith('heygen-mock')) {
      return {
        jobId,
        videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        status: 'completed',
        provider: 'HeyGen',
        estimatedCostEur: 0,
        isMock: true
      };
    }

    try {
      const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${jobId}`, {
        headers: { 'X-Api-Key': apiKey }
      });

      if (!res.ok) {
        throw new Error(`HeyGen status check failed: ${res.statusText}`);
      }

      const data = await res.json();
      const videoStatus = data?.data?.status; // 'pending' | 'processing' | 'completed' | 'failed'
      const videoUrl = data?.data?.video_url;

      return {
        jobId,
        videoUrl: videoUrl || undefined,
        status: videoStatus === 'completed' ? 'completed' : videoStatus === 'failed' ? 'failed' : 'processing',
        provider: 'HeyGen',
        estimatedCostEur: 1.25,
        isMock: false
      };
    } catch (err: any) {
      return {
        jobId,
        status: 'failed',
        provider: 'HeyGen',
        estimatedCostEur: 0,
        isMock: true,
        notice: err.message
      };
    }
  }
}
