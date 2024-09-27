import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';

interface Subscription {
  plan: string;
  start_date: string;
  end_date: string;
}

interface AuthStatus {
  is_authenticated: boolean;
  subscriptions: Subscription[];
  user_role: string | null;
}

export function useSubscriptionCheck() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkSubscriptions = async () => {
      try {
        const authStatus: AuthStatus = await checkAuthStatus();
        setSubscriptions(authStatus.subscriptions || []);

        if (authStatus.is_authenticated) {
          const planRoutes: { [key: string]: string } = {
            'salud': '/salud',
            'caja_compensacion': '/compensacion',
            'hospitales_internacionales': '/hospitales'
          };

          const userPlans = authStatus.subscriptions?.map(sub => sub.plan) || [];
          const allowedRoutes = userPlans.map(plan => planRoutes[plan]).filter(Boolean);

          if (!allowedRoutes.includes(pathname) && pathname !== '/categories') {
            router.push('/pricing');
          }
        }
      } catch (error) {
        console.error('Error checking subscriptions:', error);
        setSubscriptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptions();
  }, [pathname, router]);

  const hasSubscription = (planName: string) => {
    return subscriptions.some(sub => sub.plan === planName);
  };

  const canAccessRoute = (route: string) => {
    const planRoutes: { [key: string]: string } = {
      '/salud': 'salud',
      '/compensacion': 'caja_compensacion',
      '/hospitales': 'hospitales_internacionales'
    };
    
    const requiredPlan = planRoutes[route];
    return hasSubscription(requiredPlan);
  };

  return { subscriptions, isLoading, hasSubscription, canAccessRoute };
}