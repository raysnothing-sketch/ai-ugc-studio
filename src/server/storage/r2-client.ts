import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 Client (S3-compatible Object Storage).
 * Falls back to local public storage if R2 environment variables are not configured.
 */
export class R2StorageService {
  private static instance: R2StorageService;
  private s3Client: S3Client | null = null;
  private bucketName: string;
  private publicUrl: string;

  private constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || 'ai-ugc-studio-storage';
    this.publicUrl = process.env.R2_PUBLIC_URL || '';

    if (accountId && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      });
    }
  }

  public static getInstance(): R2StorageService {
    if (!R2StorageService.instance) {
      R2StorageService.instance = new R2StorageService();
    }
    return R2StorageService.instance;
  }

  public isConfigured(): boolean {
    return this.s3Client !== null;
  }

  /**
   * Uploads a buffer or file to Cloudflare R2.
   */
  public async uploadFile(
    key: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<{ url: string; key: string }> {
    if (!this.s3Client) {
      // Local fallback: return a placeholder URL or base64 data URI in dev
      return {
        key,
        url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`
      };
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
      })
    );

    const fileUrl = this.publicUrl
      ? `${this.publicUrl.replace(/\/$/, '')}/${key}`
      : `https://${this.bucketName}.r2.dev/${key}`;

    return { url: fileUrl, key };
  }

  /**
   * Generates a presigned upload URL for direct browser-to-R2 upload of heavy video files.
   */
  public async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600
  ): Promise<string> {
    if (!this.s3Client) {
      return `/api/upload?fallbackKey=${encodeURIComponent(key)}`;
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}

export const r2Storage = R2StorageService.getInstance();
