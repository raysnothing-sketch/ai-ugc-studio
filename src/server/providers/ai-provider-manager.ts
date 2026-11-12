import {
  IVoiceProvider,
  IVideoProvider,
  ILipSyncProvider,
  IImageProvider,
  VoiceGenerateOptions,
  VoiceGenerationResult,
  VideoGenerateOptions,
  VideoGenerationResult,
  ImageGenerateOptions,
  ImageGenerationResult,
  LipSyncOptions,
  LipSyncResult
} from './types';
import { ElevenLabsVoiceProvider } from './voice/elevenlabs-provider';
import { OpenAIVoiceProvider } from './voice/openai-tts-provider';
import { HeyGenVideoProvider } from './video/heygen-provider';
import { RunwayLumaVideoProvider } from './video/runway-luma-provider';
import { MuseTalkCloudProvider } from './lipsync/musetalk-cloud-provider';
import { ComfyUIRestClient } from './image/comfyui-rest-client';
import { db, ensureDatabaseTables } from '@/server/db';
import { providerUsageTable, generationJobsTable } from '@/server/db/schema';
import { FreeAutonomousVoiceProvider } from './voice/free-autonomous-voice-provider';
import { FreeAutonomousVideoProvider } from './video/free-autonomous-video-provider';
import { FreeAutonomousImageProvider } from './image/free-autonomous-image-provider';

export type StudioOperatingMode = 'autonomous_free' | 'cloud_paid';

export class AIProviderManager {
  private static instance: AIProviderManager;

  public voiceProviders: Map<string, IVoiceProvider> = new Map();
  public videoProviders: Map<string, IVideoProvider> = new Map();
  public lipSyncProviders: Map<string, ILipSyncProvider> = new Map();
  public imageProviders: Map<string, IImageProvider> = new Map();

  // Mode 100% Autonome & Gratuit by default (0.00 €)
  private studioMode: StudioOperatingMode = 'autonomous_free';
  private activeVoiceProvider = 'Studio-Free-Voice';
  private activeVideoProvider = 'Studio-Free-Video';
  private activeImageProvider = 'Studio-Free-Image';
  private activeLipSyncProvider = 'MuseTalk-Serverless';

  private monthlyBudgetLimitEur = 0.0;
  private isSafeSimulationOnly = true;

  private constructor() {
    // 100% Free & Autonomous Providers (Velorn / OpenMontage style)
    this.voiceProviders.set('Studio-Free-Voice', new FreeAutonomousVoiceProvider());
    this.videoProviders.set('Studio-Free-Video', new FreeAutonomousVideoProvider());
    this.imageProviders.set('Studio-Free-Image', new FreeAutonomousImageProvider());

    // Optional Cloud Providers (only active if user switches to cloud_paid mode)
    this.voiceProviders.set('ElevenLabs', new ElevenLabsVoiceProvider());
    this.voiceProviders.set('OpenAI', new OpenAIVoiceProvider());

    this.videoProviders.set('HeyGen', new HeyGenVideoProvider());
    this.videoProviders.set('Runway', new RunwayLumaVideoProvider());

    this.lipSyncProviders.set('MuseTalk-Serverless', new MuseTalkCloudProvider());

    this.imageProviders.set('ComfyUI', new ComfyUIRestClient());
  }

  public static getInstance(): AIProviderManager {
    if (!AIProviderManager.instance) {
      AIProviderManager.instance = new AIProviderManager();
    }
    return AIProviderManager.instance;
  }

  public getStudioMode(): StudioOperatingMode {
    return this.studioMode;
  }

  public setStudioMode(mode: StudioOperatingMode) {
    this.studioMode = mode;
    if (mode === 'autonomous_free') {
      this.activeVoiceProvider = 'Studio-Free-Voice';
      this.activeVideoProvider = 'Studio-Free-Video';
      this.activeImageProvider = 'Studio-Free-Image';
      this.monthlyBudgetLimitEur = 0.0;
      this.isSafeSimulationOnly = true;
    } else {
      this.activeVoiceProvider = 'ElevenLabs';
      this.activeVideoProvider = 'HeyGen';
      this.activeImageProvider = 'ComfyUI';
      this.monthlyBudgetLimitEur = 25.0;
      this.isSafeSimulationOnly = false;
    }
  }

  /**
   * Retrieves actual cumulative spent for the current calendar month directly from DB
   */
  public async getMonthlySpentEur(): Promise<number> {
    try {
      await ensureDatabaseTables();
      const records = await db.select().from(providerUsageTable);
      const now = new Date();
      const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const sum = records
        .filter((r: any) => r.recordedAt && String(r.recordedAt).startsWith(currentMonthPrefix))
        .reduce((acc: number, curr: any) => acc + (Number(curr.costEur) || 0), 0);

      return parseFloat(sum.toFixed(4));
    } catch {
      return 0;
    }
  }

