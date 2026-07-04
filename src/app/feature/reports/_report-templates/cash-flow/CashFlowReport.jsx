'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_entries',       label: 'Total Entries',     icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'opening_balance',    label: 'Opening Balance',   icon: ICONS.wallet,  tone: 'slate',   fallbackFields: ['opening_balance', 'opening_cash'] },
    { key: 'total_inflow',       label: 'Total Inflow',      icon: ICONS.arrowUp, tone: 'emerald', fallbackFields: ['total_cash_in', 'total_debit', 'cash_in', 'inflow'] },
    { key: 'total_outflow',      label: 'Total Outflow',     icon: ICONS.arrowDown, tone: 'rose',  fallbackFields: ['total_cash_out', 'total_credit', 'cash_out', 'outflow'] },
    { key: 'closing_balance',    label: 'Closing Balance',   icon: ICONS.money,   tone: 'violet',  fallbackFields: ['closing_balance', 'closing_cash', 'balance'] },
];

const COLUMNS = [
    { key: 'sl',                label: 'SL',           align: 'left' },
    { key: 'date',              label: 'Date',         align: 'left' },
    { key: 'tran_date',         label: 'Date',         align: 'left' },
    { key: 'voucher_no',        label: 'Voucher No',   align: 'left' },
    { key: 'reference',         label: 'Reference',    align: 'left' },
    { key: 'description',       label: 'Description',  align: 'left' },
    { key: 'particulars',       label: 'Particulars',  align: 'left' },
    { key: 'type',              label: 'Type',         align: 'left' },
    { key: 'tran_type',         label: 'Type',         align: 'left' },
    { key: 'cash_in',           label: 'Cash In',      align: 'right', isCurrency: true },
    { key: 'debit',             label: 'Debit',        align: 'right', isCurrency: true },
    { key: 'inflow',            label: 'Inflow',       align: 'right', isCurrency: true },
    { key: 'cash_out',          label: 'Cash Out',     align: 'right', isCurrency: true },
    { key: 'credit',            label: 'Credit',       align: 'right', isCurrency: true },
    { key: 'outflow',           label: 'Outflow',      align: 'right', isCurrency: true },
    { key: 'balance',           label: 'Balance',      align: 'right', isCurrency: true },
    { key: 'running_balance',   label: 'Balance',      align: 'right', isCurrency: true },
];

export default function CashFlowReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="blue"
            tableTitle="Cash Book Details"
            emptyMessage="No cash flow data found for the selected period."
        />
    );
}
