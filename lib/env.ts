// Environment configuration - all values must come from environment variables
export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
};

// Validate critical environment variables
const requiredEnvVars = ['NEXTAUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
const missingVars = requiredEnvVars.filter(varName => !env[varName as keyof typeof env]);

if (missingVars.length > 0) {
  console.error('CRITICAL: Missing required environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Debug logging (safe - no actual values)
console.log('Environment configuration loaded:', {
  NEXTAUTH_SECRET: env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
  NEXTAUTH_URL: env.NEXTAUTH_URL ? 'SET' : 'MISSING',
  ADMIN_EMAIL: env.ADMIN_EMAIL ? 'SET' : 'MISSING',
  ADMIN_PASSWORD_HASH: env.ADMIN_PASSWORD_HASH ? 'SET' : 'MISSING',
});
