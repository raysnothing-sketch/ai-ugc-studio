/**
 * FFmpeg Video & Audio Processing Utility.
 * Encapsulates video transcoding, audio multiplexing and mobile platform presets (TikTok, Reels, Shorts).
 */
export interface VideoExportOptions {
  aspectRatio: '9:16' | '16:9' | '1:1';
  fps?: number;
  crf?: number; // Quality: 18 (visually lossless) to 23 (default)
  targetLufs?: number; // E.g. -14 LUFS for TikTok/Instagram
}

export class FFmpegService {
  /**
   * Returns optimized FFmpeg arguments for encoding vertical/horizontal social ads.
   */
  public static getExportPresetArgs(options: VideoExportOptions): string[] {
    const { aspectRatio, fps = 30, crf = 20, targetLufs = -14 } = options;

    let resolution = '1080:1920';
    if (aspectRatio === '16:9') resolution = '1920:1080';
    if (aspectRatio === '1:1') resolution = '1080:1080';

    return [
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      crf.toString(),
      '-vf',
      `scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2,format=yuv420p`,
      '-r',
      fps.toString(),
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-af',
      `loudnorm=I=${targetLufs}:LRA=11:TP=-1.5`,
      '-movflags',
      '+faststart'
    ];
  }

  public static formatTimecode(frame: number, fps = 30): string {
    const totalSeconds = Math.floor(frame / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
