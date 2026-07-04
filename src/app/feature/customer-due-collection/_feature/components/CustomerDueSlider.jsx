'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import SelectInput from '@/components/ui/SelectInput';
import { saveCustomerDueAction } from '../action';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    customer_id: '',
    ref_type: '1',
    ref_id: '',
    invoice_no: '',
    due_date: today(),
    total_amount: '',
    paid_amount: '',
    due_amount: '',
    payment_status: '1',
    remarks: '',
    user_id: '',
};

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const buildInitialForm = (initialData, pendingCustomers, userInfo) => {
    const isDueRecord = initialData?.invoice_no != null;
    const selectedCustomer = initialData
        ? pendingCustomers.find(item => String(item.id) === String(initialData.customer_id ?? initialData.id)) || initialData
        : null;

    if (isDueRecord) {
        return {
            ...EMPTY_FORM,
            id: initialData.id ?? null,
            shop_id: String(initialData.shop_id ?? userInfo?.shop_id ?? ''),
            customer_id: String(initialData.customer_id ?? initialData.id ?? ''),
            ref_type: String(initialData.ref_type ?? 1),
            ref_id: String(initialData.ref_id ?? ''),
            invoice_no: String(initialData.invoice_no ?? ''),
            due_date: initialData.due_date || today(),
            total_amount: initialData.total_amount != null ? String(initialData.total_amount) : '',
            paid_amount: initialData.paid_amount != null ? String(initialData.paid_amount) : '',
            due_amount: initialData.due_amount != null ? String(initialData.due_amount) : '',
            payment_status: String(initialData.payment_status ?? 1),
            remarks: initialData.remarks ?? '',
            user_id: String(userInfo?.id ?? ''),
        };
    }

    return {
        ...EMPTY_FORM,
        shop_id: String(userInfo?.shop_id ?? ''),
        user_id: String(userInfo?.id ?? ''),
        customer_id: selectedCustomer ? String(selectedCustomer.id ?? '') : '',
        total_amount: selectedCustomer?.previous_due != null ? String(selectedCustomer.previous_due) : '',
        paid_amount: selectedCustomer?.previous_due != null ? String(selectedCustomer.previous_due) : '',
        due_date: today(),
        remarks: selectedCustomer ? `Collection from ${selectedCustomer.customer_name}` : '',
    };
};

