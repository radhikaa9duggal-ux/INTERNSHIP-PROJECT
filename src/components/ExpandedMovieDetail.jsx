import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Play, Check, Users, ChevronRight, Share2, Link } from 'lucide-react';
import { useWatchlistContext } from '../context/WatchlistContext';
import { getMovieVideosUrl, getMovieCreditsUrl, getMovieSimilarUrl } from '../services/tmdb';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function ExpandedMovieDetail({ movie, onClose, onSelectMovie }) {
  const { toggleWatchlist, isInWatchlist } = useWatchlistContext();
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [copied, setCopied] = useState(false);
  const inWatchlist = isInWatchlist(movie?.id);

  const handleShare = async () => {
    const url = window.location.href; // already has ?id=... in it
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for http contexts
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Prevent body scroll when the expanded detail is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Fetch credits and similar movies whenever the movie changes
  useEffect(() => {
    if (!movie?.id || !API_KEY) return;
    setTrailerKey(null);
    setCast([]);
    setSimilar([]);

    Promise.all([
      fetch(getMovieCreditsUrl(movie.id, API_KEY)).then(r => r.json()),
      fetch(getMovieSimilarUrl(movie.id, API_KEY)).then(r => r.json()),
    ]).then(([creditsData, similarData]) => {
      setCast(creditsData.cast?.slice(0, 10) || []);
      setSimilar(similarData.results?.slice(0, 12) || []);
    }).catch(err => console.error('Failed to fetch details', err));
  }, [movie?.id]);

  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : 'https://via.placeholder.com/780x1170?text=No+Poster';

  const backdropUrl = movie.backdrop_path || movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Blurred cinematic backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-3xl cursor-pointer"
        {...(backdropUrl && {
          style: {
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        })}
      />
      {/* Extra dark overlay */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* Main card */}
      <motion.div
        layoutId={`card-container-${movie.id}`}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0A0A0A] rounded-md shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col md:flex-row z-10 border border-white/10 overflow-hidden"
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black rounded-full text-white backdrop-blur-md transition-colors border border-white/10 hover:scale-105 active:scale-95"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* LEFT: Poster / Trailer */}
        <div className="w-full md:w-[38%] flex-shrink-0 relative bg-black flex items-stretch">
          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full min-h-[40vh] md:h-full block border-0 flex-1"
            />
          ) : (
            <>
              <motion.img
                layoutId={`poster-${movie.id}`}
                src={posterUrl}
                alt={movie.title}
                className="w-full h-[38vh] md:h-full object-cover object-center block"
              />
              <div className="absolute inset-0 shadow-[inset_-24px_0_48px_-8px_rgba(0,0,0,0.9)] hidden md:block pointer-events-none" />
            </>
          )}
        </div>

        {/* RIGHT: Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 overflow-y-auto text-white flex flex-col no-scrollbar"
        >
          {/* Scrollable content */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-6">

            {/* Title & Meta */}
            <div>
              <motion.h2
                layoutId={`title-${movie.id}`}
                className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4"
              >
                {movie.title}
              </motion.h2>
              <motion.div
                layoutId={`meta-${movie.id}`}
                className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wider font-semibold"
              >
                <div className="flex items-center gap-1.5 text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 rounded-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                </div>
                {movie.original_language && (
                  <span className="text-neutral-500 border border-white/10 px-2 py-1 rounded-sm">
                    {movie.original_language.toUpperCase()}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold mb-3">Synopsis</h3>
              <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                {movie.overview || 'No overview available for this title.'}
              </p>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Cast
                </h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {cast.map((person) => (
                    <div key={person.cast_id ?? person.id} className="flex-shrink-0 text-center w-16">
                      <div className="w-14 h-14 mx-auto rounded-full overflow-hidden bg-neutral-900 border border-white/10 mb-1.5">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                            <Users className="w-5 h-5 text-neutral-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-white text-[10px] font-semibold line-clamp-2 leading-tight">{person.name}</p>
                      <p className="text-neutral-500 text-[9px] line-clamp-1 mt-0.5">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {similar.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold mb-3">More Like This</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {similar.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onSelectMovie(m.id)}
                      className="flex-shrink-0 w-20 group"
                    >
                      <div className="aspect-[2/3] w-full rounded-sm overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-white/25 transition-colors mb-1.5 relative">
                        {m.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 text-neutral-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-white text-[10px] font-semibold line-clamp-2 leading-tight text-left">{m.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons — sticky at bottom */}
          <div className="sticky bottom-0 px-6 md:px-8 lg:px-10 py-5 border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col gap-4 mt-auto">
            {/* Keyboard shortcut hints */}
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-600 font-bold">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">Esc</kbd>
                Close
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">→</kbd>
                Navigate
              </span>
            </div>
            <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                if (trailerKey) return;
                setIsLoadingTrailer(true);
                try {
                  const res = await fetch(getMovieVideosUrl(movie.id, API_KEY));
                  const data = await res.json();
                  const trailer = data.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
                  if (trailer) setTrailerKey(trailer.key);
                  else alert('No official trailer found.');
                } catch (err) {
                  console.error('Failed to fetch trailer', err);
                } finally {
                  setIsLoadingTrailer(false);
                }
              }}
              disabled={isLoadingTrailer || !!trailerKey}
              className={`px-6 py-3 font-bold rounded-sm transition-all flex-1 md:flex-none text-center flex items-center justify-center gap-2 uppercase tracking-widest text-xs border
                ${trailerKey
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-white border-white text-black hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {isLoadingTrailer ? 'Loading...' : trailerKey ? 'Playing' : (
                <><Play className="w-4 h-4 fill-current" /> Trailer</>
              )}
            </button>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`px-6 py-3 font-bold rounded-sm transition-all flex-1 md:flex-none text-center flex items-center justify-center gap-2 uppercase tracking-widest text-xs border
                ${inWatchlist
                  ? 'bg-transparent text-white border-white/50 hover:border-white hover:bg-white/5'
                  : 'bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5'
                }`}
            >
              {inWatchlist ? <><Check className="w-4 h-4" /> Saved</> : 'Save'}
            </button>

            {/* Share / Copy link button */}
            <button
              onClick={handleShare}
              title="Copy link to clipboard"
              className="p-3 rounded-sm border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex-shrink-0"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                  </motion.span>
                ) : (
                  <motion.span key="share" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                    <Share2 className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            </div>{/* end buttons row */}

          {/* Clipboard toast */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest"
              >
                <Link className="w-3 h-3" />
                Link copied to clipboard
              </motion.div>
            )}
          </AnimatePresence>
          </div>{/* end sticky footer */}
        </motion.div>
      </motion.div>
    </div>
  );
}
