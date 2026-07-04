import Link from 'next/link';
import { reportList } from '@/services/report';

export const metadata = {
    title: 'Reports'
};

export default function ReportsPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reports</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Browse and filter all business reports. Choose a report to view details, charts, and summary insights.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {reportList.map((report) => (
                    <Link
                        key={report.key}
                        href={report.url}
                        className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{report.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{report.description}</p>
                        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            View report
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
