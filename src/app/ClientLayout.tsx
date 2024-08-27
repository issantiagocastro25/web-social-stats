// components/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/app/Components/MainComponents/navBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = ['/'].includes(pathname) || pathname.startsWith('/auth/');

  return (
    <>
      {!hideNavbar && <DashboardNavbar />}
      {children}
    </>
  );
}