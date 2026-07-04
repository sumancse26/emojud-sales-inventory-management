import LoginPageClient from './LoginPageClient';

const FEATURES = [
    {
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l1-5h16l1 5" />
                <path d="M3 9a2 2 0 002 2 2 2 0 002-2 2 2 0 002 2 2 2 0 002-2 2 2 0 002 2 2 2 0 002-2" />
                <path d="M5 11v8h14v-8" />
            </svg>
        ),
        label: 'Multi-Shop Control',
        desc: 'All branches from one unified dashboard',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        label: 'Live Analytics',
        desc: 'Revenue, sales & stock tracked in real time',
        color: 'bg-indigo-100 text-indigo-600',
    },
    {
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
        ),
        label: 'HR & Payroll',
        desc: 'Employees, attendance, salary simplified',
        color: 'bg-emerald-100 text-emerald-600',
    },
];

const AVATAR_COLORS = ['bg-blue-400', 'bg-violet-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-amber-400'];

function BrandPanel() {
    return (
        <div className="hidden lg:flex relative w-full  flex-col z-10">
            <div className="relative z-10 flex flex-col justify-between flex-1 px-10 xl:px-14 py-12">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30">
                        ej
                    </div>
                    <span className="text-slate-900 font-bold text-lg tracking-tight">Emojud</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">ERP</span>
                </div>

                {/* Hero */}
                <div>
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-500">Smart Business Platform</p>
                    </div>
                    <h3 className="text-4xl xl:text-4xl font-extrabold text-slate-900 leading-[1.1] mb-5 flex w-full whitespace-nowrap">
                        <span className="pe-2">Run your business</span>
                        <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #6366f1, #a855f7)' }}>
                            Effortlessly.
                        </span>
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10">
                        One platform for shops, inventory, HR, payroll,<br />and analytics — everything your team needs.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4 mb-10">
                        {FEATURES.map(({ icon, label, desc, color }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color} bg-opacity-15`}>
                                    {icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>


            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Shared background — dot grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Shared glow orbs */}
            <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-indigo-300/30 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-100 h-100 rounded-full bg-violet-300/25 blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-200/20 blur-[100px] pointer-events-none" />

            {/* Shared geometric arcs */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
                <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
                    <circle cx="1100" cy="80" r="260" stroke="#6366f1" strokeWidth="80" />
                    <circle cx="1100" cy="80" r="420" stroke="#6366f1" strokeWidth="1" />
                    <circle cx="80" cy="780" r="180" stroke="#6366f1" strokeWidth="60" />
                </svg>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 w-full max-w-[1300px] px-3 py-0 lg:py-12">
                <BrandPanel />

                {/* Right panel */}
                <div className="w-full max-w-md relative z-10 mx-auto">
                    <div className="bg-white border border-slate-200/80 rounded-[2rem] shadow-2xl shadow-slate-900/10 p-4 sm:p-8">
                        <div className="lg:hidden flex items-center gap-2.5 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30">ej</div>
                            <span className="text-slate-900 font-bold text-lg tracking-tight">Emojud</span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-300 rounded-full px-2 py-0.5">ERP</span>
                        </div>

                        <LoginPageClient currentYear={new Date().getFullYear()} />
                    </div>
                </div>

            </div>
            {/* Trust footer */}
            <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center gap-4 text-center">
                <div className="flex -space-x-2 shrink-0">
                    {AVATAR_COLORS.map((c, i) => (
                        <div key={i} className={`w-5 h-5 rounded-full border border-white shrink-0 ${c}`} />
                    ))}
                    <div className="w-5 h-5 rounded-full border border-white bg-slate-800 flex items-center justify-center shrink-0">
                        <span className="text-[7px] font-bold text-white">+120</span>
                    </div>
                </div>
                <div>
                    <p className="text-slate-700 text-xs font-semibold">500+ businesses trust Emojud</p>
                </div>
            </div>
        </div>
    );
}
