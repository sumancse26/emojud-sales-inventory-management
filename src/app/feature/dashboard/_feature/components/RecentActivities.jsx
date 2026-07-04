
const ICON_STYLE = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' },
};

const ICONS = {
  blue: <path d="M9 11l3 3L22 4" />,
  emerald: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  rose: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  amber: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></>,
};

export default function RecentActivities({ recentActivities }) {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm dark:shadow-none transition-colors">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Recent Activities</h3>
        <a href="#" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium transition-colors">View All</a>
      </div>
      <div className="p-5 space-y-4">
        {recentActivities?.length > 0 && (recentActivities.map((a, i) => {
          const ic = ICON_STYLE[a.color] ?? ICON_STYLE.blue;
          return (
            <div key={i} className="flex items-start gap-3">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${ic.bg}`}>
                <svg className={`w-3.5 h-3.5 ${ic.activity_type}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[a.color] ?? ICONS.blue}
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">{a.title}</p>
                {a.title && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">by {a.created_by}</p>}
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5">{a.activity_time}</span>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
