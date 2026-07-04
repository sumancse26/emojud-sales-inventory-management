export default function UnderDevelopment({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            {/* Animated icon */}
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center shadow-xl shadow-amber-100/50 dark:shadow-amber-900/20">
                    <svg
                        className="w-12 h-12 text-amber-500 dark:text-amber-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
                {/* Pulsing ring */}
                <span className="absolute inset-0 rounded-3xl border-2 border-amber-400/30 dark:border-amber-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Under Development</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {title ?? 'Coming Soon'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-8">
                {description ?? "We're actively building this feature. Check back soon for updates."}
            </p>

            {/* Progress bar decoration */}
            <div className="w-64 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>In Progress</span>
                    <span>~Soon</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500"
                        style={{ width: '55%' }}
                    />
                </div>
            </div>
        </div>
    );
}
