import TopbarClient from './TopbarClient';
import { buildNavItems, NAV_ITEMS } from '@/constants/navigation';

export default function Topbar({ featureData = [], userInfo = {}, dark, onToggle, onMenuOpen }) {
    const navItems = featureData.length ? buildNavItems(featureData) : NAV_ITEMS;

    return (
        <TopbarClient
            dark={dark}
            onToggle={onToggle}
            onMenuOpen={onMenuOpen}
            navItems={navItems}
            userInfo={userInfo}
        />
    );
}
