import '@/styles/globals.css';
import { Inter, Caveat } from 'next/font/google';
import { TRPCProvider } from '@/components/providers/TRPCProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
});

export const metadata = {
  title: 'My Kitchen Diary - Recipe Collection',
  description: 'My personal recipe journal - sharing the dishes I love making and the stories behind them',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${caveat.variable}`}>
        <AuthProvider>
          <TRPCProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  );
}