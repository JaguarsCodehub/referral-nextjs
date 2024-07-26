// src/app/api/referral/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust path to your Prisma client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user || !user.referralId) {
        return NextResponse.json({ error: 'Referral ID not found' }, { status: 404 });
    }

    const referralLink = `http://localhost:3000/?referral=${user.referralId}`;

    return NextResponse.json({ referralLink });
}
