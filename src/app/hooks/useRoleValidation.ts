// hooks/useRoleValidation.ts
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const roleHierarchy = {
  'Ca0-T17A': ['Ca0-T17A', '8np49Ab#', '=805MHj0'],
  '8np49Ab#': ['8np49Ab#', '=805MHj0'],
  '=805MHj0': ['=805MHj0'],
};

export const useRoleValidation = () => {
  const { userRole } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasPermission = (requiredRole: string) => {
    if (!userRole) return false;
    return roleHierarchy[userRole]?.includes(requiredRole) || false;
  };

  const checkAccess = (path: string) => {
    if (!isClient) return true; // Siempre permitir en el servidor
    if (path.startsWith('/administration/') && !hasPermission('8np49Ab#')) {
      return false;
    }
    return true;
  };

  return { hasPermission, checkAccess };
};