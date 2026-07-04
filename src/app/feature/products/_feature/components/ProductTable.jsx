import TableCard from '@/components/ui/TableCard';
import StatusBadge from '@/components/ui/StatusBadge';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm whitespace-nowrap';

const fmt = (n) =>
    Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function ProductTable({ products = [], onEdit }) {
    const handleOpenEdit = (product) => {
        onEdit?.(product);


    };


    if (!products.length) {
        return (
            <TableCard title="Products">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs mt-0.5">Add your first product to get started.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Products (${products.length})`}>
            <div className="
    w-full
    overflow-hidden
    rounded-2xl
    border border-slate-200/60 dark:border-slate-800/60
    bg-white dark:bg-slate-900
    shadow-sm
">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] table-auto text-sm">
                        {/* Header */}
                        <thead className="
                hidden md:table-header-group
                sticky top-0 z-10
                bg-slate-50 dark:bg-slate-900
                border-b border-slate-200 dark:border-slate-800
            ">
                            <tr>
                                {/* Action */}
                                <th className={`${TH} w-[70px] text-center`}>
                                    Action
                                </th>

                                {/* Serial */}
                                <th className={`${TH} w-[60px] text-center`}>
                                    #
                                </th>

                                {/* Product */}
                                <th className={`${TH} min-w-[260px]`}>
                                    Product
                                </th>

                                {/* Unit */}
                                <th className={`${TH} whitespace-nowrap`}>
                                    Unit
                                </th>

                                {/* Sales */}
                                <th className={`${TH} text-right whitespace-nowrap`}>
                                    MRP
                                </th>

                                {/* Brand */}
                                <th className={`${TH} whitespace-nowrap`}>
                                    Brand
                                </th>
                                {/* Category */}
                                <th className={`${TH} whitespace-nowrap`}>
                                    Category
                                </th>
                                {/* Status */}
                                <th className={`${TH} whitespace-nowrap`}>
                                    Status
                                </th>

                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {products?.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className={`
                            border-b border-slate-100 dark:border-slate-800
                            hover:bg-slate-50 dark:hover:bg-slate-800/40
                            transition-all duration-200
                            ${i % 2 === 0
                                            ? 'bg-white dark:bg-slate-900'
                                            : 'bg-slate-50/40 dark:bg-slate-900/40'
                                        }
                        `}
                                >
                                    {/* Action */}
                                    <td className={`${TD} text-center p-2 md:p-4`}>
                                        <button
                                            onClick={() => handleOpenEdit(p)}
                                            className="
                                    inline-flex items-center justify-center
                                    w-8 h-8 md:w-9 md:h-9
                                    rounded-xl
                                    bg-amber-50 dark:bg-amber-500/10
                                    text-amber-600 dark:text-amber-400
                                    hover:scale-105
                                    hover:bg-amber-100
                                    dark:hover:bg-amber-500/20
                                    transition-all
                                "
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    </td>

                                    {/* Serial */}
                                    <td className={`${TD} text-center p-2 md:p-4`}>
                                        <span className="
                                inline-flex items-center justify-center
                                w-6 h-6 md:w-7 md:h-7
                                rounded-full
                                bg-slate-100 dark:bg-slate-800
                                text-[10px] md:text-xs
                                font-semibold
                                text-slate-600 dark:text-slate-300
                            ">
                                            {i + 1}
                                        </span>
                                    </td>

                                    {/* Product */}
                                    <td className={`${TD} p-2 md:p-4`}>
                                        <div className="space-y-1 min-w-[180px]">
                                            {/* Mobile label */}
                                            <div className="md:hidden text-[10px] uppercase tracking-wide text-slate-400">
                                                Product
                                            </div>

                                            <p className="
                                    font-semibold
                                    text-slate-800 dark:text-slate-100
                                    text-xs md:text-sm
                                    leading-5
                                    break-words
                                ">
                                                {p.product_name}
                                            </p>

                                            <p className="
                                    text-[10px] md:text-[11px]
                                    text-amber-600 dark:text-amber-400
                                    font-mono
                                    break-all
                                ">
                                                {p.product_code}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Unit */}
                                    <td className={`${TD} p-2 md:p-4 whitespace-nowrap`}>
                                        <div className="md:hidden text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                                            Unit
                                        </div>

                                        <span className="
                                inline-flex items-center
                                px-2 py-1 rounded-lg
                                bg-slate-100 dark:bg-slate-800
                                text-slate-700 dark:text-slate-300
                                text-[10px] md:text-xs
                                font-medium
                            ">
                                            {p.unit_name ?? '—'}
                                        </span>
                                    </td>

                                    {/* Sales */}
                                    <td className={`${TD} text-right p-2 md:p-4 whitespace-nowrap`}>
                                        <div className="md:hidden text-[10px] uppercase tracking-wide text-slate-400 mb-1 text-right">
                                            Sales
                                        </div>

                                        <span className="
                                font-semibold
                                text-emerald-600 dark:text-emerald-400
                                text-xs md:text-sm
                            ">
                                            {fmt(p.sales_rate)}
                                        </span>
                                    </td>

                                    {/* Brand */}
                                    <td className={`${TD} p-2 md:p-4 whitespace-nowrap`}>
                                        <div className="md:hidden text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                                            Brand
                                        </div>

                                        {p.brand_name ? (
                                            <span className="
                                    text-slate-700 dark:text-slate-300
                                    font-medium
                                    text-xs md:text-sm
                                ">
                                                {p.brand_name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    {/* Category */}
                                    <td className={`${TD} p-2 md:p-4 whitespace-nowrap`}>
                                        <div className="md:hidden text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                                            Category
                                        </div>
                                        {p.category_name ? (
                                            <span className="
                                    text-slate-700 dark:text-slate-300
                                    font-medium
                                    text-xs md:text-sm
                                ">
                                                {p.category_name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    {/* Status */}
                                    <td className={`${TD} whitespace-nowrap`}>
                                        <StatusBadge
                                            status={Number(p.status) === 1 ? 'Active' : 'Inactive'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </TableCard>
    );
}


