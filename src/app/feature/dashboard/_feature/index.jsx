import { getDashboardSummary, getRecentOperations, getDashboardOverview, getStockOverview } from '@/services/dashboard';
import { cookies } from 'next/headers';
import StatusBadge from '@/components/ui/StatusBadge';
import StatsGrid from './components/StatsGrid';
import RevenueChart from './components/RevenueChart';
import PaymentChart from './components/PaymentChart';
import TopProducts from './components/TopProducts';
import RecentActivities from './components/RecentActivities';
import LowStockAlert from './components/LowStockAlert';
import StockSummary from './components/StockSummary';
import TodaySummary from './components/TodaySummary';
import ApprovalQueue from './components/ApprovalQueue';

const TH = 'text-left px-4 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider';
const TD = 'px-4 py-3 text-xs';

function SectionCard({ title, action, children }) {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h3>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

const ViewAllLink = ({ href = '#' }) => (
  <a href={href} className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium transition-colors">View All</a>
);

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const customHeaders = { Cookie: cookieStore.toString() };

  const summary = await getDashboardSummary(customHeaders);
  const summaryInfo = summary?.data || {};

  const recentOperations = await getRecentOperations(customHeaders);
  const recentOperationsInfo = recentOperations?.data || {};

  const dashboardOverview = await getDashboardOverview(customHeaders);
  const dashboardOverviewInfo = dashboardOverview?.data || {};

  const stockOverview = await getStockOverview(customHeaders);
  const stockOverviewInfo = stockOverview?.data || {};

  return (
    <div className="space-y-5">
      {/* Row 1: Stat cards */}
      <StatsGrid summaryInfo={summaryInfo} />

      {/* Row 2: Revenue chart | Payment method donut | Top products */}
      <div className="grid gap-5 xl:grid-cols-[1fr_260px_240px]">
        <RevenueChart overviewChart={dashboardOverviewInfo.overview_chart} />
        <PaymentChart paymentMethods={dashboardOverviewInfo.payment_method_summary} />
        <TopProducts products={dashboardOverviewInfo.top_selling_products} />
      </div>

      {/* Row 3: Recent Invoices | Recent Purchases | Recent Activities */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Recent Invoices" action={<ViewAllLink />}>
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
              <tr>{['Invoice No', 'Customer', 'Amount', 'Status'].map(h => <th key={h} className={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentOperationsInfo.recent_invoice?.length > 0 && (recentOperationsInfo.recent_invoice?.map((inv, invIndx) => (
                <tr key={invIndx} className="border-b border-slate-100 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className={`${TD} font-mono text-amber-600 dark:text-amber-400 font-medium`}>{inv.invoice_no || ''}</td>
                  <td className={`${TD} text-slate-700 dark:text-slate-300`}>{inv.customer_name || ''}</td>
                  <td className={`${TD} text-slate-800 dark:text-slate-200 font-semibold tabular-nums`}>{inv.amount}</td>
                  <td className={TD}><StatusBadge status={inv.status} /></td>
                </tr>
              )))}
            </tbody>
          </table>
        </SectionCard>

        <SectionCard title="Recent Purchases" action={<ViewAllLink />}>
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
              <tr>{['Purchase No', 'Supplier', 'Amount', 'Status'].map(h => <th key={h} className={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentOperationsInfo.recent_purchase?.length > 0 && (recentOperationsInfo.recent_purchase?.map((pur, purIndx) => (
                <tr key={purIndx} className="border-b border-slate-100 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className={`${TD} font-mono text-amber-600 dark:text-amber-400 font-medium`}>{pur.purchase_no || ''}</td>
                  <td className={`${TD} text-slate-700 dark:text-slate-300`}>{pur.supplier_name || ''}</td>
                  <td className={`${TD} text-slate-800 dark:text-slate-200 font-semibold tabular-nums`}>{pur.amount}</td>
                  <td className={TD}><StatusBadge status={pur.status} /></td>
                </tr>
              )))}
            </tbody>
          </table>
        </SectionCard>

        <RecentActivities recentActivities={recentOperationsInfo.recent_activity} />
      </div>

      {/* Row 4: Low Stock | Stock Summary | Today's Summary | Approval Queue */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <LowStockAlert items={stockOverviewInfo.low_stock_alert} />
        <StockSummary stockSummary={stockOverviewInfo.stock_summary} />
        <TodaySummary todaySummary={summaryInfo.daily_summary} />
        <ApprovalQueue />
      </div>
    </div>
  );
}

