import {
  IVoiceProvider,
  IVideoProvider,
  ILipSyncProvider,
  IImageProvider,
  VoiceGenerateOptions,
  VoiceGenerationResult,
  VideoGenerateOptions,
  VideoGenerationResult,
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

export class AIProviderManager {
  private static instance: AIProviderManager;

  public voiceProviders: Map<string, IVoiceProvider> = new Map();
  public videoProviders: Map<string, IVideoProvider> = new Map();
  public lipSyncProviders: Map<string, ILipSyncProvider> = new Map();
  public imageProviders: Map<string, IImageProvider> = new Map();

  private activeVoiceProvider = 'ElevenLabs';
  private activeVideoProvider = 'HeyGen';
  private activeLipSyncProvider = 'MuseTalk-Serverless';

  private monthlyBudgetLimitEur = parseFloat(process.env.MAX_MONTHLY_AI_BUDGET || '25.0');
  private isSafeSimulationOnly = process.env.AI_SIMULATION_ONLY === 'true';

  private constructor() {
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

  public async syncLips(options: LipSyncOptions): Promise<LipSyncResult> {
    await this.checkBudgetOrThrow(0.10);
    const provider = this.lipSyncProviders.get(this.activeLipSyncProvider) || this.lipSyncProviders.get('MuseTalk-Serverless')!;
    return await provider.syncLips(options);
  }
}

export const aiProviderManager = AIProviderManager.getInstance();
