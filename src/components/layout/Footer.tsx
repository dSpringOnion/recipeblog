import Link from 'next/link';
import { GithubIcon, TwitterIcon, MailIcon, HeartIcon, CoffeeCupIcon } from '@/components/icons/CozyIcons';

export function Footer() {
  return (
    <footer className="relative bg-transparent border-t-2 border-coffee-200/60 dark:border-coffee-700">
      {/* Decorative top border (Cyworld style) */}
      <div className="h-1 bg-gradient-to-r from-transparent via-cinnamon-300/40 to-transparent"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand with personal styling */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-coffee-100/50 border border-coffee-200/50">
                <span className="text-2xl">📖</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-coffee-900 dark:text-parchment-50">
                  My Kitchen Diary
                </span>
                <span className="text-xs text-coffee-600/70 dark:text-coffee-400 italic">where recipes come to life ☕</span>
              </div>
            </div>
            <p className="text-coffee-700/80 dark:text-coffee-400 text-sm leading-relaxed italic">
              "This is where I share the recipes I love - from cozy weeknight meals to special treats that warm the heart." ✨
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-coffee-100/50 text-coffee-600 hover:bg-coffee-200/60 hover:text-coffee-800 cozy-transition"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-coffee-100/50 text-coffee-600 hover:bg-coffee-200/60 hover:text-coffee-800 cozy-transition"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@recipecorner.com"
                className="p-2 rounded-lg bg-coffee-100/50 text-coffee-600 hover:bg-coffee-200/60 hover:text-coffee-800 cozy-transition"
              >
                <MailIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Recipes with warm colors */}
          <div>
            <h3 className="font-bold text-coffee-900 dark:text-parchment-50 mb-4 flex items-center gap-2">
              <span>🍽️</span> Recipes
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/recipes" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/recipes?difficulty=easy" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Easy Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipes?tags=vegetarian" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link href="/recipes?tags=vegan" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Vegan
                </Link>
              </li>
              <li>
                <Link href="/recipes?tags=gluten-free" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Gluten-Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-coffee-900 dark:text-parchment-50 mb-4 flex items-center gap-2">
              <span>👥</span> Community
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/recipes/create" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Share a Recipe
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-coffee-900 dark:text-parchment-50 mb-4 flex items-center gap-2">
              <span>📜</span> Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-coffee-700/80 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-parchment-50 cozy-transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-12 pt-8 border-t-2 border-coffee-200/40 dark:border-coffee-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-coffee-700/70 dark:text-coffee-400 text-sm flex items-center gap-2">
              <CoffeeCupIcon className="h-4 w-4" />
              © {new Date().getFullYear()} My Kitchen Diary
            </p>
            <p className="text-coffee-700/70 dark:text-coffee-400 text-sm flex items-center gap-2 italic">
              Made with <HeartIcon className="h-4 w-4 fill-red-400 text-red-400" /> and a pinch of magic ✨
            </p>
          </div>

          {/* Personal decorative element */}
          <div className="mt-6 text-center">
            <p className="text-xs text-coffee-600/60 dark:text-coffee-500 italic">
              📖 Sharing my recipes since 2024 | Every dish tells a story 🍳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}