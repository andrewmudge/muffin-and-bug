import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Debug logging
        console.log('NextAuth Environment Check:');
        console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
        console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
        console.log('ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
        console.log('ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.error('Missing admin credentials in environment variables');
          return null;
        }

        if (credentials.email === adminEmail) {
          try {
            const isValid = await bcrypt.compare(credentials.password, adminPasswordHash);
            if (isValid) {
              console.log('Authentication successful');
              return {
                id: '1',
                email: adminEmail,
                name: 'Admin'
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  debug: true, // Enable debug mode
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile });
      return true;
    },
    async jwt({ token, user }) {
      console.log('JWT callback:', { token, user });
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      return session;
    }
  }
});

export { handler as GET, handler as POST };
