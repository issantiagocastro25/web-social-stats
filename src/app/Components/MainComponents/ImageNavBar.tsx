import React, { useMemo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  institution_count: number;
  url: string;
  ordering: number;
  category: string;
  date_collection: string;
}

interface ImageNavbarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  categories: Category[];
  currentSection: 'salud' | 'compensacion' | 'hospitales' | 'usa';
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
    console.log('Category selected in ImageNavbar:', categoryName);
    onCategorySelect(categoryName);
  };

  const allCategories = useMemo(() => {
    const todosCategory: Category = {
      id: 0,
      name: 'Todos',
      institution_count: categories.reduce((sum, cat) => sum + cat.institution_count, 0),
      url: 'https://mediaweb.sfo3.cdn.digitaloceanspaces.com/social-media-stats-assets/todos.png',
      ordering: -1,
      category: currentSection,
      date_collection: categories[0]?.date_collection || ''
    };

    return [todosCategory, ...categories];
  }, [categories, currentSection]);

  const filteredCategories = useMemo(() => {
    return currentSection === 'salud' ? allCategories : [];
  }, [allCategories, currentSection]);

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

  if (currentSection !== 'salud' || filteredCategories.length === 0) {
    return null;
  }

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
              <span className="text-xl font-medium text-gray-700 text-center">
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