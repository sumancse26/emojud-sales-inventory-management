'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_products',     label: 'Total Products',    icon: ICONS.box,     tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_stock_value',  label: 'Stock Value',       icon: ICONS.money,   tone: 'emerald', fallbackFields: ['stock_value', 'total_value'] },
    { key: 'total_stock_qty',    label: 'Total Stock Qty',   icon: ICONS.chart,   tone: 'violet',  fallbackFields: ['closing_stock', 'stock_qty', 'avail_stock'], format: 'number' },
    { key: 'total_purchase_qty', label: 'Total Purchase Qty',icon: ICONS.cart,    tone: 'indigo',  fallbackFields: ['purchase_qty', 'in_qty'], format: 'number' },
    { key: 'total_sales_qty',    label: 'Total Sales Qty',   icon: ICONS.arrowUp, tone: 'amber',   fallbackFields: ['sales_qty', 'out_qty'], format: 'number' },
];

const COLUMNS = [
    { key: 'sl',              label: 'SL',            align: 'left' },
    { key: 'product_name',    label: 'Product',       align: 'left' },
    { key: 'product_code',    label: 'Code',          align: 'left' },
    { key: 'category_name',   label: 'Category',      align: 'left' },
    { key: 'unit_name',       label: 'Unit',          align: 'left' },
    { key: 'opening_stock',   label: 'Opening',       align: 'right', isCurrency: false },
    { key: 'purchase_qty',    label: 'Purchase Qty',  align: 'right', isCurrency: false },
    { key: 'in_qty',          label: 'In Qty',        align: 'right', isCurrency: false },
    { key: 'sales_qty',       label: 'Sales Qty',     align: 'right', isCurrency: false },
    { key: 'out_qty',         label: 'Out Qty',       align: 'right', isCurrency: false },
    { key: 'closing_stock',   label: 'Closing Stock', align: 'right', isCurrency: false },
    { key: 'avail_stock',     label: 'Available',     align: 'right', isCurrency: false },
    { key: 'stock_qty',       label: 'Stock Qty',     align: 'right', isCurrency: false },
    { key: 'purchase_rate',   label: 'Purchase Rate', align: 'right', isCurrency: true },
    { key: 'sales_rate',      label: 'Sales Rate',    align: 'right', isCurrency: true },
    { key: 'stock_value',     label: 'Stock Value',   align: 'right', isCurrency: true },
    { key: 'total_value',     label: 'Total Value',   align: 'right', isCurrency: true },
];

export default function StockSummaryReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="violet"
            tableTitle="Stock Details"
            emptyMessage="No stock data available."
        />
    );
}
