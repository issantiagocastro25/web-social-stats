import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card, Table, Checkbox, Button } from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Title, Text, Grid, Col, Metric, BarChart, DonutChart, AreaChart } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';




const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);


const ImageNavbar = ({ onCategorySelect, activeCategory }) => {
  const categories = [
    { name: 'todos', image: '/assets/imgs/images.png' },
    { name: 'Educación', image: '/assets/imgs/4.jpg' },
    { name: 'EPS y Seguros', image: '/assets/imgs/3.jpg' },
    { name: 'IPS privadas', image: '/assets/imgs/1.jpg' },
    { name: 'IPS Públicas', image: '/assets/imgs/2.jpg' },
    { name: 'Org. admin', image: '/assets/imgs/5.jpg' },
    { name: 'Org. Profesionales', image: '/assets/imgs/6.png' },
    { name: 'Farmacias', image: '/assets/imgs/8.jpeg' },
    
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
            className="w-32 h-32 object-cover rounded-xl mb-2"
          />
          <span className="text-xs font-medium text-gray-700">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

const SummaryCards = ({ data = [] }) => {
  const stats = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        facebook: 0,
        twitter: 0,
        instagram: 0,
        youtube: 0,
        tiktok: 0,
        total: 0
      };
    }

    return data.reduce((acc, item) => ({
      facebook: acc.facebook + (item.social_networks?.Facebook?.followers || 0),
      twitter: acc.twitter + (item.social_networks?.X?.followers || 0),
      instagram: acc.instagram + (item.social_networks?.Instagram?.followers || 0),
      youtube: acc.youtube + (item.social_networks?.YouTube?.followers || 0),
      tiktok: acc.tiktok + (item.social_networks?.TikTok?.followers || 0),
      total: acc.total + 
        (item.social_networks?.Facebook?.followers || 0) +
        (item.social_networks?.X?.followers || 0) +
        (item.social_networks?.Instagram?.followers || 0) +
        (item.social_networks?.YouTube?.followers || 0) +
        (item.social_networks?.TikTok?.followers || 0),
    }), { facebook: 0, twitter: 0, instagram: 0, youtube: 0, tiktok: 0, total: 0 });
  }, [data]);

  const cards = [
    { icon: FaFacebook, color: 'text-blue-600', title: 'Facebook', value: stats.facebook },
    { icon: XIcon, color: 'text-blue-400', title: 'X', value: stats.twitter },
    { icon: FaInstagram, color: 'text-pink-600', title: 'Instagram', value: stats.instagram },
    { icon: FaYoutube, color: 'text-red-600', title: 'YouTube', value: stats.youtube },
    { icon: SiTiktok, color: 'text-black', title: 'TikTok', value: stats.tiktok },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex flex-col items-center">
          <Text className="text-sm">Total Seguidores</Text>
          <Metric>{stats.total.toLocaleString()}</Metric>
        </div>
      </Card>
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

const InteractiveDataTable = ({ data, onInstitutionSelect, selectedType }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [visibleNetworks, setVisibleNetworks] = useState({
    basic: true,
    Facebook: false,
    X: false,
    Instagram: false,
    YouTube: false,
    TikTok: false
  });

  const columns = [
    { key: 'Institucion', label: 'Institución', network: 'basic' },
    { key: 'Tipo', label: 'Tipo', network: 'basic' },
    { key: 'Ciudad', label: 'Ciudad', network: 'basic' },
    { key: 'social_networks.Facebook.followers', label: 'Facebook Seguidores', network: 'Facebook' },
    { key: 'social_networks.Facebook.publications', label: 'Facebook Publicaciones', network: 'Facebook' },
    { key: 'social_networks.Facebook.reactions', label: 'Facebook Reacciones', network: 'Facebook' },
    { key: 'social_networks.Facebook.engagement', label: 'Facebook Engagement', network: 'Facebook' },
    { key: 'social_networks.X.followers', label: 'X Seguidores', network: 'X' },
    { key: 'social_networks.X.publications', label: 'X Publicaciones', network: 'X' },
    { key: 'social_networks.X.reactions', label: 'X Reacciones', network: 'X' },
    { key: 'social_networks.X.engagement', label: 'X Engagement', network: 'X' },
    { key: 'social_networks.Instagram.followers', label: 'Instagram Seguidores', network: 'Instagram' },
    { key: 'social_networks.Instagram.publications', label: 'Instagram Publicaciones', network: 'Instagram' },
    { key: 'social_networks.Instagram.reactions', label: 'Instagram Reacciones', network: 'Instagram' },
    { key: 'social_networks.Instagram.engagement', label: 'Instagram Engagement', network: 'Instagram' },
    { key: 'social_networks.YouTube.followers', label: 'YouTube Seguidores', network: 'YouTube' },
    { key: 'social_networks.YouTube.publications', label: 'YouTube Publicaciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.reactions', label: 'YouTube Reacciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.engagement', label: 'YouTube Engagement', network: 'YouTube' },
    { key: 'social_networks.TikTok.followers', label: 'TikTok Seguidores', network: 'TikTok' },
    { key: 'social_networks.TikTok.publications', label: 'TikTok Publicaciones', network: 'TikTok' },
    { key: 'social_networks.TikTok.reactions', label: 'TikTok Reacciones', network: 'TikTok' },
    { key: 'social_networks.TikTok.engagement', label: 'TikTok Engagement', network: 'TikTok' },
  ];

  const visibleColumns = columns.filter(column => visibleNetworks[column.network]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getValue = (obj, path) => {
          const value = path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
          return value !== null ? value : '';
        };

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = selectedType === 'Todos' ? sortedData : sortedData.filter(item => item.Tipo === selectedType);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (institution) => {
    setSelectedRows(prev => 
      prev.includes(institution) 
        ? prev.filter(i => i !== institution) 
        : [...prev, institution]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(filteredData);
  };

  const handleDeselectAll = () => {
    setSelectedRows([]);
  };

  const handleCompareClick = () => {
    setShowComparison(true);
  };

  const toggleNetwork = (network) => {
    setVisibleNetworks(prev => ({ ...prev, [network]: !prev[network] }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-blue-500" /> : <FaSortDown className="ml-1 text-blue-500" />;
  };

  const ComparisonView = () => (
    <Card>
      <h3 className="text-lg font-bold mb-4">Comparación de Entidades Seleccionadas</h3>
      <Table>
        <Table.Head>
          {visibleColumns.map(column => (
            <Table.HeadCell key={column.key}>{column.label}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {selectedRows.map(institution => (
            <Table.Row key={institution.Institucion}>
              {visibleColumns.map(column => (
                <Table.Cell key={column.key}>
                  {column.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : 'N/A'), institution)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-bold mb-2">Datos de Instituciones</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button size="sm" color={visibleNetworks.basic ? "blue" : "gray"} onClick={() => toggleNetwork('basic')}>
            Datos Básicos
          </Button>
          <Button size="sm" color={visibleNetworks.Facebook ? "blue" : "gray"} onClick={() => toggleNetwork('Facebook')}>
            <FaFacebook className="mr-2" />Facebook
          </Button>
          <Button size="xs" color={visibleNetworks.X ? "blue" : "gray"} onClick={() => toggleNetwork('X')}>
            <XIcon className="mr-2" />
          </Button>
          <Button size="sm" color={visibleNetworks.Instagram ? "blue" : "gray"} onClick={() => toggleNetwork('Instagram')}>
            <FaInstagram className="mr-2" />Instagram
          </Button>
          <Button size="sm" color={visibleNetworks.YouTube ? "blue" : "gray"} onClick={() => toggleNetwork('YouTube')}>
            <FaYoutube className="mr-2" />YouTube
          </Button>
          <Button size="sm" color={visibleNetworks.TikTok ? "blue" : "gray"} onClick={() => toggleNetwork('TikTok')}>
            <SiTiktok className="mr-2" />TikTok
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={handleSelectAll}>Seleccionar Todos</Button>
          <Button size="sm" onClick={handleDeselectAll}>Deseleccionar Todos</Button>
          <Button onClick={handleCompareClick} disabled={selectedRows.length < 2}>
            Comparar Seleccionados
          </Button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table hoverable className="w-full">
            <Table.Head className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <Table.HeadCell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-20">
                <Checkbox 
                  checked={selectedRows.length === filteredData.length}
                  onChange={selectedRows.length === filteredData.length ? handleDeselectAll : handleSelectAll}
                />
              </Table.HeadCell>
              {visibleColumns.map((column) => (
                <Table.HeadCell 
                  key={column.key} 
                  onClick={() => handleSort(column.key)} 
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    {column.label}
                    <SortIcon column={column.key} />
                  </div>
                </Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredData.map((item) => (
                <Table.Row 
                  key={item.Institucion} 
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  onClick={() => onInstitutionSelect(item)}
                >
                  <Table.Cell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-10">
                    <Checkbox 
                      checked={selectedRows.includes(item)}
                      onChange={() => handleRowSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Table.Cell>
                  {visibleColumns.map(column => (
                    <Table.Cell key={column.key} className="max-w-xs break-words font-medium text-gray-900 dark:text-white">
                      {column.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : 'N/A'), item)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      {showComparison && <ComparisonView />}
    </div>
  );
};


const InstitutionStats = ({ institution }) => {
  const socialMediaData = [
    { name: 'Facebook', value: institution.social_networks.Facebook?.followers || 0, color: 'blue', icon: FaFacebook },
    { name: 'X', value: institution.social_networks.X?.followers || 0, color: 'black', icon: XIcon },
    { name: 'Instagram', value: institution.social_networks.Instagram?.followers || 0, color: 'pink', icon: FaInstagram },
    { name: 'YouTube', value: institution.social_networks.YouTube?.followers || 0, color: 'red', icon: FaYoutube },
    { name: 'TikTok', value: institution.social_networks.TikTok?.followers || 0, color: 'black', icon: SiTiktok },
  ];


  const youtubeData = [
    { name: 'Seguidores', value: institution.social_networks.YouTube?.followers || 0 },
    { name: 'Publicaciones', value: institution.social_networks.YouTube?.publications || 0 },
    { name: 'Reacciones', value: institution.social_networks.YouTube?.reactions || 0 },
  ];

  // Simulated annual growth data (replace with actual data if available)
  const annualGrowthData = [
    { year: '2020', Facebook: 5, X: 3, Instagram: 8, YouTube: 10, TikTok: 15 },
    { year: '2021', Facebook: 7, X: 4, Instagram: 10, YouTube: 12, TikTok: 20 },
    { year: '2022', Facebook: 6, X: 5, Instagram: 12, YouTube: 15, TikTok: 25 },
    { year: '2023', Facebook: 8, X: 6, Instagram: 15, YouTube: 18, TikTok: 30 },
  ];


  return (
    <div className="space-y-6">
      <Card>
        <Title className="mb-4 text-xl text-center">Datos de {institution.Institucion}</Title>
        <Grid numColsLg={2} className="gap-4">
          <div>
            <Text className='text-xl text-center'><strong>Ciudad:</strong> {institution.Ciudad || 'N/A'}</Text>
            <Text className='text-xl text-center'><strong>Tipo:</strong> {institution.Tipo || 'Sin clasificar'}</Text>
          </div>
          <div>
            {Object.entries(institution.social_networks).map(([network, data]) => (
              <Text key={network} className='text-xl text-center'>
                <strong>{network}:</strong> {data.followers || 0} seguidores
              </Text>
            ))}
          </div>
        </Grid>
      </Card>

      <Card>
        <Title>Estadísticas de Redes Sociales</Title>
        <BarChart
          className="mt-4 h-80"
          data={socialMediaData}
          index="name"
          categories={["value"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          showLegend={false}
        />
      </Card>

      <Card>
        <Title className='text-xl text-center'>Estadísticas de YouTube</Title>
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
              <div key={index} className="flex justify-center space-x-6 items-center mt-2">
                <Text>{item.name}</Text>
                <Metric>{item.value.toLocaleString()}</Metric>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      <Card>
        <Title>Crecimiento Anual en Redes Sociales</Title>
        <AreaChart
          className="mt-4 h-80"
          data={annualGrowthData}
          index="year"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          valueFormatter={(number) => `${number}%`}
        />
        <div className="mt-4 flex justify-center space-x-4">
          {socialMediaData.map((network) => (
            <div key={network.name} className="flex items-center">
              <network.icon className={`text-${network.color}-500 mr-2`} />
              <Text>{network.name}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


const SocialStatsDashboard = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching data for category:', activeCategory);
        const response = await fetchSocialStats({ category: activeCategory });
        console.log('Response received:', response);
        if (response && Array.isArray(response.metrics)) {
          setAllData(response.metrics);
          setFilteredData(response.metrics);
        } else {
          throw new Error(`Data structure is not as expected: ${JSON.stringify(response)}`);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeCategory]);

   const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
    const newFilteredData = category === '' 
      ? allData 
      : allData.filter(item => item.Tipo === category);
    setFilteredData(newFilteredData);
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allData.filter(item =>
      item.Institucion.toLowerCase().includes(term) ||
      (item.Ciudad && item.Ciudad.toLowerCase().includes(term)) ||
      (item.Tipo && item.Tipo.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p>{error}</p>
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        
        <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        
        {!isLoading && allData.length > 0 && (
          <SummaryCards allData={allData} filteredData={filteredData} />
        )}
        
        <div className="mb-6">
          <TextInput
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            icon={FaSearch}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <h2 className="text-xl font-bold mb-4">Error</h2>
            <p>{error}</p>
            <button 
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Intentar de nuevo
            </button>
          </div>
        ) : filteredData.length > 0 ? (
          <Grid numColsLg={3} className="gap-6">
            <Col numColSpanLg={2}>
              <Card>
                <InteractiveDataTable 
                  data={filteredData}
                  onInstitutionSelect={handleInstitutionSelect}
                  selectedType={activeCategory}
                />
              </Card>
            </Col>
            <Col>
              {selectedInstitution ? (
                <InstitutionStats institution={selectedInstitution} />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <p>Selecciona una institución para ver sus estadísticas detalladas</p>
                </Card>
              )}
            </Col>
          </Grid>
        ) : (
          <Card>
            <p className="text-center">No se encontraron datos que coincidan con la búsqueda.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialStatsDashboard;