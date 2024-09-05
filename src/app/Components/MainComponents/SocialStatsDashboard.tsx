import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, TextInput, Card, Select, Button, Progress } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid } from '@tremor/react';
import { fetchSocialStats, fetchTemporalData, fetchSummaryCardsData, fetchCategories } from '@/api/list/listData';
import NavbarComponent from '@/app/Components/MainComponents/navBar';
import ImageNavbar from './ImageNavBar';
import SummaryCards from './SummaryCards';
import InteractiveDataTable from './InteractiveDataTable';
import InstitutionStats from './InstitutionStats';
import ComparisonCharts from './ComparisonCharts';
import ComparisonTable from './ComparisonTable';
import AnnualGrowthChart from './AnnualGrowthChart';
import TemporalAnalysisTable from './TemporalAnalysisTable';
import GroupSummaryTable from './GroupSummaryTable';

const AVAILABLE_DATES = [
  '2021-06-01', '2020-12-01', '2019-12-01', '2019-06-01', 
  '2018-12-01', '2017-12-01', '2016-12-01'
];

interface Category {
  id: number;
  name: string;
  institution_count: number | null;
  url: string;
  ordering: number;
}

const SocialStatsDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2021-06-01');
  const [selectedInstitutions, setSelectedInstitutions] = useState<any[]>([]);
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState<boolean>(false);
  const [temporalData, setTemporalData] = useState<any[]>([]);
  const [isLoadingTemporal, setIsLoadingTemporal] = useState<boolean>(false);
  const [summaryCardsData, setSummaryCardsData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const loadCategories = useCallback(async () => {
    try {
      const fetchedCategories = await fetchCategories();
      const allCategory: Category = {
        id: 0,
        name: 'Todos',
        institution_count: fetchedCategories.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
        url: '/path/to/all-category-image.jpg', // Replace with an appropriate image URL
        ordering: -1
      };
      setCategories([allCategory, ...fetchedCategories]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las categorías');
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let socialStatsResponse;
      let summaryCardsResponse;

      if (activeCategory === 'Todos') {
        // Fetch general stats for 'Todos'
        socialStatsResponse = await fetch(`${API_URL}/api/social-metrics/stats?stats_date=${selectedDate}`);
        summaryCardsResponse = await socialStatsResponse.json();
      } else {
        // Fetch category-specific data
        socialStatsResponse = await fetchSocialStats({ category: activeCategory, date: selectedDate });
        summaryCardsResponse = await fetchSummaryCardsData(activeCategoryId, selectedDate);
      }

      if (activeCategory === 'Todos') {
        setData(summaryCardsResponse);
        setFilteredData(summaryCardsResponse);
      } else {
        setData(socialStatsResponse.metrics);
        setFilteredData(socialStatsResponse.metrics);
      }
      
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
    }
  }, [loadData, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
    }
  }, [loadData, categories]);

  const handleCategorySelect = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      setSelectedInstitution(null);
      setSelectedInstitutions([]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleInstitutionSelect = (institution: any) => {
    setSelectedInstitution(institution);
    setSelectedInstitutions([]);
  };

  const handleInstitutionsSelect = (institutions: any[]) => {
    setSelectedInstitutions(institutions);
    setSelectedInstitution(null);
  };

  const handleTemporalAnalysis = useCallback(async () => {
    const institutionsToAnalyze = selectedInstitutions.length > 0 
      ? selectedInstitutions 
      : selectedInstitution ? [selectedInstitution] : [];

    if (institutionsToAnalyze.length === 0) {
      setError('Por favor, seleccione al menos una institución para el análisis temporal.');
      return;
    }

    setIsLoadingTemporal(true);
    setShowTemporalAnalysis(true);

    try {
      const institutionNames = institutionsToAnalyze.map(inst => inst.Institucion);
      const temporalDataResult = await fetchTemporalData(institutionNames, AVAILABLE_DATES);
      setTemporalData(temporalDataResult);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al obtener los datos temporales');
    } finally {
      setIsLoadingTemporal(false);
    }
  }, [selectedInstitutions, selectedInstitution]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>

        {categories.length > 0 && (
          <ImageNavbar 
            onCategorySelect={handleCategorySelect} 
            activeCategory={activeCategory} 
            categories={categories} 
          />
        )}

        {!isLoading && summaryCardsData && (
          <SummaryCards data={summaryCardsData} />
        )}

        {activeCategory === 'Todos' && summaryCardsData && (
          <GroupSummaryTable summaryCardsData={summaryCardsData} />
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
          <Button 
            color="success" 
            onClick={handleTemporalAnalysis}
            disabled={isLoadingTemporal || (selectedInstitutions.length === 0 && !selectedInstitution)}
          >
            {isLoadingTemporal ? 'Cargando...' : 'Análisis Temporal'}
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
        ) : filteredData && filteredData.length > 0 ? (
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
              <Grid numColsLg={2} className="gap-6 mt-6">
                <ComparisonCharts selectedInstitutions={selectedInstitutions} />
                <ComparisonTable selectedInstitutions={selectedInstitutions} />
              </Grid>
            )}

            {showTemporalAnalysis && (
              isLoadingTemporal ? (
                <div className="mt-4">
                  <Progress progress={100} color="blue" />
                  <p className="text-center mt-2">Cargando datos temporales...</p>
                </div>
              ) : temporalData.length > 0 ? (
                <>
                  <TemporalAnalysisTable 
                    selectedInstitutions={selectedInstitutions.length > 0 ? selectedInstitutions : [selectedInstitution]}
                    temporalData={temporalData}
                    availableDates={AVAILABLE_DATES}
                  />
                  <AnnualGrowthChart data={temporalData} />
                </>
              ) : (
                <Card>
                  <p className="text-center">No hay datos temporales disponibles.</p>
                </Card>
              )
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
