import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card, Table, Checkbox, Button } from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Title, Text, Grid, Col, Metric, BarChart, DonutChart, AreaChart } from '@tremor/react';
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

const SummaryCards = ({ allData, filteredData }) => {
  const calculateStats = (data) => {
    return data.reduce((acc, item) => ({
      facebook: acc.facebook + (item.social_networks.Facebook?.followers || 0),
      twitter: acc.twitter + (item.social_networks.X?.followers || 0),
      instagram: acc.instagram + (item.social_networks.Instagram?.followers || 0),
      youtube: acc.youtube + (item.social_networks.YouTube?.followers || 0),
      tiktok: acc.tiktok + (item.social_networks.TikTok?.followers || 0),
      total: acc.total + 
        (item.social_networks.Facebook?.followers || 0) +
        (item.social_networks.X?.followers || 0) +
        (item.social_networks.Instagram?.followers || 0) +
        (item.social_networks.YouTube?.followers || 0) +
        (item.social_networks.TikTok?.followers || 0),
    }), { facebook: 0, twitter: 0, instagram: 0, youtube: 0, tiktok: 0, total: 0 });
  };

  const totalStats = calculateStats(allData);
  const filteredStats = calculateStats(filteredData);

  const cards = [
    { icon: FaFacebook, color: 'text-blue-600', title: 'Facebook', totalValue: totalStats.facebook, filteredValue: filteredStats.facebook },
    { icon: FaTwitter, color: 'text-blue-400', title: 'Twitter', totalValue: totalStats.twitter, filteredValue: filteredStats.twitter },
    { icon: FaInstagram, color: 'text-pink-600', title: 'Instagram', totalValue: totalStats.instagram, filteredValue: filteredStats.instagram },
    { icon: FaYoutube, color: 'text-red-600', title: 'YouTube', totalValue: totalStats.youtube, filteredValue: filteredStats.youtube },
    { icon: SiTiktok, color: 'text-black', title: 'TikTok', totalValue: totalStats.tiktok, filteredValue: filteredStats.tiktok },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex flex-col items-center">
          <Text className="text-sm">Total Seguidores</Text>
          <Metric>{totalStats.total.toLocaleString()}</Metric>
          <Text className="text-xs text-gray-500">Filtrados: {filteredStats.total.toLocaleString()}</Text>
        </div>
      </Card>
      {cards.map((card, index) => (
        <Card key={index} className="flex items-center p-4">
          <card.icon className={`${card.color} text-3xl mr-4`} />
          <div>
            <Text className="text-sm">{card.title}</Text>
            <Metric>{card.filteredValue.toLocaleString()}</Metric>
            <Text className="text-xs text-gray-500">Total: {card.totalValue.toLocaleString()}</Text>
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

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key.includes('.')) {
          const [network, metric] = sortConfig.key.split('.');
          const aValue = a.social_networks[network]?.[metric] || 0;
          const bValue = b.social_networks[network]?.[metric] || 0;
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
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
          <Table.HeadCell>Institución</Table.HeadCell>
          <Table.HeadCell>Facebook</Table.HeadCell>
          <Table.HeadCell>Twitter</Table.HeadCell>
          <Table.HeadCell>Instagram</Table.HeadCell>
          <Table.HeadCell>YouTube</Table.HeadCell>
          <Table.HeadCell>TikTok</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {selectedRows.map(institution => (
            <Table.Row key={institution.Institucion}>
              <Table.Cell className="max-w-xs break-words">{institution.Institucion}</Table.Cell>
              <Table.Cell>{institution.social_networks.Facebook?.followers}</Table.Cell>
              <Table.Cell>{institution.social_networks.X?.followers}</Table.Cell>
              <Table.Cell>{institution.social_networks.Instagram?.followers}</Table.Cell>
              <Table.Cell>{institution.social_networks.YouTube?.followers}</Table.Cell>
              <Table.Cell>{institution.social_networks.TikTok?.followers}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Datos de Instituciones</h2>
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
              {['Institucion', 'Tipo', 'Ciudad', 'Facebook.followers', 'X.followers', 'Instagram.followers', 'YouTube.followers', 'TikTok.followers'].map((column) => (
                <Table.HeadCell key={column} onClick={() => handleSort(column)} className="cursor-pointer">
                  <div className="flex items-center">
                    {column.replace('.', ' ')}
                    <SortIcon column={column} />
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
                  <Table.Cell className="max-w-xs break-words font-medium text-gray-900 dark:text-white">
                    {item.Institucion}
                  </Table.Cell>
                  <Table.Cell>{item.Tipo}</Table.Cell>
                  <Table.Cell>{item.Ciudad}</Table.Cell>
                  <Table.Cell>{item.social_networks.Facebook?.followers}</Table.Cell>
                  <Table.Cell>{item.social_networks.X?.followers}</Table.Cell>
                  <Table.Cell>{item.social_networks.Instagram?.followers}</Table.Cell>
                  <Table.Cell>{item.social_networks.YouTube?.followers}</Table.Cell>
                  <Table.Cell>{item.social_networks.TikTok?.followers}</Table.Cell>
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
    { name: 'Facebook', value: institution.social_networks.Facebook?.followers || 0, color: 'blue' },
    { name: 'Twitter', value: institution.social_networks.X?.followers || 0, color: 'cyan' },
    { name: 'Instagram', value: institution.social_networks.Instagram?.followers || 0, color: 'pink' },
    { name: 'YouTube', value: institution.social_networks.YouTube?.followers || 0, color: 'red' },
    { name: 'TikTok', value: institution.social_networks.TikTok?.followers || 0, color: 'black' },
  ];

  const youtubeData = [
    { name: 'Seguidores', value: institution.social_networks.YouTube?.followers || 0 },
    { name: 'Publicaciones', value: institution.social_networks.YouTube?.publications || 0 },
    { name: 'Reacciones', value: institution.social_networks.YouTube?.reactions || 0 },
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
        <Title>Engagement por Red Social</Title>
        <AreaChart
          className="mt-4 h-80"
          data={[
            { date: "Ene", Facebook: institution.social_networks.Facebook?.engagement || 0, Twitter: institution.social_networks.X?.engagement || 0, Instagram: institution.social_networks.Instagram?.engagement || 0, YouTube: institution.social_networks.YouTube?.engagement || 0, TikTok: institution.social_networks.TikTok?.engagement || 0 },
            // Aquí podrías agregar más datos si tuvieras información histórica
          ]}
          index="date"
          categories={["Facebook", "Twitter", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
        />
      </Card>
    </div>
  );
};

const SocialStatsDashboard = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [networkFilters, setNetworkFilters] = useState({
    Facebook: true,
    X: true,
    Instagram: true,
    YouTube: true,
    TikTok: true
  });

  useEffect(() => {
    setTimeout(() => {
      setAllData(socialStatsData.data);
      setFilteredData(socialStatsData.data);
      setIsLoading(false);
    }, 1000);
  }, []);

  const applyFilters = (data) => {
    return data.filter(item => {
      const categoryMatch = activeCategory === 'Todos' || item.Tipo === activeCategory;
      const searchMatch = 
        item.Institucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.Ciudad && item.Ciudad.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.Tipo && item.Tipo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const networkMatch = Object.entries(networkFilters).some(([network, isActive]) => 
        isActive && item.social_networks[network] && item.social_networks[network].followers > 0
      );

      return categoryMatch && searchMatch && networkMatch;
    });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
    setFilteredData(applyFilters(allData));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredData(applyFilters(allData));
  };

  const handleNetworkFilterChange = (network) => {
    setNetworkFilters(prev => ({
      ...prev,
      [network]: !prev[network]
    }));
    setFilteredData(applyFilters(allData));
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        
        <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        
        <SummaryCards allData={allData} filteredData={filteredData} />
        
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <TextInput
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            icon={FaSearch}
            className="flex-grow"
          />
          {Object.entries(networkFilters).map(([network, isActive]) => (
            <Button
              key={network}
              color={isActive ? "blue" : "gray"}
              onClick={() => handleNetworkFilterChange(network)}
            >
              {network}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : (
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
                  <Text>Selecciona una institución para ver sus estadísticas detalladas</Text>
                </Card>
              )}
            </Col>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SocialStatsDashboard;