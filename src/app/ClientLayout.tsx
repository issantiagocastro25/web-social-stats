// components/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/app/Components/MainComponents/navBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = ['/Auth/login', '/Auth/register', '/Auth/forgot-password', '/Auth/password/reset/[key]'].includes(pathname);

  return (
    <>
      {!hideNavbar && <DashboardNavbar />}
      {children}
    </>
  );
}