  /**
   * Validates budget before executing external paid API calls
   */
  private async checkBudgetOrThrow(estimatedAddition: number): Promise<void> {
    // Mode 100% Autonome & Gratuit generates media locally or via open engines without billing
    if (this.studioMode === 'autonomous_free') {
      return;
    }

    if (this.isSafeSimulationOnly) {
      throw new Error("Bouclier Anti-Débit Actif : Le mode 'Simulation Sans Frais' est activé. Aucun appel payant n'est débité.");
    }

    const currentSpent = await this.getMonthlySpentEur();
    if (currentSpent + estimatedAddition > this.monthlyBudgetLimitEur) {
      throw new Error(
        `Bouclier Anti-Débit Actif : Plafond mensuel strict de ${this.monthlyBudgetLimitEur} € atteint (${currentSpent.toFixed(2)} € déjà engagés ce mois-ci). L'appel est bloqué pour protéger votre compte bancaire.`
      );
    }
  }

  public setMonthlyBudgetLimit(limit: number) {
    this.monthlyBudgetLimitEur = Math.max(0, limit);
  }

  public getMonthlyBudgetLimit(): number {
    return this.monthlyBudgetLimitEur;
  }

  public setSimulationOnly(enabled: boolean) {
    this.isSafeSimulationOnly = enabled;
  }

  public getSimulationOnly(): boolean {
    return this.isSafeSimulationOnly;
  }

  public async generateVoice(text: string, options: VoiceGenerateOptions): Promise<VoiceGenerationResult> {
    await this.checkBudgetOrThrow(0.05);

    const provider = this.voiceProviders.get(this.activeVoiceProvider) || this.voiceProviders.get('ElevenLabs')!;
    const res = await provider.generateSpeech(text, options);

    // Persist usage if not a zero-cost simulation
    if (res.estimatedCostEur > 0) {
      try {
        const jobId = `voice-${Date.now()}`;
        await db.insert(generationJobsTable).values({
          id: jobId,
          provider: res.provider,
          type: 'voice',
          status: 'completed',
          prompt: text.slice(0, 500),
          outputUrl: res.audioUrl,
          r2Key: res.r2Key || null,
          costEur: res.estimatedCostEur,
          durationSec: res.durationSec,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        });

        await db.insert(providerUsageTable).values({
          id: `usage-${Date.now()}`,
          jobId,
          provider: res.provider,
          unitsCount: text.length,
          unitType: 'characters',
          costEur: res.estimatedCostEur,
          recordedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('[AIProviderManager] Usage recording notice:', err);
      }
    }

    return res;
  }

  public async generateVideo(prompt: string, options: VideoGenerateOptions): Promise<VideoGenerationResult> {
    await this.checkBudgetOrThrow(1.50);

    const provider = this.videoProviders.get(this.activeVideoProvider) || this.videoProviders.get('HeyGen')!;
    const res = await provider.generateVideo(prompt, options);

    if (res.estimatedCostEur > 0) {
      try {
        await db.insert(generationJobsTable).values({
          id: res.jobId,
          provider: res.provider,
          type: 'video',
          status: res.status,
          prompt: prompt.slice(0, 500),
          outputUrl: res.videoUrl || null,
          r2Key: res.r2Key || null,
          costEur: res.estimatedCostEur,
          createdAt: new Date().toISOString()
        });

        await db.insert(providerUsageTable).values({
          id: `usage-${Date.now()}`,
          jobId: res.jobId,
          provider: res.provider,
          unitsCount: 1,
          unitType: 'credits',
          costEur: res.estimatedCostEur,
          recordedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('[AIProviderManager] Usage recording notice:', err);
      }
    }

    return res;
  }

  public async generateImage(prompt: string, options: ImageGenerateOptions): Promise<ImageGenerationResult> {
    await this.checkBudgetOrThrow(0.04);

    const provider = this.imageProviders.get(this.activeImageProvider) || this.imageProviders.get('Studio-Free-Image')!;
    const res = await provider.generateImage(prompt, options);

    if (res.estimatedCostEur > 0) {
      try {
        await db.insert(generationJobsTable).values({
          id: `img-${Date.now()}`,
          provider: res.provider,
          type: 'image',
          status: 'completed',
          prompt: prompt.slice(0, 500),
          outputUrl: res.imageUrl || null,
          costEur: res.estimatedCostEur,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('[AIProviderManager] Usage recording notice:', err);
      }
    }

    return res;
  }

  public async checkVideoStatus(jobId: string): Promise<VideoGenerationResult> {
    const provider = this.videoProviders.get(this.activeVideoProvider) || this.videoProviders.get('HeyGen')!;
    if (typeof (provider as any).checkJobStatus === 'function') {
      return await (provider as any).checkJobStatus(jobId);
    }
    return {
      jobId,
      status: 'completed',
      provider: 'HeyGen',
      estimatedCostEur: 0
    };
  }

  public async syncLips(options: LipSyncOptions): Promise<LipSyncResult> {
    await this.checkBudgetOrThrow(0.10);
    const provider = this.lipSyncProviders.get(this.activeLipSyncProvider) || this.lipSyncProviders.get('MuseTalk-Serverless')!;
    return await provider.syncLips(options);
  }
}

export const aiProviderManager = AIProviderManager.getInstance();
