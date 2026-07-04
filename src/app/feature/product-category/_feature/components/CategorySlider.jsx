'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveCategorySubcategoryAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const EMPTY_FORM = {
    id: null,
    parent_category_id: '',
    category_name: '',
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

export default function CategorySlider({ isOpen, onClose, categories = [], userInfo, onSaved, editData }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    parent_category_id: editData.parent_category_id != null ? String(editData.parent_category_id) : '',
                    category_name: editData.category_name ?? '',
                });
            } else {
                setForm(EMPTY_FORM);
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isOpen, editData]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!form.category_name.trim()) {
            toast.error('Category name is required.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                parent_category_id: form.parent_category_id ? Number(form.parent_category_id) : null,
                category_name: form.category_name.trim(),
                company_id: Number(userInfo?.company_id ?? 1),
                created_by: Number(userInfo?.id ?? 1),
            };

            const res = await saveCategorySubcategoryAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Category updated successfully!' : 'Category saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save category.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const parentOptions = categories
        .filter(c => c.id !== editData?.id)
        .map(c => ({ value: String(c.id), label: c.category_name }));

    const isSubcategory = Boolean(form.parent_category_id);

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
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSubcategory ? 'bg-purple-100 dark:bg-purple-500/10' : 'bg-emerald-100 dark:bg-emerald-500/10'}`}>
                            {isEdit ? (
                                <svg className={`w-4 h-4 ${isSubcategory ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className={`w-4 h-4 ${isSubcategory ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit
                                    ? `Edit ${editData?.parent_category_id != null ? 'Subcategory' : 'Category'}`
                                    : isSubcategory ? 'New Subcategory' : 'New Category'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit
                                    ? `Editing: ${editData?.category_name}`
                                    : isSubcategory
                                        ? 'Select a parent category to create a subcategory'
                                        : 'Leave parent empty to create a top-level category'}
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

                {/* Form body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {/* Category name */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="cat_name">
                            Category Name <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <input
                            id="cat_name"
                            type="text"
                            value={form.category_name}
                            onChange={e => setForm(prev => ({ ...prev, category_name: e.target.value }))}
                            placeholder="e.g. Mobile, Accessories…"
                            className={INPUT_CLS}
                            autoComplete="off"
                        />
                    </div>

                    {/* Parent category */}
                    <div>
                        <label className={LABEL_CLS} htmlFor="cat_parent">
                            Parent Category
                            <span className="ml-1.5 text-[10px] normal-case font-normal text-slate-400 dark:text-slate-500">(leave empty for top-level)</span>
                        </label>
                        <SelectInput
                            id="cat_parent"
                            options={parentOptions}
                            value={form.parent_category_id}
                            onChange={v => setForm(prev => ({ ...prev, parent_category_id: v }))}
                            placeholder="Select parent category…"
                        />
                        {form.parent_category_id && (
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, parent_category_id: '' }))}
                                className="mt-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                                Clear parent (make top-level)
                            </button>
                        )}
                    </div>

                    {/* Type hint */}
                    <div className={`rounded-xl border px-4 py-3 ${isSubcategory ? 'bg-purple-50 dark:bg-purple-500/5 border-purple-200/60 dark:border-purple-500/20' : 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20'}`}>
                        <p className={`text-xs leading-relaxed ${isSubcategory ? 'text-purple-700 dark:text-purple-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {isSubcategory
                                ? 'This will be saved as a subcategory under the selected parent category.'
                                : 'This will be saved as a top-level category with no parent.'}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
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
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${isSubcategory ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'}`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update' : 'Save')}
                    </button>
                </div>
            </div>
        </>
    );
}
