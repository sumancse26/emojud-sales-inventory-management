import { cookies } from 'next/headers';
import SupplierPaymentFeature from './_feature';
import { getPaymentMethodList } from '@/services/common';
import { getSupplierPaymentList, getSupplierPendingPaymentList, getShopWiseSupplierPaymentDueList } from '@/services/supplierPayment';

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.response?.data)) return res.response.data;
    return [];
};

export default async function SupplierPaymentPage() {
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

    let payments = [];
    let pendingSuppliers = [];
    let paymentMethods = [];
    let paymentDueList = [];

    try {
        const [paymentRes, pendingRes, paymentMethodRes, supPaymentDue] = await Promise.all([
            getSupplierPaymentList(headers),
            getSupplierPendingPaymentList(headers),
            getPaymentMethodList(headers),
            getShopWiseSupplierPaymentDueList(headers),
        ]);

        payments = normalizeList(paymentRes);
        pendingSuppliers = normalizeList(pendingRes);
        paymentMethods = normalizeList(paymentMethodRes);
        paymentDueList = normalizeList(supPaymentDue);
    } catch (error) {
        console.error('Failed to load supplier payment data:', error);
    }

    return (
        <SupplierPaymentFeature
            initialPayments={payments}
            pendingSuppliers={pendingSuppliers}
            paymentMethods={paymentMethods}
            userInfo={userInfo}
            paymentDueList={paymentDueList}
        />
    );
}
