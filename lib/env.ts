// Environment configuration - all values must come from environment variables
// This file is deprecated in favor of server-env.ts for better Amplify support
import { serverEnv } from './server-env';

export const env = serverEnv;
