import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-5 bg-slate-100 dark:bg-[#060d17] px-4">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl font-mono shadow-lg shadow-blue-500/30">
        ej
      </div>
      <div>
        <p className="text-7xl font-black text-slate-200 dark:text-slate-800 leading-none">404</p>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Page not found</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/feature/dashboard"
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-md shadow-blue-600/25"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
