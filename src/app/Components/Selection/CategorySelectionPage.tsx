'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthAndSubscriptions } from '@/app/hooks/useAuthAndSubscriptions';
import { getPricing } from '@/api/api_suscription/data-suscription.api'; 
import Spinner from '@/app/Components/Loadings/LoadingSpinner';

interface Category {
  name: string;
  description: string;
  price: number;
  duration_days: number;
  title: string;
  imageCover: string;
}

const categoryRoutes: { [key: string]: string } = {
  'hospitales_internacionales': '/hospitales',
  'salud': '/salud',
  'caja_compensacion': '/compensacion',
};

const CategorySelectionMockup: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, subscriptions } = useAuthAndSubscriptions();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await getPricing();
        setCategories(data);
      } catch (err) {
        setError('Error al obtener los datos de categorías');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (name: string) => {
    const route = categoryRoutes[name] || '/';
    window.location.href = route;
    // router.push(route);
  };

  // Mostrar Skeleton Loader mientras se cargan los datos
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Por favor, inicia sesión para ver las categorías disponibles.</div>;
  }

  const userSubscriptions = subscriptions.map(sub => sub.plan);
  const accessibleCategories = categories.filter(category => userSubscriptions.includes(category.name));

  if (accessibleCategories.length === 0) {
    return window.location.href = '/pricing';
  }

  const gridCols = accessibleCategories.length === 1 ? 'grid-cols-1' : 
                   accessibleCategories.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                   'grid-cols-1 md:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-0 h-screen`}>
      {accessibleCategories.map((category) => (
        <div key={category.name} className="relative w-full h-full overflow-hidden">
          <img 
            src={category.imageCover} 
            alt={category.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-60">
            <div className="text-center">
              <h3 className="text-white text-3xl font-bold mb-4">{category.title}</h3>
              <button
                onClick={() => handleCategoryClick(category.name)}
                className="bg-transparent hover:bg-white hover:text-black text-white font-bold py-2 px-4 border border-white hover:border-transparent rounded transition-colors duration-300"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySelectionMockup;
