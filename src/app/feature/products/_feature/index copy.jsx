'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductTable from './components/ProductTable';
import ProductSlider from './components/ProductSlider';
import { getSubcategoryList } from '@/services/products';

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-tight">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{label}</p>
            </div>
        </div>
    );
}

export default function ProductsFeature({ initialProducts = [], initialCategories = [], shops = [], userInfo = {}, brand = [], units = [] }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [query, setQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [subCategoryList, setSubCategoryList] = useState([]);


    const activeCount = useMemo(() => initialProducts.filter(p => Number(p.status) === 1).length, [initialProducts]);

    const filtered = useMemo(() => {
        let list = initialProducts;
        if (filterCategory) {
            list = list.filter(p =>
                String(p.category_id) === filterCategory ||
                p.category_name?.toLowerCase() === filterCategory.toLowerCase()
            );
        }
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter(p =>
            p.product_name?.toLowerCase().includes(q) ||
            p.product_code?.toLowerCase().includes(q) ||
            p.barcode?.toLowerCase().includes(q) ||
            p.category_name?.toLowerCase().includes(q) ||
            p.brand_name?.toLowerCase().includes(q)
        );
    }, [initialProducts, query, filterCategory]);

    const categoryOptions = useMemo(() => {
        const seen = new Set();
        return initialProducts.reduce((acc, p) => {
            if (p.category_name && !seen.has(p.category_name)) {
                seen.add(p.category_name);
                acc.push({ name: p.category_name });
            }
            return acc;
        }, []);
    }, [initialProducts]);

    const openCreate = () => { setEditData(null); setSliderOpen(true); };

    const openEdit = async (p) => {
        const subcategories = await getSubcategoryList(p.category_id);

        setSubCategoryList(subcategories.data || []);
        setEditData(p);
        setSliderOpen(true);
    };

    const handleClose = () => { setSliderOpen(false); setEditData(null); };

    const handleSaved = () => router.refresh();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Products</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Product master with three-tier pricing (Purchase / Retail / Sales)
                    </p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Product
                </button>
            </div>


            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by name, code, barcode…"
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/40 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 dark:focus:border-amber-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <ProductTable products={filtered} onEdit={openEdit} />

            <ProductSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                initialCategories={initialCategories}
                shops={shops}
                userInfo={userInfo}
                onSaved={handleSaved}
                editData={editData}
                brand={brand}
                units={units}
                subCategoryList={subCategoryList}
            />

        </div>
    );
}

