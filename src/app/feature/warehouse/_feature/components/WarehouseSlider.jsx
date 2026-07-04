'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveWarehouseAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    warehouse_name: '',
    address: '',
    company_id: '',
    created_by: ''
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

export default function WarehouseSlider({ isOpen, onClose, shops, userInfo, onSaved, editData }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Populate form when slider opens — deferred to avoid synchronous setState inside effect
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    shop_id: String(editData.shop_id ?? ''),
                    warehouse_name: editData.warehouse_name ?? '',
                    address: editData.address ?? '',
                    company_id: userInfo?.company_id ?? '',
                    created_by: userInfo?.id ?? ''
                });
            } else {
                setForm({
                    ...EMPTY_FORM,
                    company_id: userInfo?.company_id ?? '',
                    created_by: userInfo?.id ?? ''
                });
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isOpen, editData, userInfo]);

    // Prevent body scroll when open
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
        if (!form.warehouse_name.trim()) {
            toast.error('Warehouse name is required.');
            return;
        }
        if (!form.shop_id) {
            toast.error('Please select a shop.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                shop_id: Number(form.shop_id),
                warehouse_name: form.warehouse_name.trim(),
                company_id: Number(form.company_id),
                address: form.address.trim() || null,
                created_by: Number(form.created_by)
            };

            const res = await saveWarehouseAction(payload);

            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Warehouse updated successfully!' : 'Warehouse saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save warehouse.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Slider Panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/10">
                            {isEdit ? (
                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Warehouse' : 'New Warehouse'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.warehouse_name}` : 'Fill in the details to create a warehouse'}
                            </p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {/* Warehouse Name */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="warehouse_name">
                            Warehouse Name <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <input
                            id="warehouse_name"
                            name="warehouse_name"
                            type="text"
                            value={form.warehouse_name}
                            onChange={handleChange}
                            placeholder="e.g. Main Warehouse"
                            className={INPUT_CLS}
                            autoComplete="off"
                        />
                    </div>

                    {/* Shop */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="wh_shop_id">
                            Shop <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <SelectInput
                            id="wh_shop_id"
                            options={shops.map(s => ({ value: String(s.id), label: s.shop_name }))}
                            value={String(form.shop_id)}
                            onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                            placeholder="Select a shop…"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter warehouse address (optional)"
                            rows={3}
                            className={`${INPUT_CLS} resize-none`}
                        />
                    </div>

                    {/* Info hint */}
                    <div className="rounded-xl border px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20">
                        <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                            {isEdit
                                ? 'You are editing an existing warehouse. Changes will be saved immediately after confirmation.'
                                : 'Company and user info will be attached automatically from your active session.'}
                        </p>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Warehouse' : 'Save Warehouse')}
                    </button>
                </div>
            </div>
        </>
    );
}

