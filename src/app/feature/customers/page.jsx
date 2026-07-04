import { cookies } from 'next/headers';
import { getCustomerList } from '@/services/customers';
import CustomersFeature from './_feature';

export const metadata = { title: 'Customers' };

export default async function CustomersPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    const userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;

    const customHeaders = { Cookie: cookieStore.toString() };

    const customerRes = await getCustomerList(customHeaders).catch(() => null);
    const initialCustomers = customerRes?.data ?? [];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Customers</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your customer records</p>
            </div>
            <CustomersFeature initialCustomers={initialCustomers} userInfo={userInfo} />
        </div>
    );
}
