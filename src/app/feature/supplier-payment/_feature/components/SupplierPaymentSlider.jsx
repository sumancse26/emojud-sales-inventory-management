'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SelectInput from '@/components/ui/SelectInput';
import { getPaymentMethodList } from '@/services/common';
import { saveSupplierPaymentAction } from '../action';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    supplier_id: '',
    payment_date: today(),
    ref_purchase_id: '',
    payment_method_id: '',
    total_due: '',
    paid_amount: '',
    current_due: '',
    remarks: '',
    user_id: '',
};

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const buildInitialForm = (initialData, pendingSuppliers, userInfo) => {
    const selectedSupplier = initialData
        ? pendingSuppliers.find(item => String(item.id) === String(initialData.id)) || initialData
        : null;

    return {
        ...EMPTY_FORM,
        shop_id: String(userInfo?.shop_id ?? ''),
        user_id: String(userInfo?.id ?? ''),
        supplier_id: selectedSupplier ? String(selectedSupplier.id ?? '') : '',
        total_due: selectedSupplier?.previous_due != null ? String(selectedSupplier.previous_due) : '',
        paid_amount: selectedSupplier?.previous_due != null ? String(selectedSupplier.previous_due) : '',
        payment_date: today(),
        remarks: selectedSupplier ? `Payment for ${selectedSupplier.supplier_name}` : '',
    };
};

