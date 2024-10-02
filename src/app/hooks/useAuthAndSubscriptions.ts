import { useState, useEffect } from 'react';
import { useAuthCheck } from './useAuthCheck'; // Asegúrate de que la ruta de importación sea correcta
import { checkAuthStatus } from '@/api/auth';

interface Subscription {
  plan: string;
  start_date: string;
  end_date: string;
  status: string;
  payment_type: string;
}

interface AuthStatus {
  is_authenticated: boolean;
  subscriptions: Subscription[];
  user_role: string;
}

export function useAuthAndSubscriptions(requireAuth: boolean = true) {
  const { isAuthenticated, isLoading } = useAuthCheck(requireAuth);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (isAuthenticated) {
        try {
          const authStatus: AuthStatus = await checkAuthStatus();
          setSubscriptions(authStatus.subscriptions);
          setUserRole(authStatus.user_role);
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
        }
      }
    };

    fetchSubscriptions();
  }, [isAuthenticated]);

  return { isAuthenticated, isLoading, subscriptions, userRole };
}