'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { buildNavSections } from '@/constants/navigation';
import SearchableDropdown from '@/components/ui/SearchableDropdown.jsx';
import { refetchNavMenu } from '@/app/login/action';

const ChevronIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ChevronsLeftIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="11 17 6 12 11 7" />
        <polyline points="18 17 13 12 18 7" />
    </svg>
);

const ChevronsRightIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
    </svg>
);

const activeLeaf =
    'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20';
const inactiveLeaf =
    'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60';
const activeIcon = 'text-white dark:text-emerald-400';
const inactiveIcon = 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300';

function LogoMark({ companyName }) {
    return (
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shadow-lg shadow-blue-500/30 shrink-0 font-mono">
            {companyName?.charAt(0) || ''}
        </div>
    );
}

function NavLeaf({ href, label, Icon, onNavigate, collapsed }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${collapsed ? 'justify-center w-10 h-10 mx-auto p-0' : 'gap-3 px-3 py-2.5'} ${isActive ? activeLeaf : inactiveLeaf}`}>
            {!collapsed && isActive && (
                <span className="absolute left-0 inset-y-2 w-0.75 rounded-r-full bg-white/60 dark:bg-emerald-400" />
            )}
            <span className={`w-4.5 h-4.5 shrink-0 transition-colors duration-200 ${isActive ? activeIcon : inactiveIcon}`}>
                <Icon />
            </span>
            {!collapsed && (
                <>
                    <span className="leading-none">{label}</span>
                    {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 dark:bg-emerald-400 shrink-0" />
                    )}
                </>
            )}
        </Link>
    );
}

function NavParent({ label, Icon, children, onNavigate, collapsed }) {
    const pathname = usePathname();
    const hasActiveChild = children.some((c) => pathname === c.href);
    const [open, setOpen] = useState(hasActiveChild);

    if (collapsed) {
        return (
            <Link
                href={children[0].href}
                onClick={onNavigate}
                title={label}
                className={`group relative flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${hasActiveChild ? activeLeaf : inactiveLeaf}`}>
                <span className={`w-4.5 h-4.5 shrink-0 ${hasActiveChild ? activeIcon : inactiveIcon}`}>
                    <Icon />
                </span>
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${hasActiveChild ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'}`}>
                <span
                    className={`w-4.5 h-4.5 shrink-0 transition-colors duration-200 ${hasActiveChild ? 'text-emerald-500 dark:text-emerald-400' : inactiveIcon}`}>
                    <Icon />
                </span>
                <span className="leading-none flex-1 text-left">{label}</span>
                <span
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''} ${hasActiveChild ? 'text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    <ChevronIcon />
                </span>
            </button>

            <div className={`grid transition-all duration-200 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                        {children.map((child) => {
                            const isActive = pathname === child.href;
                            return (
                                <Link
                                    key={child.id}
                                    href={child.href}
                                    onClick={onNavigate}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${isActive ? activeLeaf : inactiveLeaf}`}>
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    />
                                    {child.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavList({ onNavigate, collapsed, sections }) {
    return (
        <nav className={`flex-1 py-3 space-y-4 overflow-y-auto ${collapsed ? 'px-1' : 'px-3'}`}>
            {sections.map((section, si) => (
                <div key={section.label}>
                    {collapsed ? (
                        si > 0 && <div className="my-2 mx-auto w-5 h-px bg-slate-200/70 dark:bg-slate-800/70" />
                    ) : (
                        <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            {section.label}
                        </p>
                    )}
                    <div className="space-y-0.5">
                        {section.items.map((item) =>
                            item.children ? (
                                <NavParent key={item.id} {...item} onNavigate={onNavigate} collapsed={collapsed} />
                            ) : (
                                <NavLeaf key={item.id} {...item} onNavigate={onNavigate} collapsed={collapsed} />
                            )
                        )}
                    </div>
                </div>
            ))}
        </nav>
    );
}



function BrandHeader({ collapsed, onToggle, companyName }) {
    return (
        <div
            className={`flex items-center gap-3 py-4 border-b border-slate-200/80 dark:border-slate-800/50 ${collapsed ? 'flex-col px-3 gap-2' : 'px-4'}`}>
            <LogoMark companyName={companyName} />
            {!collapsed && (
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
                        {companyName || ''}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">ERP Platform</p>
                </div>
            )}
            <button
                onClick={onToggle}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shrink-0">
                {collapsed ? <ChevronsRightIcon /> : <ChevronsLeftIcon />}
            </button>
        </div>
    );
}

function UserFooter({ collapsed, userInfo }) {
    const fullName = userInfo?.full_name || 'Admin User';
    const roleName = userInfo?.role_name || 'Super Admin';

    return (
        <div
            className={`pb-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/50 ${collapsed ? 'px-1' : 'px-3'}`}>
            {collapsed ? (
                <div className="flex justify-center py-1.5">
                    <div className="relative" title={fullName}>
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {fullName.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-[#0a1422]" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <div className="relative shrink-0">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {fullName.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-[#0a1422]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{roleName}</p>
                    </div>
                    <svg
                        className="w-3.5 h-3.5 text-slate-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export function MobileSidebarClient({ onNavigate, onClose, featureData = [], userInfo = {}, shopList = [] }) {
    const defaultShopId = useMemo(
        () => String(shopList?.find((item) => item.shop_id == userInfo?.shop_id)?.shop_id ?? ''),
        [shopList, userInfo?.shop_id]
    );
    const [selectedShop, setSelectedShop] = useState('');
    const baseSections = useMemo(() => buildNavSections(featureData), [featureData]);
    const [selectedSections, setSelectedSections] = useState(null);
    const selectedShopValue = selectedShop || defaultShopId;
    const sections = selectedSections ?? baseSections;
    const companyName = userInfo?.company_name || 'emojud';

    const onChangehandler = async (shopId) => {
        setSelectedShop(shopId);
        const whId = shopList.find((s) => String(s.shop_id) === String(shopId))?.warehouse_id;
        const res = await refetchNavMenu({ shop_id: shopId, warehouse_id: whId });
        setSelectedSections(buildNavSections(res?.data || []));
    };

    return (
        <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-64 bg-white dark:bg-[#0a1422] border-r border-slate-200/80 dark:border-slate-800/50 flex flex-col shadow-2xl">
                <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <LogoMark companyName={companyName} />
                            <div>
                                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                    {companyName}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">ERP Platform</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xl leading-none">
                            ×
                        </button>
                    </div>
                </div>
                <SearchableDropdown
                    label="Shop List"
                    options={shopList}
                    value={selectedShopValue}
                    onChange={onChangehandler}
                    valueKey="shop_id"
                    labelKey="shop_name"
                    descriptionKey="warehouse_name"
                    searchKeys={['display_code', 'shop_name', 'shop_address']}
                    placeholder="Select a shop"
                    searchPlaceholder="Search shop code or name..."
                    emptyText="No shops found"
                    className="w-full"
                    contentClassName="w-full px-3 pt-3"
                />
                <NavList onNavigate={onNavigate} collapsed={false} sections={sections} />

            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        </div>
    );
}

export default function SidebarClient({ featureData = [], userInfo = {}, shopList = [] }) {
    const [collapsed, setCollapsed] = useState(false);
    const defaultShopId = useMemo(
        () => String(shopList?.find((item) => item.shop_id == userInfo?.shop_id)?.shop_id ?? ''),
        [shopList, userInfo?.shop_id]
    );
    const [selectedShop, setSelectedShop] = useState('');
    const baseSections = useMemo(() => buildNavSections(featureData), [featureData]);
    const [selectedSections, setSelectedSections] = useState(null);
    const selectedShopValue = selectedShop || defaultShopId;
    const sections = selectedSections ?? baseSections;

    const onChangehandler = async (shopId) => {
        setSelectedShop(shopId);
        const whId = shopList.find((s) => String(s.shop_id) === String(shopId))?.warehouse_id;
        const res = await refetchNavMenu({ shop_id: shopId, warehouse_id: whId });
        setSelectedSections(buildNavSections(res?.data || []));
    };

    return (
        <aside
            className={`hidden lg:flex flex-col bg-white dark:bg-[#0a1422] border-r border-slate-200/80 dark:border-slate-800/50 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-62'}`}>
            <BrandHeader
                collapsed={collapsed}
                companyName={userInfo?.company_name}
                onToggle={() => setCollapsed((c) => !c)}
            />
            {!collapsed && (
                <SearchableDropdown
                    label="Shop List"
                    options={shopList}
                    value={selectedShopValue}
                    onChange={onChangehandler}
                    valueKey="shop_id"
                    labelKey="shop_name"
                    descriptionKey="warehouse_name"
                    searchKeys={['display_code', 'shop_name', 'shop_address']}
                    placeholder="Select a shop"
                    searchPlaceholder="Search shop code or name..."
                    emptyText="No shops found"
                />
            )}
            <NavList onNavigate={undefined} collapsed={collapsed} sections={sections} />
        </aside>
    );
}
