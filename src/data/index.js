export const STATS = [
    {
        label: 'Total Revenue',
        value: '৳ 18,42,500',
        change: '+12.4%',
        up: true,
        icon: '💰',
        color: 'from-emerald-600 to-emerald-800'
    },
    {
        label: 'Total Purchase',
        value: '৳ 11,20,000',
        change: '+8.1%',
        up: true,
        icon: '📦',
        color: 'from-blue-600 to-blue-800'
    },
    {
        label: 'Total Expense',
        value: '৳ 2,34,800',
        change: '-3.2%',
        up: false,
        icon: '📉',
        color: 'from-rose-600 to-rose-800'
    },
    {
        label: 'Active Employees',
        value: '47',
        change: '+2',
        up: true,
        icon: '👥',
        color: 'from-violet-600 to-violet-800'
    }
];

export const RECENT_INVOICES = [
    {
        no: 'INV-2026-0412',
        customer: 'Rahim Electronics',
        date: '11 May 2026',
        amount: '৳ 45,200',
        status: 'Paid',
        shop: 'Dhaka Main'
    },
    {
        no: 'INV-2026-0411',
        customer: 'Karim Traders',
        date: '10 May 2026',
        amount: '৳ 12,800',
        status: 'Pending',
        shop: 'Ctg Branch'
    },
    {
        no: 'INV-2026-0410',
        customer: 'Sunflower Store',
        date: '10 May 2026',
        amount: '৳ 88,000',
        status: 'Paid',
        shop: 'Dhaka Main'
    },
    {
        no: 'INV-2026-0409',
        customer: 'ABC Wholesale',
        date: '09 May 2026',
        amount: '৳ 31,500',
        status: 'Due',
        shop: 'Sylhet HQ'
    },
    {
        no: 'INV-2026-0408',
        customer: 'Moon Pharma',
        date: '09 May 2026',
        amount: '৳ 9,750',
        status: 'Paid',
        shop: 'Ctg Branch'
    }
];

export const RECENT_PURCHASES = [
    {
        no: 'PUR-2026-0189',
        supplier: 'ACI Limited',
        date: '11 May 2026',
        amount: '৳ 1,20,000',
        status: 'Final',
        warehouse: 'Main WH'
    },
    {
        no: 'PUR-2026-0188',
        supplier: 'Square Pharma',
        date: '10 May 2026',
        amount: '৳ 85,500',
        status: 'Draft',
        warehouse: 'Cold WH'
    },
    {
        no: 'PUR-2026-0187',
        supplier: 'Unilever BD',
        date: '09 May 2026',
        amount: '৳ 2,35,000',
        status: 'Final',
        warehouse: 'Main WH'
    },
    {
        no: 'PUR-2026-0186',
        supplier: 'Marico BD',
        date: '08 May 2026',
        amount: '৳ 64,800',
        status: 'Final',
        warehouse: 'Main WH'
    },
    {
        no: 'PUR-2026-0185',
        supplier: 'Beximco Pharma',
        date: '07 May 2026',
        amount: '৳ 45,000',
        status: 'Draft',
        warehouse: 'Main WH'
    }
];

export const EMPLOYEES = [
    {
        code: 'EMP-001',
        name: 'Md. Farhan Hossain',
        dept: 'Sales',
        designation: 'Sr. Executive',
        shop: 'Dhaka Main',
        salary: '৳ 35,000',
        status: 'Active'
    },
    {
        code: 'EMP-002',
        name: 'Nazmul Islam',
        dept: 'IT',
        designation: 'Software Eng.',
        shop: 'HQ',
        salary: '৳ 55,000',
        status: 'Active'
    },
    {
        code: 'EMP-003',
        name: 'Sharmin Akter',
        dept: 'Accounts',
        designation: 'Accountant',
        shop: 'Dhaka Main',
        salary: '৳ 28,000',
        status: 'Active'
    },
    {
        code: 'EMP-004',
        name: 'Rakib Hasan',
        dept: 'Warehouse',
        designation: 'Store Manager',
        shop: 'Ctg Branch',
        salary: '৳ 32,000',
        status: 'Active'
    },
    {
        code: 'EMP-005',
        name: 'Fatema Khatun',
        dept: 'Sales',
        designation: 'Executive',
        shop: 'Sylhet HQ',
        salary: '৳ 24,000',
        status: 'Inactive'
    }
];

