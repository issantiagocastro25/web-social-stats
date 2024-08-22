'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';

export function useAuthCheck(requireAuth: boolean = true, dashboardPath: string = '/Principal/main') {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authStatus = await checkAuthStatus();
                setIsAuthenticated(authStatus.is_authenticated);
                
                if (requireAuth && !authStatus.is_authenticated) {
                    // Si se requiere autenticación y el usuario no está autenticado, redirige al login
                    router.push('/Auth/login');
                } else if (!requireAuth && authStatus.is_authenticated) {
                    // Si no se requiere autenticación (como en la página de login) y el usuario está autenticado, redirige al dashboard
                    router.push(dashboardPath);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requireAuth, router, dashboardPath]);

    return { isAuthenticated, isLoading };
}