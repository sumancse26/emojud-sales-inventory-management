'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_customers',       label: 'Total Customers',   icon: ICONS.users,   tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_sales_amount',    label: 'Total Sales',       icon: ICONS.money,   tone: 'emerald', fallbackFields: ['total_sales', 'total_amount', 'net_amount'] },
    { key: 'total_paid_amount',     label: 'Total Received',    icon: ICONS.check,   tone: 'violet',  fallbackFields: ['total_paid', 'paid_amount', 'total_received'] },
    { key: 'total_due_amount',      label: 'Total Due',         icon: ICONS.clock,   tone: 'rose',    fallbackFields: ['total_due', 'due_amount', 'balance'] },
    { key: 'total_previous_due',    label: 'Previous Due',      icon: ICONS.ledger,  tone: 'amber',   fallbackFields: ['previous_due', 'opening_due'] },
];

const COLUMNS = [
    { key: 'sl',               label: 'SL',           align: 'left' },
    { key: 'customer_id',      label: 'ID',           align: 'left' },
    { key: 'customer_name',    label: 'Customer',     align: 'left' },
    { key: 'name',             label: 'Customer',     align: 'left' },
    { key: 'phone',            label: 'Phone',        align: 'left' },
    { key: 'phone_no',         label: 'Phone',        align: 'left' },
    { key: 'address',          label: 'Address',      align: 'left' },
    { key: 'previous_due',     label: 'Previous Due', align: 'right', isCurrency: true },
    { key: 'opening_due',      label: 'Opening Due',  align: 'right', isCurrency: true },
    { key: 'total_sales',      label: 'Total Sales',  align: 'right', isCurrency: true },
    { key: 'total_amount',     label: 'Total Amount', align: 'right', isCurrency: true },
    { key: 'total_paid',       label: 'Total Paid',   align: 'right', isCurrency: true },
    { key: 'paid_amount',      label: 'Paid',         align: 'right', isCurrency: true },
    { key: 'total_received',   label: 'Received',     align: 'right', isCurrency: true },
    { key: 'total_due',        label: 'Due',          align: 'right', isCurrency: true, isDue: true },
    { key: 'due_amount',       label: 'Due',          align: 'right', isCurrency: true, isDue: true },
    { key: 'balance',          label: 'Balance',      align: 'right', isCurrency: true, isDue: true },
];

export default function CustomerDueReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="rose"
            tableTitle="Customer Due Details"
            emptyMessage="No customer due data available."
        />
    );
}
