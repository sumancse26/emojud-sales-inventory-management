import { cookies } from 'next/headers';
import CustomerDueCollectionFeature from './_feature';
import { getCustomerDueList, getCustomerPendingDueList, getInvoiceWiseDueList } from '@/services/customerDue';

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.response?.data)) return res.response.data;
    return [];
};

export default async function CustomerDueCollectionPage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try {
            userInfo = JSON.parse(userInfoCookie);
        } catch {
            userInfo = {};
        }
    }

    const headers = { Cookie: cookieStore.toString() };

    let dues = [];
    let pendingCustomers = [];
    let invoiceWiseDue = [];

    try {
        const [dueRes, pendingRes, invWiseDue] = await Promise.all([
            getCustomerDueList(headers),
            getCustomerPendingDueList(headers),
            getInvoiceWiseDueList(headers),
        ]);

        dues = normalizeList(dueRes);
        pendingCustomers = normalizeList(pendingRes);
        invoiceWiseDue = normalizeList(invWiseDue);

    } catch (error) {
        console.error('Failed to load customer due collection data:', error);
    }

    return (
        <CustomerDueCollectionFeature
            initialDues={dues}
            pendingCustomers={pendingCustomers}
            userInfo={userInfo}
            invoiceWiseDue={invoiceWiseDue}
        />
    );
}