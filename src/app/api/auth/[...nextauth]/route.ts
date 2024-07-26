import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import TwitterProvider from 'next-auth/providers/twitter';
import { prisma } from '@/lib/prisma';
import { generateUniqueReferralId } from '@/lib/generateReferral';

export const authOptions: AuthOptions = {
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: '2.0',
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async signIn({ user }) {
            console.log('User signing in:', user);

            let existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            console.log('Existing user:', existingUser);

            if (!existingUser) {
                existingUser = await prisma.user.create({
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email || null,
                        image: user.image,
                        referralId: generateUniqueReferralId(),
                    },
                });

                console.log('User created:', existingUser);
            }

            if (!existingUser.referralId) {
                const referralId = generateUniqueReferralId();
                await prisma.user.update({
                    where: { id: user.id },
                    data: { referralId },
                });
                user.referralId = referralId;
            }

            return true;
        },
        async session({ session, token }) {
            console.log('Session callback - session before:', session);
            console.log('Session callback - token:', token);
            if (token && token.id) {
                session.user.id = token.id as string;
            }
            console.log('Session callback - session after:', session);
            return session;
        },
        async jwt({ token, user }) {
            console.log('JWT callback - token before:', token);
            if (user) {
                token.id = user.id;
            }
            console.log('JWT callback - token after:', token);
            return token;
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
