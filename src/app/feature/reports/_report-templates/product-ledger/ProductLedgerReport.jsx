'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_entries',        label: 'Total Entries',     icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'opening_stock',       label: 'Opening Stock',     icon: ICONS.box,     tone: 'slate',   fallbackFields: ['opening_stock', 'opening_qty', 'opening_balance'] },
    { key: 'total_in_qty',        label: 'Total In',          icon: ICONS.arrowUp, tone: 'emerald', fallbackFields: ['in_qty', 'purchase_qty', 'received_qty'] },
    { key: 'total_out_qty',       label: 'Total Out',         icon: ICONS.arrowDown, tone: 'rose',  fallbackFields: ['out_qty', 'sales_qty', 'issued_qty'] },
    { key: 'closing_stock',       label: 'Closing Stock',     icon: ICONS.chart,   tone: 'violet',  fallbackFields: ['closing_stock', 'closing_qty', 'balance_qty'] },
    { key: 'total_stock_value',   label: 'Stock Value',       icon: ICONS.money,   tone: 'amber',   fallbackFields: ['stock_value', 'total_value', 'amount'] },
];

const COLUMNS = [
    { key: 'sl',              label: 'SL',            align: 'left' },
    { key: 'date',            label: 'Date',          align: 'left' },
    { key: 'tran_date',       label: 'Date',          align: 'left' },
    { key: 'voucher_no',      label: 'Voucher No',    align: 'left' },
    { key: 'reference',       label: 'Reference',     align: 'left' },
    { key: 'description',     label: 'Description',   align: 'left' },
    { key: 'particulars',     label: 'Particulars',   align: 'left' },
    { key: 'type',            label: 'Type',          align: 'left' },
    { key: 'tran_type',       label: 'Type',          align: 'left' },
    { key: 'product_name',    label: 'Product',       align: 'left' },
    { key: 'in_qty',          label: 'In Qty',        align: 'right' },
    { key: 'purchase_qty',    label: 'Purchase Qty',  align: 'right' },
    { key: 'received_qty',    label: 'Received Qty',  align: 'right' },
    { key: 'out_qty',         label: 'Out Qty',       align: 'right' },
    { key: 'sales_qty',       label: 'Sales Qty',     align: 'right' },
    { key: 'issued_qty',      label: 'Issued Qty',    align: 'right' },
    { key: 'balance_qty',     label: 'Balance Qty',   align: 'right' },
    { key: 'rate',            label: 'Rate',          align: 'right', isCurrency: true },
    { key: 'amount',          label: 'Amount',        align: 'right', isCurrency: true },
    { key: 'total_amount',    label: 'Total',         align: 'right', isCurrency: true },
    { key: 'stock_value',     label: 'Stock Value',   align: 'right', isCurrency: true },
];

export default function ProductLedgerReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="teal"
            tableTitle="Product Ledger Details"
            emptyMessage="No product ledger data found for the selected filters."
        />
    );
}
