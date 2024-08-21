'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth'; // Asegúrate de que esta función exista en tu API

export const useAuthCheck = (requireAuth: boolean = true) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authStatus = await checkAuthStatus();
                setIsAuthenticated(authStatus.is_authenticated);
                if (requireAuth && !authStatus.is_authenticated) {
                    router.push('/Auth/login');
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [requireAuth, router]);

    return { isAuthenticated, isLoading };
};