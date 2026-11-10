import 'dotenv/config';

export interface AppEnv {
  baseUrl: string;
  username: string;
  password: string;
  verificationCode: string;
  mfaTimeoutMs: number;
  headless: boolean;
}

export const env: AppEnv = {
  baseUrl:
    process.env.SF_BASE_URL ??
    'https://dko000000skbiuag.lightning.force.com/one/one.app',
  username: process.env.SF_USERNAME ?? '',
  password: process.env.SF_PASSWORD ?? '',
  verificationCode: process.env.SF_VERIFICATION_CODE ?? '',
  mfaTimeoutMs: Number(process.env.SF_MFA_TIMEOUT_MS ?? 300_000),
  headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
};
