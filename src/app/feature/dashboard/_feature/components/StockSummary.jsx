'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { STOCK_SUMMARY_DATA } from '@/data';

export default function StockSummary({ stockSummary }) {
  const summary = stockSummary || {
    total_items: STOCK_SUMMARY_DATA.reduce((s, d) => s + d.value, 0),
    in_stock: { count: 0, percentage: 0 },
    low_stock: { count: 0, percentage: 0 },
    out_of_stock: { count: 0, percentage: 0 },
  };

  const chartData = [
    { name: 'In Stock', value: summary.in_stock.count ?? 0, color: '#10b981' },
    { name: 'Low Stock', value: summary.low_stock.count ?? 0, color: '#f59e0b' },
    { name: 'Out of Stock', value: summary.out_of_stock.count ?? 0, color: '#f43f5e' },
  ];
  const total = summary.total_items ?? chartData.reduce((s, d) => s + d.value, 0);
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Stock Summary</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v.toLocaleString()} items`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{Number(total).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Total Items</p>
        </div>
      </div>
      <div className="space-y-2 mt-2">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
              {Number(d.value).toLocaleString()} <span className="text-slate-400 font-normal">({total ? ((d.value / total) * 100).toFixed(1) : '0.0'}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
