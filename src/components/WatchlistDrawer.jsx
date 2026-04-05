import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Film, Star } from 'lucide-react';
import { useWatchlistContext } from '../context/WatchlistContext';

export default function WatchlistDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, watchlist, removeFromWatchlist } = useWatchlistContext();

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] backdrop-blur-3xl border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">Watchlist</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-transparent hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar">
              {watchlist.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center flex-1 text-center h-full text-neutral-500"
                >
                  <Film className="w-12 h-12 mb-4 opacity-50" strokeWidth={1} />
                  <p className="text-lg font-medium text-neutral-300">Nothing saved yet</p>
                  <p className="text-sm mt-2 text-neutral-600 max-w-[200px]">Begin exploring the archive.</p>
                </motion.div>
              ) : (
                watchlist.map((movie) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={movie.id} 
                    className="flex bg-black/50 rounded-sm overflow-hidden border border-white/5 group hover:bg-white/5 hover:border-white/20 transition-all shadow-lg"
                  >
                    <div className="w-20 h-32 relative flex-shrink-0 bg-black">
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
                      <div className="mb-auto">
                        <h3 className="font-bold text-white line-clamp-1 tracking-tight">{movie.title}</h3>
                        <div className="flex items-center text-xs text-neutral-400 gap-x-3 mt-1.5">
                           <span className="font-semibold tracking-wide">
                             {movie.release_date?.substring(0, 4) || 'TBA'}
                           </span>
                           <span className="flex items-center text-[#D4AF37]">
                             <Star className="w-3 h-3 mr-1 fill-current"/> 
                             {movie.vote_average?.toFixed(1) || 'N/A'}
                           </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="text-xs flex items-center text-neutral-500 hover:text-white w-max mt-3 transition-colors uppercase tracking-wider font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {watchlist.length > 0 && (
               <div className="p-6 border-t border-white/5 bg-black/50">
                  <div className="flex justify-between items-center text-neutral-400 uppercase tracking-widest text-xs font-bold">
                    <span>Library Size</span>
                    <span className="text-white bg-white/10 px-2 py-0.5 rounded">{watchlist.length}</span>
                  </div>
               </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
