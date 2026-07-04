import DailySalesReport from './daily-sales/DailySalesReport';
import DailyPurchaseReport from './daily-purchase/DailyPurchaseReport';
import DailyExpenseReport from './daily-expense/DailyExpenseReport';
import StockSummaryReport from './stock-summary/StockSummaryReport';
import CustomerDueReport from './customer-due/CustomerDueReport';
import SupplierDueReport from './supplier-due/SupplierDueReport';
import GrossProfitReport from './gross-profit/GrossProfitReport';
import CashFlowReport from './cash-flow/CashFlowReport';
import ProductLedgerReport from './product-ledger/ProductLedgerReport';
import CollectionReport from './collection/CollectionReport';
import DefaultReport from './default/DefaultReport';

export const reportTemplates = {
    'daily-sales': DailySalesReport,
    'daily-purchase': DailyPurchaseReport,
    'daily-expense': DailyExpenseReport,
    'stock-summary': StockSummaryReport,
    'customer-due': CustomerDueReport,
    'supplier-due': SupplierDueReport,
    'gross-profit': GrossProfitReport,
    'cash-flow': CashFlowReport,
    'product-ledger': ProductLedgerReport,
    collection: CollectionReport,
    default: DefaultReport,
};
