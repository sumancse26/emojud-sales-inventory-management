import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const fmt = (n) =>
    Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function SupplierTable({ suppliers, onEdit }) {
    if (!suppliers?.length) {
        return (
            <TableCard title="Suppliers">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <p className="text-sm font-medium">No suppliers found</p>
                    <p className="text-xs mt-0.5">Add your first supplier to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Suppliers (${suppliers.length})`}>
            <table className="w-full text-sm min-w-175">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Supplier', 'Phone', 'Email', 'Address', 'Due', 'Status'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((s, i) => (
                        <tr key={s.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>

                            {/* Actions */}
                            <td className={`${TD} w-[5%]`}>
                                <button onClick={() => onEdit?.(s)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>
                            </td>

                            <td className={`${TD} w-10`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>

                            {/* Supplier */}
                            <td className={TD}>
                                <div className="flex items-center gap-2.5">
                                    <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        {s.supplier_name?.charAt(0)?.toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{s.supplier_name}</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{s.supplier_code}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Phone */}
                            <td className={TD}>
                                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-xs">
                                    <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                    {s.phone}
                                </span>
                            </td>

                            {/* Email */}
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs`}>
                                {s.email ? (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                                        </svg>
                                        {s.email}
                                    </span>
                                ) : <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                            </td>

                            {/* Address */}
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs max-w-40`}>
                                {s.address ? (
                                    <span className="flex items-start gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <span className="truncate">{s.address}</span>
                                    </span>
                                ) : <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                            </td>

                            {/* Due */}
                            <td className={TD}>
                                {Number(s.previous_due) > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-100 dark:border-rose-500/20">
                                        <span className="text-[10px]">৳</span>
                                        {fmt(s.previous_due)}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                        ৳ 0
                                    </span>
                                )}
                            </td>

                            {/* Status */}
                            <td className={TD}>
                                {Number(s.status) === 1 ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        Inactive
                                    </span>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
