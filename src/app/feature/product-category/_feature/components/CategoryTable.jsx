import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function CategoryTable({ items, onEdit }) {
    if (!items?.length) {
        return (
            <TableCard title="Categories &amp; Subcategories">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                    <p className="text-sm font-medium">No categories found</p>
                    <p className="text-xs mt-0.5">Add your first category to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Categories & Subcategories (${items.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Name', 'Type', 'Parent Category'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => {
                        const isSubcategory = item.parent_category_id != null;
                        return (
                            <tr
                                key={item.id}
                                className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                            >
                                <td className={`${TD} w-[5%]`}>
                                    <button
                                        onClick={() => onEdit?.(item)}
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
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSubcategory ? 'bg-purple-100 dark:bg-purple-500/10' : 'bg-emerald-100 dark:bg-emerald-500/10'}`}>
                                            {isSubcategory ? (
                                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-100">{item.category_name}</span>
                                    </div>
                                </td>
                                <td className={TD}>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                        isSubcategory
                                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20'
                                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubcategory ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                                        {isSubcategory ? 'Subcategory' : 'Category'}
                                    </span>
                                </td>
                                <td className={`${TD} text-slate-500 dark:text-slate-400`}>
                                    {item.parent_category_name ? (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                            {item.parent_category_name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TableCard>
    );
}
