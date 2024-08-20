import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card } from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { BarChart, DonutChart, Title, Text, Grid, Col, AreaChart, Legend, Flex, Metric } from '@tremor/react';
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
    <div className="flex flex-wrap justify-center gap-4 mb-8">
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
            className="w-12 h-12 object-cover rounded-full mb-2"
          />
          <span className="text-xs font-medium text-gray-700">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

const SummaryCards = ({ data }) => {
  const stats = useMemo(() => {
    const totalFollowers = data.reduce((sum, item) => 
      sum + (item.Facebook || 0) + (item.Twitter || 0) + (item.Instagram || 0), 0
    );
    const youtubeStats = data.reduce((sum, item) => ({
      videos: sum.videos + (item.Videos2 || 0),
      views: sum.views + (item.Visitas2 || 0),
      subscribers: sum.subscribers + (item['Suscrip.'] || 0),
    }), { videos: 0, views: 0, subscribers: 0 });
    return { 
      totalFollowers,
      twitter: data.reduce((sum, item) => sum + (item.Twitter || 0), 0),
      instagram: data.reduce((sum, item) => sum + (item.Instagram || 0), 0),
      ...youtubeStats 
    };
  }, [data]);

  const cards = [
    { icon: FaFacebook, color: 'text-blue-600', title: 'Total Seguidores', value: stats.totalFollowers },
    { icon: FaTwitter, color: 'text-blue-400', title: 'Seguidores Twitter', value: stats.twitter },
    { icon: FaInstagram, color: 'text-pink-600', title: 'Seguidores Instagram', value: stats.instagram },
    { icon: FaYoutube, color: 'text-red-600', title: 'Suscriptores YouTube', value: stats.subscribers },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="flex items-center p-4">
          <card.icon className={`${card.color} text-3xl mr-4`} />
          <div>
            <Text className="text-sm">{card.title}</Text>
            <Metric>{card.value.toLocaleString()}</Metric>
          </div>
        </Card>
      ))}
    </div>
  );
};

const DataTable = ({ data, searchTerm, sortConfig, onSort, onInstitutionClick, selectedInstitution }) => {
  const filteredData = data.filter(item =>
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
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {['Instituciones', 'Ciudad', 'Tipo'].map((column) => (
              <th key={column} scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => onSort(column)}>
                <div className="flex items-center">
                  {column}
                  <SortIcon column={column} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr 
              key={index}
              onClick={() => onInstitutionClick(item)}
              className={`bg-white border-b hover:bg-gray-50 cursor-pointer ${
                selectedInstitution && selectedInstitution.Instituciones === item.Instituciones ? 'bg-blue-50' : ''
              }`}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.Instituciones}</th>
              <td className="px-6 py-4">{item.Ciudad || 'N/A'}</td>
              <td className="px-6 py-4">{item.Tipo || 'Sin clasificar'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InstitutionStats = ({ institution }) => {
  const socialMediaData = [
    { name: 'Facebook', value: institution.Facebook || 0, color: 'blue' },
    { name: 'Twitter', value: institution.Twitter || 0, color: 'cyan' },
    { name: 'Instagram', value: institution.Instagram || 0, color: 'pink' },
  ];

  const youtubeData = [
    { name: 'Videos', value: institution.Videos2 || 0 },
    { name: 'Visitas', value: institution.Visitas2 || 0 },
    { name: 'Suscriptores', value: institution['Suscrip.'] || 0 },
  ];

  const growthData = [
    { date: "Ene 1", Facebook: 1000, Twitter: 500, Instagram: 700 },
    { date: "Feb 1", Facebook: 1200, Twitter: 550, Instagram: 900 },
    { date: "Mar 1", Facebook: 1500, Twitter: 600, Instagram: 1100 },
    { date: "Abr 1", Facebook: 1800, Twitter: 700, Instagram: 1300 },
    { date: "May 1", Facebook: 2000, Twitter: 800, Instagram: 1500 },
  ];

  return (
    <div className="space-y-6">
      <div className='grid grid-cols-2'>
      <Card >
        <Title className="mb-4 text-3xl text-center">Datos de {institution.Instituciones}</Title>
        <Grid numColsLg={2} className="gap-4 text-center">
          <div>
            <Text className='text-xl'><strong>Ciudad:</strong> {institution.Ciudad || 'N/A'}</Text>
            <Text className='text-xl'><strong>Tipo:</strong> {institution.Tipo || 'Sin clasificar'}</Text>
          </div>
          <div>
            <Text className='text-xl'><strong>Facebook:</strong> {institution.Facebook || 0} seguidores</Text>
            <Text className='text-xl'><strong>Twitter:</strong> {institution.Twitter || 0} seguidores</Text>
            <Text className='text-xl'><strong>Instagram:</strong> {institution.Instagram || 0} seguidores</Text>
          </div>
        </Grid>
      </Card>
      <Card>
        <Title>Estadísticas de YouTube</Title>
        <Grid numColsLg={2} className="gap-4 mt-4">
          <DonutChart
            className="h-60"
            data={youtubeData}
            category="value"
            index="name"
            colors={["red", "orange", "yellow"]}
            showLabel={true}
          />
          <div>
            {youtubeData.map((item, index) => (
              <Flex key={index} justifyContent="center" className="mt-2">
                <Text className='text-xl'>{item.name}</Text>
                <Metric className='ml-12'>{item.value.toLocaleString()}</Metric>
              </Flex>
            ))}
          </div>
        </Grid>
      </Card>
      </div>
      <Card>
        <Title>Estadísticas de Redes Sociales</Title>
        <BarChart
          className="mt-4 h-80"
          data={socialMediaData}
          index="name"
          categories={["value"]}
          colors={["blue", "cyan", "pink"]}
          yAxisWidth={48}
          showLegend={false}
        />
      </Card>
      <Card>
        <Title>Crecimiento de Seguidores</Title>
        <AreaChart
          className="mt-4 h-80"
          data={growthData}
          index="date"
          categories={["Facebook", "Twitter", "Instagram"]}
          colors={["blue", "cyan", "pink"]}
        />
      </Card>
    </div>
  );
};

const SocialStatsDashboard = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

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
    setSelectedInstitution(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInstitutionClick = (institution) => {
    setSelectedInstitution(institution);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Dashboard de Estadísticas Sociales
      </h1>
      
      <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
      
      <SummaryCards data={filteredData} />
      
      <div className="mb-6">
        <TextInput
          type="text"
          placeholder="Buscar por institución, ciudad o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={FaSearch}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : (
        <Grid numColsLg={3} className="gap-6">
          <Col numColSpanLg={2}>
            <Card>
              <Title className="mb-4">Lista de Instituciones</Title>
              <DataTable 
                data={filteredData} 
                searchTerm={searchTerm}
                sortConfig={sortConfig}
                onSort={handleSort}
                onInstitutionClick={handleInstitutionClick}
                selectedInstitution={selectedInstitution}
              />
            </Card>
          </Col>
          <Col>
            {selectedInstitution ? (
              <InstitutionStats institution={selectedInstitution} />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <Text>Selecciona una institución para ver sus estadísticas detalladas</Text>
              </Card>
            )}
          </Col>
        </Grid>
      )}
    </div>
  );
};

export default SocialStatsDashboard;