import { Search, Film } from 'lucide-react';

export default function OverlayUI({ searchQuery, onSearchChange, loading, error }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <header className="p-6 md:p-8 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50 shadow-lg">
            <Film className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              3D Cinematic Explorer
            </h1>
          </div>

          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl leading-5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg transition-all duration-300"
              placeholder="Search the globe..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Overlay */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-6 rounded-2xl">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Bottom Footer Elements can go here if needed */}
      <div className="p-6 w-full text-center pointer-events-auto bg-gradient-to-t from-slate-950/80 to-transparent">
        <p className="text-slate-500 text-sm font-medium tracking-wide">
          Drag to rotate • Scroll to zoom • Click a poster for info
        </p>
      </div>
    </div>
  );
}
