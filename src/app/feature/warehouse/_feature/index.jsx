'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WarehouseTable from './components/WarehouseTable';
import WarehouseSlider from './components/WarehouseSlider';

export default function WarehouseFeature({ initialWarehouses, shops, userInfo }) {
    const router = useRouter();
    const [sliderOpen, setSliderOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const openCreate = () => {
        setEditData(null);
        setSliderOpen(true);
    };

    const openEdit = (warehouse) => {
        setEditData(warehouse);
        setSliderOpen(true);
    };

    const handleClose = () => {
        setSliderOpen(false);
        setEditData(null);
    };

    const handleSaved = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Warehouse</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Manage all storage locations across your shops
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Warehouse
                </button>
            </div>

            {/* Table */}
            <WarehouseTable warehouses={initialWarehouses} onEdit={openEdit} />

            {/* Right-side Slider */}
            <WarehouseSlider
                isOpen={sliderOpen}
                onClose={handleClose}
                shops={shops}
                userInfo={userInfo}
                onSaved={handleSaved}
                editData={editData}
            />
        </div>
    );
}

