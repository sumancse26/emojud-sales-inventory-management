import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const StatusPill = ({ name }) => {
    const map = {
        Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
        Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
        Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400',
    };
    const cls = map[name] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
            {name ?? '—'}
        </span>
    );
};

const CheckIcon = ({ yes }) => yes ? (
    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
) : (
    <svg className="w-4 h-4 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
    </svg>
);

export default function PurchaseTable({ purchases = [], onView, onEdit }) {
    if (!purchases.length) {
        return (
            <TableCard title="Purchase Orders">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                    </svg>
                    <p className="text-sm font-medium">No purchase orders found</p>
                    <p className="text-xs mt-0.5">Create your first purchase to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Purchase Orders (${purchases.length})`}>
            <table className="w-full text-sm min-w-175">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Purchase No', 'Date', 'Supplier', 'Status', 'Submitted', 'Confirmed'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((p, i) => (
                        <tr key={p.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>

                            {/* Action */}
                            <td className={`${TD} w-[5%]`}>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => onView?.(p.id)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-[11px] font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                                        View
                                    </button>
                                    <button onClick={() => onEdit?.(p)}
                                        className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Edit
                                    </button>
                                </div>
                            </td>

                            {/* # */}
                            <td className={`${TD} w-10`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>

                            {/* Purchase No */}
                            <td className={TD}>
                                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    {p.purchase_no}
                                </span>
                            </td>

                            {/* Date */}
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs`}>
                                {p.purchase_date}
                            </td>

                            {/* Supplier */}
                            <td className={TD}>
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        {p.supplier_name?.charAt(0)?.toUpperCase()}
                                    </span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{p.supplier_name}</span>
                                </div>
                            </td>

                            {/* Status */}
                            <td className={TD}>
                                <StatusPill name={p.tran_status_name} />
                            </td>

                            {/* Submitted */}
                            <td className={`${TD} text-center`}>
                                <CheckIcon yes={Number(p.is_submit) === 1} />
                            </td>

                            {/* Confirmed */}
                            <td className={`${TD} text-center`}>
                                <CheckIcon yes={Number(p.is_confirm) === 1} />
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

