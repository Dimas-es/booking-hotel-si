import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are not set');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password');
          }

          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err: any) {
          // Pastikan error dilempar sebagai Error agar next-auth handle dengan benar
          throw new Error(err?.message || 'Internal server error');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        return {
          ...token,
          role: user.role,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.id,
        },
      };
    },
    async signIn({ user, account, profile }: any) {
      try {
        if (account?.provider === "google") {
          const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  provider: account.provider,
                  provider_id: profile.sub,
                  role: 'user',
                }
              ]);

            if (insertError) {
              console.error('Error creating user:', insertError);
              throw new Error('Failed to create user');
            }
          }
        }
        return true;
      } catch (err: any) {
        console.error('signIn callback error:', err);
        throw new Error(err?.message || 'Internal server error');
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 