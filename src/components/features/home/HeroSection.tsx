import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecipeBookIcon, PencilIcon } from '@/components/icons/CozyIcons';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-parchment-100 via-latte-50 to-coffee-100">
      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 paper-texture pointer-events-none" />

      {/* Decorative scrapbook elements */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-coffee-200/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-cinnamon-200/20 blur-3xl" />

      {/* Decorative corner doodles (Cyworld style) */}
      <div className="absolute top-6 left-6 text-6xl opacity-20 rotate-12">✨</div>
      <div className="absolute top-6 right-6 text-6xl opacity-20 -rotate-12">☕</div>

      <div className="relative py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Personal welcome note */}
          <div className="inline-block mb-6 px-6 py-3 bg-parchment-50/80 border-2 border-dashed border-coffee-300/50 rounded-2xl cozy-shadow rotate-[-0.5deg]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-sm font-medium text-coffee-700 italic">Welcome to my recipe journal</span>
              <span className="text-2xl">🍳</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-coffee-900 leading-tight">
            My Kitchen Stories &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-600 to-cinnamon-600 relative">
              Favorite Recipes
              {/* Decorative underline */}
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,4 Q25,7 50,4 T100,4" stroke="currentColor" strokeWidth="2" fill="none" className="text-cinnamon-400/40"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-coffee-700/80 max-w-2xl mx-auto leading-relaxed">
            All the recipes I share on social media, collected in one cozy place.
            From coffee creations to comfort food. ☕✨
          </p>

          {/* Recipe Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Coffee Recipes */}
            <Link href="/recipes?category=coffee">
              <div className="bg-white p-6 rounded-xl cozy-shadow-lg hover:cozy-shadow-xl cozy-transition border-2 border-coffee-300/40 rotate-[-1deg] hover:rotate-0 group">
                <div className="text-5xl mb-3 text-center">☕</div>
                <h3 className="text-xl font-bold text-coffee-900 text-center mb-2">Coffee Recipes</h3>
                <p className="text-coffee-700/70 text-sm text-center italic">
                  Espresso drinks, cold brews & more
                </p>
              </div>
            </Link>

            {/* Food Recipes */}
            <Link href="/recipes?category=food">
              <div className="bg-white p-6 rounded-xl cozy-shadow-lg hover:cozy-shadow-xl cozy-transition border-2 border-cinnamon-300/40 rotate-[1deg] hover:rotate-0 group">
                <div className="text-5xl mb-3 text-center">🍳</div>
                <h3 className="text-xl font-bold text-coffee-900 text-center mb-2">Food Recipes</h3>
                <p className="text-coffee-700/70 text-sm text-center italic">
                  From quick bites to comfort meals
                </p>
              </div>
            </Link>
          </div>

          {/* Add recipe button */}
          <div className="mt-12 text-center">
            <Link href="/recipes/create">
              <Button
                size="lg"
                className="bg-cinnamon-500 hover:bg-cinnamon-600 text-parchment-50 cozy-shadow-lg border-2 border-cinnamon-600/30"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Add New Recipe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}