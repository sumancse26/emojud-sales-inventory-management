'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { saveProductAction } from '../action';
import SelectInput from '@/components/ui/SelectInput';

const EMPTY_FORM = {
    id: null,
    shop_id: '',
    barcode: '',
    product_name: '',
    brand_id: '',
    unit_id: '',
    purchase_rate: '',
    retail_rate: '',
    sales_rate: '',
    min_stock_qty: '',
    is_batch_wise: 0,
    is_expire_wise: 0,
    specifications: '',
    created_by: '',
};

const INPUT_CLS =
    'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';

const LABEL_CLS =
    'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

const SECTION_HDR =
    'text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3';

export default function ProductSlider({ isOpen, onClose, initialCategories = [], shops = [], userInfo, onSaved, editData, brand = [], units = [], subCategoryList = [] }) {
    const isEdit = Boolean(editData?.id);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');

    const shopOptions = useMemo(
        () => shops.map(s => ({ value: String(s.id), label: s.shop_name })),
        [shops]
    );
    const categoryOptions = useMemo(
        () => initialCategories.map(c => ({ value: String(c.id), label: c.category_name })),
        [initialCategories]
    );
    const subcategoryOptions = useMemo(
        () => subcategories.map(s => ({ value: String(s.id), label: s.category_name })),
        [subcategories]
    );

    // Reset form whenever slider opens
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (editData?.id) {
                setForm({
                    id: editData.id,
                    shop_id: String(editData.shop_id ?? userInfo?.shop_id ?? ''),
                    barcode: editData.barcode ?? '',
                    product_name: editData.product_name ?? '',
                    brand_id: editData.brand_id ? String(editData.brand_id) : '',
                    unit_id: editData.unit_id ? String(editData.unit_id) : '',
                    purchase_rate: editData.purchase_rate ?? '',
                    retail_rate: editData.retail_rate ?? '',
                    sales_rate: editData.sales_rate ?? '',
                    min_stock_qty: editData.min_stock_qty ?? '',
                    is_batch_wise: editData.is_batch_wise ?? 0,
                    is_expire_wise: editData.is_expire_wise ?? 0,
                    specifications: editData.specifications ?? '',
                    created_by: String(userInfo?.id ?? ''),
                });
                const cat = initialCategories.find(c => c.id === editData.category_id);
                setSelectedCategoryId(cat ? String(cat.id) : '');
                setSubcategories(subCategoryList ?? []);
                setSelectedSubcategoryId(editData.sub_category_id ? String(editData.sub_category_id) : '');
            } else {
                setForm({
                    ...EMPTY_FORM,
                    shop_id: String(userInfo?.shop_id ?? ''),
                    barcode: editData?.barcode ?? '',
                    created_by: String(userInfo?.id ?? ''),
                });
                setSelectedCategoryId('');
                setSubcategories([]);
                setSelectedSubcategoryId('');
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isOpen, editData, userInfo, initialCategories, subCategoryList]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleCheck = (name) => {
        setForm(prev => ({ ...prev, [name]: prev[name] ? 0 : 1 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.product_name.trim()) { toast.error('Product name is required.'); return; }
        if (!form.shop_id) { toast.error('Please select a shop.'); return; }
        const categoryId = selectedCategoryId ? Number(selectedCategoryId) : editData?.category_id ?? null;
        if (!categoryId) { toast.error('Please select a category.'); return; }
        const subCategoryId = selectedSubcategoryId ? Number(selectedSubcategoryId) : null;

        setSaving(true);
        try {
            const payload = {
                id: isEdit ? Number(form.id) : null,
                shop_id: Number(form.shop_id),
                barcode: form.barcode.trim() || null,
                product_name: form.product_name.trim(),
                category_id: categoryId,
                sub_category_id: subCategoryId,
                brand_id: form.brand_id !== '' ? Number(form.brand_id) : null,
                unit_id: form.unit_id !== '' ? Number(form.unit_id) : null,
                purchase_rate: form.purchase_rate !== '' ? Number(form.purchase_rate) : 0,
                retail_rate: form.retail_rate !== '' ? Number(form.retail_rate) : 0,
                sales_rate: form.sales_rate !== '' ? Number(form.sales_rate) : 0,
                min_stock_qty: form.min_stock_qty !== '' ? Number(form.min_stock_qty) : 0,
                is_batch_wise: form.is_batch_wise ? 1 : 0,
                is_expire_wise: form.is_expire_wise ? 1 : 0,
                specifications: form.specifications.trim() || null,
                created_by: Number(form.created_by),
            };
            const res = await saveProductAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save product.');
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
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {isEdit ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? 'Edit Product' : 'New Product'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {isEdit ? `Editing: ${editData?.product_name}` : 'Fill in the details to add a product'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        aria-label="Close">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* ── Basic Info ─────────────────────────────── */}
                    <div>
                        <p className={SECTION_HDR}>Basic Info</p>
                        <div className="space-y-4">
                            {/* Shop */}
                            <div>
                                <label className={LABEL_CLS}>Shop</label>
                                <SelectInput
                                    options={shopOptions}
                                    value={form.shop_id}
                                    onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                                    placeholder="Select a shop…"
                                    disabled
                                />
                            </div>

                            {/* Product Name */}
                            <div>
                                <label className={LABEL_CLS} htmlFor="product_name">
                                    Product Name <span className="text-red-500 normal-case font-normal">*</span>
                                </label>
                                <input id="product_name" name="product_name" type="text" value={form.product_name}
                                    onChange={handleChange} placeholder="e.g. Samsung Galaxy A54"
                                    className={INPUT_CLS} autoComplete="off" />
                            </div>

                            {/* Barcode */}
                            <div>
                                <label className={LABEL_CLS} htmlFor="barcode">Barcode</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 5v14M7 5v14M11 5v14M15 5v14M19 5v14" />
                                        </svg>
                                    </span>
                                    <input id="barcode" name="barcode" type="text" value={form.barcode}
                                        onChange={handleChange} placeholder="Scan or type barcode…"
                                        className={`${INPUT_CLS} pl-10`} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Category ───────────────────────────────── */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                        <p className={SECTION_HDR}>Category</p>
                        <div className="space-y-4">
                            <div>
                                <label className={LABEL_CLS}>
                                    Category <span className="text-red-500 normal-case font-normal">*</span>
                                </label>
                                <SelectInput
                                    options={categoryOptions}
                                    value={selectedCategoryId}
                                    onChange={setSelectedCategoryId}
                                    placeholder="Select category…"
                                />
                            </div>

                            {selectedCategoryId && (
                                <div>
                                    <label className={LABEL_CLS}>
                                        Sub-category
                                        <span className="normal-case font-normal text-slate-400 dark:text-slate-500 ml-1">(optional)</span>
                                    </label>
                                    {subcategoryOptions.length > 0 ? (
                                        <SelectInput
                                            options={[{ value: '', label: 'None (use parent category)' }, ...subcategoryOptions]}
                                            value={selectedSubcategoryId}
                                            onChange={setSelectedSubcategoryId}
                                            placeholder="Select sub-category…"
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 px-1">
                                            No sub-categories for this category.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Brand & Unit ───────────────────────────── */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                        <p className={SECTION_HDR}>Brand &amp; Unit</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={LABEL_CLS}>Brand</label>
                                <SelectInput
                                    options={[{ value: '', label: 'Select brand…' }, ...brand.map(g => ({ value: String(g.id), label: g.lookup_value }))]}
                                    value={form.brand_id}
                                    onChange={v => setForm(prev => ({ ...prev, brand_id: v }))}
                                    placeholder="Select brand…"
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLS}>Unit</label>
                                <SelectInput
                                    options={[{ value: '', label: 'Select unit…' }, ...units.map(u => ({ value: String(u.id), label: u.lookup_value }))]}
                                    value={form.unit_id}
                                    onChange={v => setForm(prev => ({ ...prev, unit_id: v }))}
                                    placeholder="Select unit…"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Pricing ────────────────────────────────── */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                        <p className={SECTION_HDR}>Pricing (৳)</p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'purchase_rate', label: 'DP' },
                                { id: 'retail_rate', label: 'RP' },
                                { id: 'sales_rate', label: 'MRP' },
                            ].map(({ id, label }) => (
                                <div key={id}>
                                    <label className={LABEL_CLS} htmlFor={id}>{label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">৳</span>
                                        <input id={id} name={id} type="number" min="0" step="0.01"
                                            value={form[id]} onChange={handleChange} placeholder="0.00"
                                            className={`${INPUT_CLS} pl-7`} autoComplete="off" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Stock & Flags ──────────────────────────── */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                        <p className={SECTION_HDR}>Stock &amp; Tracking</p>
                        <div className="space-y-3">
                            {/* Min Stock */}
                            <div>
                                <label className={LABEL_CLS} htmlFor="min_stock_qty">Min Stock Qty</label>
                                <input id="min_stock_qty" name="min_stock_qty" type="number" min="0"
                                    value={form.min_stock_qty} onChange={handleChange} placeholder="e.g. 20"
                                    className={INPUT_CLS} autoComplete="off" />
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'is_batch_wise', label: 'Batch Wise', desc: 'Track by batch' },
                                    { name: 'is_expire_wise', label: 'Expire Wise', desc: 'Track expiry dates' },
                                ].map(({ name, label, desc }) => (
                                    <button key={name} type="button" onClick={() => toggleCheck(name)}
                                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all ${form[name]
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}>
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${form[name]
                                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400'
                                            }`}>
                                            {form[name] ? (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                                            )}
                                        </span>
                                        <div>
                                            <p className={`text-xs font-semibold ${form[name] ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>{label}</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Specifications ─────────────────────────── */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-5">
                        <label className={LABEL_CLS} htmlFor="specifications">Specifications</label>
                        <textarea id="specifications" name="specifications" rows={3} value={form.specifications}
                            onChange={handleChange} placeholder="Optional notes, specs, or description…"
                            className={`${INPUT_CLS} resize-none`} />
                    </div>

                    {/* Hint */}
                    <div className="rounded-xl border px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20">
                        <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                            {isEdit
                                ? 'You are editing an existing product. Changes will take effect immediately after saving.'
                                : 'Shop info is attached automatically from your active session.'}
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
                        className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 disabled:opacity-60 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500">
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isEdit ? 'Updating…' : 'Saving…'}
                            </>
                        ) : (isEdit ? 'Update Product' : 'Save Product')}
                    </button>
                </div>
            </div>
        </>
    );
}

