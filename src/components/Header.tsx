import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-900">
          <ShoppingBag className="h-6 w-6 text-amber-500" />
          <span>Sosta Bazar</span>
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-emerald-800">
          <Link href="/deals" className="hover:text-amber-600 transition-colors">
            Deals
          </Link>
          <Link href="/stores" className="hover:text-amber-600 transition-colors">
            Stores
          </Link>
        </nav>
      </div>
    </header>
  );
}
