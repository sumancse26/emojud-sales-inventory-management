import StatusBadge from '@/components/ui/StatusBadge';
import TableCard from '@/components/ui/TableCard';
import { EMPLOYEES } from '@/data';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';

export default function PayrollDetailTable() {
  return (
    <TableCard title="May 2026 — Employee Payroll Detail">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
          <tr>
            {['Employee', 'Basic', 'Allowance', 'Net Salary', 'Paid', 'Status', ''].map(h => (
              <th key={h} className={TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EMPLOYEES.map((emp, i) => {
            const basic = parseInt(emp.salary.replace(/[^\d]/g, ''));
            const allowance = Math.round(basic * 0.2);
            const net = basic + allowance;
            return (
              <tr key={emp.code} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/40 dark:bg-slate-900/10' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-teal-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">{emp.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">৳ {basic.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">৳ {allowance.toLocaleString()}</td>
                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">৳ {net.toLocaleString()}</td>
                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 text-xs">৳ {net.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status="Paid" /></td>
                <td className="px-4 py-3">
                  <button className="text-xs text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10">
                    Slip
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
