'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { saveCommissionProfitAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const today = () => new Date().toISOString().split('T')[0];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    year_id: currentYear,
    month_id: currentMonth,
    commission_amount: 0,
    is_received_commission: 0,
    received_date: today(),
    user_id: '',
};
const monthList = [
    {
        id: 1,
        name: 'JAN'
    },
    {
        id: 2,
        name: 'FEB'
    },
    {
        id: 3,
        name: 'MAR'
    },
    {
        id: 4,
        name: 'APR'
    },
    {
        id: 5,
        name: 'MAY'
    },
    {
        id: 6,
        name: 'JUN'
    },
    {
        id: 7,
        name: 'JUL'
    },
    {
        id: 8,
        name: 'AUG'
    },
    {
        id: 9,
        name: 'SEP'
    },
    {
        id: 10,
        name: 'OCT'
    },
    {
        id: 11,
        name: 'NOV'
    },
    {
        id: 12,
        name: 'DEC'
    },
];

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${checked
                ? 'bg-emerald-500'
                : 'bg-slate-200 dark:bg-slate-700'
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
            />
        </button>
    );
}

const buildInitialForm = (initialData, userInfo) => {
    if (initialData?.id) {
        console.log(initialData);
        return {
            ...EMPTY_FORM,
            id: initialData.id,
            shop_id: String(initialData.shop_id ?? userInfo?.shop_id ?? ''),
            year_id: Number(initialData.year_id || currentYear),
            month_id: Number(initialData.month_id || currentMonth),
            isReceived: initialData.isReceived,
            commission_amount: String(initialData.commission_amount ?? 0),
            is_received_commission: String(initialData.is_received_commission ?? 0),
            received_date: initialData.received_date || today(),
            user_id: String(userInfo?.id ?? ''),
        };
    }

    return {
        ...EMPTY_FORM,
        shop_id: String(userInfo?.shop_id ?? ''),
        user_id: String(userInfo?.id ?? ''),
    };
};

export default function CommissionProfitSlider({ isOpen, onClose, userInfo, initialData, onSaved }) {
    const isEdit = Boolean(initialData?.id);
    const [form, setForm] = useState(() => buildInitialForm(initialData, userInfo));
    const [saving, setSaving] = useState(false);
    const [months, setMonths] = useState(monthList);

    useEffect(() => {
        if (!isOpen) return;
        setForm(buildInitialForm(initialData, userInfo));
    }, [isOpen, initialData, userInfo]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        if (!form.year_id || !form.month_id || !form.commission_amount) {
            toast.error('Year, month and comission amount are required.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                shop_id: Number(form.shop_id || userInfo?.shop_id || 0),
                year_id: Number(form.year_id),
                month_id: Number(form.month_id),
                commission_amount: Number(form.commission_amount || 0),
                is_received_commission: Number(form.is_received_commission || 0),
                received_date: form.is_received_commission == 1 ? form.received_date : null,
                user_id: Number(form.user_id || userInfo?.id || 0),
            };

            const res = await saveCommissionProfitAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Commission record updated successfully!' : 'Commission record saved successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save commission record.');
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
                                <path d="M3 13.5l4.5-4.5 3 3L16.5 6l4.5 4.5" />
                                <path d="M3 20h18" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{isEdit ? 'Edit Commission' : 'New Commission'}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Record shop-wise commission and received status</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Close">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className={LABEL_CLS} htmlFor="year_id">Year <span className="text-red-500 normal-case font-normal">*</span></label>
                            <input id="year_id" name="year_id" type="number" min="2000" step="1" value={form.year_id} onChange={handleChange} className={INPUT_CLS} />
                        </div>
                        <div>
                            <label className={LABEL_CLS} htmlFor="month_id">Month <span className="text-red-500 normal-case font-normal">*</span></label>
                            {/* <input id="month_id" name="month_id" type="number" min="1" max="12" step="1" value={form.month_id} onChange={handleChange} className={INPUT_CLS} /> */}
                            <SelectInput
                                id="month_id"
                                options={months?.map(mn => ({
                                    value: mn.id,
                                    label: mn.name,
                                }))}
                                value={form.month_id}
                                onChange={(value) =>
                                    setForm(prev => ({
                                        ...prev,
                                        month_id: value,
                                    }))
                                }
                                placeholder="Select Month"
                            />
                        </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols gap-3">
                        <div className='flex items-center justify-between'>
                            <label className={LABEL_CLS}>
                                Received Status
                            </label>

                            <Toggle
                                checked={(form.is_received_commission == 1)}
                                onChange={(v) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        is_received_commission: v ? 1 : 0,
                                    }))
                                }
                            />
                        </div>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols gap-3">

                        <div>
                            <label className={LABEL_CLS} htmlFor="received_date">Received Date</label>
                            <input disabled={form.is_received_commission == 0} id="received_date" name="received_date" type="date" value={form.received_date} onChange={handleChange} className={INPUT_CLS} />
                        </div>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols">

                        <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-3">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Commission Amount</p>
                            {/* <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mt-1">৳ {form.commission_amount}</p> */}
                            <input
                                id="commission_amount"
                                name="commission_amount"
                                type="number"
                                min="0"
                                value={form.commission_amount || ""}
                                onChange={handleChange}
                                className={INPUT_CLS}
                                placeholder="Enter commission amount"
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <p className="text-xs leading-relaxed">Save commission entries by invoice and product. Profit and commission amounts are shown as a quick calculation preview.</p>
                    </div>
                </form>

                <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">Cancel</button>
                    {form.isReceived == 0 && (<button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30">
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating...' : 'Saving...'}
                            </>
                        ) : (isEdit ? 'Update Commission' : 'Save Commission')}
                    </button>)}

                </div>
            </div>
        </>
    );
}
