// src/app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    const handleSignIn = async () => {
        await signIn('twitter', { callbackUrl: '/dashboard' });
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleSignIn}>Login with Twitter</button>
        </div>
    );
};

export default Login;
