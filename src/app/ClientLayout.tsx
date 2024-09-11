// components/ClientLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/app/Components/MainComponents/navBar';
import { checkAuthStatus } from '@/api/auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const hideNavbar = ['/'].includes(pathname) || pathname.startsWith('/auth/');

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const authStatus = await checkAuthStatus();
  //       setIsAuthenticated(authStatus.is_authenticated);
  //     } catch (error) {
  //       console.error('Error checking authentication:', error);
  //       setIsAuthenticated(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  // if (isAuthenticated === null) {
  //   return <>{children}</>;
  // }

  return (
    <>
      {/* {!hideNavbar && <DashboardNavbar />} */}
      {children}
    </>
  );
}