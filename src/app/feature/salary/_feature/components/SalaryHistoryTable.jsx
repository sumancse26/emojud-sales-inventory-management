import StatusBadge from '@/components/ui/StatusBadge';
import TableCard from '@/components/ui/TableCard';
import { SALARY_MONTHS } from '@/data';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';

export default function SalaryHistoryTable() {
  return (
    <TableCard title="Salary History">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
          <tr>
            {['Month', 'Employees', 'Total Amount', 'Paid', 'Due', 'Status', ''].map(h => (
              <th key={h} className={TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SALARY_MONTHS.map((sm, i) => (
            <tr key={sm.month} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/40 dark:bg-slate-900/10' : ''}`}>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold text-xs">{sm.month}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{sm.employees}</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold text-xs">{sm.total}</td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 text-xs">{sm.paid}</td>
              <td className="px-4 py-3 text-rose-600 dark:text-rose-400 text-xs">{sm.due}</td>
              <td className="px-4 py-3"><StatusBadge status={sm.status} /></td>
              <td className="px-4 py-3">
                <button className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10">
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}
