import Link from 'next/link';
import { reportList } from '@/services/report';

export const metadata = {
    title: 'Reports'
};

export default function ReportsLayout({ children, params }) {
    const activeReport = params?.report;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-6 py-6"><main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