export const PRODUCTS = [
    {
        code: 'PRD-001',
        name: 'Paracetamol 500mg',
        category: 'Medicine',
        dr: '৳ 8.50',
        rr: '৳ 11.00',
        sr: '৳ 10.00',
        stock: 4800,
        batch: true,
        expire: true
    },
    {
        code: 'PRD-002',
        name: 'Amoxicillin 250mg',
        category: 'Medicine',
        dr: '৳ 32.00',
        rr: '৳ 45.00',
        sr: '৳ 42.00',
        stock: 1200,
        batch: true,
        expire: true
    },
    {
        code: 'PRD-003',
        name: 'Hand Wash 500ml',
        category: 'FMCG',
        dr: '৳ 65.00',
        rr: '৳ 95.00',
        sr: '৳ 90.00',
        stock: 620,
        batch: false,
        expire: false
    },
    {
        code: 'PRD-004',
        name: 'Mineral Water 1L',
        category: 'Beverage',
        dr: '৳ 12.00',
        rr: '৳ 20.00',
        sr: '৳ 18.00',
        stock: 3200,
        batch: false,
        expire: true
    },
    {
        code: 'PRD-005',
        name: 'Shampoo 200ml',
        category: 'FMCG',
        dr: '৳ 110.00',
        rr: '৳ 160.00',
        sr: '৳ 150.00',
        stock: 88,
        batch: false,
        expire: false
    }
];

export const SHOPS = [
    {
        code: 'SHP-01',
        name: 'Dhaka Main Branch',
        phone: '01711-000001',
        employees: 18,
        revenue: '৳ 9,80,000',
        status: 'Active'
    },
    {
        code: 'SHP-02',
        name: 'Chittagong Branch',
        phone: '01711-000002',
        employees: 14,
        revenue: '৳ 5,40,000',
        status: 'Active'
    },
    {
        code: 'SHP-03',
        name: 'Sylhet Head Office',
        phone: '01711-000003',
        employees: 9,
        revenue: '৳ 2,24,500',
        status: 'Active'
    },
    {
        code: 'SHP-04',
        name: 'Comilla Outlet',
        phone: '01711-000004',
        employees: 6,
        revenue: '৳ 98,000',
        status: 'Inactive'
    }
];

export const SALARY_MONTHS = [
    { month: 'May 2026', employees: 47, total: '৳ 14,82,000', paid: '৳ 14,82,000', due: '৳ 0', status: 'Paid' },
    { month: 'April 2026', employees: 46, total: '৳ 14,50,000', paid: '৳ 14,50,000', due: '৳ 0', status: 'Paid' },
    {
        month: 'March 2026',
        employees: 45,
        total: '৳ 13,90,000',
        paid: '৳ 13,50,000',
        due: '৳ 40,000',
        status: 'Partial'
    }
];

/* ── Dashboard ── */
export const DASHBOARD_STATS = [
    {
        label: 'Total Sales',
        value: '৳ 18,42,500',
        change: '12.4%',
        up: true,
        color: 'emerald',
        spark: [30, 42, 35, 55, 40, 62, 52, 70, 62, 78, 72, 90]
    },
    {
        label: 'Total Purchase',
        value: '৳ 11,20,000',
        change: '8.1%',
        up: true,
        color: 'blue',
        spark: [40, 38, 50, 45, 58, 52, 64, 58, 68, 62, 72, 76]
    },
    {
        label: 'Total Expense',
        value: '৳ 2,34,800',
        change: '3.2%',
        up: false,
        color: 'rose',
        spark: [62, 58, 65, 52, 60, 46, 55, 42, 50, 36, 44, 32]
    },
    {
        label: 'Net Profit',
        value: '৳ 4,87,700',
        change: '15.7%',
        up: true,
        color: 'amber',
        spark: [35, 42, 38, 52, 46, 62, 56, 72, 66, 78, 72, 88]
    },
    {
        label: 'Stock Value',
        value: '৳ 24,85,600',
        change: '6.3%',
        up: true,
        color: 'violet',
        spark: [50, 53, 51, 56, 54, 58, 56, 62, 60, 64, 62, 67]
    },
    {
        label: 'Due Collection',
        value: '৳ 3,45,200',
        change: '2.4%',
        up: false,
        color: 'cyan',
        spark: [72, 68, 74, 62, 70, 56, 64, 50, 60, 44, 54, 42]
    }
];

