'use client';

import { useState, useMemo } from 'react';
import StockSummaryTable from './components/StockSummaryTable';
import StockDetailPanel from './components/StockDetailPanel';

export default function StockSummaryFeature({ initialList }) {
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return initialList;
        return initialList.filter(item =>
            item.product_name?.toLowerCase().includes(q) ||
            item.product_code?.toLowerCase().includes(q) ||
            item.category_name?.toLowerCase().includes(q) ||
            item.brand_name?.toLowerCase().includes(q)
        );
    }, [initialList, search]);

    const handleViewDetail = (product) => {
        setSelectedProduct(product);
        setPanelOpen(true);
    };

    const handleClosePanel = () => {
        setPanelOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Stock Summary</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        View current stock levels across all products
                    </p>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search product, code, brand…"
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#0d1729] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                    />
                </div>
            </div>

            <StockSummaryTable list={filtered} onViewDetail={handleViewDetail} />

            <StockDetailPanel
                isOpen={panelOpen}
                onClose={handleClosePanel}
                product={selectedProduct}
            />
        </div>
    );
}
