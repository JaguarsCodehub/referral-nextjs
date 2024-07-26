// src/app/dashboard/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const { data: session, status } = useSession();
    console.log(session)
    const [referralLink, setReferralLink] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchReferralLink = async () => {
            if (session?.user?.referralId) {
                setReferralLink(`http://localhost:3000/?referral=${session.user.referralId}`);
            }
        };

        if (session && session.user) {
            fetchReferralLink();
        }
    }, [session]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome, {session?.user?.name}</h1>
            <p>Your referral link: <a href={referralLink}>{referralLink}</a></p>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
};

export default Dashboard;
