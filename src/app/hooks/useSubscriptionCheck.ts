import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';

interface Subscription {
  plan: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface AuthStatus {
  is_authenticated: boolean;
  subscriptions: Subscription[];
  user_role: string | null;
}

const PLAN_ROUTES: { [key: string]: string } = {
  'salud': '/salud',
  'caja_compensacion': '/compensacion',
  'hospitales_internacionales': '/hospitales'
};

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
          const allowedRoutes = getAccessibleRoutes(authStatus.subscriptions);

          if (!allowedRoutes.includes(pathname) && !['/', '/pricing', '/categories'].includes(pathname)) {
            if (allowedRoutes.length > 0) {
              router.push(allowedRoutes[0]);
            } else {
              console.log('se redirige');
              router.push('/categories');
              window.location.href = '/categories';
            }
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

  const isSubscriptionValid = (subscription: Subscription): boolean => {
    const now = new Date();
    const startDate = new Date(subscription.start_date);
    const endDate = new Date(subscription.end_date);
    return subscription.status === 'approved' && now >= startDate && now <= endDate;
  };

  const hasSubscription = (planName: string): boolean => {
    return subscriptions.some(sub => sub.plan === planName && isSubscriptionValid(sub));
  };

  const canAccessRoute = (route: string): boolean => {
    const planForRoute = Object.entries(PLAN_ROUTES).find(([_, path]) => path === route)?.[0];
    return planForRoute ? hasSubscription(planForRoute) : false;
  };

  const getAccessibleRoutes = (subs: Subscription[] = subscriptions): string[] => {
    return Array.from(new Set(subs.filter(isSubscriptionValid).map(sub => PLAN_ROUTES[sub.plan]).filter(Boolean)));
  };

  return { subscriptions, isLoading, hasSubscription, canAccessRoute, getAccessibleRoutes };
}