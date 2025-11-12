import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-latte-100 via-parchment-100 to-coffee-100/30">
      {/* Cyworld-style page frame */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative">
          {/* Dashed border frame (notebook style) */}
          <div className="border-4 border-dashed border-coffee-400/40 rounded-2xl bg-parchment-50/95 backdrop-blur-sm cozy-shadow-lg overflow-hidden">

            {/* Binder ring holes on the left */}
            <div className="absolute left-0 top-20 bottom-20 w-8 flex flex-col justify-around items-center pointer-events-none z-10">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-coffee-300 to-coffee-400 border-2 border-coffee-500/30 shadow-inner"></div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-coffee-300 to-coffee-400 border-2 border-coffee-500/30 shadow-inner"></div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-coffee-300 to-coffee-400 border-2 border-coffee-500/30 shadow-inner"></div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-coffee-300 to-coffee-400 border-2 border-coffee-500/30 shadow-inner"></div>
            </div>

            {/* Visit counter at top (Cyworld style) */}
            <div className="bg-parchment-100/60 border-b-2 border-dashed border-coffee-300/40 px-6 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-coffee-600 italic">
                    TODAY: <span className="font-bold text-cinnamon-600">127</span>
                  </span>
                  <span className="text-coffee-400">|</span>
                  <span className="text-coffee-600 italic">
                    TOTAL: <span className="font-bold text-cinnamon-600">15,842</span>
                  </span>
                </div>
                <span className="text-coffee-600/70 italic text-xs">✨ My Kitchen Diary</span>
              </div>
            </div>

            <Navbar />

            {/* Main content area with sidebar */}
            <div className="flex gap-6 px-6 py-6">
              {/* Sidebar - hidden on mobile */}
              <div className="hidden lg:block">
                <Sidebar />
              </div>

              {/* Main content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}