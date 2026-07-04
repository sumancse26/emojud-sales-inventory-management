import TableCard from '@/components/ui/TableCard';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3 text-sm';

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const fmtDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB');
};

export default function CommissionProfitTable({ commissions = [], onEdit }) {
    if (!commissions.length) {
        return (
            <TableCard title="Commission Profit History">
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                    <svg className="w-12 h-12 mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 3 3L16.5 6l4.5 4.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18" />
                    </svg>
                    <p className="text-sm font-medium">No commission records found</p>
                    <p className="text-xs mt-0.5">Create your first commission-profit entry.</p>
                </div>
            </TableCard>
        );
    }

    return (
        <TableCard title={`Commission Profit History (${commissions.length})`}>
            <table className="w-full text-sm min-w-210">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <tr>
                        {['#', 'Period', 'Commission Amount', 'Received', 'Date', 'Action'].map(h => (
                            <th key={h} className={TH}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {commissions.map((item, index) => {
                        const commission = Number(item.commission_amount, 0);
                        const isReceived = Number(item.is_received_commission) === 1;

                        return (
                            <tr key={item.id ?? `${item.invoice_id}-${item.product_id}-${index}`} className={`border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${index % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                                <td className={`${TD} w-10`}>
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">{index + 1}</span>
                                </td>
                                <td className={`${TD} font-mono text-xs text-slate-600 dark:text-slate-300`}>{item.year_id}-{String(item.month_id || '').padStart(2, '0')}</td>

                                <td className={`${TD} tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold`}>৳ {fmt(commission)}</td>
                                <td className={TD}>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${isReceived ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-500/20'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isReceived ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`} />
                                        {isReceived ? 'Received' : 'Pending'}
                                    </span>
                                </td>
                                <td className={`${TD} text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap`}>{fmtDate(item.received_date)}</td>
                                <td className={TD}>
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.({ ...item, isReceived: item.is_received_commission })}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-200/70 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </TableCard>
    );
}
