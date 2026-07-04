'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getUserShopsByUserId } from '@/services/userPermission';
import { saveUserShopPermissionAction } from '../action';

export default function PermissionSlider({ isOpen, user, shops, userInfo, onClose }) {
    const [selectedShopIds, setSelectedShopIds] = useState(new Set());
    const originalShopIds = useRef(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch user's current shop permissions when slider opens
    useEffect(() => {
        if (!user?.user_id) return;
        setLoading(true);
        getUserShopsByUserId(user.user_id)
            .then(res => {
                const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
                const ids = list.map(s => Number(s.shop_id));
                originalShopIds.current = new Set(ids);
                setSelectedShopIds(new Set(ids));
            })
            .catch(() => {
                toast.error('Failed to load current permissions.');
            })
            .finally(() => setLoading(false));
    }, [user?.user_id]);

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleToggle = (shopId) => {
        setSelectedShopIds(prev => {
            const next = new Set(prev);
            if (next.has(shopId)) {
                next.delete(shopId);
            } else {
                next.add(shopId);
            }
            return next;
        });
    };

    const handleSelectAll = () => {
        setSelectedShopIds(new Set(shops.map(s => Number(s.id))));
    };

    const handleClearAll = () => {
        setSelectedShopIds(new Set());
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const newShopIds = Array.from(selectedShopIds).filter(
                id => !originalShopIds.current.has(id)
            );

            if (newShopIds.length === 0) {
                toast.info('No new shops to add.');
                setSaving(false);
                return;
            }

            const payload = {
                data: newShopIds.map(shop_id => ({
                    user_id: Number(user.user_id),
                    shop_id: Number(shop_id),
                    company_id: Number(userInfo?.company_id),
                    login_user_id: Number(userInfo?.id),
                })),
            };

            const res = await saveUserShopPermissionAction(payload);

            if (res?.response_code === 200 || res?.success) {
                toast.success('Shop permissions saved successfully!');
                onClose();
            } else {
                toast.error(res?.message || 'Failed to save permissions.');
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
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/10">
                            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                Shop Permissions
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {user?.full_name} ({user?.employee_code})
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Bulk actions */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedShopIds.size}</span>
                                    {' '}of {shops.length} shops selected
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Shop checklist */}
                            <div className="space-y-2">
                                {shops.map(shop => {
                                    const shopId = Number(shop.id);
                                    const checked = selectedShopIds.has(shopId);
                                    return (
                                        <label
                                            key={shopId}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                                checked
                                                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                                                    : 'border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => handleToggle(shopId)}
                                                className="w-4 h-4 rounded accent-emerald-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                                                    {shop.shop_name}
                                                </p>
                                                {shop.display_code && (
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        {shop.display_code}
                                                    </p>
                                                )}
                                            </div>
                                            {checked && (
                                                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            )}
                                        </label>
                                    );
                                })}

                                {shops.length === 0 && (
                                    <p className="text-center text-sm text-slate-400 py-8">
                                        No shops available.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200/60 dark:border-slate-800/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Permissions'}
                    </button>
                </div>
            </div>
        </>
    );
}
