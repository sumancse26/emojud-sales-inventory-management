export default function TableCard({ title, action, children }) {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
