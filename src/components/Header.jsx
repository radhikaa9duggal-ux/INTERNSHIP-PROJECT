import { useState, useEffect } from 'react';
import { Search, Film, Bookmark, X } from 'lucide-react';
import { useWatchlistContext } from '../context/WatchlistContext';

export default function Header({ searchQuery, onSearchChange }) {
  const { watchlist, setIsDrawerOpen } = useWatchlistContext();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(!!searchQuery);

  // Detect page scroll to switch header from transparent to opaque
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClearSearch = () => {
    onSearchChange('');
    setSearchOpen(false);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-black/90 backdrop-blur-2xl border-b border-white/8 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-transparent border-b border-transparent'
        }
      `}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-6">

        {/* ── Brand ── */}
        <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer group" onClick={() => { onSearchChange(''); setSearchOpen(false); }}>
          <div className="relative">
            <div className="w-8 h-8 border border-white/20 rounded-sm flex items-center justify-center group-hover:border-white transition-colors duration-300">
              <Film className="w-4 h-4 stroke-[1.5] text-white" />
            </div>
            {/* Gold accent dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
          </div>
          <span className="text-white font-black tracking-[0.15em] uppercase text-xl hidden sm:block">
            Cinematic
          </span>
        </div>

        {/* ── Nav Links (desktop) ── */}
        <nav className="hidden lg:flex items-center gap-8 flex-shrink-0">
          {['Discover', 'Trending', 'Top Rated'].map((label) => (
            <button
              key={label}
              onClick={() => onSearchChange('')}
              className="text-neutral-400 hover:text-white text-sm font-semibold tracking-wide transition-colors duration-200 uppercase"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Search (expands inline on click) ── */}
        <div className={`flex items-center transition-all duration-400 ${searchOpen ? 'flex-1 max-w-sm' : 'w-auto'}`}>
          {searchOpen ? (
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-neutral-500 pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search the archive..."
                className="w-full pl-10 pr-9 py-2.5 bg-white/8 border border-white/15 rounded-sm text-white placeholder-neutral-500 text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200 tracking-wide"
              />
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-neutral-400 hover:text-white border border-transparent hover:border-white/20 rounded-sm transition-all duration-200 group"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── Watchlist Button ── */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex items-center gap-2.5 px-4 py-2.5 border border-white/15 rounded-sm text-white hover:bg-white hover:text-black transition-all duration-300 group flex-shrink-0"
          aria-label="Open Watchlist"
        >
          <Bookmark className="w-4 h-4 group-hover:fill-current transition-all duration-200" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
            Watchlist
          </span>
          {watchlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] flex items-center justify-center bg-[#D4AF37] text-black text-[9px] font-black rounded-full border-2 border-black shadow-lg">
              {watchlist.length > 9 ? '9+' : watchlist.length}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}