export default function CustomerDueSlider({ isOpen, onClose, userInfo, pendingCustomers = [], initialData, onSaved, invoiceWiseDue = [] }) {
    const isEdit = Boolean(initialData?.invoice_no && initialData?.id);
    const [form, setForm] = useState(() => buildInitialForm(initialData, pendingCustomers, userInfo));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setForm(buildInitialForm(initialData, pendingCustomers, userInfo));
    }, [isOpen, initialData, pendingCustomers, userInfo]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const customerOptions = useMemo(
        () => pendingCustomers.map(item => ({ value: String(item.id), label: `${item.customer_name} (${fmt(item.previous_due)})` })),
        [pendingCustomers]
    );

    const selectedCustomer = useMemo(
        () => pendingCustomers.find(item => String(item.id) === String(form.customer_id)) ?? null,
        [pendingCustomers, form.customer_id]
    );

    const totalAmount = Number(form.total_amount || selectedCustomer?.previous_due || 0);
    const paidAmount = Number(form.paid_amount || 0);
    const dueAmount = Math.max(totalAmount - paidAmount, 0);
    const paymentStatus = dueAmount === 0 ? 2 : 1;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCustomerChange = (value) => {
        const match = pendingCustomers.find(item => String(item.id) === String(value));
        setForm(prev => ({
            ...prev,
            customer_id: value,
            total_amount: match?.previous_due != null ? String(match.previous_due) : prev.total_amount,
            paid_amount: match?.previous_due != null ? String(match.previous_due) : prev.paid_amount,
            remarks: match ? `Collection from ${match.customer_name}` : prev.remarks,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!form.customer_id) {
            toast.error('Please select a customer.');
            return;
        }


        if (!form.invoice_no.trim()) {
            toast.error('Invoice no is required.');
            return;
        }

        if (!form.due_date) {
            toast.error('Collection date is required.');
            return;
        }

        setSaving(true);
        try {

            const payload = {
                id: isEdit ? Number(form.id) : null,
                shop_id: Number(form.shop_id || userInfo?.shop_id || 0),
                customer_id: Number(form.customer_id),
                ref_type: Number(form.ref_type || 1),
                ref_id: form.ref_id,
                invoice_no: form.invoice_no.trim(),
                due_date: form.due_date,
                total_amount: Number(form.total_amount || 0),
                paid_amount: Number(form.paid_amount || 0),
                due_amount: Number(dueAmount),
                payment_status: Number(paymentStatus),
                remarks: form.remarks.trim() || null,
                user_id: Number(form.user_id || userInfo?.id || 0),
            };

            const res = await saveCustomerDueAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Customer due collection updated successfully!' : 'Customer due collection saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save customer due collection.');
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
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{isEdit ? 'Edit Due Collection' : 'New Due Collection'}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{isEdit ? 'Update customer due collection details' : 'Collect customer due against an invoice reference'}</p>
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
                        <label className={LABEL_CLS} htmlFor="customer_id">Customer <span className="text-red-500 normal-case font-normal">*</span></label>
                        <SelectInput id="customer_id" options={customerOptions} value={String(form.customer_id)} onChange={handleCustomerChange} placeholder="Select pending customer…" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="due_date">Collection Date <span className="text-red-500 normal-case font-normal">*</span></label>
                            <input id="due_date" name="due_date" type="date" value={form.due_date} onChange={handleChange} className={INPUT_CLS} />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="invoice_no">Invoice No <span className="text-red-500 normal-case font-normal">*</span></label>
                            <SelectInput
                                id="ref_type"
                                options={invoiceWiseDue.map(inv => ({
                                    value: String(inv.invoice_no),
                                    label: inv.invoice_no,
                                }))}
                                value={form.invoice_no}
                                onChange={(value) => {
                                    const selectedInvoice = invoiceWiseDue.find(
                                        inv => String(inv.invoice_no) === String(value)
                                    );

                                    setForm(prev => ({
                                        ...prev,
                                        invoice_no: value,
                                        total_amount: selectedInvoice.due_amount,
                                        paid_amount: selectedInvoice.due_amount,
                                        ref_id: selectedInvoice?.id || "",
                                    }));
                                }}
                                placeholder="Select invoice..."
                            />

                        </div>
                    </div>



                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="total_amount">Total Amount</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>

                                <input id="total_amount" name="total_amount" type="number" min="0" step="0.01" value={form.total_amount} onChange={handleChange} className={`${INPUT_CLS} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="paid_amount">Collected Amount</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                                <input id="paid_amount" name="paid_amount" type="number" min="0" step="0.01" value={form.paid_amount} onChange={handleChange} className={`${INPUT_CLS} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS}>Due Amount</label>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400">
                                ৳ {fmt(dueAmount)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS}>Payment Status</label>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {paymentStatus === 2 ? 'Paid' : 'Partial'}
                            </div>
                        </div>
                        {selectedCustomer && (
                            <div>
                                <label className={LABEL_CLS}>Selected Customer Due</label>
                                <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    ৳ {fmt(selectedCustomer.previous_due)}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={LABEL_CLS} htmlFor="remarks">Remarks</label>
                        <textarea id="remarks" name="remarks" value={form.remarks} onChange={handleChange} rows={4} placeholder="Add collection notes…" className={`${INPUT_CLS} resize-none`} />
                    </div>

                    <div className="rounded-xl border px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <p className="text-xs leading-relaxed">Use pending customer selection to prefill due amount, then submit collection with invoice reference.</p>
                    </div>
                </form>

                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">Cancel</button>

                    {!form.id && (<button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30">
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Collection' : 'Save Collection')}
                    </button>)}
                </div>
            </div>
        </>
    );
}