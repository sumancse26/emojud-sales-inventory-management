import { cookies } from 'next/headers';
import ExpenseFeature from './_feature';
import { getExpenseList } from '@/services/expense';
import {  getExpenseHeadList, getPaymentMethodList } from '@/services/common';

import { getShopList } from '@/services/shop';

export default async function ExpensePage() {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try { userInfo = JSON.parse(userInfoCookie); } catch { /* ignore */ }
    }

    const headers = { Cookie: cookieStore.toString() };
    let expenses = [], shops = [], expenseHeads = [], paymentMethods = [];

    try {
        const [expenseRes, shopRes, headRes, pmRes] = await Promise.all([
            getExpenseList(headers),
            getShopList(headers),
            getExpenseHeadList(headers),
            getPaymentMethodList(headers),
        ]);
        expenses = expenseRes?.data || [];
        shops = shopRes?.data || [];
        expenseHeads = Array.isArray(headRes) ? headRes : (headRes?.data || []);
        paymentMethods = Array.isArray(pmRes) ? pmRes : (pmRes?.data || []);
    } catch (error) {
        console.error('Failed to load expense data:', error);
    }

    return (
        <ExpenseFeature
            initialExpenses={expenses}
            shops={shops}
            expenseHeads={expenseHeads}
            paymentMethods={paymentMethods}
            userInfo={userInfo}
        />
    );
}
