import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3';

const AVATAR_COLORS = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
];

function avatarColor(name = '') {
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function CustomerTable({ customers = [], onEdit }) {
    return (
        <TableCard title={`${customers.length} customer${customers.length !== 1 ? 's' : ''} found`}>
            <table className="w-full text-sm min-w-175">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Customer', 'Phone', 'Email', 'Address', 'Due', 'Status'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                No customers found
                            </td>
                        </tr>
                    ) : customers.map((c, i) => (
                        <tr key={c.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/40 dark:bg-slate-900/10' : ''}`}>

                            {/* Edit */}
                            <td className={`${TD} w-[5%]`}>
                                <button onClick={() => onEdit?.(c)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>
                            </td>

                            {/* # */}
                            <td className={TD}>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{i + 1}</span>
                            </td>

                            {/* Customer */}
                            <td className={TD}>
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${avatarColor(c.customer_name)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                                        {(c.customer_name || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold whitespace-nowrap">{c.customer_name}</p>
                                        <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{c.customer_code}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Phone */}
                            <td className={TD}>
                                <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                    {c.phone || '—'}
                                </span>
                            </td>

                            {/* Email */}
                            <td className={TD}>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40 block">
                                    {c.email || '—'}
                                </span>
                            </td>

                            {/* Address */}
                            <td className={TD}>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-36 block">
                                    {c.address || '—'}
                                </span>
                            </td>

                            {/* Due */}
                            <td className={TD}>
                                {Number(c.previous_due) > 0 ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-semibold whitespace-nowrap">
                                        ৳ {Number(c.previous_due).toLocaleString()}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                                )}
                            </td>

                            {/* Status */}
                            <td className={TD}>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.status === 1 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    {c.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
