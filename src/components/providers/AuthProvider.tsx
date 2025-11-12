'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // DEV MODE: Disable session refetching in development to avoid CLIENT_FETCH_ERROR
  // when email server is not configured
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <SessionProvider
      // In development, disable automatic session fetching
      refetchInterval={isDev ? 0 : 0}
      refetchOnWindowFocus={isDev ? false : true}
      // Provide null session in dev to prevent initial fetch
      session={isDev ? null : undefined}
    >
      {children}
    </SessionProvider>
  );
}