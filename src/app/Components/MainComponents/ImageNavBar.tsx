import React, { useMemo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  institution_count: number | null;
  url: string;
  ordering: number;
}

interface ImageNavbarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  categories: Category[];
  currentSection: 'salud' | 'compensacion' | 'hospitales';
}

const NextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} z-15`}>
      <FaChevronRight className="text-blue-500 text-2xl" onClick={onClick}/>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} z-10`}>
      <FaChevronLeft className="text-blue-500 text-2xl" onClick={onClick} />
    </div>
  );
};

const ImageNavbar: React.FC<ImageNavbarProps> = ({ onCategorySelect, activeCategory, categories, currentSection }) => {
  const handleCategorySelect = (categoryName: string) => {
    onCategorySelect(categoryName);
  };

  const filteredCategories = useMemo(() => {
    if (currentSection === 'salud') {
      return categories;
    } else {
      return categories.filter(category => category.name !== 'Todos');
    }
  }, [categories, currentSection]);

  const slidesToShow = useMemo(() => {
    const maxSlides = 5;
    return Math.min(filteredCategories.length, maxSlides);
  }, [filteredCategories]);

  const settings = useMemo(() => ({
    dots: false,
    infinite: filteredCategories.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slidesToShow, 3),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
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
  }), [filteredCategories, slidesToShow]);

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