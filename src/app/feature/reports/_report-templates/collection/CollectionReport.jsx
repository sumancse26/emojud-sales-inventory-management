'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_collections',    label: 'Total Collections',  icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_amount',         label: 'Total Amount',       icon: ICONS.money,   tone: 'emerald', fallbackFields: ['total_collection', 'collection_amount', 'amount'] },
    { key: 'total_cash',           label: 'Cash Collection',    icon: ICONS.wallet,  tone: 'violet',  fallbackFields: ['cash_amount', 'cash'] },
    { key: 'total_bank',           label: 'Bank Collection',    icon: ICONS.chart,   tone: 'indigo',  fallbackFields: ['bank_amount', 'bank'] },
    { key: 'total_mobile',         label: 'Mobile Banking',     icon: ICONS.expense, tone: 'cyan',    fallbackFields: ['mobile_amount', 'mobile_banking'] },
];

const COLUMNS = [
    { key: 'sl',                label: 'SL',              align: 'left' },
    { key: 'collection_no',    label: 'Collection No',   align: 'left' },
    { key: 'receipt_no',       label: 'Receipt No',      align: 'left' },
    { key: 'voucher_no',       label: 'Voucher No',      align: 'left' },
    { key: 'date',             label: 'Date',            align: 'left' },
    { key: 'collection_date',  label: 'Date',            align: 'left' },
    { key: 'customer_name',    label: 'Customer',        align: 'left' },
    { key: 'name',             label: 'Name',            align: 'left' },
    { key: 'invoice_no',       label: 'Invoice No',      align: 'left' },
    { key: 'payment_method',   label: 'Method',          align: 'left' },
    { key: 'payment_type',     label: 'Method',          align: 'left' },
    { key: 'description',      label: 'Description',     align: 'left' },
    { key: 'remarks',          label: 'Remarks',         align: 'left' },
    { key: 'amount',           label: 'Amount',          align: 'right', isCurrency: true },
    { key: 'collection_amount',label: 'Amount',          align: 'right', isCurrency: true },
    { key: 'cash_amount',      label: 'Cash',            align: 'right', isCurrency: true },
    { key: 'bank_amount',      label: 'Bank',            align: 'right', isCurrency: true },
    { key: 'mobile_amount',    label: 'Mobile',          align: 'right', isCurrency: true },
];

export default function CollectionReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="emerald"
            tableTitle="Collection Details"
            emptyMessage="No collection data found for the selected period."
        />
    );
}
