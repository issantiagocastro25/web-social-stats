"use client";

import React from 'react';
import {useAuthCheck} from '@/app/hooks/useAuthCheck';
import SocialStatsDashboard from '@/app/Components/MainComponents/SocialStatsDashboard';

const MainPage = () => {
  const { isAuthenticated, hasSubscription } = useAuthCheck();

  if (!isAuthenticated) {
    return null;
  }

  if (!hasSubscription) {
    return null;
  }

  return (
    <>
    <title>Social</title>
      <SocialStatsDashboard />
    </>
  );
};

export default MainPage;