'use client';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-96 text-center gap-4 px-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-3xl">⚠️</div>
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Something went wrong</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
          {error?.message ?? 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
