// Server-side environment configuration with multiple fallbacks
import fs from 'fs';
import path from 'path';

// Try to load environment variables from various sources
function loadServerEnv() {
  // 1. First try process.env (standard)
  if (process.env.NEXTAUTH_SECRET) {
    console.log('✅ Using process.env environment variables');
    return {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    };
  }
  
  // 2. Try to load from server-env.json (created during build)
  try {
    const serverEnvPath = path.join(process.cwd(), 'lib', 'server-env.json');
    if (fs.existsSync(serverEnvPath)) {
      const serverEnv = JSON.parse(fs.readFileSync(serverEnvPath, 'utf8'));
      console.log('✅ Using server-env.json environment variables');
      return serverEnv;
    }
  } catch (error) {
    console.log('❌ Failed to load server-env.json:', error.message);
  }
  
  // 3. Try runtime config from Next.js
  try {
    const getConfig = require('next/config').default;
    const config = getConfig();
    if (config?.serverRuntimeConfig) {
      console.log('✅ Using Next.js serverRuntimeConfig');
      return config.serverRuntimeConfig;
    }
  } catch (error) {
    console.log('❌ Failed to load Next.js runtime config:', error.message);
  }
  
  // 4. Final fallback - return empty object
  console.log('❌ No environment variables found, using empty configuration');
  return {
    NEXTAUTH_SECRET: '',
    NEXTAUTH_URL: 'https://main.dtxq3d0owqh57.amplifyapp.com',
    ADMIN_EMAIL: '',
    ADMIN_PASSWORD_HASH: '',
  };
}

export const serverEnv = loadServerEnv();

// Validation
const requiredEnvVars = ['NEXTAUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
const missingVars = requiredEnvVars.filter(varName => !serverEnv[varName]);

if (missingVars.length > 0) {
  console.error('CRITICAL: Missing required environment variables:', missingVars);
  console.error('Available environment variables:', Object.keys(serverEnv));
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Debug logging (safe - no actual values)
console.log('Server environment configuration loaded:', {
  NEXTAUTH_SECRET: serverEnv.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
  NEXTAUTH_URL: serverEnv.NEXTAUTH_URL ? 'SET' : 'MISSING',
  ADMIN_EMAIL: serverEnv.ADMIN_EMAIL ? 'SET' : 'MISSING',
  ADMIN_PASSWORD_HASH: serverEnv.ADMIN_PASSWORD_HASH ? 'SET' : 'MISSING',
});
