import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGenres } from '../hooks/useGenres';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GenreFilterBar({ selectedGenreId, onSelectGenre }) {
  const genres = useGenres();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  if (!genres.length) return null;

  return (
    <div className="relative flex items-center gap-2 mb-8">
      {/* Left fade + scroll button */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <button
        onClick={() => scroll('left')}
        className="flex-shrink-0 p-2 text-neutral-500 hover:text-white transition-colors z-20"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable pill list */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar flex-1 py-1"
      >
        {/* "All" pill */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectGenre(null)}
          className={`flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-sm border tracking-widest uppercase transition-all duration-200
            ${!selectedGenreId
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30'
            }`}
        >
          All
        </motion.button>

        {genres.map((genre) => (
          <motion.button
            key={genre.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGenre(genre.id === selectedGenreId ? null : genre.id)}
            className={`flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-sm border tracking-widest uppercase transition-all duration-200 whitespace-nowrap
              ${selectedGenreId === genre.id
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30'
              }`}
          >
            {genre.name}
          </motion.button>
        ))}
      </div>

      {/* Right fade + scroll button */}
      <button
        onClick={() => scroll('right')}
        className="flex-shrink-0 p-2 text-neutral-500 hover:text-white transition-colors z-20"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute right-10 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
}
