// components/AccessDenied.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Cambia esto si usabas 'next/router'

const AccessDenied = ({ redirectPath }: { redirectPath: string }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 3000); // 3000 ms = 3 seconds

    return () => clearTimeout(timer); // Limpieza del timer
  }, [redirectPath, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-6">No tienes permiso para ver esta página.</p>
      <p className="text-sm text-gray-500">Serás redirigido en 3 segundos...</p>
      <button 
        onClick={() => router.push(redirectPath)} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Volver a la página principal
      </button>
    </div>
  );
};

export default AccessDenied;
