// components/LinkedInLoginButton.tsx
'use client';

import React from 'react';
import { Button } from 'flowbite-react';

const LinkedInLoginButton: React.FC = () => {
  const handleLinkedInLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin/login/`);
      const data = await response.json();
      window.location.href = data.login_url;
    } catch (error) {
      console.error('Error initiating LinkedIn login:', error);
    }
  };

  return (
    <Button onClick={handleLinkedInLogin} color="blue">
      Login with LinkedIn
    </Button>
  );
};

export default LinkedInLoginButton;