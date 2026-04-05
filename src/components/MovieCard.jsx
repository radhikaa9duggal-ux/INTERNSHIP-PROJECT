import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function MovieCard({ movie, onClick }) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <motion.div
      layoutId={`card-container-${movie.id}`}
      onClick={() => onClick(movie.id)}
      className="cursor-pointer group relative rounded-md overflow-hidden bg-[#0A0A0A] border border-white/5 shadow-2xl hover:border-white/20 transition-all duration-500 flex flex-col"
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        <motion.img
          layoutId={`poster-${movie.id}`}
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>
      
      {/* Info container that sits at the bottom */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 flex flex-col justify-end">
        <motion.h3 
          layoutId={`title-${movie.id}`}
          className="text-lg md:text-xl font-bold text-white line-clamp-1 drop-shadow-lg tracking-tight"
        >
          {movie.title}
        </motion.h3>
        
        <motion.div 
          layoutId={`meta-${movie.id}`}
          className="flex items-center gap-3 text-sm text-neutral-300 mt-2 drop-shadow-md font-medium"
        >
          <div className="flex items-center text-[#D4AF37] bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
            <Star className="w-3.5 h-3.5 fill-current mr-1.5" />
            <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <span className="opacity-50">•</span>
          <span className="opacity-80 tracking-wide text-xs uppercase">{movie.release_date?.substring(0, 4) || 'TBA'}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
