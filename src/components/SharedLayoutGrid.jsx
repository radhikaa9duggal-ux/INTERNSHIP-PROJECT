import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import ExpandedMovieDetail from './ExpandedMovieDetail';

export default function SharedLayoutGrid({ movies = [], loading = false }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedMovieOverride, setExpandedMovieOverride] = useState(null);

  // Sync expanded ID from URL on mount and on back/forward
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setExpandedId(id ? Number(id) : null);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const handleSelectMovie = (id) => {
    setExpandedMovieOverride(null);
    setExpandedId(id);
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  };

  const handleCloseMovie = () => {
    setExpandedMovieOverride(null);
    setExpandedId(null);
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  };

  const handleSelectSimilar = async (id) => {
    const existing = movies.find(m => m.id === id);
    if (existing) {
      setExpandedMovieOverride(existing);
    } else {
      try {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const data = await res.json();
        setExpandedMovieOverride(data);
      } catch (e) {
        console.error('Failed to load similar movie', e);
      }
    }
    setExpandedId(id);
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);
  };

  const expandedMovieFromGrid = useMemo(
    () => movies.find(m => m.id === expandedId),
    [movies, expandedId]
  );
  const expandedMovie = expandedMovieOverride || expandedMovieFromGrid;

  // ── Keyboard Navigation ──────────────────────────────────────────
  useEffect(() => {
    if (!expandedId) return; // Only when modal is open

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        handleCloseMovie();
        return;
      }

      const currentIndex = movies.findIndex(m => m.id === expandedId);
      if (currentIndex === -1) return; // expanded is a similar/override movie

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = movies[currentIndex + 1];
        if (next) handleSelectMovie(next.id);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = movies[currentIndex - 1];
        if (prev) handleSelectMovie(prev.id);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedId, movies]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
        {[...Array(15)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!movies.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-neutral-600">
        <p className="text-2xl font-bold text-neutral-400">No results found</p>
        <p className="text-sm mt-3">Try a different search, genre, or rating range.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6 relative z-0">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={handleSelectMovie}
          />
        ))}
      </div>

      <AnimatePresence>
        {expandedId && expandedMovie && (
          <ExpandedMovieDetail
            key={`expanded-${expandedId}`}
            movie={expandedMovie}
            onClose={handleCloseMovie}
            onSelectMovie={handleSelectSimilar}
          />
        )}
      </AnimatePresence>
    </>
  );
}
