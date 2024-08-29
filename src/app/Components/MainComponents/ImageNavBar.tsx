import React from 'react';

const ImageNavbar = ({ onCategorySelect, activeCategory }) => {
  const categories = [
      { name: 'todos', image: '/assets/imgs/images.png' },
      { name: 'IPS privadas', image: '/assets/imgs/1.jpg' },
      { name: 'IPS Públicas', image: '/assets/imgs/2.jpg' },
      { name: 'EPS y Seguros', image: '/assets/imgs/3.jpg' },
      { name: 'Educación', image: '/assets/imgs/4.jpg' },
      { name: 'Org. Profesionales', image: '/assets/imgs/6.png' },
      { name: 'Org. admin', image: '/assets/imgs/5.jpg' },
      { name: 'Farmacias', image: '/assets/imgs/8.jpeg' },
      { name: 'Los 15 mejores Hospitales de Latinoamérica', image: '/assets/imgs/9.jpeg' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <div
          key={category.name}
          className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${
            category.name === activeCategory
              ? 'bg-blue-200 shadow-md'
              : 'hover:bg-gray-200'
          }`}
          onClick={() => onCategorySelect(category.name)}
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-32 h-32 object-cover rounded-xl mb-2"
          />
          <span className="text-xs font-medium text-gray-700">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ImageNavbar;