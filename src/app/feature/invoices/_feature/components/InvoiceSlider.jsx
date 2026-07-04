'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import SelectInput from '@/components/ui/SelectInput';
import { getInvoiceDetail } from '@/services/invoice';
import { getCustomerList } from '@/services/customers';
import { saveCustomerAction, saveInvoiceAction } from '../action';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const INPUT_SM = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const SECTION_CLS = 'pt-5 border-t border-slate-100 dark:border-slate-800/50';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
    shop_id: '',
    customer_id: '',
    invoice_date: today(),
    discount_amount: '',
    vat_amount: '',
    paid_amount: '',
    is_submit: 1,
};

const mkRow = () => ({
    _key: Math.random().toString(36).slice(2),
    product_id: '',
    qty: '',
    rate: '',
    vat_amt: '',
    disc_amt: '',
});

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const btnColor = 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20';

function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${checked ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
        </label>
    );
}

function CheckPill({ yes }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${yes ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700/40 dark:text-slate-400'}`}>
            {yes ? (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            ) : (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            )}
            {yes ? 'Yes' : 'No'}
        </span>
    );
}

/* ── View mode body ─────────────────────────────────────────── */
function ViewBody({ viewData }) {
    const m = viewData?.master ?? {};
    const details = viewData?.details ?? [];

    return (
        <div className="px-6 py-5 space-y-5">
            {/* Master info */}
            <div className="bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-4 space-y-1">
                {[
                    ['Invoice No', m.invoice_no ?? '—'],
                    ['Date', m.invoice_date ?? '—'],
                    ['Customer', m.customer_name ?? '—'],
                    ['Shop', m.shop_name ?? '—'],
                    ['Status', m.tran_status_name ?? '—'],
                ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{val}</span>
                    </div>
                ))}
                <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Submitted</span>
                    <CheckPill yes={Number(m.is_submit) === 1} />
                </div>
            </div>

            {/* Product rows */}
            <div>
                <p className={LABEL_CLS}>Products</p>
                <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/40">
                                {['Product', 'Qty', 'Rate', 'VAT', 'Disc', 'Total'].map(h => (
                                    <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((d, i) => {
                                const rowTotal = (Number(d.qty) * Number(d.rate)) + Number(d.vat_amt || 0) - Number(d.disc_amt || 0);
                                return (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/30 last:border-0">
                                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{d.product_name ?? d.product_id}</td>
                                        <td className="px-3 py-2 tabular-nums">{d.qty}</td>
                                        <td className="px-3 py-2 tabular-nums">৳{fmt(d.rate)}</td>
                                        <td className="px-3 py-2 tabular-nums text-amber-600 dark:text-amber-400">৳{fmt(d.vat_amt)}</td>
                                        <td className="px-3 py-2 tabular-nums text-rose-500 dark:text-rose-400">৳{fmt(d.disc_amt)}</td>
                                        <td className="px-3 py-2 tabular-nums font-semibold text-slate-800 dark:text-slate-100">৳{fmt(rowTotal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment summary */}
            <div className="bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-4 space-y-1">
                {[
                    ['Total Amount', `৳ ${fmt(m.total_amount)}`],
                    ['Discount', `৳ ${fmt(m.discount_amount)}`],
                    ['VAT', `৳ ${fmt(m.vat_amount)}`],
                ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 tabular-nums">{val}</span>
                    </div>
                ))}
                <div className="flex items-center justify-between py-1.5 border-t border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Net Amount</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">৳ {fmt(m.net_amount)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Paid</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 tabular-nums">৳ {fmt(m.paid_amount)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-t border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Due Amount</span>
                    <span className={`text-sm font-bold tabular-nums ${Number(m.due_amount) > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>৳ {fmt(m.due_amount)}</span>
                </div>
            </div>
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────── */
export default function InvoiceSlider({
    isOpen,
    onClose,
    mode = 'create',
    selectedId,
    isAlreadySubmitted,
    customers = [],
    shops = [],
    products = [],
    userInfo,
    onSaved,
}) {
    const [form, setForm] = useState({ ...EMPTY_FORM, shop_id: userInfo?.shop_id ?? '', invoice_date: today() });
    const [rows, setRows] = useState([mkRow()]);
    const [viewData, setViewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerModalLoading, setCustomerModalLoading] = useState(false);
    const [customerForm, setCustomerForm] = useState({ customer_name: '', phone_no: '' });
    const [localCustomers, setLocalCustomers] = useState(customers);

    useEffect(() => {
        const t = setTimeout(() => {
            setLocalCustomers(customers);
        }, 0);

        return () => clearTimeout(t);
    }, [customers]);

    const customerOptions = localCustomers.map(c => ({ value: String(c.id), label: c.name ?? c.customer_name ?? String(c.id) }));
    const shopOptions = shops.map(s => ({ value: String(s.id), label: s.name ?? s.shop_name ?? String(s.id) }));
    const productOptions = products.map(p => ({ value: String(p.id), label: `${p.product_name} (${p.avail_stock})` }));

    /* Totals */
    const totals = useMemo(() => {
        const total_amount = rows.reduce((s, r) => s + (Number(r.qty) * Number(r.rate || 0)), 0);
        const discount_amount = Number(form.discount_amount) || 0;
        const vat_amount = Number(form.vat_amount) || 0;
        const net_amount = total_amount - discount_amount + vat_amount;
        const paid_amount = form.paid_amount !== '' ? Number(form.paid_amount) || 0 : net_amount;
        const due_amount = net_amount - paid_amount;
        return { total_amount, discount_amount, vat_amount, net_amount, paid_amount, due_amount };
    }, [rows, form.discount_amount, form.vat_amount, form.paid_amount]);

    /* Reset / load on open */
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (mode === 'create') {
                setForm({ ...EMPTY_FORM, shop_id: userInfo?.shop_id ?? '', invoice_date: today() });
                setRows([mkRow()]);
                setViewData(null);
            } else if (mode === 'view' && selectedId) {
                setLoading(true);
                setViewData(null);
                getInvoiceDetail(selectedId)
                    .then(res => setViewData(res))
                    .catch(() => toast.error('Failed to load invoice details.'))
                    .finally(() => setLoading(false));
            } else if (mode === 'edit' && selectedId) {
                setLoading(true);
                setViewData(null);
                getInvoiceDetail(selectedId)
                    .then(res => {
                        const m = res?.master ?? {};
                        const details = res?.details ?? [];
                        setForm({
                            id: m.id,
                            shop_id: String(m.shop_id || ''),
                            customer_id: String(m.customer_id || ''),
                            invoice_date: m.invoice_date || today(),
                            discount_amount: m.discount_amount ?? '',
                            vat_amount: m.vat_amount ?? '',
                            paid_amount: m.paid_amount ?? '',
                            is_submit: Number(m.is_submit ?? 1),
                        });
                        setRows(details.length > 0
                            ? details.map(d => ({
                                id: d.id,
                                _key: Math.random().toString(36).slice(2),
                                product_id: String(d.product_id || ''),
                                qty: String(d.qty || ''),
                                rate: String(d.rate || ''),
                                vat_amt: String(d.vat_amt || ''),
                                disc_amt: String(d.disc_amt || ''),
                            }))
                            : [mkRow()]
                        );
                    })
                    .catch(() => toast.error('Failed to load invoice for editing.'))
                    .finally(() => setLoading(false));
            }
        }, 0);

        return () => clearTimeout(t);
    }, [isOpen, mode, selectedId, userInfo?.shop_id]);

    /* Row helpers */
    const updateRow = (key, field, value) => {
        if (field == 'product_id') {
            const selectedProduct = products.find(p => String(p.id) === String(value));

            if (selectedProduct) {
                const rate = selectedProduct.sales_rate || '';
                const disc_amt = selectedProduct.disc_amt || 0;
                const qty = 1;
                setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value, rate, disc_amt, qty } : r));
                return;
            }
        }

        setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value } : r));
    };
    const addRow = () => setRows(prev => [...prev, mkRow()]);
    const removeRow = (key) => setRows(prev => prev.length > 1 ? prev.filter(r => r._key !== key) : prev);

    const handleCustomerFormChange = (field, value) => {
        setCustomerForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateCustomer = async () => {
        if (!customerForm.customer_name.trim()) return toast.warn('Customer name is required.');
        if (!customerForm.phone_no.trim()) return toast.warn('Customer phone number is required.');

        setCustomerModalLoading(true);
        try {
            const payload = {
                id: null,
                shop_id: Number(userInfo?.shop_id ?? ''),
                customer_name: customerForm.customer_name.trim(),
                phone: customerForm.phone_no.trim(),
                email: null,
                address: null,
                previous_due: 0,
                created_by: Number(userInfo?.id ?? ''),
            };

            const res = await saveCustomerAction(payload);
            const success = res?.response_code === 200 || res?.success;
            if (!success) {
                throw new Error(res?.message || 'Failed to save customer.');
            }

            toast.success('Customer created successfully!');
            const updated = await getCustomerList();
            const updatedCustomers = Array.isArray(updated)
                ? updated
                : Array.isArray(updated?.data)
                    ? updated.data
                    : [];

            if (updatedCustomers.length) {
                setLocalCustomers(updatedCustomers);
                const createdCustomer = updatedCustomers.find(c =>
                    c.phone === customerForm.phone_no.trim()
                    && (c.customer_name === customerForm.customer_name.trim() || c.name === customerForm.customer_name.trim())
                );

                if (createdCustomer) {
                    setForm(prev => ({
                        ...prev,
                        customer_id: String(createdCustomer.id ?? createdCustomer.customer_id ?? ''),
                    }));
                }
            }

            setCustomerModalOpen(false);
            setCustomerForm({ customer_name: '', phone_no: '' });
        } catch (error) {
            toast.error(error?.message || 'Failed to create customer. Please try again.');
        } finally {
            setCustomerModalLoading(false);
        }
    };

    /* Submit */
    const handleSubmit = async () => {
        if (!form.shop_id) return toast.warn('Please select a shop.');
        if (!form.customer_id) return toast.warn('Please select a customer.');
        if (!form.invoice_date) return toast.warn('Please enter an invoice date.');
        if (rows.every(r => !r.product_id)) return toast.warn('Please add at least one product.');

        const validRows = rows.filter(r => r.product_id && r.qty && r.rate);
        if (!validRows.length) return toast.warn('Each product row needs a product, qty, and rate.');

        setSaving(true);
        try {
            const payload = {
                id: mode === 'edit' ? Number(selectedId) : null,
                shop_id: Number(form.shop_id),
                customer_id: Number(form.customer_id),
                invoice_date: form.invoice_date,
                total_amount: totals.total_amount,
                discount_amount: totals.discount_amount,
                vat_amount: totals.vat_amount,
                net_amount: totals.net_amount,
                paid_amount: totals.paid_amount,
                due_amount: totals.due_amount,
                is_submit: form.is_submit,
                user_id: userInfo?.id ?? null,
                products: validRows.map(r => ({
                    id: r.id,
                    product_id: Number(r.product_id),
                    qty: Number(r.qty),
                    rate: Number(r.rate),
                    vat_amt: Number(r.vat_amt) || 0,
                    disc_amt: Number(r.disc_amt) || 0,
                    total_amount: (Number(r.qty) * Number(r.rate)) + Number(r.vat_amt || 0) - Number(r.disc_amt || 0),
                })),
            };

            const res = await saveInvoiceAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(mode === 'edit' ? 'Invoice updated successfully!' : 'Invoice created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save invoice.');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-5xl bg-white dark:bg-[#0a1120] shadow-2xl z-50 flex flex-col overflow-hidden border-l border-slate-200/60 dark:border-slate-700/40 transition-transform duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {mode === 'view'
                                    ? (viewData?.master?.invoice_no ?? 'Invoice Detail')
                                    : mode === 'edit' ? 'Edit Invoice' : 'New Invoice'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {mode === 'view'
                                    ? (viewData?.master?.customer_name ?? 'Loading…')
                                    : mode === 'edit' ? 'Update the invoice details'
                                        : 'Fill in the details to create a sales invoice'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {mode === 'view' ? (
                        loading ? (
                            <div className="flex items-center justify-center py-24">
                                <svg className="w-8 h-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                                    <path d="M3 12a9 9 0 019-9" strokeLinecap="round" />
                                </svg>
                            </div>
                        ) : viewData ? (
                            <ViewBody viewData={viewData} />
                        ) : null
                    ) : (mode === 'edit' && loading) ? (
                        <div className="flex items-center justify-center py-24">
                            <svg className="w-8 h-8 animate-spin text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                                <path d="M3 12a9 9 0 019-9" strokeLinecap="round" />
                            </svg>
                        </div>
                    ) : (
                        /* ── Create / Edit form ── */
                        <div className="px-6 py-5 space-y-5">

                            {/* Basic info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={LABEL_CLS}>Shop</label>
                                    <SelectInput
                                        disabled
                                        options={shopOptions}
                                        value={form.shop_id}
                                        onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                                        placeholder="Select shop…"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLS}>Invoice Date</label>
                                    <input disabled type="date" value={form.invoice_date}
                                        onChange={e => setForm(prev => ({ ...prev, invoice_date: e.target.value }))}
                                        className={INPUT_CLS} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <label className={LABEL_CLS}>Customer</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomerForm({ customer_name: '', phone_no: '' });
                                            setCustomerModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition mb-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add Customer
                                    </button>
                                </div>
                                <SelectInput
                                    options={customerOptions}
                                    value={form.customer_id}
                                    onChange={v => setForm(prev => ({ ...prev, customer_id: v }))}
                                    placeholder="Select customer…"
                                />
                            </div>

                            {/* Product rows */}
                            <div className={SECTION_CLS}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className={LABEL_CLS + ' mb-0'}>Products</p>
                                    <button type="button" onClick={addRow}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                                        Add Row
                                    </button>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                                    <table className="w-full text-sm min-w-175">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/40">
                                                {['Product', 'Qty', 'Rate', 'VAT', 'Disc', 'Total', ''].map(h => (
                                                    <th key={h} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => {
                                                const rowTotal = (Number(row.qty) * Number(row.rate || 0)) + Number(row.vat_amt || 0) - Number(row.disc_amt || 0);
                                                return (
                                                    <tr key={row._key} className="border-b border-slate-100 dark:border-slate-800/30 last:border-0">
                                                        <td className="px-2 py-2 min-w-42">
                                                            <SelectInput
                                                                options={productOptions}
                                                                value={row.product_id}
                                                                onChange={v => updateRow(row._key, 'product_id', v)}
                                                                placeholder="Select product…"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="1" value={row.qty}
                                                                onChange={e => updateRow(row._key, 'qty', e.target.value)}
                                                                placeholder="0" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="0.01" value={row.rate}
                                                                onChange={e => updateRow(row._key, 'rate', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="0.01" value={row.vat_amt}
                                                                onChange={e => updateRow(row._key, 'vat_amt', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="0.01" value={row.disc_amt}
                                                                onChange={e => updateRow(row._key, 'disc_amt', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32 tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                            ৳{fmt(rowTotal)}
                                                        </td>
                                                        <td className="px-2 py-2 w-10">
                                                            <button type="button" onClick={() => removeRow(row._key)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment summary */}
                            <div className={SECTION_CLS}>
                                <p className={LABEL_CLS}>Payment Summary</p>
                                <div className="bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Amount</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">৳ {fmt(totals.total_amount)}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Discount</label>
                                            <input type="number" min="0" step="0.01"
                                                value={form.discount_amount}
                                                onChange={e => setForm(prev => ({ ...prev, discount_amount: e.target.value }))}
                                                placeholder="0.00"
                                                className={INPUT_SM} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">VAT</label>
                                            <input type="number" min="0" step="0.01"
                                                value={form.vat_amount}
                                                onChange={e => setForm(prev => ({ ...prev, vat_amount: e.target.value }))}
                                                placeholder="0.00"
                                                className={INPUT_SM} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Net Amount</span>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">৳ {fmt(totals.net_amount)}</span>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Paid Amount</label>
                                        <input type="number" min="0" step="0.01"
                                            value={totals.paid_amount}
                                            onChange={e => setForm(prev => ({ ...prev, paid_amount: e.target.value }))}
                                            placeholder="0.00"
                                            className={INPUT_SM} />
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Due Amount</span>
                                        <span className={`text-sm font-bold tabular-nums ${totals.due_amount > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                            ৳ {fmt(totals.due_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className={SECTION_CLS + ' space-y-3'}>
                                <Toggle
                                    label="Submit"
                                    checked={Boolean(form.is_submit)}
                                    onChange={v => setForm(prev => ({ ...prev, is_submit: v ? 1 : 0 }))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {customerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setCustomerModalOpen(false)} />
                        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/70 bg-white dark:border-slate-700/70 dark:bg-slate-950 shadow-2xl">
                            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/70">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Customer</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a new customer and select it immediately.</p>
                                </div>
                                <button type="button" onClick={() => setCustomerModalOpen(false)} className="rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4">
                                <div>
                                    <label className={LABEL_CLS} htmlFor="new_customer_name">Customer Name</label>
                                    <input
                                        id="new_customer_name"
                                        type="text"
                                        value={customerForm.customer_name}
                                        onChange={e => handleCustomerFormChange('customer_name', e.target.value)}
                                        placeholder="Enter customer name"
                                        className={INPUT_CLS}
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className={LABEL_CLS} htmlFor="new_customer_phone">Phone</label>
                                    <input
                                        id="new_customer_phone"
                                        type="tel"
                                        value={customerForm.phone_no}
                                        onChange={e => handleCustomerFormChange('phone_no', e.target.value)}
                                        placeholder="Enter phone number"
                                        className={INPUT_CLS}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t border-slate-200/70 dark:border-slate-800/70 px-6 py-4 bg-slate-50 dark:bg-slate-900">
                                <button type="button" onClick={() => setCustomerModalOpen(false)} disabled={customerModalLoading}
                                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleCreateCustomer} disabled={customerModalLoading}
                                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60">
                                    {customerModalLoading ? 'Saving…' : 'Save Customer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer — create & edit modes */}
                {(mode === 'create' || mode === 'edit') && (
                    <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                        <button type="button" onClick={onClose} disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                            Cancel
                        </button>
                        {isAlreadySubmitted != 1 && (<button type="button" onClick={handleSubmit} disabled={saving}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${btnColor}`}>
                            {saving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path className="opacity-25" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : mode === 'edit' ? 'Update Invoice' : 'Save Invoice'}
                        </button>)}

                    </div>
                )}
            </div>
        </>
    );
}
