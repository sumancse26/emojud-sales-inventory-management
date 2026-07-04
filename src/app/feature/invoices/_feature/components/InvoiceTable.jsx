import TableCard from '@/components/ui/TableCard';

const TH = 'px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap';
const TD = 'px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap';

const fmt = (n) =>
    Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

function CheckIcon({ yes }) {
    return yes ? (
        <svg className="w-4 h-4 text-emerald-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ) : (
        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function StatusPill({ name }) {
    const map = {
        Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    };
    const cls = map[name] ?? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cls}`}>
            {name ?? '—'}
        </span>
    );
}

export default function InvoiceTable({ invoices = [], onView, onEdit }) {
    if (!invoices.length) {
        return (
            <TableCard title="Invoices">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No invoices yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Create your first sales invoice</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Invoices (${invoices.length})`}>
            <table className="w-full text-left min-w-[860px]">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        <th className={`${TH} w-[5%]`}>Actions</th>
                        <th className={TH}>#</th>
                        <th className={TH}>Invoice No</th>
                        <th className={TH}>Date</th>
                        <th className={TH}>Customer</th>
                        <th className={`${TH} text-right`}>Total Amount</th>
                        <th className={`${TH} text-right`}>Due</th>
                        <th className={TH}>Status</th>
                        <th className={`${TH} text-center`}>Submitted</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {invoices.map((inv, idx) => (
                        <tr key={inv.id ?? idx}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                            <td className={`${TD} w-[5%]`}>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => onView?.(inv.id)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                                        View
                                    </button>
                                    <button onClick={() => onEdit?.(inv)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Edit
                                    </button>
                                </div>
                            </td>
                            <td className={TD}><span className="text-slate-400 tabular-nums">{idx + 1}</span></td>
                            <td className={TD}>
                                <span className="font-mono font-semibold text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    {inv.invoice_no ?? '—'}
                                </span>
                            </td>
                            <td className={TD}><span className="text-xs text-slate-500">{inv.invoice_date ?? '—'}</span></td>
                            <td className={TD}>
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        {inv.customer_name?.charAt(0)?.toUpperCase() ?? '?'}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate">{inv.customer_name ?? '—'}</p>
                                        {inv.phone && <p className="text-[10px] text-slate-400">{inv.phone}</p>}
                                    </div>
                                </div>
                            </td>
                            <td className={`${TD} text-right`}><span className="font-semibold tabular-nums">৳ {fmt(inv.total_amount)}</span></td>
                            <td className={`${TD} text-right`}>
                                <span className={`font-semibold tabular-nums text-xs ${Number(inv.due_amount) > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400'}`}>
                                    ৳ {fmt(inv.due_amount)}
                                </span>
                            </td>
                            <td className={TD}><StatusPill name={inv.tran_status_name} /></td>
                            <td className={`${TD} text-center`}><CheckIcon yes={Number(inv.is_submit) === 1} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
