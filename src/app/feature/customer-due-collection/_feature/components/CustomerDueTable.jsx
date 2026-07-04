import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const PaymentStatusPill = ({ status }) => {
    const st = Number(status);
    if (st === 2) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Paid
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
            Partial
        </span>
    );
};

export default function CustomerDueTable({ dues = [], onEdit }) {
    if (!dues.length) {
        return (
            <TableCard title="Customer Due Collection History">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h16" />
                    </svg>
                    <p className="text-sm font-medium">No customer due collections found</p>
                    <p className="text-xs mt-0.5">Create your first due collection from pending customers.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Customer Due Collection History (${dues.length})`}>
            <table className="w-full text-sm min-w-175">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['#', 'Invoice No', 'Date', 'Customer', 'Total', 'Paid', 'Due', 'Status', 'Remarks', 'Action'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dues.map((due, index) => (
                        <tr key={due.id ?? `${due.invoice_no}-${index}`} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${index % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                            <td className={`${TD} w-10`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
                            </td>
                            <td className={TD}>
                                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">{due.invoice_no}</span>
                            </td>
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap`}>{due.due_date}</td>
                            <td className={TD}>
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">{due.customer_name?.charAt(0)?.toUpperCase() ?? 'C'}</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{due.customer_name}</span>
                                </div>
                            </td>
                            <td className={`${TD} text-slate-700 dark:text-slate-300 tabular-nums`}>৳ {fmt(due.total_amount)}</td>
                            <td className={`${TD} text-slate-700 dark:text-slate-300 tabular-nums`}>৳ {fmt(due.paid_amount)}</td>
                            <td className={`${TD} tabular-nums ${Number(due.due_amount) > 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}`}>৳ {fmt(due.due_amount)}</td>
                            <td className={TD}><PaymentStatusPill status={due.payment_status} /></td>
                            <td className={`${TD} text-xs text-slate-500 dark:text-slate-400 max-w-64`}>
                                <span className="line-clamp-2">{due.remarks || '—'}</span>
                            </td>
                            <td className={TD}>
                                <button
                                    type="button"
                                    onClick={() => onEdit?.(due)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-200/70 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}