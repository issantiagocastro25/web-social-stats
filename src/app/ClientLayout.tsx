// components/ClientLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/app/Components/MainComponents/navBar';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import { useRoleValidation } from '@/app/hooks/useRoleValidation';
import AccessDenied from './Components/AuthComponents/DeniedAccess';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthCheck();
  const { checkAccess } = useRoleValidation();
  const [hasAccess, setHasAccess] = useState(true);
  const hideNavbar = ['/'].includes(pathname) || pathname.startsWith('/auth/');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setHasAccess(checkAccess(pathname));
    }
  }, [isLoading, isAuthenticated, pathname, checkAccess]);

  // Si aún está cargando, muestra los children (podría ser una pantalla de carga)
  if (isLoading) {
    return <>{children}</>;
  }

  // Si no está autenticado, podrías redirigir al login o mostrar un mensaje
  if (!isAuthenticated) {
    // Aquí puedes manejar el caso de usuario no autenticado
    return <>{children}</>;
  }

  // Si no tiene acceso debido al rol, muestra un mensaje de error
  if (!hasAccess) {
    return <AccessDenied redirectPath="/salud" />;
  }

  return (
    <>
      {!hideNavbar && <DashboardNavbar />}
      {children}
    </>
  );
}