import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function PendingSupplierTable({ suppliers = [], onPayNow }) {
    return (
        <TableCard title={`Pending Supplier Dues (${suppliers.length})`}>
            {!suppliers.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                    <p className="text-sm font-medium">No pending supplier dues</p>
                    <p className="text-xs mt-0.5">All suppliers are settled right now.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-150">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                            <tr>
                                {['#', 'Supplier', 'Contact', 'Due', 'Action'].map(h => (
                                    <th key={h} className={TH}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index) => (
                                <tr key={supplier.id ?? supplier.supplier_code ?? index} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${index % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                                    <td className={`${TD} w-10`}>
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
                                    </td>
                                    <td className={TD}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-400">{supplier.supplier_name?.charAt(0)?.toUpperCase() ?? 'S'}</span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{supplier.supplier_name}</p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{supplier.supplier_code ?? '—'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${TD} text-xs text-slate-500 dark:text-slate-400`}>
                                        <div className="space-y-0.5">
                                            <p>{supplier.phone || '—'}</p>
                                            <p className="truncate">{supplier.email || supplier.address || '—'}</p>
                                        </div>
                                    </td>
                                    <td className={`${TD} tabular-nums`}>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-100 dark:border-rose-500/20">
                                            <span className="text-[10px]">৳</span>
                                            {fmt(supplier.previous_due)}
                                        </span>
                                    </td>
                                    <td className={TD}>
                                        <button
                                            onClick={() => onPayNow?.(supplier)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                            Pay Now
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </TableCard>
    );
}