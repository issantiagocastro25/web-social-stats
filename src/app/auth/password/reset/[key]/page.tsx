'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResetPassword from '@/app/Components/AuthComponents/resertPass';
import LoadingBasic from '@/app/Components/Loadings/LoadingBasic';
import { checkAuthStatus } from '@/api/auth';

export default function ResetPasswordPage({ params }: { params: { key: string } }) {
  const [uid, token] = params.key.split('-');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.is_authenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className='my-4'><LoadingBasic/></div>;
  }

  return (
    <div className="bg-[#f6f3fa]">
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="max-w-md w-full">
          <ResetPassword uid={uid} token={token} />
        </div>
      </div>
    </div>
  );
}