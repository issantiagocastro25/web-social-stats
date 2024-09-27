// hooks/usePermissions.ts
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const roleHierarchy = {
  'Ca0-T17A': ['Ca0-T17A', '8np49Ab#', '=805MHj0'],
  '8np49Ab#': ['8np49Ab#', '=805MHj0'],
  '=805MHj0': ['=805MHj0'],
};

export const usePermissions = () => {
  const { userRole } = useAuth();
  const [router, setRouter] = useState(null);

  useEffect(() => {
    // Importamos dinámicamente useRouter solo en el cliente
    import('next/navigation').then((mod) => {
      setRouter(mod.useRouter());
    });
  }, []);

  const hasPermission = (requiredRole: string) => {
    if (!userRole) return false;
    return roleHierarchy[userRole]?.includes(requiredRole) || false;
  };

  const checkAccess = (path: string) => {
    if (path.startsWith('/administration/') && !hasPermission('8np49Ab#')) {
      if (router) {
        router.push('/unauthorized');
      }
      return false;
    }
    return true;
  };

  return { hasPermission, checkAccess };
};