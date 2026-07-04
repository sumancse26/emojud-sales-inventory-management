import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3';

const AVATAR_COLORS = [
    'from-violet-500 to-indigo-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
];

function avatarColor(name = '') {
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function EmployeeTable({ employees = [], onEdit }) {
    return (
        <TableCard title={`${employees.length} employee${employees.length !== 1 ? 's' : ''} found`}>
            <table className="w-full text-sm min-w-200">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Employee', 'Department / Designation', 'Shop', 'Phone', 'Blood', 'Status'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                No employees found
                            </td>
                        </tr>
                    ) : employees.map((emp, i) => (
                        <tr key={emp.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/40 dark:bg-slate-900/10' : ''}`}>

                            {/* Edit */}
                            <td className={`${TD} w-[5%]`}>
                                <button onClick={() => onEdit?.(emp)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Edit
                                </button>
                            </td>

                            {/* # */}
                            <td className={TD}>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{i + 1}</span>
                            </td>

                            {/* Name + code */}
                            <td className={TD}>
                                <div className="flex items-center gap-2.5">

                                    <div>
                                        <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold whitespace-nowrap">{emp.full_name}</p>
                                        <p className="font-mono text-[11px] text-violet-600 dark:text-violet-400 mt-0.5">{emp.employee_code}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Dept / Designation */}
                            <td className={TD}>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">{emp.department_name || '—'}</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">{emp.designation_name || '—'}</p>
                            </td>

                            {/* Shop */}
                            <td className={TD}>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-semibold whitespace-nowrap">
                                    {emp.shop_name || '—'}
                                </span>
                            </td>

                            {/* Phone */}
                            <td className={TD}>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{emp.phone || '—'}</span>
                            </td>

                            {/* Blood */}
                            <td className={TD}>
                                {emp.blood_group_name ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                                        {emp.blood_group_name}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                                )}
                            </td>

                            {/* Status */}
                            <td className={TD}>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${emp.is_active === 1 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active === 1 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    {emp.is_active === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}


