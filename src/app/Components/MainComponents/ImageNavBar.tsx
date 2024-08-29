import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Category {
  name: string;
  image: string;
}

interface ImageNavbarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string;
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10`}
      style={{ ...style, display: "block", right: "10px" }}
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
      style={{ ...style, display: "block", left: "10px" }}
      onClick={onClick}
    >
      <FaChevronLeft className="text-blue-500 text-2xl" />
    </div>
  );
};

const ImageNavbar: React.FC<ImageNavbarProps> = ({ onCategorySelect, activeCategory }) => {
  const categories: Category[] = [
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
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
        {categories.map((category) => (
          <div key={category.name} className="px-2">
            <div
              className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                category.name === activeCategory
                  ? 'bg-blue-200 shadow-md'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => onCategorySelect(category.name)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-40 h-40 object-cover rounded-xl mb-4"
              />
              <span className="text-sm font-medium text-gray-700 text-center">
                {category.name}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageNavbar;