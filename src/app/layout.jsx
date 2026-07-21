import './globals.css';
import { connectDB } from '@/lib/db.js';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
    title: 'Emojud ERP — Smart Multi-Shop Management System',
    description:
        'Emojud is a modern ERP solution for managing shops, employees, inventory, purchase, sales, accounts, and payroll in one powerful platform.',
    metadataBase: new URL('https://emojud.vercel.app'),
    icons: {
        icon: "/smart-erp-rounded.png"
    },
};

export default async function RootLayout({ children }) {
    // Establish database connection on app startup
    try {
        await connectDB();
    } catch (error) {
        console.error('Database startup failed:', error);
    }

    return (
        <html lang="en" className="h-full antialiased" suppressHydrationWarning>
            <head>
                {/* Blocking script: reads localStorage and applies .dark to <html> before first paint */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var d=localStorage.getItem('ej-dark');document.documentElement.classList.toggle('dark',d==='true')}catch(e){}})()`
                    }}
                />
            </head>
            <body className="m-0 min-h-full flex flex-col">
                {children} <ToastProvider />
            </body>
        </html>
    );
}
