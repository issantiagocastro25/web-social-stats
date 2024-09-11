import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Card, Select, Button, Pagination } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid } from '@tremor/react';
import { fetchSocialStats, fetchTemporalData, fetchSummaryCardsData, fetchCategories } from '@/api/list/listData';
import ImageNavbar from './ImageNavBar';
import SummaryCards from './SummaryCards';
import InteractiveDataTable from './InteractiveDataTable';
import InstitutionStats from './InstitutionStats';
import ComparisonCharts from './ComparisonCharts';
import ComparisonTable from './ComparisonTable';
import TemporalAnalysisTable from './TemporalAnalysisTable';
import GroupSummaryTable from './GroupSummaryTable';
import GroupTemporalAnalysisTable from './GroupTemporalAnalysisTable';

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
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2021-06-01');
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState(false);
  const [temporalData, setTemporalData] = useState([]);
  const [isLoadingTemporal, setIsLoadingTemporal] = useState(false);
  const [summaryCardsData, setSummaryCardsData] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGroupTemporalAnalysis, setShowGroupTemporalAnalysis] = useState(false);
  const [showGroupSummaryTable, setShowGroupSummaryTable] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
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
      const response = await fetchSocialStats({ 
        category: activeCategory, 
        date: selectedDate, 
        page: currentPage 
      });
      
      if (response && response.data && Array.isArray(response.data.metrics)) {
        setData(response.data.metrics);
        setFilteredData(response.data.metrics);
        setTotalPages(response.total_pages || 1);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
      
      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Ocurrió un error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate, currentPage]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
    }
  }, [loadData, categories, activeCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (categoryName: string, isAllCategory: boolean) => {
    setActiveCategory(categoryName.toLowerCase());
    setActiveCategoryId(isAllCategory ? null : categories.find(cat => cat.name === categoryName)?.id || null);
    setSelectedInstitution(null);
    setSelectedInstitutions([]);
    setCurrentPage(1);
    setShowGroupSummaryTable(isAllCategory);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((item: any) =>
      item.Institucion.toLowerCase().includes(term) ||
      (item.Ciudad && item.Ciudad.toLowerCase().includes(term)) ||
      (item.Tipo && item.Tipo.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  };

  const handleTemporalAnalysis = async (institutions: any[] = []) => {
    setIsLoadingTemporal(true);
    setShowTemporalAnalysis(true);
    try {
      const institutionsToAnalyze = institutions.length > 0 
        ? institutions 
        : selectedInstitutions.length > 0 
          ? selectedInstitutions 
          : selectedInstitution ? [selectedInstitution] : [];

      if (institutionsToAnalyze.length === 0) {
        throw new Error('Por favor, seleccione al menos una institución para el análisis temporal.');
      }

      const institutionNames = institutionsToAnalyze.map(inst => inst.Institucion);
      const temporalDataResult = await fetchTemporalData(institutionNames, AVAILABLE_DATES);
      setTemporalData(temporalDataResult);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al obtener los datos temporales');
    } finally {
      setIsLoadingTemporal(false);
    }
  };

  const handleGroupTemporalAnalysis = async () => {
    setIsLoadingTemporal(true);
    setShowGroupTemporalAnalysis(true);
    try {
      const allCategories = ['todos', ...categories.map(cat => cat.name.toLowerCase())];
      const temporalDataResult = await Promise.all(
        allCategories.map(async (category) => {
          const categoryData = await fetchTemporalData([category], AVAILABLE_DATES);
          return { category, data: categoryData };
        })
      );
      setTemporalData(temporalDataResult);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos temporales de grupo');
    } finally {
      setIsLoadingTemporal(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        <Select className='pb-5 w-56' value={selectedDate} onChange={handleDateChange}>
          {AVAILABLE_DATES.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </Select>
        {categories.length > 0 && (
          <ImageNavbar 
            onCategorySelect={handleCategorySelect} 
            activeCategory={activeCategory} 
            categories={categories} 
          />
        )}

        <SummaryCards 
          data={summaryCardsData} 
          isAllCategory={activeCategory === 'todos'}
          selectedInstitutions={selectedInstitutions}
        />

        {activeCategory === 'todos' && summaryCardsData && (
          <Card className="mb-6">
            <GroupSummaryTable 
              summaryCardsData={summaryCardsData} 
              // Removemos la prop onTemporalAnalysis
            />
          </Card>
        )}

        <div className="mb-6 flex space-x-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Buscar por institución, ciudad o tipo..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Button 
            color="success" 
            onClick={() => handleTemporalAnalysis()}
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
              <h2 className="text-xl font-bold mb-4">Datos para la categoría: {activeCategory}</h2>
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                selectedType={activeCategory}
                selectedDate={selectedDate}
                onInstitutionsSelect={handleInstitutionsSelect}
                selectedInstitution={selectedInstitution}
                onTemporalAnalysis={handleTemporalAnalysis}
              />
            </Card>
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showIcons={true}
              />
            </div>

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
              <TemporalAnalysisTable 
                selectedInstitutions={selectedInstitutions.length > 0 ? selectedInstitutions : [selectedInstitution]}
                temporalData={temporalData}
                availableDates={AVAILABLE_DATES}
              />
            )}

            {showGroupTemporalAnalysis && (
              <GroupTemporalAnalysisTable 
                temporalData={temporalData}
                availableDates={AVAILABLE_DATES}
                onClose={() => setShowGroupTemporalAnalysis(false)}
              />
            )}
          </>
        ) : (
          <Card>
            <p className="text-center">No se encontraron datos para la categoría: {activeCategory}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialStatsDashboard;