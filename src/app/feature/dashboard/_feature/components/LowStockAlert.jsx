
export default function LowStockAlert({ items }) {
  const rows = items || [];

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Low Stock Alert</h3>
        <a href="#" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium transition-colors">View All</a>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
          <tr>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Available</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Min. Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => {
            const isLow = Number(item.available_stock ?? 0) <= Number(item.min_stock_qty ?? 0);
            const productName = item.product_name || item.name || '';
            return (
              <tr key={item.product_id ?? productName} className={`border-b border-slate-100 dark:border-slate-800/30 last:border-0 ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{productName}</td>
                <td className={`px-4 py-2.5 font-semibold tabular-nums ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.available_stock != null ? item.available_stock : item.available} pcs
                </td>
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 tabular-nums">{item.min_stock_qty != null ? item.min_stock_qty : item.min} pcs</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
