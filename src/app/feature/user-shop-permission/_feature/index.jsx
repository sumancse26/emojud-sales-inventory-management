'use client';
import { useState, useMemo } from 'react';
import UserTable from './components/UserTable';
import PermissionSlider from './components/PermissionSlider';

export default function UserShopPermissionFeature({ initialUsers, shops, userInfo }) {
    const [sliderOpen, setSliderOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialUsers;
        return initialUsers.filter(u =>
            u.full_name?.toLowerCase().includes(q) ||
            u.employee_code?.toLowerCase().includes(q)
        );
    }, [initialUsers, query]);

    const handleManage = (user) => { setSelectedUser(user); setSliderOpen(true); };
    const handleClose = () => { setSliderOpen(false); setSelectedUser(null); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Shop Permission</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Assign shop access permissions to users
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by name or employee code…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
                    {filtered.length} of {initialUsers.length}
                </p>
            </div>

            {/* Table */}
            <UserTable users={filtered} onManage={handleManage} />

            {/* Slider */}
            <PermissionSlider
                isOpen={sliderOpen}
                user={selectedUser}
                shops={shops}
                userInfo={userInfo}
                onClose={handleClose}
            />
        </div>
    );
}
