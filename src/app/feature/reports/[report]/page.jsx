import { getReportConfig } from '@/services/report';
import { getUserWiseShopList } from '@/services/shop';
import { getShopWiseProductList } from '@/services/products';
import { cookies } from 'next/headers';
import ReportDetailClient from './ReportDetailClient.jsx';

export async function generateMetadata({ params }) {
    const resolved = await params;
    const config = getReportConfig(resolved.report);
    return {
        title: config?.title ? `${config.title} | Reports` : 'Report'
    };
}

export default async function ReportDetailPage({ params }) {
    const resolved = await params;
    const { report: reportKey } = resolved;
    const config = getReportConfig(reportKey);

    if (!config) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
                <h1 className="text-xl font-semibold">Report not found</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Check the report URL and try again.</p>
            </div>
        );
    }

    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try {
            userInfo = JSON.parse(userInfoCookie);
        } catch {
            userInfo = {};
        }
    }

    let shopList = [];
    let productList = [];
    try {
        const headers = { Cookie: cookieStore.toString() };
        const shopRes = await getUserWiseShopList(headers);
        const products = await getShopWiseProductList(headers);
        shopList = shopRes?.data || [];
        productList = products?.data || [];
    } catch {
        shopList = [];
        productList = [];
    }

    return <ReportDetailClient reportKey={config?.key} config={config} userInfo={userInfo} shopList={shopList} productList={productList} />;
}
