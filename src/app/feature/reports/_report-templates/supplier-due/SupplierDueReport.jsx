'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_suppliers',       label: 'Total Suppliers',   icon: ICONS.truck,   tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_purchase_amount', label: 'Total Purchase',    icon: ICONS.money,   tone: 'emerald', fallbackFields: ['total_purchase', 'total_amount', 'net_amount'] },
    { key: 'total_paid_amount',     label: 'Total Paid',        icon: ICONS.check,   tone: 'violet',  fallbackFields: ['total_paid', 'paid_amount'] },
    { key: 'total_due_amount',      label: 'Total Due',         icon: ICONS.clock,   tone: 'rose',    fallbackFields: ['total_due', 'due_amount', 'balance'] },
    { key: 'total_previous_due',    label: 'Previous Due',      icon: ICONS.ledger,  tone: 'amber',   fallbackFields: ['previous_due', 'opening_due'] },
];

const COLUMNS = [
    { key: 'sl',               label: 'SL',            align: 'left' },
    { key: 'supplier_id',      label: 'ID',            align: 'left' },
    { key: 'supplier_name',    label: 'Supplier',      align: 'left' },
    { key: 'name',             label: 'Supplier',      align: 'left' },
    { key: 'phone',            label: 'Phone',         align: 'left' },
    { key: 'phone_no',         label: 'Phone',         align: 'left' },
    { key: 'address',          label: 'Address',       align: 'left' },
    { key: 'previous_due',     label: 'Previous Due',  align: 'right', isCurrency: true },
    { key: 'opening_due',      label: 'Opening Due',   align: 'right', isCurrency: true },
    { key: 'total_purchase',   label: 'Total Purchase',align: 'right', isCurrency: true },
    { key: 'total_amount',     label: 'Total Amount',  align: 'right', isCurrency: true },
    { key: 'total_paid',       label: 'Total Paid',    align: 'right', isCurrency: true },
    { key: 'paid_amount',      label: 'Paid',          align: 'right', isCurrency: true },
    { key: 'total_due',        label: 'Due',           align: 'right', isCurrency: true, isDue: true },
    { key: 'due_amount',       label: 'Due',           align: 'right', isCurrency: true, isDue: true },
    { key: 'balance',          label: 'Balance',       align: 'right', isCurrency: true, isDue: true },
];

export default function SupplierDueReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="orange"
            tableTitle="Supplier Due Details"
            emptyMessage="No supplier due data available."
        />
    );
}
