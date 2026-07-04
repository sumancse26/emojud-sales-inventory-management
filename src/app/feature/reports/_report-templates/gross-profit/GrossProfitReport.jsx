'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_entries',       label: 'Total Entries',     icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_sales',        label: 'Total Sales',       icon: ICONS.arrowUp, tone: 'emerald', fallbackFields: ['total_sales_amount', 'sales_amount'] },
    { key: 'total_cost',         label: 'Total Cost',        icon: ICONS.arrowDown, tone: 'rose',  fallbackFields: ['total_cost_amount', 'cost_amount', 'purchase_amount', 'total_purchase'] },
    { key: 'gross_profit',       label: 'Gross Profit',      icon: ICONS.chart,   tone: 'violet',  fallbackFields: ['profit', 'profit_amount', 'gross_profit_amount'] },
    { key: 'profit_margin',      label: 'Profit Margin',     icon: ICONS.percent, tone: 'amber',   fallbackFields: ['margin', 'profit_percentage'], format: (v) => `${Number(v || 0).toFixed(2)}%` },
];

const COLUMNS = [
    { key: 'sl',                 label: 'SL',           align: 'left' },
    { key: 'product_name',      label: 'Product',      align: 'left' },
    { key: 'product_code',      label: 'Code',         align: 'left' },
    { key: 'category_name',     label: 'Category',     align: 'left' },
    { key: 'date',              label: 'Date',         align: 'left' },
    { key: 'invoice_no',        label: 'Invoice No',   align: 'left' },
    { key: 'qty',               label: 'Qty',          align: 'right' },
    { key: 'sales_qty',         label: 'Sales Qty',    align: 'right' },
    { key: 'sales_amount',      label: 'Sales Amount', align: 'right', isCurrency: true },
    { key: 'total_sales_amount',label: 'Sales Amount', align: 'right', isCurrency: true },
    { key: 'cost_amount',       label: 'Cost Amount',  align: 'right', isCurrency: true },
    { key: 'total_cost_amount', label: 'Cost Amount',  align: 'right', isCurrency: true },
    { key: 'purchase_amount',   label: 'Purchase',     align: 'right', isCurrency: true },
    { key: 'profit',            label: 'Profit',       align: 'right', isCurrency: true },
    { key: 'profit_amount',     label: 'Profit',       align: 'right', isCurrency: true },
    { key: 'gross_profit_amount', label: 'Profit',     align: 'right', isCurrency: true },
    { key: 'margin',            label: 'Margin %',     align: 'right' },
    { key: 'profit_percentage', label: 'Margin %',     align: 'right' },
];

export default function GrossProfitReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="emerald"
            tableTitle="Profit Details"
            emptyMessage="No profit data found for the selected period."
        />
    );
}