export default function SupplierPaymentSlider({ isOpen, onClose, userInfo, paymentMethods = [], pendingSuppliers = [], initialData, onSaved, paymentDueList = [] }) {
    const [form, setForm] = useState(() => buildInitialForm(initialData, pendingSuppliers, userInfo));
    const [saving, setSaving] = useState(false);
    const [fetchedMethods, setFetchedMethods] = useState([]);

    useEffect(() => {
        if (!isOpen || paymentMethods.length) return;

        const loadMethods = async () => {
            try {
                const res = await getPaymentMethodList();
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                setFetchedMethods(list);
            } catch {
                toast.error('Failed to load payment methods.');
            }
        };

        loadMethods();
    }, [isOpen, paymentMethods.length]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const methods = paymentMethods.length ? paymentMethods : fetchedMethods;

    const supplierOptions = useMemo(
        () => pendingSuppliers.map(item => ({ value: String(item.id), label: `${item.supplier_name} (${fmt(item.previous_due)})` })),
        [pendingSuppliers]
    );

    const paymentMethodOptions = useMemo(
        () => methods.map(item => ({ value: String(item.id), label: item.name ?? item.lookup_value ?? item.payment_method_name ?? String(item.id) })),
        [methods]
    );

    const selectedSupplier = useMemo(
        () => pendingSuppliers.find(item => String(item.id) === String(form.supplier_id)) ?? null,
        [pendingSuppliers, form.supplier_id]
    );

    const totalDue = Number(form.total_due || selectedSupplier?.previous_due || 0);
    const paidAmount = Number(form.paid_amount || 0);
    const currentDue = Math.max(totalDue - paidAmount, 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSupplierChange = (value) => {
        const match = pendingSuppliers.find(item => String(item.id) === String(value));
        setForm(prev => ({
            ...prev,
            supplier_id: value,
            total_due: match?.previous_due != null ? String(match.previous_due) : prev.total_due,
            paid_amount: match?.previous_due != null ? String(match.previous_due) : prev.paid_amount,
            remarks: match ? `Payment for ${match.supplier_name}` : prev.remarks,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.supplier_id) {
            toast.error('Please select a supplier.');
            return;
        }

        if (!form.payment_method_id) {
            toast.error('Please select a payment method.');
            return;
        }

        if (!form.payment_date) {
            toast.error('Payment date is required.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: null,
                shop_id: Number(form.shop_id || userInfo?.shop_id || 0),
                supplier_id: Number(form.supplier_id),
                payment_date: form.payment_date,
                purchase_no: form.purchase_no,
                ref_purchase_id: form.ref_purchase_id || null,
                payment_method_id: Number(form.payment_method_id),
                total_due: Number(form.total_due || 0),
                paid_amount: Number(form.paid_amount || 0),
                current_due: Number(currentDue),
                remarks: form.remarks.trim() || null,
                user_id: Number(form.user_id || userInfo?.id || 0),
            };
            const res = await saveSupplierPaymentAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success('Supplier payment saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save supplier payment.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">New Supplier Payment</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Record a payment against the selected supplier due</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Close">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div>
                        <label className={LABEL_CLS} htmlFor="supplier_id">Supplier <span className="text-red-500 normal-case font-normal">*</span></label>
                        <SelectInput id="supplier_id" options={supplierOptions} value={String(form.supplier_id)} onChange={handleSupplierChange} placeholder="Select pending supplier…" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="payment_date">Payment Date <span className="text-red-500 normal-case font-normal">*</span></label>
                            <input id="payment_date" name="payment_date" type="date" value={form.payment_date} onChange={handleChange} className={INPUT_CLS} />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="payment_method_id">Payment Method <span className="text-red-500 normal-case font-normal">*</span></label>
                            <SelectInput id="payment_method_id" options={paymentMethodOptions} value={String(form.payment_method_id)} onChange={(value) => setForm(prev => ({ ...prev, payment_method_id: value }))} placeholder="Select method…" />
                        </div>
                    </div>


                    <div>
                        <label className={LABEL_CLS} htmlFor="purchase_list">Purchase List<span className="text-red-500 normal-case font-normal">*</span></label>
                        <SelectInput
                            id="purchase_id"
                            options={paymentDueList.map(pur => ({
                                value: String(pur.purchase_no),
                                label: pur.purchase_no,
                            }))}
                            value={form.purchase_no}
                            onChange={(value) => {
                                const selectedPurchase = paymentDueList.find(
                                    pur => String(pur.purchase_no) === String(value)
                                );

                                setForm(prev => ({
                                    ...prev,
                                    purchase_no: value,
                                    total_due: selectedPurchase.due_amount,
                                    paid_amount: selectedPurchase.due_amount,
                                    ref_purchase_id: selectedPurchase?.id || "",
                                }));
                            }}
                            placeholder="Select invoice..."
                        />
                    </div>
                    {/* <div>
                            <label className={LABEL_CLS} htmlFor="ref_purchase_id">Reference Purchase No</label>
                            <input id="ref_purchase_id" name="ref_purchase_id" type="text" value={form.ref_purchase_id} onChange={handleChange} placeholder="PUR-00001" className={INPUT_CLS} autoComplete="off" />
                        </div> */}




                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="total_due">Total Due</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                                <input id="total_due" name="total_due" type="number" min="0" step="0.01" value={form.total_due} onChange={handleChange} className={`${INPUT_CLS} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="paid_amount">Paid Amount</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                                <input id="paid_amount" name="paid_amount" type="number" min="0" step="0.01" value={form.paid_amount} onChange={handleChange} className={`${INPUT_CLS} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS}>Current Due</label>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400">
                                ৳ {fmt(currentDue)}
                            </div>
                        </div>
                    </div>

                    {selectedSupplier && (
                        <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-400">
                            Selected supplier due: ৳ {fmt(selectedSupplier.previous_due)}
                        </div>
                    )}

                    <div>
                        <label className={LABEL_CLS} htmlFor="remarks">Remarks</label>
                        <textarea id="remarks" name="remarks" value={form.remarks} onChange={handleChange} rows={4} placeholder="Add payment notes…" className={`${INPUT_CLS} resize-none`} />
                    </div>

                    <div className="rounded-xl border px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <p className="text-xs leading-relaxed">Use a pending supplier record to auto-fill the due amount and keep the payment aligned with the supplier balance.</p>
                    </div>
                </form>

                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">Cancel</button>
                    <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30">
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving…
                            </>
                        ) : 'Save Payment'}
                    </button>
                </div>
            </div>
        </>
    );
}