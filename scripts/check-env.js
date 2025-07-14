// This file runs at build time and injects environment variables into the Next.js build
// It's a workaround for Amplify's environment variable issues with server-side functions

console.log('🔧 Build-time environment variable injection script');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Available environment variables:');

// List all environment variables that start with common prefixes
const envVars = Object.keys(process.env).filter(key => 
  key.startsWith('NEXTAUTH_') || 
  key.startsWith('AUTH_') || 
  key.startsWith('ADMIN_') ||
  key.startsWith('AWS_')
);

envVars.forEach(key => {
  console.log(`${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`);
});

// If we're in Amplify build environment, try to access SSM parameters
if (process.env.AWS_AMPLIFY_DEPLOYMENT_ID) {
  console.log('🚀 Running in Amplify build environment');
  console.log('AWS_AMPLIFY_DEPLOYMENT_ID:', process.env.AWS_AMPLIFY_DEPLOYMENT_ID);
}

console.log('✅ Build-time environment check complete');
