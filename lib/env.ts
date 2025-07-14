// Environment configuration with fallbacks
export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || '750ba3f7aa4554926143b72bbe48e314511a31d91ad78864abe07df190f2270a',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://main.dtxq3d0owqh57.amplifyapp.com',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'mudge.andrew@gmail.com',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || '$2b$12$.K8Z1IocZSIQgmQN7OYfD.9RI2sAbDNLhIDL7l1DuLdd.OfX6/.Wi',
};

// Debug logging
console.log('Environment configuration loaded:', {
  NEXTAUTH_SECRET: env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
  NEXTAUTH_URL: env.NEXTAUTH_URL ? 'SET' : 'MISSING',
  ADMIN_EMAIL: env.ADMIN_EMAIL ? 'SET' : 'MISSING',
  ADMIN_PASSWORD_HASH: env.ADMIN_PASSWORD_HASH ? 'SET' : 'MISSING',
});
