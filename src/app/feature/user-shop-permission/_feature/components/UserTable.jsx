import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function UserTable({ users, onManage }) {
    if (!users?.length) {
        return (
            <TableCard title="Users">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs mt-0.5">No users available to manage.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Users (${users.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['#', 'Employee', 'Username', ''].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr
                            key={user.user_id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                        >
                            <td className={`${TD} w-12`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>
                            <td className={TD}>
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{user.full_name}</span>
                                        {user.employee_code && (
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.employee_code}</p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className={`${TD} text-slate-500 dark:text-slate-400`}>
                                {user.username ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {user.username}
                                    </span>
                                ) : (
                                    <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                                )}
                            </td>
                            <td className={`${TD} text-right`}>
                                <button
                                    onClick={() => onManage?.(user)}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Manage Shops
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
