import React, { useRef, useEffect, useState, useMemo } from 'react';
import Header from './components/Header';
import SharedLayoutGrid from './components/SharedLayoutGrid';
import GenreFilterBar from './components/GenreFilterBar';
import HeroBanner from './components/HeroBanner';
import SortAndFilterBar from './components/SortAndFilterBar';
import GlobalLoadingBar from './components/GlobalLoadingBar';
import ErrorState from './components/ErrorState';
import { useMovies } from './hooks/useMovies';
import { WatchlistProvider } from './context/WatchlistContext';
import WatchlistDrawer from './components/WatchlistDrawer';

function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [heroMovieId, setHeroMovieId] = useState(null);

  const { movies, loading, loadingMore, error, searchQuery, setSearchQuery, hasMore, loadMore } = useMovies(selectedGenreId);
  const observerTarget = useRef(null);

  // Client-side sort + filter (applied on top of the fetched page)
  const filteredAndSorted = useMemo(() => {
    let result = movies;

    // Rating filter
    if (minRating > 0) {
      result = result.filter(m => (m.vote_average || 0) >= minRating);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'vote_average': return (b.vote_average || 0) - (a.vote_average || 0);
        case 'release_date': return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        case 'title': return (a.title || '').localeCompare(b.title || '');
        case 'popularity':
        default: return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return result;
  }, [movies, minRating, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) loadMore();
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [observerTarget, loadMore, hasMore, loading, loadingMore]);

  // Handle hero click — injects movie ID into SharedLayoutGrid
  const handleHeroMovieClick = (id) => {
    setHeroMovieId(id);
    // Push to URL so SharedLayoutGrid's popstate sync picks it up
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
    // SharedLayoutGrid listens to popstate, but pushState doesn't fire it —
    // so we dispatch it manually
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const isSearchActive = !!searchQuery;

  return (
    <WatchlistProvider>
      <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-white/20 selection:text-white">
        <GlobalLoadingBar loading={loading || loadingMore} />
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <WatchlistDrawer />

        {/* Hero — flush under the fixed header, no top padding */}
        {!isSearchActive && !selectedGenreId && (
          <HeroBanner onMovieClick={handleHeroMovieClick} />
        )}

        {/* Offset when no hero (search/genre active) so content clears fixed header */}
        <main className={`flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${
          isSearchActive || selectedGenreId ? 'pt-[88px]' : ''
        }`}>
          {error ? (
            <ErrorState message={error} />
          ) : (
            <>
              {/* Page title + count */}
              <div className="mb-6 flex justify-between items-end">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {isSearchActive ? 'Search Results' : 'Trending Now'}
                </h2>
                {!loading && (
                  <span className="text-neutral-500 text-sm font-medium tabular-nums">
                    {filteredAndSorted.length} title{filteredAndSorted.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Genre Filter (hidden during search) */}
              {!isSearchActive && (
                <GenreFilterBar
                  selectedGenreId={selectedGenreId}
                  onSelectGenre={setSelectedGenreId}
                />
              )}

              {/* Sort + Rating Filter */}
              <SortAndFilterBar
                minRating={minRating}
                onMinRatingChange={setMinRating}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <SharedLayoutGrid
                movies={filteredAndSorted}
                loading={loading}
              />

              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="h-16 mt-8 flex justify-center items-center">
                {loadingMore && (
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-[#D4AF37]" />
                )}
              </div>
            </>
          )}
        </main>

        <footer className="py-12 text-center text-white/30 text-sm border-t border-white/5 bg-[#0A0A0A]">
          <p className="tracking-[0.25em] uppercase font-bold text-xs">Cinematic Data Explorer</p>
          <p className="mt-2 opacity-40">Frontend Developer Internship Assignment</p>
        </footer>
      </div>
    </WatchlistProvider>
  );
}

export default App;
