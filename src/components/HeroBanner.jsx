import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export default function HeroBanner({ onMovieClick }) {
  const [films, setFilms] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef(null);

  useEffect(() => {
    if (!API_KEY) return;
    fetch(`/tmdb-api/trending/movie/week?api_key=${API_KEY}`)

      .then(r => r.json())
      .then(data => {
        const candidates = (data.results || [])
          .filter(m => m.backdrop_path && m.overview && m.poster_path)
          .slice(0, 8); // top 8 trending films
        setFilms(candidates);
      })
      .catch(err => console.error('Failed to fetch hero films', err));
  }, []);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setActiveIndex(index);
  }, []);

  const next = useCallback(() => {
    goTo((activeIndex + 1) % films.length, 1);
  }, [activeIndex, films.length, goTo]);

  const prev = useCallback(() => {
    goTo((activeIndex - 1 + films.length) % films.length, -1);
  }, [activeIndex, films.length, goTo]);

  // Autoplay
  useEffect(() => {
    if (!films.length) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [films.length, next]);

  // Pause autoplay on hover
  const pauseAutoplay = () => clearInterval(timerRef.current);
  const resumeAutoplay = () => {
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
  };

  if (!films.length) return (
    <div className="w-full h-[65vh] bg-[#0A0A0A] animate-pulse mb-0" />
  );

  const film = films[activeIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${film.backdrop_path}`;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <div
      className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden mb-0"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* ── Background Backdrop (crossfade) ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${film.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={backdropUrl}
            alt={film.title}
            className="w-full h-full object-cover object-[center_20%]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      {/* Top bar blend so navbar reads cleanly over hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

      {/* ── Content (animate per-slide change) ── */}
      <div className="absolute inset-0 flex items-end pb-14 md:pb-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex items-end justify-between gap-8">
          
          {/* Left: text */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${film.id}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">
                Trending This Week
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black text-white tracking-tight leading-none mb-4">
                {film.title}
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed line-clamp-2 mb-8 max-w-md">
                {film.overview}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onMovieClick(film.id)}
                  className="flex items-center gap-2 px-7 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Explore
                </button>
                <button
                  onClick={() => onMovieClick(film.id)}
                  className="flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-white/25 hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Info className="w-4 h-4" />
                  Details
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: poster thumbnail stack */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`poster-${film.id}`}
              custom={direction}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="hidden lg:block flex-shrink-0"
            >
              <div className="w-36 xl:w-44 aspect-[2/3] rounded-sm overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={film.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Dot + Arrow Controls ── */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
        {films.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            className={`transition-all duration-300 rounded-full ${
              i === activeIndex
                ? 'w-8 h-1.5 bg-[#D4AF37]'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 border border-white/10 rounded-full text-white transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/70 border border-white/10 rounded-full text-white transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5">
        <motion.div
          key={activeIndex}
          className="h-full bg-[#D4AF37]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
