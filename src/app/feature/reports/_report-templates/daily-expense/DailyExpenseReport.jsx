'use client';

import StandardReportTemplate, { ICONS } from '../StandardReportTemplate';

const METRICS = [
    { key: 'total_expense',         label: 'Total Entries',    icon: ICONS.invoice, tone: 'blue',    fallbackFields: '__count__', format: 'number' },
    { key: 'total_expense_amount',  label: 'Total Expense',    icon: ICONS.expense, tone: 'rose',    fallbackFields: ['amount', 'expense_amount', 'total_amount'] },
    { key: 'total_paid_amount',     label: 'Total Paid',       icon: ICONS.check,   tone: 'emerald', fallbackFields: ['paid_amount'] },
    { key: 'total_due_amount',      label: 'Total Due',        icon: ICONS.clock,   tone: 'amber',   fallbackFields: ['due_amount'] },
];

const COLUMNS = [
    { key: 'expense_no',       label: 'Expense No',   align: 'left' },
    { key: 'sl',               label: 'SL',           align: 'left' },
    { key: 'expense_date',     label: 'Date',         align: 'left' },
    { key: 'date',             label: 'Date',         align: 'left' },
    { key: 'category_name',    label: 'Category',     align: 'left' },
    { key: 'expense_category', label: 'Category',     align: 'left' },
    { key: 'description',      label: 'Description',  align: 'left' },
    { key: 'remarks',          label: 'Remarks',      align: 'left' },
    { key: 'amount',           label: 'Amount',       align: 'right', isCurrency: true },
    { key: 'expense_amount',   label: 'Amount',       align: 'right', isCurrency: true },
    { key: 'total_amount',     label: 'Total',        align: 'right', isCurrency: true },
    { key: 'paid_amount',      label: 'Paid',         align: 'right', isCurrency: true },
    { key: 'due_amount',       label: 'Due',          align: 'right', isCurrency: true, isDue: true },
];

export default function DailyExpenseReport({ reportData }) {
    return (
        <StandardReportTemplate
            reportData={reportData}
            metrics={METRICS}
            columns={COLUMNS}
            accent="rose"
            tableTitle="Expense Details"
            emptyMessage="No expense data found for the selected period."
        />
    );
}
