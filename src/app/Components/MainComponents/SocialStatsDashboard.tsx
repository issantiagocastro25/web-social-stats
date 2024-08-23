import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card, Table, Checkbox, Button, Select ,Navbar} from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Title, Text, Grid, Col, Metric, BarChart, LineChart, ScatterChart, DonutChart, AreaChart } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);


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

const ImageNavbar = ({ onCategorySelect, activeCategory }) => {
  const categories = [
    { name: 'Todos', image: '/assets/imgs/images.png' },
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

const SummaryCards = ({ groupData = [], selectedData = [] }) => {
  const calculateStats = (data) => {
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
  };

  const groupStats = useMemo(() => calculateStats(groupData), [groupData]);
  const selectedStats = useMemo(() => calculateStats(selectedData), [selectedData]);

  const networkCards = [
    { icon: FaFacebook, color: 'text-blue-600', title: 'Facebook', groupValue: groupStats.facebook, selectedValue: selectedStats.facebook },
    { icon: XIcon, color: 'text-blue-400', title: 'X', groupValue: groupStats.twitter, selectedValue: selectedStats.twitter },
    { icon: FaInstagram, color: 'text-pink-600', title: 'Instagram', groupValue: groupStats.instagram, selectedValue: selectedStats.instagram },
    { icon: FaYoutube, color: 'text-red-600', title: 'YouTube', groupValue: groupStats.youtube, selectedValue: selectedStats.youtube },
    { icon: SiTiktok, color: 'text-black', title: 'TikTok', groupValue: groupStats.tiktok, selectedValue: selectedStats.tiktok },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex flex-col items-center">
          <Text className="text-sm">Total Seguidores del Grupo</Text>
          <Metric>{groupStats.total.toLocaleString()}</Metric>
          <Text className="text-xs text-gray-500">Seleccionados: {selectedStats.total.toLocaleString()}</Text>
        </div>
      </Card>
      {networkCards.map((card, index) => (
        <Card key={index} className="flex flex-col items-center p-4">
          <card.icon className={`${card.color} text-3xl mb-2`} />
          <Text className="text-sm">{card.title}</Text>
          <Metric>{card.groupValue.toLocaleString()}</Metric>
          <Text className="text-xs text-gray-500">
            Seleccionados: {card.selectedValue.toLocaleString()}
          </Text>
        </Card>
      ))}
    </div>
  );
};


const ComparisonCharts = ({ selectedInstitutions }) => {
  const prepareChartData = (metric) => {
    return selectedInstitutions.map(institution => ({
      name: institution.Institucion,
      Facebook: institution.social_networks?.Facebook?.[metric] || 0,
      X: institution.social_networks?.X?.[metric] || 0,
      Instagram: institution.social_networks?.Instagram?.[metric] || 0,
      YouTube: institution.social_networks?.YouTube?.[metric] || 0,
      TikTok: institution.social_networks?.TikTok?.[metric] || 0,
    }));
  };

  const followersData = prepareChartData('followers');
  const publicationsData = prepareChartData('publications');
  const reactionsData = prepareChartData('reactions');
  const engagementData = prepareChartData('engagement');

  return (
    <div className="space-y-6">
      <Card>
        <Title>Comparación de Seguidores por Red Social</Title>
        <BarChart
          className="mt-4 h-80"
          data={followersData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          stack={false}
        />
      </Card>

      <Card>
        <Title>Comparación de Publicaciones por Red Social</Title>
        <LineChart
          className="mt-4 h-80"
          data={publicationsData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          connectNulls={true}
        />
      </Card>

      <Card>
        <Title>Comparación de Reacciones por Red Social</Title>
        <BarChart
          className="mt-4 h-80"
          data={reactionsData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          stack={true}
        />
      </Card>

      <Card>
        <Title>Comparación de Engagement por Red Social</Title>
        <ScatterChart
          className="mt-4 h-80"
          data={engagementData}
          category="name"
          x="Facebook"
          y="Instagram"
          size="YouTube"
          color="TikTok"
          showLegend={false}
        >
          <Text>
            Tamaño del punto: YouTube engagement
            Color del punto: TikTok engagement
          </Text>
        </ScatterChart>
      </Card>
    </div>
  );
};

const ComparisonTable = ({ selectedInstitutions }) => {
  const columns = [
    { key: 'Institucion', label: 'Institución' },
    { key: 'Tipo', label: 'Tipo' },
    { key: 'Ciudad', label: 'Ciudad' },
    { key: 'Facebook', label: 'Facebook Seguidores' },
    { key: 'X', label: 'X Seguidores' },
    { key: 'Instagram', label: 'Instagram Seguidores' },
    { key: 'YouTube', label: 'YouTube Seguidores' },
    { key: 'TikTok', label: 'TikTok Seguidores' },
  ];

  return (
    <Card>
      <Title>Comparación de Instituciones Seleccionadas</Title>
      <Table>
        <Table.Head>
          {columns.map((column) => (
            <Table.HeadCell key={column.key}>{column.label}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {selectedInstitutions.map((institution) => (
            <Table.Row key={institution.Institucion}>
              <Table.Cell>{institution.Institucion}</Table.Cell>
              <Table.Cell>{institution.Tipo}</Table.Cell>
              <Table.Cell>{institution.Ciudad}</Table.Cell>
              <Table.Cell>{institution.social_networks?.Facebook?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.X?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.Instagram?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.YouTube?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.TikTok?.followers || 0}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

const InteractiveDataTable = ({ data, onInstitutionSelect, selectedType, selectedYear, selectedMonth, onInstitutionsSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState([]);
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
          const value = path.split('.').reduce((o, key) => (o && o[key]!== undefined ? o[key] : null), obj);
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

  const filteredData = useMemo(() => {
    return sortedData.filter(item => 
      (selectedType === 'todos' || item.Tipo === selectedType) &&
      (!selectedYear || item.year === selectedYear) &&
      (!selectedMonth || item.month === selectedMonth)
    );
  }, [sortedData, selectedType, selectedYear, selectedMonth]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (institution) => {
    setSelectedRows(prev => {
      const newSelection = prev.includes(institution)
        ? prev.filter(i => i !== institution)
        : [...prev, institution];
      onInstitutionsSelect(newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const newSelection = selectedRows.length === filteredData.length ? [] : filteredData;
    setSelectedRows(newSelection);
    onInstitutionsSelect(newSelection);
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
          <Button size="sm" onClick={handleSelectAll}>
            {selectedRows.length === filteredData.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
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
                  onChange={handleSelectAll}
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
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchSocialStats({ 
          category: activeCategory,
          year: selectedYear
        });
        if (response && Array.isArray(response.metrics)) {
          setAllData(response.metrics);
          setFilteredData(response.metrics);
        } else {
          throw new Error(`Data structure is not as expected: ${JSON.stringify(response)}`);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, [activeCategory, selectedYear]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
    const newFilteredData = allData.filter(item => 
      (category === 'todos' || item.Tipo === category) &&
      (!selectedYear || item.year === selectedYear)
    );
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleInstitutionsSelect = (institutions) => {
    setSelectedInstitutions(institutions);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Dashboard de Estadísticas Sociales
          </h1>
          
          <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
          
          {!isLoading && filteredData.length > 0 && (
            <SummaryCards groupData={filteredData} selectedData={selectedInstitutions} />
          )}
        
        <div className="mb-6 flex space-x-4">
          <TextInput
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            icon={FaSearch}
          />
          <Select value={selectedYear} onChange={handleYearChange}>
            <option value="">Todos los años</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
          </Select>
          {/*<Select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Todos los meses</option>
            {/* Add month options 
          </Select>*/}
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
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  onInstitutionsSelect={handleInstitutionsSelect}
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
        
        {selectedInstitutions.length > 1 && (
          <>
            <ComparisonTable selectedInstitutions={selectedInstitutions} />
            <ComparisonCharts selectedInstitutions={selectedInstitutions} />
          </>
        )}
      </div>
    </div>
  );
};

export default SocialStatsDashboard;