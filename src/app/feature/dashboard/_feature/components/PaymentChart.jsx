'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function formatMoney(value) {
  return `৳ ${Number(value ?? 0).toLocaleString('en-IN')}`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl shadow-lg px-3 py-2 text-xs font-semibold" style={{ color: payload[0].payload.color }}>
      {payload[0].name}: {payload[0].value}%
    </div>
  );
}

export default function PaymentChart({ paymentMethods }) {
  const data = Array.isArray(paymentMethods) && paymentMethods.length > 0
    ? paymentMethods.map((method, index) => ({
      name: method.payment_method,
      value: Number(method.percentage ?? 0),
      amount: Number(method.amount ?? 0),
      color: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'][index % 6],
    }))
    : [];

  const totalAmount = data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalLabel = totalAmount > 0 ? formatMoney(totalAmount) : '0';

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors flex flex-col">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-3">Sales by Payment Method</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{totalLabel}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Total</p>
        </div>
      </div>
      <div className="space-y-2 mt-1">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
