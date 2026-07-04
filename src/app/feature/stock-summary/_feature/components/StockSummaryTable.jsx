import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

export default function StockSummaryTable({ list, onViewDetail }) {
    if (!list?.length) {
        return (
            <TableCard title="Stock Summary">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <p className="text-sm font-medium">No stock data found</p>
                    <p className="text-xs mt-0.5">Try adjusting your search.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Stock Summary (${list.length})`}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['', '#', 'Product Code', 'Product Name', 'Category', 'Sub Category', 'Brand', 'Unit', 'Stock'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.map((item, i) => (
                        <tr
                            key={item.id}
                            className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}
                        >
                            <td className={`${TD} w-[5%]`}>
                                <button
                                    onClick={() => onViewDetail?.(item)}
                                    className="inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-[11px] font-semibold hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    View
                                </button>
                            </td>
                            <td className={`${TD} w-12`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {i + 1}
                                </span>
                            </td>
                            <td className={TD}>
                                <span className="font-mono text-xs font-semibold text-violet-600 dark:text-violet-400">
                                    {item.product_code}
                                </span>
                            </td>
                            <td className={TD}>
                                <span className="font-medium text-slate-800 dark:text-slate-100">{item.product_name}</span>
                            </td>
                            <td className={TD}>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                                    {item.category_name}
                                </span>
                            </td>
                            <td className={`${TD} text-slate-500 dark:text-slate-400`}>
                                {item.sub_category_name ?? <span className="text-slate-300 dark:text-slate-600 italic">—</span>}
                            </td>
                            <td className={`${TD} text-slate-600 dark:text-slate-300`}>{item.brand_name}</td>
                            <td className={TD}>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {item.unit_name}
                                </span>
                            </td>
                            <td className={TD}>
                                <span className={`inline-flex items-center gap-1 text-sm font-bold tabular-nums ${item.avail_stock <= 0 ? 'text-rose-600 dark:text-rose-400' : item.avail_stock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    {item.avail_stock}
                                    {item.avail_stock <= 0 && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">Out</span>
                                    )}
                                    {item.avail_stock > 0 && item.avail_stock <= 5 && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">Low</span>
                                    )}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}
