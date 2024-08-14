"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card } from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import socialStatsData from '@/app/Principal/main/socialStatsData.json';

const ImageNavbar = ({ onCategorySelect, activeCategory }) => {
  const categories = [
    { name: 'Todos', image: '/assets/imgs/images.png' },
    { name: 'Educación', image: '/assets/imgs/4.jpg' },
    { name: 'EPS y Seguros', image: '/assets/imgs/3.jpg' },
    { name: 'IPS privadas', image: '/assets/imgs/1.jpg' },
    { name: 'IPS Públicas', image: '/assets/imgs/2.jpg' },
    { name: 'Org. admin', image: '/assets/imgs/5.jpg' },
    { name: 'Org. Profesionales', image: '/assets/imgs/6.png' },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {categories.map((category) => (
        <div
          key={category.name}
          className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${
            category.name === activeCategory
              ? 'bg-blue-100 shadow-md'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onCategorySelect(category.name)}
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-48 h-48 object-cover rounded-lg mb-8"
          />
          {/*<span className="text-xs font-medium text-gray-700">{category.name}</span>*/}
        </div>
      ))}
    </div>
  );
};

const SummaryCards = ({ data }) => {
  const totalFollowers = useMemo(() => {
    return data.reduce((sum, item) => 
      sum + (item.Facebook || 0) + (item.Twitter || 0) + (item.Instagram || 0), 0
    );
  }, [data]);

  const youtubeStats = useMemo(() => {
    return data.reduce((sum, item) => ({
      videos: sum.videos + (item.Videos2 || 0),
      views: sum.views + (item.Visitas2 || 0),
      subscribers: sum.subscribers + (item['Suscrip.'] || 0),
    }), { videos: 0, views: 0, subscribers: 0 });
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <div className="flex items-center">
          <FaFacebook className="text-blue-600 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Facebook Followers</p>
            <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center">
          <FaYoutube className="text-red-600 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">YouTube Subscribers</p>
            <p className="text-2xl font-bold text-gray-900">{youtubeStats.subscribers.toLocaleString()}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center">
          <FaTwitter className="text-blue-400 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Twitter Followers</p>
            <p className="text-2xl font-bold text-gray-900">{data.reduce((sum, item) => sum + (item.Twitter || 0), 0).toLocaleString()}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center">
          <FaInstagram className="text-pink-600 text-3xl mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Instagram Followers</p>
            <p className="text-2xl font-bold text-gray-900">{data.reduce((sum, item) => sum + (item.Instagram || 0), 0).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DataTable = ({ data, searchTerm, sortConfig, onSort }) => {
  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) + '%' : 'N/A';
  };

  const totalFollowers = useMemo(() => {
    return data.reduce((sum, item) => 
      sum + (item.Facebook || 0) + (item.Twitter || 0) + (item.Instagram || 0), 0
    );
  }, [data]);

  const followersByType = useMemo(() => {
    return data.reduce((acc, item) => {
      const type = item.Tipo || 'Sin clasificar';
      if (!acc[type]) acc[type] = 0;
      acc[type] += (item.Facebook || 0) + (item.Twitter || 0) + (item.Instagram || 0);
      return acc;
    }, {});
  }, [data]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(item =>
    item.Instituciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.Ciudad && item.Ciudad.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.Tipo && item.Tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const SortIcon = ({ column }) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-blue-500" /> : <FaSortDown className="ml-1 text-blue-500" />;
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => onSort('Instituciones')}>
              <div className="flex items-center">
                Institución
                <SortIcon column="Instituciones" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => onSort('Ciudad')}>
              <div className="flex items-center">
                Ciudad
                <SortIcon column="Ciudad" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => onSort('Tipo')}>
              <div className="flex items-center">
                Tipo
                <SortIcon column="Tipo" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3">Redes Sociales</th>
            <th scope="col" className="px-6 py-3">Total RS</th>
            <th scope="col" className="px-6 py-3">% por Tipo</th>
            <th scope="col" className="px-6 py-3">% del Total</th>
            <th scope="col" className="px-6 py-3">YouTube</th>
            <th scope="col" className="px-6 py-3">Visitas/Video YT</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => {
            const totalItemFollowers = (item.Facebook || 0) + (item.Twitter || 0) + (item.Instagram || 0);
            const typeFollowers = followersByType[item.Tipo || 'Sin clasificar'];
            return (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.Instituciones}
                </th>
                <td className="px-6 py-4">{item.Ciudad || 'N/A'}</td>
                <td className="px-6 py-4">{item.Tipo || 'Sin clasificar'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FaFacebook className="text-blue-600" /> {item.Facebook || 0}
                    <FaTwitter className="text-blue-400" /> {item.Twitter || 0}
                    <FaInstagram className="text-pink-600" /> {item.Instagram || 0}
                  </div>
                </td>
                <td className="px-6 py-4">{totalItemFollowers}</td>
                <td className="px-6 py-4">{calculatePercentage(totalItemFollowers, typeFollowers)}</td>
                <td className="px-6 py-4">{calculatePercentage(totalItemFollowers, totalFollowers)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FaYoutube className="text-red-600" />
                    <span>V: {item.Videos2 || 0}</span>
                    <span>Vis: {item.Visitas2 || 0}</span>
                    <span>Sus: {item['Suscrip.'] || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item['Visitas/video'] || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const SocialStatsDashboard = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setFilteredData(socialStatsData.data);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === 'Todos') {
      setFilteredData(socialStatsData.data);
    } else {
      setFilteredData(socialStatsData.data.filter(item => item.Tipo === category));
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Dashboard de Estadísticas Sociales
      </h1>
      <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <SummaryCards data={filteredData} />
          <div className="mb-6">
            <TextInput
              type="text"
              placeholder="Buscar por institución, ciudad o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <DataTable 
              data={filteredData} 
              searchTerm={searchTerm}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SocialStatsDashboard;