import { APPROVAL_QUEUE } from '@/data';

const STYLE = {
  amber:   { bg: 'bg-amber-100 dark:bg-amber-500/15',   text: 'text-amber-600 dark:text-amber-400',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'   },
  blue:    { bg: 'bg-blue-100 dark:bg-blue-500/15',     text: 'text-blue-600 dark:text-blue-400',     badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'     },
  rose:    { bg: 'bg-rose-100 dark:bg-rose-500/15',     text: 'text-rose-600 dark:text-rose-400',     badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'     },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
};

export default function ApprovalQueue() {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm dark:shadow-none transition-colors">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Approval Queue</h3>
        <a href="#" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium transition-colors">View All</a>
      </div>
      <div className="p-5 space-y-3.5">
        {APPROVAL_QUEUE.map(item => {
          const s = STYLE[item.color];
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                <svg className={`w-4 h-4 ${s.text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </span>
              <p className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${s.badge}`}>{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
