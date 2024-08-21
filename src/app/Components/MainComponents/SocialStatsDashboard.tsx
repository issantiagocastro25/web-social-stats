import React, { useState, useEffect, useMemo } from 'react';
import { Spinner, TextInput, Card, Table, Checkbox, Button } from 'flowbite-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
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

const InteractiveDataTable = ({ data, onInstitutionSelect, selectedType }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
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
          <Table.HeadCell>YouTube Suscriptores</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {selectedRows.map(institution => (
            <Table.Row key={institution.Instituciones}>
              <Table.Cell className="max-w-xs break-words">{institution.Instituciones}</Table.Cell>
              <Table.Cell>{institution.Facebook}</Table.Cell>
              <Table.Cell>{institution.Twitter}</Table.Cell>
              <Table.Cell>{institution.Instagram}</Table.Cell>
              <Table.Cell>{institution['Suscrip.']}</Table.Cell>
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
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell className="w-4">
              <Checkbox 
                checked={selectedRows.length === filteredData.length}
                onChange={selectedRows.length === filteredData.length ? handleDeselectAll : handleSelectAll}
              />
            </Table.HeadCell>
            {['Instituciones', 'Tipo', 'Ciudad', 'Facebook', 'Twitter', 'Instagram', 'Videos2', 'Visitas2', 'Suscrip.'].map((column) => (
              <Table.HeadCell key={column} onClick={() => handleSort(column)} className="cursor-pointer">
                <div className="flex items-center">
                  {column}
                  <SortIcon column={column} />
                </div>
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData.map((item) => (
              <Table.Row 
                key={item.Instituciones} 
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                onClick={() => onInstitutionSelect(item)}
              >
                <Table.Cell className="w-4">
                  <Checkbox 
                    checked={selectedRows.includes(item)}
                    onChange={() => handleRowSelect(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Table.Cell>
                <Table.Cell className="max-w-xs break-words font-medium text-gray-900 dark:text-white">
                  {item.Instituciones}
                </Table.Cell>
                <Table.Cell>{item.Tipo}</Table.Cell>
                <Table.Cell>{item.Ciudad}</Table.Cell>
                <Table.Cell>{item.Facebook}</Table.Cell>
                <Table.Cell>{item.Twitter}</Table.Cell>
                <Table.Cell>{item.Instagram}</Table.Cell>
                <Table.Cell>{item.Videos2}</Table.Cell>
                <Table.Cell>{item.Visitas2}</Table.Cell>
                <Table.Cell>{item['Suscrip.']}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      {showComparison && <ComparisonView />}
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
        <Title className="mb-4 text-xl text-center">Datos de {institution.Instituciones}</Title>
        <Grid numColsLg={2} className="gap-4">
          <div>
            <Text className='text-xl text-center'><strong>Ciudad:</strong> {institution.Ciudad || 'N/A'}</Text>
            <Text className='text-xl text-center'><strong>Tipo:</strong> {institution.Tipo || 'Sin clasificar'}</Text>
          </div>
          <div>
            <Text className='text-xl text-center'><strong>Facebook:</strong> {institution.Facebook || 0} seguidores</Text>
            <Text className='text-xl text-center'><strong>Twitter:</strong> {institution.Twitter || 0} seguidores</Text>
            <Text className='text-xl text-center'><strong>Instagram:</strong> {institution.Instagram || 0} seguidores</Text>
          </div>
        </Grid>
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
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setFilteredData(socialStatsData.data);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = socialStatsData.data.filter(item =>
      item.Instituciones.toLowerCase().includes(term) ||
      (item.Ciudad && item.Ciudad.toLowerCase().includes(term)) ||
      (item.Tipo && item.Tipo.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
            onChange={handleSearch}
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