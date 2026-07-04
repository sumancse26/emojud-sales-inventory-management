import { fetchApi } from '@/lib/api';

const reportMap = {
    'daily-sales': {
        endpoint: '/api/report/daily-sales',
        url: '/feature/reports/daily-sales',
        title: 'Daily Sales',
        description: 'View daily sales totals, revenue, and trend data.',
        filters: { dateRange: true, product: false }
    },
    'daily-purchase': {
        endpoint: '/api/report/daily-purchase',
        url: '/feature/reports/daily-purchase',
        title: 'Daily Purchase',
        description: 'Monitor daily purchase activity and totals.',
        filters: { dateRange: true, product: false }
    },
    'daily-expense': {
        endpoint: '/api/report/daily-expense',
        url: '/feature/reports/daily-expense',
        title: 'Daily Expense',
        description: 'Track daily expense amounts and category summaries.',
        filters: { dateRange: true, product: false }
    },
    'gross-profit': {
        endpoint: '/api/report/gross-profit',
        url: '/feature/reports/gross-profit',
        title: 'Gross Profit',
        description: 'Analyze profit margins and cost versus sales.',
        filters: { dateRange: true, product: false }
    },
    'cash-flow': {
        endpoint: '/api/report/cash-flow',
        url: '/feature/reports/cash-flow',
        title: 'Cash Flow',
        description: 'Review cash movement and liquidity over time.',
        filters: { dateRange: true, product: false }
    },
    collection: {
        endpoint: '/api/report/collection',
        url: '/feature/reports/collection',
        title: 'Collection',
        description: 'See payment collection and receipt trends.',
        filters: { dateRange: true, product: false }
    },
    'customer-due': {
        endpoint: '/api/report/customer-due',
        url: '/feature/reports/customer-due',
        title: 'Customer Due',
        description: 'Review outstanding balances for customers.',
        filters: { dateRange: false, product: false }
    },
    'supplier-due': {
        endpoint: '/api/report/supplier-due',
        url: '/feature/reports/supplier-due',
        title: 'Supplier Due',
        description: 'Review outstanding balances for suppliers.',
        filters: { dateRange: false, product: false }
    },
    'product-ledger': {
        endpoint: '/api/report/product-ledger',
        url: '/feature/reports/product-ledger',
        title: 'Product Ledger',
        description: 'Inspect stock movement, opening balances, and product cost flow.',
        filters: { dateRange: true, product: true }
    },
    'stock-summary': {
        endpoint: '/api/report/stock-summary',
        url: '/feature/reports/stock-summary',
        title: 'Stock Summary',
        description: 'View overall stock valuation and inventory balances.',
        filters: { dateRange: false, product: false }
    },
    'employee-reports': {
        endpoint: '/api/report/employee-report',
        url: '/feature/reports/employee-reports',
        title: 'Employee Report',
        description: 'View overall employee valuation and inventory balances.',
        filters: { dateRange: false, product: false }
    }
};

const reportSlugMap = Object.fromEntries(
    Object.entries(reportMap).map(([key, value]) => {
        const slug = value.url?.replace(/^\/feature\/reports\//, '') || key;
        return [slug, { key, ...value }];
    })
);

export const fetchReport = async (reportKey, params = {}, customHeaders = {}) => {
    const report = reportMap[reportKey] || reportSlugMap[reportKey];
    if (!report) {
        throw new Error(`Unknown report key: ${reportKey}`);
    }

    const query = new URLSearchParams(
        Object.entries(params || {})
            .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
            .map(([key, value]) => [key, String(value)])
    ).toString();

    const url = query ? `${report.endpoint}?${query}` : report.endpoint;
    return fetchApi(url, {
        method: 'GET',
        headers: customHeaders
    });
};

export const reportList = Object.entries(reportMap).map(([key, value]) => ({
    key,
    url: value.url || `/feature/reports/${key}`,
    ...value
}));
export const getReportConfig = (reportKey) => {
    const report = reportMap[reportKey] || reportSlugMap[reportKey];
    return report ? { key: report.key, ...report } : null;
};
