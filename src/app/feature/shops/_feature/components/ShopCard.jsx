const AVATAR_COLORS = [
    'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
    'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400',
    'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400',
    'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
];

function getAvatarColor(name = '') {
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
}

export default function ShopCard({ shop, onEdit }) {
    const initial = (shop.shop_name || '?')[0].toUpperCase();
    const avatarCls = getAvatarColor(shop.shop_name);
    const isActive = shop.status === 1;

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 flex flex-col gap-4 hover:border-blue-300/60 dark:hover:border-slate-700/80 hover:shadow-md hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-200 group">

            {/* Top row */}
            <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 group-hover:scale-105 transition-transform duration-200 ${avatarCls}`}>
                    {initial}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Name + codes */}
            <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{shop.shop_name}</h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="font-mono text-[11px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-md px-1.5 py-0.5">
                        {shop.display_code}
                    </span>
                    {shop.short_code && (
                        <span className="font-mono text-[11px] bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 rounded-md px-1.5 py-0.5">
                            {shop.short_code}
                        </span>
                    )}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                {shop.phone && (
                    <p className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .96h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.92a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <span>{shop.phone}</span>
                    </p>
                )}
                {(shop.address || shop.address_2) && (
                    <p className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="line-clamp-2">{[shop.address, shop.address_2].filter(Boolean).join(', ')}</span>
                    </p>
                )}
                {shop.slogan && (
                    <p className="flex items-center gap-2 italic text-slate-400 dark:text-slate-500">
                        <svg className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <span className="line-clamp-1">{shop.slogan}</span>
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button onClick={() => onEdit?.(shop)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 transition-all">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                </button>
            </div>
        </div>
    );
}

