'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveShopAction } from '../action';
// import { saveShop } from '@/services/shop';

const EMPTY_FORM = {
    id: null,
    company_id: '',
    shop_name: '',
    display_code: '',
    short_code: '',
    phone: '',
    address: '',
    address_2: '',
    slogan: '',
    created_by: ''
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS =
    'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

export default function ShopSlider({ isOpen, onClose, userInfo, onSaved, editData }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    company_id: editData.company_id ?? userInfo?.company_id ?? '',
                    shop_name: editData.shop_name ?? '',
                    display_code: editData.display_code ?? '',
                    short_code: editData.short_code ?? '',
                    phone: editData.phone ?? '',
                    address: editData.address ?? '',
                    address_2: editData.address_2 ?? '',
                    slogan: editData.slogan ?? '',
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
        if (!form.shop_name.trim()) { toast.error('Shop name is required.'); return; }
        if (!form.display_code.trim()) { toast.error('Display code is required.'); return; }

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                company_id: Number(form.company_id),
                shop_name: form.shop_name.trim(),
                display_code: form.display_code.trim(),
                short_code: form.short_code.trim() || null,
                phone: form.phone.trim() || null,
                address: form.address.trim() || null,
                address_2: form.address_2.trim() || null,
                slogan: form.slogan.trim() || null,
                created_by: Number(form.created_by)
            };

            const res = await saveShopAction(payload);

            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Shop updated successfully!' : 'Shop created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save shop.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const isEditCls = { btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30', iconBg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', hint: 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isEditCls.iconBg}`}>
                            {isEdit ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Shop' : 'New Shop'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.shop_name}` : 'Fill in the details to create a shop'}
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

                    {/* Shop Name */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="shop_name">
                            Shop Name <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <input id="shop_name" name="shop_name" type="text" value={form.shop_name}
                            onChange={handleChange} placeholder="e.g. Main Branch"
                            className={INPUT_CLS} autoComplete="off" />
                    </div>

                    {/* Codes – 2 col */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="display_code">
                                Display Code <span className="text-red-500 normal-case font-normal">*</span>
                            </label>
                            <input id="display_code" name="display_code" type="text" value={form.display_code}
                                onChange={handleChange} placeholder="e.g. SHOP-001"
                                className={INPUT_CLS} autoComplete="off" />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="short_code">Short Code</label>
                            <input id="short_code" name="short_code" type="text" value={form.short_code}
                                onChange={handleChange} placeholder="e.g. MAIN"
                                className={INPUT_CLS} autoComplete="off" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="phone">Phone</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </span>
                            <input id="phone" name="phone" type="tel" value={form.phone}
                                onChange={handleChange} placeholder="e.g. 01700000000"
                                className={`${INPUT_CLS} pl-10`} autoComplete="off" />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="address">Address</label>
                        <input id="address" name="address" type="text" value={form.address}
                            onChange={handleChange} placeholder="Primary address"
                            className={INPUT_CLS} autoComplete="off" />
                    </div>

                    {/* Address 2 */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="address_2">Address 2</label>
                        <input id="address_2" name="address_2" type="text" value={form.address_2}
                            onChange={handleChange} placeholder="Area / landmark (optional)"
                            className={INPUT_CLS} autoComplete="off" />
                    </div>

                    {/* Slogan */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="slogan">Slogan</label>
                        <input id="slogan" name="slogan" type="text" value={form.slogan}
                            onChange={handleChange} placeholder="e.g. Best Shop in Town"
                            className={INPUT_CLS} autoComplete="off" />
                    </div>

                    {/* Hint */}
                    <div className={`rounded-xl border px-4 py-3 ${isEditCls.hint}`}>
                        <p className="text-xs leading-relaxed">
                            {isEdit
                                ? 'You are editing an existing shop. Changes will take effect immediately.'
                                : 'Company info is attached automatically from your active session.'}
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3">
                    <button type="button" onClick={onClose} disabled={saving}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={saving}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${isEditCls.btn}`}>
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Shop' : 'Create Shop')}
                    </button>
                </div>
            </div>
        </>
    );
}
