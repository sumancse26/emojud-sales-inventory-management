'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import SelectInput from '@/components/ui/SelectInput';
import { getExpenseDetail } from '@/services/expense';
import { saveExpenseAction } from '../action';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const INPUT_SM = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const SECTION_CLS = 'pt-5 border-t border-slate-100 dark:border-slate-800/50';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
    shop_id: '',
    expense_date: today(),
    remarks: '',
};

const LABEL_SM = 'block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1';

const mkRow = () => ({
    _key: Math.random().toString(36).slice(2),
    id: null,
    expense_head_id: '',
    amount: '',
    payment_method_id: '',
    remarks: '',
});

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── View body ──────────────────────────────────────────────── */
function ViewBody({ rowData, details, loading }) {
    if (loading) {
        return (
            <div className="px-6 py-5 space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        );
    }

    const totalAmount = details.reduce((s, d) => s + Number(d.amount || 0), 0);

    return (
        <div className="px-6 py-5 space-y-5">
            {/* Master info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className={LABEL_CLS}>Expense No</p>
                    <p className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{rowData?.expense_no}</p>
                </div>
                <div>
                    <p className={LABEL_CLS}>Date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rowData?.expense_date}</p>
                </div>
                {rowData?.remarks && (
                    <div className="col-span-2">
                        <p className={LABEL_CLS}>Remarks</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{rowData.remarks}</p>
                    </div>
                )}
            </div>

            {/* Detail rows */}
            <div className={SECTION_CLS}>
                <p className={LABEL_CLS}>Expense Items</p>
                {details.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-700/50">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                                <tr>
                                    {['Expense Head', 'Amount', 'Payment Method', 'Remarks'].map(h => (
                                        <th key={h} className="text-left px-3 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap border-b border-slate-200/60 dark:border-slate-800/40">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((d, i) => (
                                    <tr key={d.id ?? i} className={`border-b border-slate-100 dark:border-slate-800/30 ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{d.expense_head_name}</td>
                                        <td className="px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">৳ {fmt(d.amount)}</td>
                                        <td className="px-3 py-2.5">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                {d.payment_method_name}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{d.remarks || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">No expense items found.</p>
                )}
            </div>

            {/* Total */}
            {details.length > 0 && (
                <div className={`${SECTION_CLS} bg-slate-50/60 dark:bg-slate-900/30 rounded-2xl p-4`}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount</span>
                        <span className="text-base font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                            ৳ {fmt(totalAmount)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────── */
export default function ExpenseSlider({
    isOpen, onClose,
    mode = 'create',
    rowData = null,
    shops = [], expenseHeads = [], paymentMethods = [],
    userInfo, onSaved,
}) {
    const [form, setForm] = useState({ ...EMPTY_FORM, expense_date: today() });
    const [rows, setRows] = useState([mkRow()]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewDetails, setViewDetails] = useState([]);

    /* Options */
    const shopOptions = useMemo(() => shops.map(s => ({ value: String(s.id), label: s.shop_name ?? String(s.id) })), [shops]);
    const headOptions = useMemo(() => expenseHeads.map(h => ({ value: String(h.id), label: h.lookup_value })), [expenseHeads]);
    const pmOptions = useMemo(() => paymentMethods.map(p => ({ value: String(p.id), label: p.lookup_value })), [paymentMethods]);

    /* Total */
    const totalAmount = useMemo(() => rows.reduce((s, r) => s + (Number(r.amount) || 0), 0), [rows]);

    /* Load on open */
    useEffect(() => {
        if (!isOpen) return;

        if (mode === 'create') {
            setForm({ shop_id: String(userInfo?.shop_id || ''), expense_date: today(), remarks: '' });
            setRows([mkRow()]);
            setViewDetails([]);
            return;
        }

        if (!rowData?.id) return;
        setLoading(true);
        setViewDetails([]);

        getExpenseDetail(rowData.id)
            .then(res => {
                const details = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
                if (mode === 'view') {
                    setViewDetails(details);
                } else {
                    // edit
                    setForm({
                        shop_id: String(userInfo?.shop_id || ''),
                        expense_date: rowData.expense_date || today(),
                        remarks: rowData.remarks || '',
                    });
                    setRows(details.length > 0
                        ? details.map(d => ({
                            _key: Math.random().toString(36).slice(2),
                            id: d.id ?? null,
                            expense_head_id: String(d.expense_head_id || ''),
                            amount: String(d.amount || ''),
                            payment_method_id: String(d.payment_method_id || ''),
                            remarks: d.remarks || '',
                        }))
                        : [mkRow()]
                    );
                }
            })
            .catch(() => toast.error('Failed to load expense details.'))
            .finally(() => setLoading(false));
    }, [isOpen, mode, rowData?.id]);

    /* Scroll lock */
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const updateRow = useCallback((key, field, value) => {
        setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value } : r));
    }, []);

    const addRow = () => setRows(prev => [...prev, mkRow()]);
    const removeRow = (key) => setRows(prev => prev.length > 1 ? prev.filter(r => r._key !== key) : prev);

    const handleSubmit = async () => {
        if (!form.shop_id) { toast.error('Please select a shop.'); return; }
        if (!form.expense_date) { toast.error('Expense date is required.'); return; }
        const validRows = rows.filter(r => r.expense_head_id && r.amount && r.payment_method_id);
        if (!validRows.length) { toast.error('Add at least one expense item with head, amount and payment method.'); return; }

        setSaving(true);
        try {
            const payload = {
                id: mode === 'edit' ? Number(rowData.id) : null,
                shop_id: Number(form.shop_id),
                expense_date: form.expense_date,
                total_amount: totalAmount,
                remarks: form.remarks.trim() || null,
                user_id: Number(userInfo?.id),
                details: validRows.map(r => ({
                    id: r.id ?? null,
                    expense_head_id: Number(r.expense_head_id),
                    amount: Number(r.amount),
                    payment_method_id: Number(r.payment_method_id),
                    remarks: r.remarks.trim() || null,
                })),
            };

            const res = await saveExpenseAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(mode === 'edit' ? 'Expense updated successfully!' : 'Expense created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save expense.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const isView = mode === 'view';

    /* Header meta */
    const headerMeta = {
        create: { title: 'New Expense', subtitle: 'Fill in the details to record an expense', icon: 'plus' },
        edit:   { title: 'Edit Expense', subtitle: `Editing: ${rowData?.expense_no ?? ''}`, icon: 'edit' },
        view:   { title: 'Expense Details', subtitle: rowData?.expense_no ?? '', icon: 'view' },
    }[mode];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/10">
                            {headerMeta.icon === 'edit' ? (
                                <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : headerMeta.icon === 'view' ? (
                                <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{headerMeta.title}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{headerMeta.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                {isView ? (
                    <div className="flex-1 overflow-y-auto">
                        <ViewBody rowData={rowData} details={viewDetails} loading={loading} />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Shop */}
                                <div>
                                    <label className={LABEL_CLS}>
                                        Shop <span className="text-red-500 normal-case font-normal">*</span>
                                    </label>
                                    <SelectInput
                                        options={shopOptions}
                                        value={form.shop_id}
                                        onChange={v => setForm(p => ({ ...p, shop_id: v }))}
                                        placeholder="Select shop…"
                                        disabled
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className={LABEL_CLS} htmlFor="exp_date">
                                        Expense Date <span className="text-red-500 normal-case font-normal">*</span>
                                    </label>
                                    <input
                                        id="exp_date"
                                        type="date"
                                        value={form.expense_date}
                                        onChange={e => setForm(p => ({ ...p, expense_date: e.target.value }))}
                                        className={INPUT_CLS}
                                    />
                                </div>

                                {/* Remarks */}
                                <div>
                                    <label className={LABEL_CLS} htmlFor="exp_remarks">Remarks</label>
                                    <textarea
                                        id="exp_remarks"
                                        rows={2}
                                        value={form.remarks}
                                        onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
                                        placeholder="Optional notes about this expense…"
                                        className={`${INPUT_CLS} resize-none`}
                                    />
                                </div>

                                {/* Expense Items */}
                                <div className={SECTION_CLS}>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className={`${LABEL_CLS} mb-0`}>
                                            Expense Items <span className="text-red-500 normal-case font-normal">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addRow}
                                            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                            Add Row
                                        </button>
                                    </div>

                                    {/* Rows table */}
                                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
                                        <table className="w-full table-fixed text-xs">
                                            <thead className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/40">
                                                <tr>
                                                    <th className="text-left pl-3 pr-1 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-[38%]">Expense Head</th>
                                                    <th className="text-left px-1 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-[18%]">Amount</th>
                                                    <th className="text-left px-1 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-[22%]">Payment</th>
                                                    <th className="text-left px-1 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Remarks</th>
                                                    <th className="w-8" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, idx) => (
                                                    <tr key={row._key} className={`border-b border-slate-100 dark:border-slate-800/30 last:border-0 ${idx % 2 ? 'bg-slate-50/20 dark:bg-slate-900/10' : ''}`}>
                                                        <td className="pl-2 pr-1 py-2">
                                                            <SelectInput
                                                                options={headOptions}
                                                                value={row.expense_head_id}
                                                                onChange={v => updateRow(row._key, 'expense_head_id', v)}
                                                                placeholder="Select head…"
                                                            />
                                                        </td>
                                                        <td className="px-1 py-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={row.amount}
                                                                onChange={e => updateRow(row._key, 'amount', e.target.value)}
                                                                placeholder="0.00"
                                                                className={INPUT_SM}
                                                            />
                                                        </td>
                                                        <td className="px-1 py-2">
                                                            <SelectInput
                                                                options={pmOptions}
                                                                value={row.payment_method_id}
                                                                onChange={v => updateRow(row._key, 'payment_method_id', v)}
                                                                placeholder="Select…"
                                                            />
                                                        </td>
                                                        <td className="px-1 py-2">
                                                            <input
                                                                type="text"
                                                                value={row.remarks}
                                                                onChange={e => updateRow(row._key, 'remarks', e.target.value)}
                                                                placeholder="Note…"
                                                                className={INPUT_SM}
                                                            />
                                                        </td>
                                                        <td className="pr-2 py-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(row._key)}
                                                                disabled={rows.length === 1}
                                                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all mx-auto"
                                                            >
                                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M18 6 6 18M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between mt-3 px-1">
                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                            {rows.length} item{rows.length !== 1 ? 's' : ''}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Total:</span>
                                            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                                                ৳ {fmt(totalAmount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/50 shrink-0 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        {isView ? 'Close' : 'Cancel'}
                    </button>
                    {!isView && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving || loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-600/25"
                        >
                            {saving ? 'Saving…' : mode === 'edit' ? 'Update Expense' : 'Save Expense'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
