# emojud — ERP Platform

A modern, full-featured ERP (Enterprise Resource Planning) web application built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

Crafted with ♥ by **Suman Sarker**.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 16 (App Router)             |
| UI Library | React 19                            |
| Styling    | Tailwind CSS v4                     |
| Language   | JavaScript (no TypeScript)          |
| Routing    | File-system based App Router      |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects automatically to `/feature/dashboard`.

---

## File Structure

```
src/
├── app/
│   ├── globals.css               # Tailwind import + dark mode variant
│   ├── layout.js                 # Root layout (Geist font)
│   ├── page.js                   # Redirects → /feature/dashboard
│   └── feature/
│       ├── layout.js             # App shell: Sidebar + Topbar + dark mode state
│       │
│       ├── dashboard/
│       │   ├── page.js
│       │   └── _feature/         # Feature UI (private, not a route)
│       │       ├── index.js
│       │       └── components/
│       │           ├── StatsGrid.js
│       │           └── RevenueChart.js
│       │
│       ├── shops/
│       │   ├── page.js
│       │   └── _feature/
│       │       ├── index.js
│       │       └── components/ShopCard.js
│       │
│       ├── products/
│       │   ├── page.js           # /feature/products
│       │   ├── new/page.js       # /feature/products/new
│       │   ├── category/page.js  # /feature/products/category
│       │   └── _feature/
│       │       ├── index.js
│       │       └── components/ProductTable.js
│       │
│       ├── purchase/
│       │   ├── page.js           # /feature/purchase
│       │   ├── returns/page.js   # /feature/purchase/returns
│       │   ├── suppliers/page.js # /feature/purchase/suppliers
│       │   └── _feature/
│       │       ├── index.js
│       │       └── components/
│       │           ├── PurchaseStats.js
│       │           └── PurchaseTable.js
│       │
│       ├── sales/
│       │   ├── page.js           # /feature/sales
│       │   ├── returns/page.js   # /feature/sales/returns
│       │   ├── customers/page.js # /feature/sales/customers
│       │   └── _feature/
│       │       ├── index.js
│       │       └── components/
│       │           ├── SalesStats.js
│       │           └── SalesTable.js
│       │
│       ├── employees/
│       │   ├── page.js               # /feature/employees
│       │   ├── attendance/page.js    # /feature/employees/attendance
│       │   ├── leave/page.js         # /feature/employees/leave
│       │   └── _feature/
│       │       ├── index.js
│       │       └── components/EmployeeTable.js
│       │
│       └── salary/
│           ├── page.js
│           └── _feature/
│               ├── index.js
│               └── components/
│                   ├── SalaryHistoryTable.js
│                   └── PayrollDetailTable.js
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.js    # Collapsible desktop sidebar + MobileSidebar export
│   │   └── Topbar.js     # Top bar with search, theme toggle, notifications, user menu
│   └── ui/
│       ├── StatusBadge.js
│       └── TableCard.js
│
├── constants/
│   └── navigation.js     # SVG icons, NAV_ITEMS (Topbar), NAV_SECTIONS (Sidebar)
│
└── data/
    └── index.js          # Shared mock data (stats, invoices, employees, etc.)
```

> **`_feature/` convention** — the underscore prefix tells Next.js to ignore these folders as routes. They hold the UI components for each section and live co-located with their route.

---

## Key Conventions

- **Dark mode** — class-based (`.dark` on the wrapper div in `feature/layout.js`). Toggle is in the Topbar.
- **Navigation config** — edit `src/constants/navigation.js` to add/remove nav items, icons, or child routes. Sidebar and Topbar both read from here.
- **Adding a new top-level page** — create `src/app/feature/[name]/page.js` and add the entry to `NAV_SECTIONS` in `navigation.js`.
- **Adding a child page** — create `src/app/feature/[parent]/[child]/page.js` and add it to the parent's `children` array in `navigation.js`. No other changes needed.
- **Shared mock data** — all sample data lives in `src/data/index.js`. Replace with real API calls per feature.

---

## Future Development

### Immediate next steps
- [ ] Replace mock data in `src/data/index.js` with real API/database calls
- [ ] Build out placeholder child pages (Add Product, Suppliers, Attendance, Leave, etc.)
- [ ] Add form components for create/edit flows

### Authentication
- [ ] Integrate an auth provider (NextAuth.js / Clerk / custom JWT)
- [ ] Add route protection in `feature/layout.js` or middleware
- [ ] Replace hardcoded "Admin User" in Sidebar and Topbar with session data

### Database
- [ ] Add Prisma + a database (PostgreSQL recommended)
- [ ] Model entities: Shop, Product, Employee, Purchase, Sale, Salary
- [ ] Create API routes under `src/app/api/`

### Multi-tenancy
- [ ] Scope all data queries by organisation/company
- [ ] Add company-switcher to the Sidebar company card

### Polish
- [ ] Add loading skeletons (use Next.js `loading.js` per route)
- [ ] Add error boundaries (`error.js` per route)
- [ ] Add `not-found.js` for unknown routes
- [ ] Integrate a chart library (Recharts / Chart.js) to replace the placeholder RevenueChart

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
