'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { loginAction } from './action';

export default function LoginPageClient({ currentYear, demoAccount, liveUrl }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username || !password) { toast.error('Invalid Credentials'); return; }
        try {
            setLoading(true);
            const res = await loginAction({ username, password });
            if (res.response_code == 200) {
                toast.success(res.message || 'Login Successful');
                window.location.href = '/feature/dashboard';
            } else {
                toast.error(res.message || 'Invalid Credentials');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    function fillDemoCredentials() {
        setUsername(demoAccount.username);
        setPassword(demoAccount.password);
        setShowPw(true);
    }

    return (
        <div className="w-full max-w-sm">
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500 mb-8">Sign in to your account to continue</p>

            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Demo Access</p>

                    </div>
                    <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="shrink-0 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                        Use demo account
                    </button>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p>
                        <span className="font-semibold text-slate-900">Username:</span> {demoAccount.username}
                    </p>
                    <p>
                        <span className="font-semibold text-slate-900">Password:</span> {demoAccount.password}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">
                        User Name
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                        </span>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="user name"
                            autoComplete="username"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-[11px] font-bold tracking-widest uppercase text-slate-500">
                            Password
                        </label>
                        <button type="button" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </span>
                        <input
                            id="password"
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label={showPw ? 'Hide password' : 'Show password'}>
                            {showPw ? (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                    <div className="relative shrink-0">
                        <input type="checkbox" className="sr-only peer" checked={remember} onChange={e => setRemember(e.target.checked)} />
                        <div className="w-[1.1rem] h-[1.1rem] rounded-sm border-2 border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                            {remember && <svg viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5"><polyline points="1,5 4.5,8.5 11,1" /></svg>}
                        </div>
                    </div>
                    <span className="text-sm text-slate-600">Stay signed in for 30 days</span>
                </label>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm py-3.5 transition-all shadow-lg shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Signing in…
                        </>
                    ) : (
                        <>
                            Continue
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-3 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all">
                    <svg className="w-4 h-4" viewBox="0 0 21 21"><path d="M0 0h10v10H0z" fill="#f25022" /><path d="M11 0h10v10H11z" fill="#7fba00" /><path d="M0 11h10v10H0z" fill="#00a4ef" /><path d="M11 11h10v10H11z" fill="#ffb900" /></svg>
                    Microsoft
                </button>
                <button type="button" className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all">
                    <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    SSO
                </button>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
                Need help?
                <button type="button" className="font-semibold text-indigo-600 hover:underline underline-offset-2">Contact your administrator</button>
            </p>
        </div>
    );
}
