import SalaryHistoryTable from './components/SalaryHistoryTable';
import PayrollDetailTable from './components/PayrollDetailTable';

export default function SalaryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Salary Processing</h2>
          <p className="text-sm text-slate-500 mt-0.5">Monthly payroll management</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-teal-600/25 hover:shadow-teal-500/30">
          + Process Month
        </button>
      </div>
      <SalaryHistoryTable />
      <PayrollDetailTable />
    </div>
  );
}
