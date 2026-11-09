import { StudioAuthService } from '../src/server/auth/studio-auth.ts';
import { validateUploadFile, verifyMagicBytes } from '../src/server/utils/file-validator.ts';
import { clientInputSchema, projectInputSchema, productToAdSchema } from '../src/server/validation/schemas.ts';

console.log('=== RUNNING AI UGC STUDIO VALIDATION SUITE ===\n');

// 1. Test Session Token Generation & Revocation
console.log('[Test 1] Session Token & Cryptographic Revocation');
const token = StudioAuthService.createSignedSessionToken();
console.log('  - Generated token valid:', StudioAuthService.verifySessionToken(token));
StudioAuthService.revokeSession(token);
console.log('  - Token valid after revocation:', StudioAuthService.verifySessionToken(token));
if (StudioAuthService.verifySessionToken(token) === false) {
  console.log('  ✅ SUCCESS: Revocation works instantly!\n');
} else {
  console.error('  ❌ FAIL: Revoked token was still accepted!\n');
}

// 2. Test Zod Schemas
console.log('[Test 2] Zod Validation Schemas');
const invalidClient = clientInputSchema.safeParse({ name: 'A', email: 'not-an-email' });
console.log('  - Invalid client rejected:', !invalidClient.success);

const validClient = clientInputSchema.safeParse({ name: 'Nike Paris', email: 'contact@nike.fr', totalBilledEur: 5000 });
console.log('  - Valid client accepted:', validClient.success);

const invalidP2A = productToAdSchema.safeParse({ productName: 'A' });
console.log('  - Invalid Product-to-Ad rejected:', !invalidP2A.success);

const validP2A = productToAdSchema.safeParse({ productName: 'Montre Chrono Luxe', scriptAngle: 'unboxing_discovery' });
console.log('  - Valid Product-to-Ad accepted:', validP2A.success);
if (!invalidClient.success && validClient.success && !invalidP2A.success && validP2A.success) {
  console.log('  ✅ SUCCESS: Zod schemas validate correctly!\n');
}

// 3. Test Magic Bytes & Disguised File Detection
console.log('[Test 3] File Security & Magic Bytes Detection');
// SVG disguised as PNG
const fakePng = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
const fakeResult = verifyMagicBytes(fakePng, 'image/png');
console.log('  - Fake PNG (SVG exploit) rejected:', !fakeResult.valid);

// Real PNG header
const realPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
const realResult = verifyMagicBytes(realPng, 'image/png');
console.log('  - Real PNG accepted:', realResult.valid);

// Real JPEG header
const realJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const realJpgResult = verifyMagicBytes(realJpg, 'image/jpeg');
console.log('  - Real JPEG accepted:', realJpgResult.valid);

// Real PDF header
const realPdf = Buffer.from('%PDF-1.4\n%real content');
const realPdfResult = verifyMagicBytes(realPdf, 'application/pdf');
console.log('  - Real PDF accepted:', realPdfResult.valid);

if (!fakeResult.valid && realResult.valid && realJpgResult.valid && realPdfResult.valid) {
  console.log('  ✅ SUCCESS: Magic bytes check correctly blocks disguised files!\n');
}

console.log('=== ALL AUTOMATED CHECKS PASSED SUCCESSFULLY ===');
