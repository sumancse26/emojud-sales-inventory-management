'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { saveDepartmentAction } from '../action';

const EMPTY_FORM = { id: null, department_name: '', display_code: '', status: 0, company_id: null, user_id: null };

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

export default function DepartmentSlider({ isOpen, onClose, userInfo, onSaved, editData }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    department_name: editData.department_name ?? '',
                    display_code: editData.display_code ?? '',
                    company_id: userInfo.company_id ?? null,
                    status: editData.status,
                    user_id: userInfo.user_id ?? null,
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.department_name.trim()) {
            toast.error('Department name is required.');
            return;
        }


        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                department_name: form.department_name.trim(),
                display_code: form.display_code.trim() ?? '',
                status: form.status ?? 0,
                company_id: Number(userInfo?.company_id ?? 1),
                user_id: Number(userInfo?.id ?? 1),
            };


            const res = await saveDepartmentAction(payload);
            if (res?.response_code == 200 || res?.success) {
                toast.success(isEdit ? 'Department updated successfully!' : 'Department saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save department.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-500/10">
                            {isEdit ? (
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Department' : 'New Department'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.department_name}` : 'Fill in the details to create a department'}
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
                    <div>
                        <label className={LABEL_CLS} htmlFor="department_name">
                            Department Name <span className="text-red-500 normal-case font-normal">*</span>
                        </label>
                        <input
                            id="department_name"
                            name="department_name"
                            type="text"
                            value={form.department_name}
                            onChange={handleChange}
                            placeholder="e.g. Sales, HR, Admin…"
                            className={INPUT_CLS}
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className={LABEL_CLS} htmlFor="display_code">
                            Display Code <span className="text-red-500 normal-case font-normal"></span>
                        </label>
                        <input
                            id="display_code"
                            name="display_code"
                            type="text"
                            value={form.display_code}
                            onChange={handleChange}
                            placeholder="e.g. SLS, HR, ADM…"
                            maxLength={10}
                            className={`${INPUT_CLS} uppercase`}
                            autoComplete="off"
                        />
                        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">Short code used as identifier. Will be uppercased automatically.</p>
                    </div>
                    <div>
                        <label
                            htmlFor="status"
                            className={`flex items-center justify-between gap-3 cursor-pointer ${LABEL_CLS}`}
                        >
                            <span>Status</span>

                            <div className="flex items-center gap-3">
                                <button
                                    id="status"
                                    type="button"
                                    role="switch"
                                    aria-checked={form.status === 1}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            status: prev.status === 1 ? 0 : 1,
                                        }))
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${form.status === 1
                                        ? "bg-emerald-500"
                                        : "bg-slate-300 dark:bg-slate-700"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${form.status === 1
                                            ? "translate-x-5"
                                            : "translate-x-0.5"
                                            }`}
                                    />
                                </button>
                            </div>
                        </label>
                    </div>

                    <div className="rounded-xl border px-4 py-3 bg-blue-50 dark:bg-blue-500/5 border-blue-200/60 dark:border-blue-500/20">
                        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-400">
                            {isEdit
                                ? 'You are editing an existing department. Changes will be saved immediately after confirmation.'
                                : 'Company and user info will be attached automatically from your active session.'}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all shadow-sm shadow-emerald-600/25"
                        >
                            {saving ? 'Saving…' : isEdit ? 'Update Department' : 'Save Department'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
