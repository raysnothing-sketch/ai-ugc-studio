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

export class AIProviderManager {
  private static instance: AIProviderManager;

  public voiceProviders: Map<string, IVoiceProvider> = new Map();
  public videoProviders: Map<string, IVideoProvider> = new Map();
  public lipSyncProviders: Map<string, ILipSyncProvider> = new Map();
  public imageProviders: Map<string, IImageProvider> = new Map();

  private activeVoiceProvider = 'ElevenLabs';
  private activeVideoProvider = 'HeyGen';
  private activeLipSyncProvider = 'MuseTalk-Serverless';

  private totalSpentEur = 0;
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

  private checkBudgetOrThrow(estimatedAddition: number) {
    if (this.isSafeSimulationOnly) {
      throw new Error("Bouclier Anti-Débit Actif : Le mode 'Simulation Sans Frais' est activé. Aucun appel payant n'est débité.");
    }
    if (this.totalSpentEur + estimatedAddition > this.monthlyBudgetLimitEur) {
      throw new Error(
        `Bouclier Anti-Débit Actif : Plafond mensuel strict de ${this.monthlyBudgetLimitEur} € atteint (${this.totalSpentEur.toFixed(2)} € déjà engagés). L'appel est bloqué pour protéger votre compte bancaire.`
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
    this.checkBudgetOrThrow(0.05);
    const provider = this.voiceProviders.get(this.activeVoiceProvider) || this.voiceProviders.get('ElevenLabs')!;
    const res = await provider.generateSpeech(text, options);
    this.totalSpentEur += res.estimatedCostEur;
    return res;
  }

  public async generateVideo(prompt: string, options: VideoGenerateOptions): Promise<VideoGenerationResult> {
    this.checkBudgetOrThrow(1.50);
    const provider = this.videoProviders.get(this.activeVideoProvider) || this.videoProviders.get('HeyGen')!;
    const res = await provider.generateVideo(prompt, options);
    this.totalSpentEur += res.estimatedCostEur;
    return res;
  }

  public async syncLips(options: LipSyncOptions): Promise<LipSyncResult> {
    this.checkBudgetOrThrow(0.10);
    const provider = this.lipSyncProviders.get(this.activeLipSyncProvider) || this.lipSyncProviders.get('MuseTalk-Serverless')!;
    const res = await provider.syncLips(options);
    this.totalSpentEur += res.estimatedCostEur;
    return res;
  }

  public getTotalSpentEur(): number {
    return parseFloat(this.totalSpentEur.toFixed(3));
  }
}

export const aiProviderManager = AIProviderManager.getInstance();
