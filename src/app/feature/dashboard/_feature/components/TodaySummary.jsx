
const STYLE = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', val: 'text-emerald-600 dark:text-emerald-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', val: 'text-blue-600 dark:text-blue-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', val: 'text-rose-600 dark:text-rose-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', val: 'text-amber-600 dark:text-amber-400' },
};

const ICONS = {
  sales: <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />,
  purchase: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.81L23 6H6" /></>,
  expense: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  profit: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
};

const formatSummaryValue = (value) => {
  if (value == null) return '৳ 0';
  if (typeof value === 'number') return `৳ ${value.toLocaleString('en-IN')}`;
  return typeof value === 'string' && value.trim().length > 0 ? value : '৳ 0';
};

const buildTodaySummary = (summary) => {
  if (Array.isArray(summary) && summary.length > 0) {
    return summary;
  }

  if (summary && typeof summary === 'object') {
    return [
      { label: "Today's Sales", value: formatSummaryValue(summary.sales), color: 'emerald', icon: 'sales' },
      { label: "Today's Purchase", value: formatSummaryValue(summary.purchase), color: 'blue', icon: 'purchase' },
      { label: "Today's Expense", value: formatSummaryValue(summary.expense), color: 'rose', icon: 'expense' },
      { label: "Today's Profit", value: formatSummaryValue(summary.profit), color: 'amber', icon: 'profit' },
    ];
  }

  return [
    { label: "Today's Sales", value: 0, color: 'emerald', icon: 'sales' },
    { label: "Today's Purchase", value: 0, color: 'blue', icon: 'purchase' },
    { label: "Today's Expense", value: 0, color: 'rose', icon: 'expense' },
    { label: "Today's Profit", value: 0, color: 'amber', icon: 'profit' },
  ];
};

export default function TodaySummary({ todaySummary }) {
  const items = buildTodaySummary(todaySummary);

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">Today&apos;s Summary</h3>
      <div className="space-y-3.5">
        {items.map(item => {
          const s = STYLE[item.color];
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.text}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[item.icon]}
                </svg>
              </span>
              <p className="flex-1 text-xs text-slate-600 dark:text-slate-400">{item.label}</p>
              <p className={`text-sm font-bold tabular-nums ${s.val}`}>{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