export const REVENUE_DATA = [
    { date: 'May 16', sales: 980000, purchase: 540000, expense: 210000 },
    { date: 'May 17', sales: 1050000, purchase: 480000, expense: 235000 },
    { date: 'May 18', sales: 920000, purchase: 510000, expense: 195000 },
    { date: 'May 19', sales: 1120000, purchase: 560000, expense: 250000 },
    { date: 'May 20', sales: 1080000, purchase: 520000, expense: 228000 },
    { date: 'May 21', sales: 1180000, purchase: 580000, expense: 262000 },
    { date: 'May 22', sales: 1250000, purchase: 600000, expense: 280000 }
];

export const PAYMENT_METHOD_DATA = [
    { name: 'Cash', value: 40.5, color: '#10b981' },
    { name: 'Card', value: 28.3, color: '#3b82f6' },
    { name: 'Mobile Banking', value: 20.1, color: '#f59e0b' },
    { name: 'Other', value: 11.1, color: '#f43f5e' }
];

export const TOP_PRODUCTS = [
    { name: 'iPhone 15 Pro Max', amount: '৳ 6,45,000', qty: '245 pcs', color: 'bg-slate-700' },
    { name: 'Samsung Galaxy S24', amount: '৳ 4,20,000', qty: '198 pcs', color: 'bg-blue-600' },
    { name: 'Xiaomi 14', amount: '৳ 2,85,000', qty: '158 pcs', color: 'bg-orange-500' },
    { name: 'OnePlus 12', amount: '৳ 2,10,000', qty: '132 pcs', color: 'bg-red-600' },
    { name: 'Oppo Reno 11', amount: '৳ 1,65,000', qty: '115 pcs', color: 'bg-emerald-600' }
];

export const RECENT_ACTIVITIES = [
    { text: 'Invoice INV-2026-0412 created', by: 'Hasan Admin', time: '10:30 AM', color: 'blue' },
    { text: 'Purchase PUR-2026-0189 confirmed', by: 'Hasan Admin', time: '10:15 AM', color: 'emerald' },
    { text: 'Expense EXP-2026-0087 added', by: 'Hasan Admin', time: '09:45 AM', color: 'rose' },
    { text: 'Stock updated for iPhone 15 Pro Max', by: 'Hasan Admin', time: '09:30 AM', color: 'amber' },
    { text: 'Customer payment received from Rahim Electronics', by: '', time: '09:29 AM', color: 'blue' }
];

export const LOW_STOCK = [
    { name: 'iPhone 14', available: 8, min: 20, low: true },
    { name: 'Samsung S23', available: 5, min: 15, low: true },
    { name: 'Oppo Reno 10', available: 3, min: 10, low: true },
    { name: 'Vivo Y27', available: 7, min: 15, low: false }
];

export const STOCK_SUMMARY_DATA = [
    { name: 'In Stock', value: 856, color: '#10b981' },
    { name: 'Low Stock', value: 256, color: '#f59e0b' },
    { name: 'Out of Stock', value: 136, color: '#f43f5e' }
];

export const TODAY_SUMMARY = [
    { label: "Today's Sales", value: '৳ 2,45,600', color: 'emerald', icon: 'sales' },
    { label: "Today's Purchase", value: '৳ 1,25,400', color: 'blue', icon: 'purchase' },
    { label: "Today's Expense", value: '৳ 18,750', color: 'rose', icon: 'expense' },
    { label: "Today's Profit", value: '৳ 1,01,450', color: 'amber', icon: 'profit' }
];

export const APPROVAL_QUEUE = [
    { label: 'Purchase Requisitions', count: 0, color: 'amber' },
    { label: 'Purchase Orders', count: 0, color: 'blue' },
    { label: 'Expense Approvals', count: 0, color: 'rose' },
    { label: 'Stock Adjustments', count: 0, color: 'emerald' }
];
