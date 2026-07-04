'use client';

import { logoutAction } from '@/app/login/action';
import { toast } from 'react-toastify';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

function SunIcon() {
    return (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="5" />
            <path
                strokeLinecap="round"
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg className="w-4.25 h-4.25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'New purchase order received',
        desc: 'PO-2026-0041 from Dhaka Traders',
        time: '2m ago',
        unread: true,
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'Salary processed for April',
        desc: '24 employees paid successfully',
        time: '1h ago',
        unread: true,
        color: 'bg-emerald-500'
    },
    {
        id: 3,
        title: 'Low stock alert',
        desc: 'Product SKU-889 below threshold',
        time: '3h ago',
        unread: false,
        color: 'bg-amber-500'
    },
    {
        id: 4,
        title: 'New shop onboarded',
        desc: 'Chittagong Branch is now active',
        time: '1d ago',
        unread: false,
        color: 'bg-violet-500'
    }
];

const USER_MENU = [
    { label: 'My Profile', icon: '👤', desc: 'View your account' },
    { label: 'Settings', icon: '⚙️', desc: 'Preferences & security' },
    { label: 'Activity Log', icon: '📋', desc: 'Recent actions' }
];

function useClickOutside(ref, handler) {
    useEffect(() => {
        function listener(e) {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler();
        }

        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler]);
}

function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(NOTIFICATIONS);
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    const unreadCount = items.filter((n) => n.unread).length;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/40 transition-all duration-200">
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 px-0.5 bg-rose-500 rounded-full ring-1 ring-white dark:ring-[#0a1422] text-[7px] text-white flex items-center justify-center font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                Notifications
                            </span>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
                                className="flex items-center gap-1 text-[10px] font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 transition-colors">
                                <CheckIcon /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                        {items.map((n) => (
                            <div
                                key={n.id}
                                onClick={() =>
                                    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
                                }
                                className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/50 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.color} ${n.unread ? 'opacity-100' : 'opacity-25'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold leading-tight ${n.unread ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {n.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{n.desc}</p>
                                    <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-1">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/60 text-center">
                        <button className="text-[11px] font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 transition-colors">
                            View all notifications →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function UserDropdown({ userInfo }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const router = useRouter();

    useClickOutside(ref, () => setOpen(false));

    const logoutHandler = async () => {
        try {
            const res = await logoutAction({ user_id: userInfo?.user_id });

            if (res.response_code == 200) {
                toast.success(res.message || 'Logout Successful');
                router.push('/login');
            } else {
                toast.error(res.message || 'Invalid Credentials');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    const handleMenuClick = (label) => {
        setOpen(false);
        if (label === 'Settings') {
            router.push('/feature/change-password');
        }
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors duration-200">
                <div className="relative">

                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {userInfo.photo_url && (
                            <Image
                                src={userInfo.photo_url || ''}
                                alt="User Photo"
                                fill
                                className="object-cover"
                            />
                        )}

                        {!userInfo.photo_url || userInfo.photo_url == null && (userInfo?.full_name?.charAt(0) || '')}
                    </div>
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-[#0a1422]" />
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{userInfo?.full_name || ''}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{userInfo?.role_name || ''}</p>
                </div>
                <svg
                    className={`w-3 h-3 text-slate-400 hidden sm:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                    <Image
                                        src={userInfo.photo_url || ''}
                                        alt="User Photo"
                                        fill
                                        className="object-cover"
                                    />
                                    {!userInfo.photo_url || userInfo.photo_url == null && (userInfo?.full_name?.charAt(0) || '')}
                                </div>
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-[#0d1729]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{userInfo?.full_name || ''}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">{userInfo?.designation_name || ''}</p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-medium">
                                Online · {userInfo?.role_name || ''}
                            </span>
                        </div>
                    </div>

                    <div className="py-1.5">
                        {USER_MENU.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleMenuClick(item.label)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                                <span className="text-sm">{item.icon}</span>
                                <div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{item.label}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/60 py-1.5">
                        <button
                            onClick={logoutHandler}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left">
                            <span className="text-sm">🚪</span>
                            <div>
                                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 leading-tight">Log Out</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">End your session</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function TopbarClient({ dark, onToggle, onMenuOpen, navItems, userInfo }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [dateLabel, setDateLabel] = useState('');
    const currentNav = mounted ? navItems.find((n) => n.href === pathname) : null;
    const resolvedDark = mounted ? dark : false;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setMounted(true);
            setDateLabel(
                new Date().toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            );
        }, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <header className="bg-white/90 dark:bg-[#0a1422]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/50 px-5 py-3 flex items-center justify-between shrink-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-3">
                <button
                    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={onMenuOpen}
                    aria-label="Open menu">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {currentNav?.label ?? 'Dashboard'}
                    </h1>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
                        {dateLabel}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/40 rounded-xl px-3 py-1.5 w-44 transition-colors duration-300">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        placeholder="Quick search…"
                        className="bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none w-full"
                    />
                </div>

                <button
                    suppressHydrationWarning
                    onClick={onToggle}
                    title={resolvedDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-blue-400 hover:bg-amber-50 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/40 transition-all duration-200">
                    {resolvedDark ? <SunIcon /> : <MoonIcon />}
                </button>

                <NotificationDropdown />
                <UserDropdown userInfo={userInfo} />
            </div>
        </header>
    );
}
