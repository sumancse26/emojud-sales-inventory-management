const STATS = [
  { label: 'This Month',  value: '৳ 4,85,000', sub: '12 orders', accent: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/5',   border: 'border-amber-200/60 dark:border-amber-500/20' },
  { label: 'Due Payment', value: '৳ 1,20,500', sub: '3 pending',  accent: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-500/5',     border: 'border-rose-200/60 dark:border-rose-500/20' },
  { label: 'Suppliers',   value: '38 active',  sub: '5 new this month', accent: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/5',   border: 'border-blue-200/60 dark:border-blue-500/20' },
];

export default function PurchaseStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATS.map(c => (
        <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} p-5 transition-colors duration-300`}>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{c.label}</p>
          <p className={`text-2xl font-bold mt-1.5 ${c.accent}`}>{c.value}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
