
export default function TopProducts({ products }) {
  const items = products;

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Top Selling Products</h3>
        {/* <button className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          This Month
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </button> */}
      </div>
      <div className="space-y-3.5 flex-1">
        {items.map((p, index) => {
          const name = p.product_name || p.name || '';
          const qty = typeof p.qty === 'number' ? `${p.qty} pcs` : String(p.qty || '');
          const amount = p.amount != null ? `৳ ${Number(p.amount).toLocaleString('en-IN')}` : '';
          const color = p.color || ['bg-slate-700', 'bg-blue-600', 'bg-orange-500', 'bg-red-600', 'bg-emerald-600'][index % 5];
          return (
            <div key={p.product_id ?? name} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                <span className="text-[10px] font-bold text-white leading-none">{name.slice(0, 2)?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{name}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{qty}</p>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 shrink-0">{amount}</p>
            </div>
          );
        })}
      </div>
      <a href="#" className="block mt-4 text-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
        View All Products →
      </a>
    </div>
  );
}
