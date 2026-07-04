'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function EyeToggleIcon({ off }) {
    return off ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

const fields = [
    { name: 'old_password', label: 'Current Password' },
    { name: 'new_password', label: 'New Password' },
    { name: 'confirm_password', label: 'Confirm New Password' }
];

export default function ChangePasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [show, setShow] = useState({ old_password: false, new_password: false, confirm_password: false });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const toggleShow = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.new_password != form.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (form.new_password.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ old_password: form.old_password, new_password: form.new_password })
            });

            const data = await res.json();

            if (res.ok && data?.response_code == 200) {
                toast.success(data.message || 'Password changed successfully');
                router.push("/login");
            } else {
                toast.error(data?.message || 'Failed to change password');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="bg-white dark:bg-[#0d1729] rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-800/60 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Change Password</h1>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Update your account password</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                        {fields.map(({ name, label }) => (
                            <div key={name} className="space-y-1.5">
                                <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                    {label}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                                        <LockIcon />
                                    </span>
                                    <input
                                        type={show[name] ? 'text' : 'password'}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-10 pr-11 py-3 text-sm outline-none transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleShow(name)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                        <EyeToggleIcon off={!show[name]} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                                {loading ? 'Saving…' : 'Save Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
