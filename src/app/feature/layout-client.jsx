'use client';

import { useState, useSyncExternalStore } from 'react';
import { MobileSidebarClient } from '@/components/layout/SidebarClient';
import TopbarClient from '@/components/layout/TopbarClient';
import { buildNavItems } from '@/constants/navigation';

function subscribe(cb) {
    const observer = new MutationObserver(cb);
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
}

export default function FeatureLayoutClient({ children, sidebar, featureData, userInfo, shopList = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navItems = buildNavItems(featureData);

    const dark = useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains('dark'),
        () => false
    );

    function toggleDark() {
        const newDark = !dark;
        localStorage.setItem('ej-dark', String(newDark));
        document.documentElement.classList.toggle('dark', newDark);
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-100 dark:bg-[#060d17] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
            {sidebar}
            {sidebarOpen && (
                <MobileSidebarClient
                    featureData={featureData}
                    userInfo={userInfo}
                    shopList={shopList}
                    onNavigate={() => setSidebarOpen(false)}
                    onClose={() => setSidebarOpen(false)}
                />
            )}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopbarClient
                    dark={dark}
                    onToggle={toggleDark}
                    onMenuOpen={() => setSidebarOpen(true)}
                    navItems={navItems}
                    userInfo={userInfo}
                />
                <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-5 lg:py-5">{children}</main>
            </div>
        </div>
    );
}
