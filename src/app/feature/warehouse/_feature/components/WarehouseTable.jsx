import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function WarehouseTable({ warehouses, onEdit }) {
    if (!warehouses?.length) {
        return (
            <TableCard title="Warehouses">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25V19.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 19.5V9.75z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                    </svg>
                    <p className="text-sm font-medium">No warehouses found</p>
                    <p className="text-xs mt-0.5">Add your first warehouse to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Warehouses (${warehouses.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Warehouse Name', 'Shop', 'Address'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {warehouses.map((w, i) => (
                        <tr
                            key={w.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                        >
                            <td className={`${TD} w-[5%]`}>
                                <button
                                    onClick={() => onEdit?.(w)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>
                            </td>
                            <td className={`${TD} w-12`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>
                            <td className={TD}>
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25V19.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 19.5V9.75z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                                        </svg>
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{w.warehouse_name}</span>
                                </div>
                            </td>
                            <td className={TD}>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                    {w.shop_name}
                                </span>
                            </td>
                            <td className={`${TD} text-slate-500 dark:text-slate-400`}>
                                {w.address ? (
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {w.address}
                                    </span>
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
