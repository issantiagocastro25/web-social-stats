'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

// Ejemplo de categorías
const mockCategories = [
  { id: 1, name: 'Hospitales', imageUrl: 'https://mediaweb.sfo3.cdn.digitaloceanspaces.com/social-media-stats-assets/portadas/hospitales.webp', route: '/hospitales' },
  { id: 2, name: 'Salud', imageUrl: 'https://mediaweb.sfo3.cdn.digitaloceanspaces.com/social-media-stats-assets/portadas/salud.jpg', route: '/salud' },
  { id: 3, name: 'Compensacion', imageUrl: 'https://mediaweb.sfo3.cdn.digitaloceanspaces.com/social-media-stats-assets/portadas/compensacion.jpg', route: '/compensacion' },
];

const CategorySelectionMockup: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (route: string) => {
    console.log(`Navigating to ${route}`);
    router.push(route);
  };

  return (
    <div className="h-screen flex">
      {mockCategories.map((category) => (
        <div
          key={category.id}
          className="flex-1 relative overflow-hidden cursor-pointer"
          onClick={() => handleCategoryClick(category.route)}
        >
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-4xl font-bold mb-4 text-white">{category.name}</h2>
            <button
  className="bg-[#5C00CE] hover:bg-[#4a00a3] text-white font-bold py-2 px-4 rounded transition-colors duration-300"
>
  Entrar
</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySelectionMockup;