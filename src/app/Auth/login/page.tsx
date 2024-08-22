'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/api/auth';
import Login from "@/app/Components/AuthComponents/login";
import LoadingBasic from '@/app/Components/Loadings/LoadingBasic';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const authStatus = await checkAuthStatus();
                if (authStatus.is_authenticated) {
                    router.push('/Principal/main');
                } else {
                    setShouldRender(true);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setShouldRender(true);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    if (isLoading) {
        return <LoadingBasic />;
    }

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="bg-[#f6f3fa]">
            <div className="container mx-auto p-4 flex items-center justify-center h-screen">
                <div className="max-w-md w-full">
                    <Login />
                </div>
            </div>
        </div>
    );
}