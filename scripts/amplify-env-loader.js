// Custom environment variable loader for Amplify
// This will try to load environment variables from various sources

const fs = require('fs');
const path = require('path');

function loadAmplifyEnvVars() {
  console.log('🔧 Loading Amplify environment variables...');
  
  // Check if we're in Amplify build environment
  if (process.env.AWS_AMPLIFY_DEPLOYMENT_ID) {
    console.log('✅ Amplify build environment detected');
    
    // Try to read from Amplify's environment variable format
    const amplifyEnvPath = '/tmp/amplify-env.json';
    if (fs.existsSync(amplifyEnvPath)) {
      try {
        const amplifyEnv = JSON.parse(fs.readFileSync(amplifyEnvPath, 'utf8'));
        console.log('📦 Loaded Amplify environment variables from file');
        return amplifyEnv;
      } catch (error) {
        console.log('❌ Failed to read Amplify environment file:', error.message);
      }
    }
  }
  
  // Fallback to process.env
  console.log('📋 Using process.env fallback');
  return process.env;
}

// Create a .env.runtime file for Next.js to use
function createRuntimeEnvFile() {
  const envVars = loadAmplifyEnvVars();
  
  const runtimeEnvContent = `# Runtime environment variables for Next.js
NEXTAUTH_URL=${envVars.NEXTAUTH_URL || 'https://main.dtxq3d0owqh57.amplifyapp.com'}
NEXTAUTH_SECRET=${envVars.NEXTAUTH_SECRET || envVars.AUTH_SECRET || ''}
ADMIN_EMAIL=${envVars.ADMIN_EMAIL || ''}
ADMIN_PASSWORD_HASH=${envVars.ADMIN_PASSWORD_HASH || ''}
`;

  fs.writeFileSync(path.join(__dirname, '..', '.env.runtime'), runtimeEnvContent);
  console.log('✅ Created .env.runtime file');
  
  // Also create a JSON file for server-side access
  const serverEnvContent = {
    NEXTAUTH_URL: envVars.NEXTAUTH_URL || 'https://main.dtxq3d0owqh57.amplifyapp.com',
    NEXTAUTH_SECRET: envVars.NEXTAUTH_SECRET || envVars.AUTH_SECRET || '',
    ADMIN_EMAIL: envVars.ADMIN_EMAIL || '',
    ADMIN_PASSWORD_HASH: envVars.ADMIN_PASSWORD_HASH || ''
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'lib', 'server-env.json'), 
    JSON.stringify(serverEnvContent, null, 2)
  );
  console.log('✅ Created server-env.json file');
}

if (require.main === module) {
  createRuntimeEnvFile();
}

module.exports = { loadAmplifyEnvVars, createRuntimeEnvFile };
