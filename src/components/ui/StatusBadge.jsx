export default function StatusBadge({ status }) {
  const map = {
    Paid:     'bg-emerald-100 text-emerald-700 ring-emerald-300/60 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30',
    Final:    'bg-emerald-100 text-emerald-700 ring-emerald-300/60 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30',
    Active:   'bg-emerald-100 text-emerald-700 ring-emerald-300/60 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30',
    Pending:  'bg-amber-100  text-amber-700  ring-amber-300/60  dark:bg-amber-500/15  dark:text-amber-400  dark:ring-amber-500/30',
    Partial:  'bg-amber-100  text-amber-700  ring-amber-300/60  dark:bg-amber-500/15  dark:text-amber-400  dark:ring-amber-500/30',
    Draft:    'bg-slate-100  text-slate-600  ring-slate-300/60  dark:bg-slate-500/15  dark:text-slate-400  dark:ring-slate-500/30',
    Due:      'bg-rose-100   text-rose-700   ring-rose-300/60   dark:bg-rose-500/15   dark:text-rose-400   dark:ring-rose-500/30',
    Inactive: 'bg-slate-100  text-slate-500  ring-slate-300/60  dark:bg-slate-500/15  dark:text-slate-500  dark:ring-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 transition-colors ${map[status] ?? 'bg-slate-100 text-slate-600 ring-slate-300/60 dark:bg-slate-700 dark:text-slate-300'}`}>
      {status}
    </span>
  );
}
