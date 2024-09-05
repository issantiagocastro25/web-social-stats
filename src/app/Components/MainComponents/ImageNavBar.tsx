import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: number;
  name: string;
  institution_count: number;
  url : string;
}

interface ImageNavbarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-15`}
      style={{ ...style, display: "block", right: "0px" }}
      onClick={onClick}
    >
      <FaChevronRight className="text-blue-500 text-2xl" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10`}
      style={{ ...style, display: "block", left: "0px" }}
      onClick={onClick}
    >
      <FaChevronLeft className="text-blue-500 text-2xl" />
    </div>
  );
};

const ImageNavbar: React.FC<ImageNavbarProps> = ({ onCategorySelect, activeCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
1
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseStats = await fetch(`${API_URL}/api/social-metrics/stats?stats_date=2021-06-01`);
        const response = await fetch(`${API_URL}/api/social-metrics/institutions/categories`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Category[] = await response.json();

        const otros: Category[] = await responseStats.json() ;

        console.log(otros);
        
        // Calcular el total de instituciones
        const totalInstitutions = data.reduce((sum, category) => sum + category.institution_count, 0);
        
        // Añadir la categoría "todos" al principio del array
        const allCategories = [
          
          ...data
        ];
        
        setCategories(allCategories);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching categories');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mb-8 relative">
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                category.name === activeCategory
                  ? 'bg-blue-200 shadow-md'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => onCategorySelect(category.name)}
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