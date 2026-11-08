import { IVideoProvider, VideoGenerateOptions, VideoGenerationResult } from '../types';

export class HeyGenVideoProvider implements IVideoProvider {
  name = 'HeyGen';

  async generateVideo(prompt: string, options: VideoGenerateOptions): Promise<VideoGenerationResult> {
    const estimatedCostEur = 1.25;

    return {
      jobId: `heygen-job-${Date.now()}`,
      videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      status: 'completed',
      provider: 'HeyGen',
      estimatedCostEur
    };
  }

  async checkJobStatus(jobId: string): Promise<VideoGenerationResult> {
    return {
      jobId,
      videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      status: 'completed',
      provider: 'HeyGen',
      estimatedCostEur: 1.25
    };
  }
}
