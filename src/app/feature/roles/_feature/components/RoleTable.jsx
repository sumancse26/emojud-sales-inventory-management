import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function RoleTable({ items, onEdit }) {
    if (!items?.length) {
        return (
            <TableCard title="Roles">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <p className="text-sm font-medium">No roles found</p>
                    <p className="text-xs mt-0.5">Add your first role to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Roles (${items.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Role Name', 'Code'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr
                            key={item.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                        >
                            <td className={`${TD} w-[5%]`}>
                                <button
                                    onClick={() => onEdit?.(item)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
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
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{item.role_name}</span>
                                </div>
                            </td>
                            <td className={TD}>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {item.display_code}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
