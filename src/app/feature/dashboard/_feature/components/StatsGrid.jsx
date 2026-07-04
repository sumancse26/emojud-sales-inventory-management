"use client";
import {
  PackagePlus,
  PackageMinus,
  HandCoins,
  Landmark,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

const STROKE = { emerald: '#10b981', blue: '#3b82f6', rose: '#f43f5e', amber: '#f59e0b', violet: '#8b5cf6', cyan: '#06b6d4' };
const ICON_BG = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
};

function formatCurrency(value) {
  const amount = Number(value ?? 0);
  const formatted = Math.abs(amount).toLocaleString('en-IN');
  return amount < 0 ? `-৳ ${formatted}` : `৳ ${formatted}`;
}

function formatCurrentMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(first)} – ${fmt(last)}`;
}

const ICONS = {
  emerald: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>,
  blue: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.81L23 6H6" /></svg>,
  rose: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
  amber: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  violet: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
  cyan: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
};

export default function StatsGrid({ summaryInfo }) {
  const { monthly_summary = {}, stock_value = 0, due_collection = 0, active_employee = 0 } = summaryInfo || {};
  const sales = Number(monthly_summary.sales ?? 0);
  const purchase = Number(monthly_summary.purchase ?? 0);
  const expense = Number(monthly_summary.expense ?? 0);
  const profit = Number(monthly_summary.profit ?? 0);

  const dashboardStats = [
    {
      label: 'Total Sales',
      value: formatCurrency(sales),
      change: '12.4%',
      changeLabel: 'vs last month',
      up: true,
      color: 'emerald',
    },
    {
      label: 'Total Purchase',
      value: formatCurrency(purchase),
      change: '8.1%',
      changeLabel: 'vs last month',
      up: true,
      color: 'blue',
    },
    {
      label: 'Total Expense',
      value: formatCurrency(expense),
      change: '3.2%',
      changeLabel: 'vs last month',
      up: false,
      color: 'rose',
    },
    {
      label: 'Net Profit',
      value: formatCurrency(profit),
      change: profit >= 0 ? 'Positive' : 'Negative',
      changeLabel: 'Profit trend',
      up: profit >= 0,
      color: 'amber',
    },
    {
      label: 'Stock Value',
      value: formatCurrency(stock_value),
      change: '6.3%',
      changeLabel: 'month change',
      up: true,
      color: 'violet',
    },
    {
      label: 'Due Collection',
      value: formatCurrency(due_collection),
      change: '2.4%',
      changeLabel: 'month change',
      up: false,
      color: 'cyan',
    },
    {
      label: 'Active Employees',
      value: String(active_employee ?? 0),
      color: 'emerald',
      hideChange: true,
    },
  ];



  const quickLinks = [
    {
      label: "Stock In",
      icon: PackagePlus,
      href: "/feature/purchases",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Stock Out",
      icon: PackageMinus,
      href: "/feature/invoices",
      className: "bg-red-50 text-red-700 border-red-200",
    },
    {
      label: "Due Collection",
      icon: HandCoins,
      href: "/feature/customer-due-collection",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Supplier Payment",
      icon: Landmark,
      href: "/feature/supplier-payment",
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    {
      label: "Daily Expense",
      icon: ReceiptText,
      href: "/feature/expenses",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      label: "Commission Profit",
      icon: HandCoins,
      href: "/feature/commission-profit",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
  ];

  const monthRange = formatCurrentMonthRange();

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
          flex items-center gap-2
          px-3 py-1
          rounded-xl
          border
          transition-all duration-200
          hover:shadow-sm hover:-translate-y-0.5
          ${item.className}

          dark:bg-slate-800
          dark:border-slate-700
          dark:text-slate-200
        `}
              >
                <Icon size={16} strokeWidth={2.2} />

                <span className="text-xs sm:text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-lg px-3 py-1.5 shadow-sm">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {monthRange}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboardStats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl px-4 pt-4 pb-0 shadow-sm dark:shadow-none overflow-hidden transition-colors">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">{s.label}</p>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ICON_BG[s.color]}`}>
                {ICONS[s.color]}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{s.value}</p>
            {!s.hideChange && (
              <div className="flex items-center gap-1 mt-1.5">
                <span className={`text-[11px] font-semibold ${s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {s.up ? '↑' : '↓'} {s.change}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">{s.changeLabel}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
