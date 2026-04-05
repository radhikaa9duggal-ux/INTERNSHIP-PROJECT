import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'vote_average' },
  { label: 'Release Date', value: 'release_date' },
  { label: 'Title A–Z', value: 'title' },
];

export default function SortAndFilterBar({ minRating, onMinRatingChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#0A0A0A] border border-white/5 rounded-sm">
      {/* Sort dropdown */}
      <div className="flex items-center gap-3 flex-1 min-w-[180px]">
        <ArrowUpDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold whitespace-nowrap">Sort by</label>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer appearance-none border-b border-white/10 pb-0.5 hover:border-white/30 transition-colors"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0A0A] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-white/10 hidden sm:block" />

      {/* Rating slider */}
      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
        <SlidersHorizontal className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold whitespace-nowrap">
          Min Rating
        </label>
        <div className="flex items-center gap-2 flex-1">
          <input
            type="range"
            min="0"
            max="9"
            step="0.5"
            value={minRating}
            onChange={e => onMinRatingChange(Number(e.target.value))}
            className="flex-1 accent-[#D4AF37] cursor-pointer h-1"
          />
          <span className="text-[#D4AF37] font-bold text-sm w-8 text-right tabular-nums">
            {minRating > 0 ? `${minRating}+` : 'All'}
          </span>
        </div>
      </div>
    </div>
  );
}
