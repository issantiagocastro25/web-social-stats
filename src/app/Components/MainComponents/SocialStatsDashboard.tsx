import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, TextInput, Card, Select, Button } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { fetchSocialStats, fetchTemporalData } from '@/api/list/listData';
import NavbarComponent from '@/app/Components/MainComponents/navBar';
import ImageNavbar from './ImageNavBar';
import SummaryCards from './SummaryCards';
import InteractiveDataTable from './InteractiveDataTable';
import InstitutionStats from './InstitutionStats';
import ComparisonCharts from './ComparisonCharts';
import ComparisonTable from './ComparisonTable';
import AnnualGrowthChart from './AnnualGrowthChart';
import TemporalAnalysisTable from './TemporalAnalysisTable';

const AVAILABLE_DATES = [
  '2021-06-01', '2020-12-01', '2019-12-01', '2019-06-01', 
  '2018-12-01', '2017-12-01', '2016-12-01'
];

const SocialStatsDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2021-06-01');
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState(false);
  const [temporalData, setTemporalData] = useState([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchSocialStats({ 
        category: activeCategory, 
        date: selectedDate 
      });
      setData(response.metrics);
      setFilteredData(response.metrics);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedInstitution(null);
    setSelectedInstitutions([]);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
    setSelectedInstitutions([]);
  };

  const handleInstitutionsSelect = (institutions) => {
    setSelectedInstitutions(institutions);
    setSelectedInstitution(null);
  };

  const handleTemporalAnalysis = async () => {
    const newShowTemporalAnalysis = !showTemporalAnalysis;
    setShowTemporalAnalysis(newShowTemporalAnalysis);
    
    if (newShowTemporalAnalysis && (selectedInstitutions.length > 0 || selectedInstitution)) {
      setIsLoading(true);
      try {
        const institutionsToFetch = selectedInstitutions.length > 0 
          ? selectedInstitutions.map(inst => inst.Institucion)
          : [selectedInstitution.Institucion];

        const temporalDataResult = await fetchTemporalData(institutionsToFetch, AVAILABLE_DATES);
        setTemporalData(temporalDataResult);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching temporal data');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(item =>
      item.Institucion.toLowerCase().includes(term) ||
      (item.Ciudad && item.Ciudad.toLowerCase().includes(term)) ||
      (item.Tipo && item.Tipo.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>

        <ImageNavbar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />

        {!isLoading && filteredData.length > 0 && (
          <SummaryCards groupData={filteredData} selectedData={selectedInstitutions} allData={data} />
        )}

        <div className="mb-6 flex space-x-4 items-center">
          <TextInput
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            icon={FaSearch}
          />
          <Select value={selectedDate} onChange={handleDateChange}>
            {AVAILABLE_DATES.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </Select>
          <Button color="success" onClick={handleTemporalAnalysis}>
            {showTemporalAnalysis ? 'Ocultar Análisis Temporal' : 'Mostrar Análisis Temporal'}
          </Button>
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
              onClick={loadData}
            >
              Intentar de nuevo
            </button>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <Card>
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                selectedType={activeCategory}
                selectedDate={selectedDate}
                onInstitutionsSelect={handleInstitutionsSelect}
                selectedInstitution={selectedInstitution}
              />
            </Card>

            {selectedInstitution && (
              <InstitutionStats institution={selectedInstitution} />
            )}

            {selectedInstitutions.length > 1 && (
              <>
                <ComparisonCharts selectedInstitutions={selectedInstitutions} />
                <ComparisonTable selectedInstitutions={selectedInstitutions} />
              </>
            )}

            {showTemporalAnalysis && temporalData.length > 0 && (
              <>
                <TemporalAnalysisTable 
                  selectedInstitutions={selectedInstitutions.length > 0 ? selectedInstitutions : [selectedInstitution]}
                  temporalData={temporalData}
                  availableDates={AVAILABLE_DATES}
                />
                <AnnualGrowthChart data={temporalData} />
              </>
            )}
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