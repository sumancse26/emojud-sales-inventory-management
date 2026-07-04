'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_purchase',          label: 'Total Purchases',  icon: ICONS.cart,    tone: 'indigo',  fallbackFields: '__count__', format: 'number' },
    { key: 'total_purchase_amount',   label: 'Total Amount',     icon: ICONS.money,   tone: 'emerald', fallbackFields: ['total_amount', 'net_amount'] },
    { key: 'total_paid_amount',       label: 'Total Paid',       icon: ICONS.check,   tone: 'violet',  fallbackFields: ['paid_amount'] },
    { key: 'total_due_amount',        label: 'Total Due',        icon: ICONS.clock,   tone: 'rose',    fallbackFields: ['due_amount'] },
    { key: 'total_discount_amount',   label: 'Total Discount',   icon: ICONS.tag,     tone: 'amber',   fallbackFields: ['discount_amount'] },
    { key: 'total_vat_amount',        label: 'Total VAT',        icon: ICONS.receipt, tone: 'cyan',    fallbackFields: ['vat_amount'] },
];

const COLUMNS = [
    { key: 'purchase_no',     label: 'Purchase No',  align: 'left' },
    { key: 'purchase_date',   label: 'Date',         align: 'left' },
    { key: 'supplier_name',   label: 'Supplier',     align: 'left' },
    { key: 'total_amount',    label: 'Amount',       align: 'right', isCurrency: true },
    { key: 'discount_amount', label: 'Discount',     align: 'right', isCurrency: true },
    { key: 'vat_amount',      label: 'VAT',          align: 'right', isCurrency: true },
    { key: 'net_amount',      label: 'Net',          align: 'right', isCurrency: true },
    { key: 'paid_amount',     label: 'Paid',         align: 'right', isCurrency: true },
    { key: 'due_amount',      label: 'Due',          align: 'right', isCurrency: true, isDue: true },
];

export default function DailyPurchaseReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="indigo"
            tableTitle="Purchase Details"
            emptyMessage="No purchase data found for the selected period."
        />
    );
}
