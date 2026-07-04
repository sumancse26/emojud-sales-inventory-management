'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import SelectInput from '@/components/ui/SelectInput';
import { getPurchaseDetail } from '@/services/purchase';
import { getSupplierList } from '@/services/suppliers';
import { savePurchaseAction, saveSupplierAction } from '../action';

const LABEL_CLS = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';
const INPUT_CLS = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const INPUT_SM = 'w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all';
const SECTION_CLS = 'pt-5 border-t border-slate-100 dark:border-slate-800/50';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
    shop_id: '',
    warehouse_id: '',
    supplier_id: '',
    purchase_date: today(),
    discount_amount: '',
    vat_amount: '',
    paid_amount: '',
    is_submit: 1,
    is_confirm: 1,
};

const mkRow = () => ({
    _key: Math.random().toString(36).slice(2),
    product_id: '',
    qty: '',
    purchase_rate: '',
    retail_rate: '',
    sales_rate: '',
});

const fmt = (n) => Number(n || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

function InfoRow({ label, value, highlight }) {
    return (
        <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
            <span className={`text-sm font-semibold tabular-nums ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</span>
        </div>
    );
}

/* ── View mode body ─────────────────────────────────────────── */
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

function ViewBody({ viewData }) {
    const m = viewData?.master ?? {};
    const details = viewData?.details ?? [];

    return (
        <div className="px-6 py-5 space-y-5">
            {/* Purchase Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className={LABEL_CLS}>Purchase No</p>
                    <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{m.purchase_no}</p>
                </div>
                <div>
                    <p className={LABEL_CLS}>Date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.purchase_date}</p>
                </div>
                <div>
                    <p className={LABEL_CLS}>Supplier</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.supplier_name}</p>
                </div>
                <div>
                    <p className={LABEL_CLS}>Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        {m.tran_status_name ?? '—'}
                    </span>
                </div>
                <div>
                    <p className={LABEL_CLS}>Submitted</p>
                    <CheckPill yes={Number(m.is_submit) === 1} />
                </div>
                <div>
                    <p className={LABEL_CLS}>Confirmed</p>
                    <CheckPill yes={Number(m.is_confirm) === 1} />
                </div>
            </div>

            {/* Products */}
            <div className={SECTION_CLS}>
                <p className={LABEL_CLS}>Products</p>
                {details.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-700/50">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                                <tr>
                                    {['Product', 'Qty', 'Purchase Rate', 'Retail Rate', 'Sales Rate', 'Amount'].map(h => (
                                        <th key={h} className="text-left px-3 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap border-b border-slate-200/60 dark:border-slate-800/40">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((d, i) => (
                                    <tr key={d.id ?? i} className={`border-b border-slate-100 dark:border-slate-800/30 ${i % 2 ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''}`}>
                                        <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{d.product_name ?? d.product_id}</td>
                                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 tabular-nums">{d.qty}</td>
                                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 tabular-nums">৳ {fmt(d.purchase_rate)}</td>
                                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 tabular-nums">৳ {fmt(d.retail_rate)}</td>
                                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 tabular-nums">৳ {fmt(d.sales_rate)}</td>
                                        <td className="px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">৳ {fmt(d.total_amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">No product details available.</p>
                )}
            </div>

            {/* Summary */}
            <div className={`${SECTION_CLS} bg-slate-50/60 dark:bg-slate-900/30 rounded-2xl p-4 space-y-0.5`}>
                <InfoRow label="Total Amount" value={`৳ ${fmt(m.total_amount)}`} />
                <InfoRow label="Discount" value={`- ৳ ${fmt(m.discount_amount)}`} />
                <InfoRow label="VAT" value={`+ ৳ ${fmt(m.vat_amount)}`} />
                <div className="border-t border-slate-200 dark:border-slate-700/50 my-2" />
                <InfoRow label="Net Amount" value={`৳ ${fmt(m.net_amount)}`} highlight />
                <InfoRow label="Paid" value={`৳ ${fmt(m.paid_amount)}`} />
                <InfoRow label="Due" value={`৳ ${fmt(m.due_amount)}`} highlight={Number(m.due_amount) > 0} />
            </div>
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────── */
export default function PurchaseSlider({
    isOpen, onClose,
    mode = 'create',
    selectedId = null,
    suppliers = [], warehouses = [], shops = [], products = [],
    userInfo, onSaved,
    isAlreadyConfirmed = 0,
}) {
    const [form, setForm] = useState({ ...EMPTY_FORM, shop_id: String(userInfo?.shop_id ?? ''), warehouse_id: String(userInfo?.warehouse_id ?? ''), purchase_date: today() });
    const [rows, setRows] = useState([mkRow()]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [supplierModalOpen, setSupplierModalOpen] = useState(false);
    const [supplierModalVisible, setSupplierModalVisible] = useState(false);
    const [supplierModalLoading, setSupplierModalLoading] = useState(false);
    const [supplierForm, setSupplierForm] = useState({ supplier_name: '', phone_no: '' });
    const [localSupplier, setLocalSupplier] = useState(suppliers);

    //const supplierOptions = useMemo(() => suppliers.map(s => ({ value: String(s.id), label: s.supplier_name })), [suppliers]);
    const warehouseOptions = useMemo(() => warehouses.map(w => ({ value: String(w.id), label: w.warehouse_name })), [warehouses]);
    const shopOptions = useMemo(() => shops.map(s => ({ value: String(s.id), label: s.shop_name ?? s.name ?? String(s.id) })), [shops]);
    const productOptions = useMemo(() => products.map(p => ({ ...p, value: String(p.id), label: p.product_name })), [products]);

    /* Barcode Scanner Integration */
    const barcodeBufferRef = useRef('');
    const lastKeyTimeRef = useRef(0);

    useEffect(() => {
        if (!isOpen || mode === 'view') return;

        const handleKeyDown = (e) => {
            const currentTime = Date.now();

            // If more than 50ms between keystrokes, assume it's manual typing and reset buffer
            if (currentTime - lastKeyTimeRef.current > 50) {
                barcodeBufferRef.current = '';
            }

            if (e.key === 'Enter' && barcodeBufferRef.current.length > 0) {
                e.preventDefault();
                const scannedCode = barcodeBufferRef.current;

                const foundProduct = productOptions.find(p =>
                    String(p.barcode) === scannedCode ||
                    String(p.product_code) === scannedCode ||
                    String(p.id) === scannedCode
                );

                if (foundProduct) {
                    setRows(prev => {
                        const existingRowIndex = prev.findIndex(r => String(r.product_id) === String(foundProduct.id));
                        if (existingRowIndex >= 0) {
                            // Increment quantity if already exists
                            const newRows = [...prev];
                            newRows[existingRowIndex] = {
                                ...newRows[existingRowIndex],
                                qty: Number(newRows[existingRowIndex].qty) + 1
                            };
                            return newRows;
                        } else {
                            // Find an empty row or create new
                            const emptyRowIndex = prev.findIndex(r => !r.product_id);
                            const newRowData = {
                                product_id: String(foundProduct.id),
                                qty: 1,
                                purchase_rate: foundProduct.purchase_rate || '',
                                retail_rate: foundProduct.retail_rate || '',
                                sales_rate: foundProduct.sales_rate || ''
                            };

                            if (emptyRowIndex >= 0) {
                                const newRows = [...prev];
                                newRows[emptyRowIndex] = { ...newRows[emptyRowIndex], ...newRowData };
                                return newRows;
                            } else {
                                return [...prev, { _key: Math.random().toString(36).slice(2), ...newRowData }];
                            }
                        }
                    });
                    toast.success(`Scanned: ${foundProduct.product_name}`);
                } else {
                    toast.error(`Product not found for barcode: ${scannedCode}`);
                }
                barcodeBufferRef.current = '';
            } else if (e.key.length === 1) { // Standard character keys
                barcodeBufferRef.current += e.key;
            }

            lastKeyTimeRef.current = currentTime;
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, mode, productOptions]);


    const totals = useMemo(() => {
        const total_amount = rows.reduce(
            (sum, r) => sum + (Number(r.qty) || 0) * (Number(r.purchase_rate) || 0),
            0
        );

        const discount = Number(form.discount_amount) || 0;
        const vat = Number(form.vat_amount) || 0;

        const net_amount = total_amount - discount + vat;

        const paid = Number(form.paid_amount || 0);

        // 👇 KEY LOGIC
        const isPaidEmpty =
            form.paid_amount === '' ||
            form.paid_amount === null ||
            form.paid_amount === undefined;

        const due_amount = isPaidEmpty
            ? 0
            : Math.max(net_amount - paid, 0);

        return {
            total_amount,
            net_amount,
            due_amount
        };
    }, [
        rows,
        form.discount_amount,
        form.vat_amount,
        form.paid_amount
    ]);
    /* Reset / load on open */
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => {
            if (mode === 'create') {
                setForm({ ...EMPTY_FORM, shop_id: String(userInfo?.shop_id ?? ''), warehouse_id: String(userInfo?.warehouse_id ?? ''), purchase_date: today() });
                setRows([mkRow()]);
                setViewData(null);
            } else if (mode === 'view' && selectedId) {
                setLoading(true);
                setViewData(null);
                getPurchaseDetail(selectedId)
                    .then(res => setViewData(res))
                    .catch(() => toast.error('Failed to load purchase details.'))
                    .finally(() => setLoading(false));
            } else if (mode === 'edit' && selectedId) {
                setLoading(true);
                setViewData(null);
                getPurchaseDetail(selectedId)
                    .then(res => {
                        const m = res?.master ?? {};
                        const details = res?.details ?? [];
                        setForm({
                            id: String(m.id ?? ''),
                            shop_id: String(m.shop_id || ''),
                            warehouse_id: String(m.warehouse_id || ''),
                            supplier_id: String(m.supplier_id || ''),
                            purchase_date: m.purchase_date || today(),
                            discount_amount: m.discount_amount ?? '',
                            vat_amount: m.vat_amount ?? '',
                            paid_amount: m.paid_amount ?? '0',
                            due_amount: m.due_amount ?? '0',
                            is_submit: Number(m.is_submit ?? 1),
                            is_confirm: Number(m.is_confirm ?? 1),
                        });
                        setRows(details.length > 0
                            ? details.map(d => ({
                                id: String(d.id ?? ''),
                                _key: Math.random().toString(36).slice(2),
                                product_id: String(d.product_id || ''),
                                qty: String(d.qty || ''),
                                purchase_rate: String(d.purchase_rate || ''),
                                retail_rate: String(d.retail_rate || ''),
                                sales_rate: String(d.sales_rate || ''),
                            }))
                            : [mkRow()]
                        );
                    })
                    .catch(() => toast.error('Failed to load purchase for editing.'))
                    .finally(() => setLoading(false));
            }
        }, 0);

        return () => clearTimeout(t);
    }, [isOpen, mode, selectedId, userInfo?.shop_id, userInfo?.warehouse_id]);

    /* Lock scroll */
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const t = setTimeout(() => {
            setLocalSupplier(suppliers);
        }, 0);

        return () => clearTimeout(t);
    }, [suppliers]);

    const updateRow = useCallback((key, field, value) => {
        if (field == 'product_id') {
            const selectedProduct = productOptions.find(pd => pd.id == value);
            setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value, qty: 1, purchase_rate: selectedProduct.purchase_rate, retail_rate: selectedProduct.retail_rate, sales_rate: selectedProduct.sales_rate } : r));
        } else {
            setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value } : r));
        }

    }, []);

    const addRow = () => setRows(prev => [...prev, mkRow()]);
    const removeRow = (key) => setRows(prev => prev.length > 1 ? prev.filter(r => r._key !== key) : prev);

    const supplierOptions = localSupplier.map(c => ({ value: String(c.id), label: c.name ?? c.supplier_name ?? String(c.id) }));

    const handlesupplierFormChange = (field, value) => {
        setSupplierForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateSupplier = async () => {
        if (!supplierForm.supplier_name.trim()) return toast.warn('Supplier name is required.');
        if (!supplierForm.phone_no.trim()) return toast.warn('Supplier phone number is required.');

        setSupplierModalLoading(true);
        try {
            const payload = {
                id: null,
                shop_id: Number(userInfo?.shop_id ?? ''),
                supplier_name: supplierForm.supplier_name.trim(),
                phone: supplierForm.phone_no.trim(),
                email: null,
                address: null,
                previous_due: 0,
                created_by: Number(userInfo?.id ?? ''),
            };

            const res = await saveSupplierAction(payload);
            const success = res?.response_code === 200 || res?.success;
            if (!success) {
                throw new Error(res?.message || 'Failed to save supplier.');
            }

            toast.success('Supplier created successfully!');
            const updated = await getSupplierList();
            const updatedSuppliers = Array.isArray(updated)
                ? updated
                : Array.isArray(updated?.data)
                    ? updated.data
                    : [];

            if (updatedSuppliers.length) {
                setLocalSupplier(updatedSuppliers);
                const createdSupplier = updatedSuppliers.find(c =>
                    c.phone === supplierForm.phone_no.trim()
                    && (c.supplier_name === supplierForm.supplier_name.trim() || c.name === supplierForm.supplier_name.trim())
                );

                if (createdSupplier) {
                    setForm(prev => ({
                        ...prev,
                        supplier_id: String(createdSupplier.id ?? createdSupplier.supplier_id ?? ''),
                    }));
                }
            }

            setSupplierModalVisible(false);
            setTimeout(() => setSupplierModalOpen(false), 200);
            setSupplierForm({ supplier_name: '', phone_no: '' });
        } catch (error) {
            toast.error(error?.message || 'Failed to create supplier. Please try again.');
        } finally {
            setSupplierModalLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.shop_id) { toast.error('Please select a shop.'); return; }
        if (!form.warehouse_id) { toast.error('Please select a warehouse.'); return; }
        if (!form.supplier_id) { toast.error('Please select a supplier.'); return; }
        if (!form.purchase_date) { toast.error('Purchase date is required.'); return; }
        const validRows = rows.filter(r => r.product_id && r.qty && r.purchase_rate);
        if (!validRows.length) { toast.error('Add at least one product with qty and purchase rate.'); return; }

        setSaving(true);
        try {
            const payload = {
                id: mode === 'edit' ? Number(selectedId) : null,
                shop_id: Number(form.shop_id),
                warehouse_id: Number(form.warehouse_id),
                supplier_id: Number(form.supplier_id),
                purchase_date: form.purchase_date,
                total_amount: totals.total_amount,
                discount_amount: Number(form.discount_amount) || 0,
                vat_amount: Number(form.vat_amount) || 0,
                net_amount: totals.net_amount,
                paid_amount: Number(form.paid_amount) || 0,
                due_amount: totals.due_amount || 0,
                is_submit: form.is_submit,
                is_confirm: form.is_confirm,
                user_id: Number(userInfo?.id),
                products: validRows.map(r => ({
                    id: r.id || null,
                    product_id: Number(r.product_id),
                    qty: Number(r.qty),
                    purchase_rate: Number(r.purchase_rate),
                    retail_rate: Number(r.retail_rate) || 0,
                    sales_rate: Number(r.sales_rate) || 0,
                    total_amount: Number(r.qty) * Number(r.purchase_rate),
                })),
            };

            const res = await savePurchaseAction(payload);
            if (res?.response_code === 200 || res?.success) {
                toast.success(res?.message || "Success!");
                onSaved?.();
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save purchase.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const iconBg = 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    const btnColor = 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 hover:shadow-emerald-500/30';

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer — wider for purchase line items */}
            <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-5xl bg-white dark:bg-[#0d1729] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {mode === 'view'
                                    ? (viewData?.master?.purchase_no ?? 'Purchase Detail')
                                    : mode === 'edit' ? 'Edit Purchase' : 'New Purchase'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {mode === 'view'
                                    ? (viewData?.master?.supplier_name ?? 'Loading…')
                                    : mode === 'edit' ? 'Update the purchase order details'
                                        : 'Fill in the details to create a purchase order'}
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

                            {/* Warehouse + Supplier */}
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className={LABEL_CLS} htmlFor="pur_shop">
                                        Shop <span className="text-red-500 normal-case font-normal">*</span>
                                    </label>
                                    <SelectInput
                                        disabled
                                        id="pur_shop"
                                        options={shopOptions}
                                        value={form.shop_id}
                                        onChange={v => setForm(prev => ({ ...prev, shop_id: v }))}
                                        placeholder="Select shop…"
                                    />
                                </div>
                                <div>
                                    <label className={LABEL_CLS} htmlFor="pur_warehouse">
                                        Warehouse <span className="text-red-500 normal-case font-normal">*</span>
                                    </label>
                                    <SelectInput
                                        disabled
                                        id="pur_warehouse"
                                        options={warehouseOptions}
                                        value={form.warehouse_id}
                                        onChange={v => setForm(prev => ({ ...prev, warehouse_id: v }))}
                                        placeholder="Select warehouse…"
                                    />
                                </div>

                            </div>

                            {/* Shop */}
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <label className={LABEL_CLS + ' mb-0'} htmlFor="pur_supplier">
                                        Supplier <span className="text-red-500 normal-case font-normal">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSupplierForm({ supplier_name: '', phone_no: '' });
                                            setSupplierModalOpen(true);
                                            requestAnimationFrame(() => setSupplierModalVisible(true));
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition whitespace-nowrap"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add Supplier
                                    </button>
                                </div>
                                <SelectInput
                                    id="pur_supplier"
                                    options={supplierOptions}
                                    value={form.supplier_id}
                                    onChange={v => setForm(prev => ({ ...prev, supplier_id: v }))}
                                    placeholder="Select supplier…"
                                />
                            </div>



                            {/* Purchase Date */}
                            <div>
                                <label className={LABEL_CLS} htmlFor="pur_date">
                                    Purchase Date <span className="text-red-500 normal-case font-normal">*</span>
                                </label>
                                <input
                                    id="pur_date"
                                    type="date"
                                    value={form.purchase_date}
                                    onChange={e => setForm(prev => ({ ...prev, purchase_date: e.target.value }))}
                                    className={INPUT_CLS}
                                />
                            </div>

                            {/* Products section */}
                            <div className={SECTION_CLS}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className={LABEL_CLS + ' mb-0'}>
                                        Products <span className="text-red-500 normal-case font-normal">*</span>
                                    </p>
                                    <button type="button" onClick={addRow}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add Row
                                    </button>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                                    <table className="w-full text-sm min-w-195">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/40">
                                                {['Product', 'Qty', 'DP', 'RP', 'MRP', 'Amount', ''].map(h => (
                                                    <th key={h} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => {
                                                const rowTotal = (Number(row.qty) || 0) * (Number(row.purchase_rate) || 0);
                                                return (
                                                    <tr key={row._key} className="border-b border-slate-100 dark:border-slate-800/30 last:border-0">
                                                        <td className="px-2 py-2 min-w-42">
                                                            <SelectInput
                                                                id={`row_product_${row._key}`}
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
                                                            <input type="number" min="0" step="0.01" value={row.purchase_rate}
                                                                onChange={e => updateRow(row._key, 'purchase_rate', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="0.01" value={row.retail_rate}
                                                                onChange={e => updateRow(row._key, 'retail_rate', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-32">
                                                            <input type="number" min="0" step="0.01" value={row.sales_rate}
                                                                onChange={e => updateRow(row._key, 'sales_rate', e.target.value)}
                                                                placeholder="0.00" className={INPUT_SM} />
                                                        </td>
                                                        <td className="px-2 py-2 w-24 tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                            ৳{fmt(rowTotal)}
                                                        </td>
                                                        <td className="px-2 py-1.5 w-8">
                                                            <button type="button" onClick={() => removeRow(row._key)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M18 6 6 18M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className={SECTION_CLS}>
                                <p className={LABEL_CLS}>Payment Summary</p>
                                <div className="bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-4 space-y-3">
                                    {/* Read-only total */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Amount</span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">৳ {fmt(totals.total_amount)}</span>
                                    </div>

                                    {/* Discount + VAT */}
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

                                    {/* Net Amount */}
                                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Net Amount</span>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">৳ {fmt(totals.net_amount)}</span>
                                    </div>

                                    {/* Paid Amount */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Paid Amount
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.paid_amount || mode == 'create' ? totals.net_amount : 0}
                                            onChange={e => {
                                                const paid = e.target.value;

                                                setForm(prev => ({
                                                    ...prev,
                                                    paid_amount: paid
                                                }));
                                            }}
                                            placeholder="0.00"
                                            className={INPUT_SM}
                                        />
                                    </div>

                                    {/* Due Amount */}
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
                                <Toggle
                                    label="Confirm"
                                    checked={Boolean(form.is_confirm)}
                                    onChange={v => setForm(prev => ({ ...prev, is_confirm: v ? 1 : 0 }))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer — create & edit modes */}
                {(mode === 'create' || mode === 'edit') && (
                    <div className="px-6 py-5 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3 shrink-0">
                        <button type="button" onClick={onClose} disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50">
                            Cancel
                        </button>
                        {isAlreadyConfirmed != 1 && (<button type="button" onClick={handleSubmit} disabled={saving}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 ${btnColor}`}>
                            {saving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path className="opacity-25" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : mode === 'edit' ? 'Update Purchase' : 'Save Purchase'}
                        </button>)}

                    </div>
                )}

                {supplierModalOpen && typeof window !== 'undefined' && createPortal(
                    <div className={`fixed inset-0 z-9999 flex items-center justify-center px-4 transition-all duration-200 ${supplierModalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setSupplierModalVisible(false); setTimeout(() => setSupplierModalOpen(false), 200); }} />
                        <div className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/70 bg-white dark:border-slate-700/70 dark:bg-slate-950 shadow-2xl transition-all duration-200 ${supplierModalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/70">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Supplier</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a new supplier and select it immediately.</p>
                                </div>
                                <button type="button" onClick={() => { setSupplierModalVisible(false); setTimeout(() => setSupplierModalOpen(false), 200); }} className="rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4">
                                <div>
                                    <label className={LABEL_CLS} htmlFor="new_supplier_name">Supplier Name</label>
                                    <input
                                        id="new_supplier_name"
                                        type="text"
                                        value={supplierForm.supplier_name}
                                        onChange={e => handlesupplierFormChange('supplier_name', e.target.value)}
                                        placeholder="Enter supplier name"
                                        className={INPUT_CLS}
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className={LABEL_CLS} htmlFor="new_supplier_phone">Phone</label>
                                    <input
                                        id="new_supplier_phone"
                                        type="tel"
                                        value={supplierForm.phone_no}
                                        onChange={e => handlesupplierFormChange('phone_no', e.target.value)}
                                        placeholder="Enter phone number"
                                        className={INPUT_CLS}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t border-slate-200/70 dark:border-slate-800/70 px-6 py-4 bg-slate-50 dark:bg-slate-900">
                                <button type="button" onClick={() => { setSupplierModalVisible(false); setTimeout(() => setSupplierModalOpen(false), 200); }} disabled={supplierModalLoading}
                                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleCreateSupplier} disabled={supplierModalLoading}
                                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60">
                                    {supplierModalLoading ? 'Saving…' : 'Save Supplier'}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
}
