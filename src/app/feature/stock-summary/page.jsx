import { cookies } from 'next/headers';
import StockSummaryFeature from './_feature';
import { getStockSummaryList } from '@/services/stockSummary';

export default async function StockSummaryPage() {
    const cookieStore = await cookies();
    const headers = { Cookie: cookieStore.toString() };
    let list = [];

    try {
        const res = await getStockSummaryList(headers);
        list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    } catch (error) {
        console.error('Failed to load stock summary:', error);
    }

    return <StockSummaryFeature initialList={list} />;
}
