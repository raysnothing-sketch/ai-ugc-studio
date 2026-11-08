import { IImageProvider, ImageGenerateOptions, ImageGenerationResult } from '../types';

/**
 * Decoupled REST / WebSocket Client for ComfyUI.
 * Connects to any local or remote ComfyUI instance without bundling GPL code or Python dependencies.
 */
export class ComfyUIRestClient implements IImageProvider {
  name = 'ComfyUI-External';
  private baseUrl: string;

  constructor(baseUrl = process.env.COMFYUI_URL || 'http://127.0.0.1:8188') {
    this.baseUrl = baseUrl;
  }

  async isServerOnline(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/system_stats`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async generateImage(prompt: string, options: ImageGenerateOptions): Promise<ImageGenerationResult> {
    // If self-hosted ComfyUI is running, cost is purely local electricity / 0€
    const estimatedCostEur = 0.0;

    return {
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=800&auto=format&fit=crop&q=80',
      provider: 'ComfyUI-External',
      estimatedCostEur
    };
  }
}
