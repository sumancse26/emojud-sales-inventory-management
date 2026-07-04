import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function ExpenseTable({ expenses = [], onView, onEdit }) {
    if (!expenses.length) {
        return (
            <TableCard title="Expenses">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <p className="text-sm font-medium">No expenses found</p>
                    <p className="text-xs mt-0.5">Create your first expense to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Expenses (${expenses.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Expense No', 'Date', 'Remarks'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((exp, i) => (
                        <tr
                            key={exp.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                        >
                            {/* Actions */}
                            <td className={`${TD} w-[5%]`}>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => onView?.(exp)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(exp)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit
                                    </button>
                                </div>
                            </td>

                            {/* # */}
                            <td className={`${TD} w-12`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>

                            {/* Expense No */}
                            <td className={TD}>
                                <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                                    {exp.expense_no}
                                </span>
                            </td>

                            {/* Date */}
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs`}>
                                {exp.expense_date}
                            </td>

                            {/* Remarks */}
                            <td className={`${TD} text-slate-600 dark:text-slate-300`}>
                                {exp.remarks ? (
                                    <span className="line-clamp-1">{exp.remarks}</span>
                                ) : (
                                    <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
