import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function SupplierPaymentTable({ payments = [] }) {
    if (!payments.length) {
        return (
            <TableCard title="Supplier Payment History">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h16" />
                    </svg>
                    <p className="text-sm font-medium">No supplier payments found</p>
                    <p className="text-xs mt-0.5">Create the first payment from the pending dues panel.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Supplier Payment History (${payments.length})`}>
            <table className="w-full text-sm min-w-175">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['#', 'Payment No', 'Date', 'Supplier', 'Total Due', 'Paid', 'Current Due', 'Remarks'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={payment.id ?? payment.payment_no ?? index} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${index % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                            <td className={`${TD} w-10`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
                            </td>
                            <td className={TD}>
                                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">{payment.payment_no}</span>
                            </td>
                            <td className={`${TD} text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap`}>{payment.payment_date}</td>
                            <td className={TD}>
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        {payment.supplier_name?.charAt(0)?.toUpperCase() ?? 'S'}
                                    </span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{payment.supplier_name}</span>
                                </div>
                            </td>
                            <td className={`${TD} text-slate-700 dark:text-slate-300 tabular-nums`}>৳ {fmt(payment.total_due)}</td>
                            <td className={`${TD} text-slate-700 dark:text-slate-300 tabular-nums`}>৳ {fmt(payment.paid_amount)}</td>
                            <td className={`${TD} tabular-nums ${Number(payment.current_due) > 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}`}>৳ {fmt(payment.current_due)}</td>
                            <td className={`${TD} text-xs text-slate-500 dark:text-slate-400 max-w-64`}>
                                <span className="line-clamp-2">{payment.remarks || '—'}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}