'use client';

import StandardReportTemplate, { ICONS, fmtCurrency } from '../StandardReportTemplate';
import { formatNumber } from '../reportHelpers';

const METRICS = [
    { key: 'total_invoice',          label: 'Total Invoices',   icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_sales_amount',     label: 'Total Sales',      icon: ICONS.money,   tone: 'emerald', fallbackFields: ['total_amount', 'net_amount'] },
    { key: 'total_paid_amount',      label: 'Total Paid',       icon: ICONS.check,   tone: 'violet',  fallbackFields: ['paid_amount'] },
    { key: 'total_due_amount',       label: 'Total Due',        icon: ICONS.clock,   tone: 'rose',    fallbackFields: ['due_amount'] },
    { key: 'total_discount_amount',  label: 'Total Discount',   icon: ICONS.tag,     tone: 'amber',   fallbackFields: ['discount_amount'] },
    { key: 'total_vat_amount',       label: 'Total VAT',        icon: ICONS.receipt, tone: 'cyan',    fallbackFields: ['vat_amount'] },
];

const COLUMNS = [
    { key: 'invoice_no',      label: 'Invoice No',  align: 'left' },
    { key: 'invoice_date',    label: 'Date',         align: 'left' },
    { key: 'customer_name',   label: 'Customer',     align: 'left' },
    { key: 'total_amount',    label: 'Amount',       align: 'right', isCurrency: true },
    { key: 'discount_amount', label: 'Discount',     align: 'right', isCurrency: true },
    { key: 'vat_amount',      label: 'VAT',          align: 'right', isCurrency: true },
    { key: 'net_amount',      label: 'Net',          align: 'right', isCurrency: true },
    { key: 'paid_amount',     label: 'Paid',         align: 'right', isCurrency: true },
    { key: 'due_amount',      label: 'Due',          align: 'right', isCurrency: true, isDue: true },
];

export default function DailySalesReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="emerald"
            tableTitle="Invoice Details"
            emptyMessage="No sales data found for the selected period."
        />
    );
}
