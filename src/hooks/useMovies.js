import { useState, useEffect, useCallback, useRef } from 'react';
import { getPopularMoviesUrl, getSearchMoviesUrl, TMDB_BASE_URL } from '../services/tmdb';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


export function useMovies(selectedGenreId = null) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('q') || '';
  });

  // Sync searchQuery to the URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [searchQuery]);

  // Build the correct URL depending on query / genre / popular
  const buildUrl = useCallback((query, pageNum) => {
    if (query) return getSearchMoviesUrl(query, API_KEY, pageNum);
    if (selectedGenreId) {
      return `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenreId}&sort_by=popularity.desc&page=${pageNum}`;
    }
    return getPopularMoviesUrl(API_KEY, pageNum);
  }, [selectedGenreId]);

  const fetchMovies = useCallback(async (query, pageNum = 1, append = false) => {
    if (!API_KEY) {
      setError('Missing TMDB API Key.');
      setLoading(false);
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setPage(1);
    }
    setError(null);

    try {
      const url = buildUrl(query, pageNum);
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      const fetchedMovies = data.results || [];

      if (append) {
        setMovies(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          return [...prev, ...fetchedMovies.filter(m => !existingIds.has(m.id))];
        });
      } else {
        setMovies(fetchedMovies);
      }

      setHasMore(data.page < data.total_pages);
      setPage(data.page);

    } catch (err) {
      setError(err.message || 'Failed to fetch movies.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildUrl]);

  // Re-fetch whenever searchQuery OR selectedGenreId changes (with debounce on search)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      fetchMovies(searchQuery, 1, false);
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchMovies(searchQuery, 1, false);
    }, searchQuery ? 500 : 0); // instant refetch on genre change, debounced on search

    return () => clearTimeout(timer);
  }, [searchQuery, fetchMovies]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      fetchMovies(searchQuery, page + 1, true);
    }
  }, [fetchMovies, searchQuery, page, loadingMore, hasMore, loading]);

  return {
    movies,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
    searchQuery,
    setSearchQuery,
  };
}
