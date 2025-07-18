'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function GitHubAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const exchangeToken = async () => {
      if (status !== 'authenticated') return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user?.email,
          name: session.user?.name,
        }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } else {
        console.error('❌ Failed to get token from backend:', data);
        router.push('/login');
      }
    };

    exchangeToken();
  }, [session, status, router]);

  return <p className="text-center mt-20 text-gray-500">⏳ Logging in with GitHub...</p>;
}
