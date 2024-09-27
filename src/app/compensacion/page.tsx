"use client";

import React from 'react';
import {useAuthCheck} from '@/app/hooks/useAuthCheck';
import {useSubscriptionCheck} from '@/app/hooks/useSubscriptionCheck';
import SocialStatsDashboard from '@/app/Components/MainComponents/SocialStatsDashboard';

const MainPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthCheck();
  const { hasSubscription, isLoading: subLoading } = useSubscriptionCheck();

  if (!isAuthenticated || !hasSubscription('caja_compensacion')) {
    return null; // El hook se encargará de la redirección si es necesario
  }

  return (
    <>
    <title>Social</title>
      <SocialStatsDashboard />
    </>
  );
};

export default MainPage;