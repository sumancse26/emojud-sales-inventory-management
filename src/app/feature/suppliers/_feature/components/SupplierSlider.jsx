'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveSupplierAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    supplier_name: '',
    phone: '',
    email: '',
    address: '',
    previous_due: '',
    created_by: ''
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS =
    'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

export default function SupplierSlider({ isOpen, onClose, shops, userInfo, onSaved, editData }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    shop_id: String(editData.shop_id ?? ''),
                    supplier_name: editData.supplier_name ?? '',
                    phone: editData.phone ?? '',
                    email: editData.email ?? '',
                    address: editData.address ?? '',
                    previous_due: editData.previous_due ?? '',
                    created_by: userInfo?.id ?? ''
                });
            } else {
                setForm({
                    ...EMPTY_FORM,
                    shop_id: String(userInfo?.shop_id ?? ''),
                    created_by: userInfo?.id ?? ''
                });
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isOpen, editData, userInfo]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.supplier_name.trim()) { toast.error('Supplier name is required.'); return; }
        if (!form.phone.trim()) { toast.error('Phone number is required.'); return; }
        if (!form.shop_id) { toast.error('Please select a shop.'); return; }

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                shop_id: Number(form.shop_id),
                supplier_name: form.supplier_name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim() || null,
                address: form.address.trim() || null,
                previous_due: form.previous_due !== '' ? Number(form.previous_due) : 0,
                created_by: Number(form.created_by)
            };

            const res = await saveSupplierAction(payload);

            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Supplier updated successfully!' : 'Supplier created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save supplier.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const accentOpen = 'border-emerald-500/70 bg-white ring-2 ring-emerald-500/15 dark:border-emerald-500/60 dark:bg-slate-950';
    const btnColor = 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30';
    const iconBg = 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    const hintBg = 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400';

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                            {isEdit ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M19 8v6M22 11h-6" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Supplier' : 'New Supplier'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.supplier_name}` : 'Fill in the details to add a supplier'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Close">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {/* Supplier Name */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="supplier_name">
                            Supplier Name <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <input id="supplier_name" name="supplier_name" type="text" value={form.supplier_name}
                            onChange={handleChange} placeholder="e.g. ABC Traders"
                            className={INPUT_CLS} autoComplete="off" />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="phone">
                            Phone <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </span>
                            <input id="phone" name="phone" type="tel" value={form.phone}
                                onChange={handleChange} placeholder="e.g. 01800000000"
                                className={`${INPUT_CLS} pl-10`} autoComplete="off" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                                </svg>
                            </span>
                            <input id="email" name="email" type="email" value={form.email}
                                onChange={handleChange} placeholder="e.g. abc@gmail.com"
                                className={`${INPUT_CLS} pl-10`} autoComplete="off" />
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="sup_shop_id">
                            Shop <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <SelectInput
                            id="sup_shop_id"
                            options={shops.map(s => ({ value: String(s.id), label: s.shop_name }))}
                            value={String(form.shop_id)}
                            onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                            placeholder="Select a shop…"
                        />
                    </div>

                    {/* Previous Due */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="previous_due">Previous Due</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                            <input id="previous_due" name="previous_due" type="number" min="0" step="0.01"
                                value={form.previous_due} onChange={handleChange}
                                placeholder="0.00"
                                className={`${INPUT_CLS} pl-8`} />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="address">Address</label>
                        <textarea id="address" name="address" value={form.address}
                            onChange={handleChange} placeholder="Enter supplier address (optional)"
                            rows={3} className={`${INPUT_CLS} resize-none`} />
                    </div>

                    {/* Hint */}
                    <div className={`rounded-xl border px-4 py-3 ${hintBg}`}>
                        <p className="text-xs leading-relaxed">
                            {isEdit
                                ? 'You are editing an existing supplier. All changes are saved immediately.'
                                : 'Supplier code will be auto-generated after saving.'}
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={saving}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={saving}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${btnColor}`}>
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Supplier' : 'Add Supplier')}
                    </button>
                </div>
            </div>
        </>
    );
}
