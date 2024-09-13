import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: number;
  name: string;
  institution_count: number | null;
  url: string;
  ordering: number;
}

interface ImageNavbarProps {
  onCategorySelect: (category: string, isAllCategory: boolean) => void;
  activeCategory: string;
  categories: Category[];
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-15`}
    >
      <FaChevronRight className="text-blue-500 text-2xl" onClick={onClick}/>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10`}
    >
      <FaChevronLeft className="text-blue-500 text-2xl" onClick={onClick} />
    </div>
  );
};

const ImageNavbar: React.FC<ImageNavbarProps> = ({ onCategorySelect, activeCategory, categories }) => {
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Filtrar las categorías no deseadas
    const excludedCategories = ['Todos']; // Añade aquí los nombres de las categorías que quieres excluir
    const filtered = categories.filter(cat => !excludedCategories.includes(cat.name));

    // Crear la categoría personalizada "Todos"
    const allCategory: Category = {
      id: 0,
      name: 'Todos',
      institution_count: filtered.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
      url: 'https://cdn-icons-png.flaticon.com/512/4320/4320350.png', // Reemplaza esto con una URL de imagen adecuada
      ordering: -1
    };

    // Combinar la categoría personalizada con las categorías filtradas
    setFilteredCategories([allCategory, ...filtered]);
  }, [categories]);

  const handleCategorySelect = (categoryName: string) => {
    const isAllCategory = categoryName === 'Todos';
    onCategorySelect(categoryName, isAllCategory);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="mb-8 relative">
      <Slider {...settings}>
        {filteredCategories.map((category) => (
          <div key={category.id} className="px-2">
            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                category.name === activeCategory
                  ? 'bg-blue-200 shadow-md'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => handleCategorySelect(category.name)}
            >
              <img
                src={category.url}
                alt={category.name}
                className="w-40 h-40 object-cover rounded-xl mb-4"
              />
              <span className="text-sm font-medium text-gray-700 text-center">
                {category.name}
              </span>
              <span className="text-xs text-gray-500">
                {category.institution_count} instituciones
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageNavbar;