import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { serverEnv } from '@/lib/server-env';

// Debug all environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All process.env keys:', Object.keys(process.env).sort());
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXTAUTH_SECRET length:', process.env.NEXTAUTH_SECRET?.length);
console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);
console.log('AUTH_SECRET length:', process.env.AUTH_SECRET?.length);
console.log('ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
console.log('ADMIN_EMAIL value:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
console.log('ADMIN_PASSWORD_HASH length:', process.env.ADMIN_PASSWORD_HASH?.length);
console.log('=== END DEBUG ===');

// Use server environment configuration
console.log('Using server environment configuration...');
console.log('Server env NEXTAUTH_SECRET exists:', !!serverEnv.NEXTAUTH_SECRET);
console.log('Server env ADMIN_EMAIL exists:', !!serverEnv.ADMIN_EMAIL);
console.log('Server env ADMIN_PASSWORD_HASH exists:', !!serverEnv.ADMIN_PASSWORD_HASH);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize function called');
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const adminEmail = serverEnv.ADMIN_EMAIL;
        const adminPasswordHash = serverEnv.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.error('CRITICAL: Admin credentials not found in server environment');
          return null;
        }

        console.log('Checking credentials for:', credentials.email);
        console.log('Admin email:', adminEmail);

        if (credentials.email === adminEmail) {
          try {
            const isValid = await bcrypt.compare(credentials.password, adminPasswordHash);
            if (isValid) {
              console.log('Authentication successful');
              return {
                id: '1',
                email: adminEmail,
                name: 'Admin',
                role: 'admin'
              };
            } else {
              console.log('Password validation failed');
            }
          } catch (error) {
            console.error('bcrypt.compare error:', error);
          }
        } else {
          console.log('Email does not match admin email');
        }

        return null;
      }
    })
  ],
  secret: serverEnv.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - token:', token, 'user:', user);
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session, 'token:', token);
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
