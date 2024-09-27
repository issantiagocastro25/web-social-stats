import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';

export function useAuthCheck(requireAuth: boolean = true, dashboardPath: string = '/salud') {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.is_authenticated);
        setHasSubscription(!!authStatus.subscription);

        if (authStatus.is_authenticated) {
          // Si el usuario está autenticado
          if (pathname.startsWith('/profile/')) {
            // Permitir acceso a rutas que comienzan con /profile/
            return;
          } else if (!authStatus.subscription && !pathname.startsWith('/pricing')) {
            // Sin suscripción, redirigir a /pricing, excepto si ya está en /pricing
            router.push('/pricing');
          } else if (authStatus.subscription && pathname === '/') {
            // Si está autenticado, tiene suscripción y está en la página de inicio, redirigir al dashboard
            router.push(dashboardPath);
          }
        } else {
          // Si no está autenticado y se requiere autenticación, redirigir al login
          if (requireAuth && pathname !== '/') {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setHasSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router, dashboardPath, pathname]);

  return { isAuthenticated, hasSubscription, isLoading };
}