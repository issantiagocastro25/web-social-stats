import React, { useState, useEffect } from 'react';
import { Spinner, TextInput, Card, Select } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid, Col } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';
import ImageNavbar from './ImageNavBar';
import SummaryCards from './SummaryCards';
import InteractiveDataTable from './InteractiveDataTable';
import ChartsSection from './ChartsSection';
import TemporalAnalysisTable from './TemporalAnalysisTable';
import GroupSummaryTable from './GroupSummaryTable';

const SocialStatsDashboard = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2021');
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState(false);
  const [totalStats, setTotalStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const date = selectedYear === '2021' ? '2021-06-01' : '2020-12-01';
        const response = await fetchSocialStats({ 
          category: activeCategory,
          date: date
        });
        if (response && Array.isArray(response.metrics)) {
          setAllData(response.metrics);
          setFilteredData(response.metrics);
          if (activeCategory === 'todos') {
            setTotalStats(calculateTotalStats(response.metrics));
          }
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


  const calculateTotalStats = (data) => {
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
    setSelectedInstitutions([]);
    if (category === 'todos') {
      setTotalStats(calculateTotalStats(allData));
    } else {
      const filteredData = allData.filter(item => item.Tipo === category);
      setFilteredData(filteredData);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
  };

  const handleInstitutionsSelect = (institutions) => {
    setSelectedInstitutions(institutions);
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

  const handleTemporalAnalysis = () => {
    setShowTemporalAnalysis(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        
        <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        
        {!isLoading && filteredData.length > 0 && (
          <SummaryCards groupData={filteredData} selectedData={selectedInstitutions} allData={allData} totalStats={totalStats} />
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
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </Select>
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
          <>
            {activeCategory === 'todos' && (
              <GroupSummaryTable allData={allData} />
            )}
            <Card>
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                selectedType={activeCategory}
                selectedYear={selectedYear}
                onInstitutionsSelect={handleInstitutionsSelect}
                selectedInstitution={selectedInstitution}
                onTemporalAnalysis={handleTemporalAnalysis}
              />
            </Card>
            
            {showTemporalAnalysis && selectedInstitutions.length > 0 && (
              <TemporalAnalysisTable selectedInstitutions={selectedInstitutions} />
            )}
            
            <ChartsSection 
              selectedInstitution={selectedInstitution}
              selectedInstitutions={selectedInstitutions}
            />
          </>
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