import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import { useEffect, useRef } from 'react';

export default function MovieGrid({ movies, loading, isSearch, loadMore, hasMore, loadingMore }) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      // Trigger when the target is 200px close to entering the screen
      { rootMargin: '200px' } 
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  if (loading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center">
        <div className="text-slate-500 text-lg">
          {isSearch 
            ? "No movies found matching your search." 
            : "No movies available right now."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        {movies.map((movie, index) => (
          <MovieCard
            // Using index fallback incase TMDB returns duplicate movies in subsequent pages
            key={`${movie.id}-${index}`}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            voteAverage={movie.vote_average}
            overview={movie.overview}
            genreIds={movie.genre_ids}
          />
        ))}
        
        {/* Append skeleton cards inline if we are fetching the next page */}
        {loadingMore && Array.from({ length: 5 }).map((_, idx) => (
          <SkeletonCard key={`skeleton-more-${idx}`} />
        ))}
      </div>
      
      {/* Invisible sentinel for the IntersectionObserver */}
      {hasMore && (
        <div ref={observerTarget} className="h-4 w-full" aria-hidden="true" />
      )}
    </>
  );
}
