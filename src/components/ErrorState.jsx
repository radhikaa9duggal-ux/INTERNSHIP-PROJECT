import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message }) {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Something went wrong</h2>
      <p className="text-slate-400 max-w-md">
        {message || "We encountered an unexpected error while fetching movies. Please check your connection and try again."}
      </p>
    </div>
  );
}
