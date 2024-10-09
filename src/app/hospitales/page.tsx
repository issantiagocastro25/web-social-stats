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
    console.log('MainPage effect - Auth loading:', authLoading, 'Sub loading:', subLoading);
    if (!authLoading && !subLoading) {
      const timer = setTimeout(() => {
        setIsDashboardLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading, subLoading]);

  console.log('MainPage render - isAuthenticated:', isAuthenticated, 'hasSubscription:', hasSubscription('hospitales_internacionales'));

  if (!isAuthenticated && !authLoading) {
    console.log('User not authenticated');
    return null;
  }

  if (!hasSubscription('hospitales_internacionales') && !subLoading) {
    console.log('User does not have subscription');
    return null;
  }

  return (
    <>
      <title>Hospitales - Social</title>
      <LoadingModal isLoading={isLoading} />
      <SocialStatsDashboard 
        section="hospitales"
        isLoading={isDashboardLoading}
        setIsLoading={setIsDashboardLoading}
      />
    </>
  );
};

export default MainPage;