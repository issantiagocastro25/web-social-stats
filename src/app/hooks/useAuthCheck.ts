import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';

export function useAuthCheck(requireAuth: boolean = true) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.is_authenticated);

        if (!authStatus.is_authenticated && requireAuth && pathname !== '/' && pathname !== '/pricing' && pathname!== '/salud') {
          router.push('/');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, router, pathname]);

  return { isAuthenticated, isLoading };
}