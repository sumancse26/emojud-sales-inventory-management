import { cookies } from 'next/headers';
import Sidebar, { fetchShopList } from '@/components/layout/Sidebar';
import { navMenu } from '@/services/auth';
import FeatureLayoutClient from './layout-client';

export default async function FeatureLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const userInfoCookie = cookieStore.get('user_info')?.value;
    let userInfo = {};

    if (userInfoCookie) {
        try {
            userInfo = JSON.parse(userInfoCookie);
        } catch (error) {
            console.error('Failed to parse user_info cookie:', error);
        }
    }

    let featureData = [];
    let shopList = [];

    if (token) {
        const headers = {
            Cookie: cookieStore.toString()
        };

        try {
            const result = await navMenu(headers);
            featureData = result?.data || [];
        } catch (error) {
            console.error('Failed to load navigation:', error);
        }

        try {
            shopList = await fetchShopList();
        } catch (error) {
            console.error('Failed to load shop list:', error);
        }
    }

    return (
        <FeatureLayoutClient
            featureData={featureData}
            userInfo={userInfo}
            shopList={shopList}
            sidebar={<Sidebar featureData={featureData} userInfo={userInfo} shopList={shopList} />}>
            {children}
        </FeatureLayoutClient>
    );
}
