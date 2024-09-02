'use client';

import React from 'react';
import ResetPasswordForm from '@/app/Components/AuthComponents/resertPass';

export default function ResetPasswordPage({ params }: { params: { key: string } }) {
  return (
    <div className="bg-[#f6f3fa] min-h-screen flex items-center justify-center">
        <ResetPasswordForm resetKey={params.key} />
    </div>
  );
}