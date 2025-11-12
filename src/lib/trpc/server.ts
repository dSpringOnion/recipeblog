import { cache } from 'react';
import { createTRPCProxyClient, loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCMsw } from 'msw-trpc';
import { type AppRouter } from '@/server/routers/_app';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

export const createCaller = cache(() =>
  api
);