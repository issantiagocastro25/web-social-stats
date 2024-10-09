'use client'

import React, { useState, useEffect } from 'react';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import { useSubscriptionCheck } from '@/app/hooks/useSubscriptionCheck';
import SocialStatsDashboard from '@/app/Components/MainComponents/SocialStatsDashboard';
import LoadingModal from '../Components/MainComponents/LoadingModal';

const MainPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthCheck();
  const { hasSubscription, isLoading: subLoading } = useSubscriptionCheck();
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const isLoading = authLoading || subLoading || isDashboardLoading;

  useEffect(() => {
    if (!authLoading && !subLoading) {
      // Simula un tiempo de carga mínimo para el dashboard
      const timer = setTimeout(() => {
        setIsDashboardLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading, subLoading]);

  if (!isAuthenticated || !hasSubscription('caja_compensacion')) {
    return null; // El hook se encargará de la redirección si es necesario
  }

  return (
    <>
      <title>Social</title>
      <LoadingModal isLoading={isLoading} />
      <SocialStatsDashboard 
        section="compensacion"
        isLoading={isDashboardLoading}
        setIsLoading={setIsDashboardLoading}
      />
    </>
  );
};

export default MainPage;
