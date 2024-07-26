// src/app/api/generate-referral/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust path to your Prisma client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateUniqueReferralId } from '@/lib/generateReferral';

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const referralId = generateUniqueReferralId();

    await prisma.user.update({
        where: { id: session.user.id },
        data: { referralId },
    });

    return NextResponse.json({ referralId });
}
