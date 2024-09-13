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
import ProgressBar from './ProgressBar';

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
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingSummaryCards, setIsLoadingSummaryCards] = useState(true);
  const [isLoadingDataTable, setIsLoadingDataTable] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2021-06-01');
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState(false);
  const [temporalData, setTemporalData] = useState([]);
  const [isLoadingTemporal, setIsLoadingTemporal] = useState(false);
  const [temporalProgress, setTemporalProgress] = useState(0);
  const [summaryCardsData, setSummaryCardsData] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGroupTemporalAnalysis, setShowGroupTemporalAnalysis] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const fetchedCategories = await fetchCategories();
      const allCategory: Category = {
        id: 0,
        name: 'Todos',
        institution_count: fetchedCategories.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
        url: '/path/to/all-category-image.jpg',
        ordering: -1
      };
      setCategories([allCategory, ...fetchedCategories]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las categorías');
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadData = useCallback(async () => {
    setIsLoadingDataTable(true);
    setIsLoadingSummaryCards(true);
    setError(null);
    try {
      console.log('Fetching data for category:', activeCategory);
      const response = await fetchSocialStats({ 
        category: activeCategory.toLowerCase(), 
        date: selectedDate, 
        page: currentPage 
      });
      
      console.log('API response:', response);

      if (response && response.data && Array.isArray(response.data.metrics)) {
        setData(response.data.metrics);
        setFilteredData(response.data.metrics);
        setTotalPages(response.total_pages || 1);
        console.log('Data loaded successfully:', response.data.metrics);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
      
      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'Todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Ocurrió un error al cargar los datos');
    } finally {
      setIsLoadingDataTable(false);
      setIsLoadingSummaryCards(false);
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

  const handleCategorySelect = (categoryName: string) => {
    console.log('Category selected:', categoryName);
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      setSelectedInstitution(null);
      setSelectedInstitutions([]);
      setCurrentPage(1);
      loadData();
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

  const handleTemporalAnalysis = async () => {
    setIsLoadingTemporal(true);
    setShowTemporalAnalysis(true);
    setTemporalProgress(0);
    try {
      const institutionsToAnalyze = selectedInstitutions.length > 0 
        ? selectedInstitutions 
        : selectedInstitution ? [selectedInstitution] : [];

      if (institutionsToAnalyze.length === 0) {
        throw new Error('Por favor, seleccione al menos una institución para el análisis temporal.');
      }

      const institutionNames = institutionsToAnalyze.map(inst => inst.Institucion);
      const totalSteps = AVAILABLE_DATES.length;

      const temporalDataResult = await Promise.all(
        AVAILABLE_DATES.map(async (date, index) => {
          const result = await fetchTemporalData(institutionNames, [date]);
          setTemporalProgress(((index + 1) / totalSteps) * 100);
          return result;
        })
      );

      setTemporalData(temporalDataResult.flat());
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al obtener los datos temporales');
    } finally {
      setIsLoadingTemporal(false);
      setTemporalProgress(0);
    }
  };

  const handleGroupTemporalAnalysis = async () => {
    setIsLoadingTemporal(true);
    setShowGroupTemporalAnalysis(true);
    setTemporalProgress(0);
    try {
      const totalSteps = AVAILABLE_DATES.length;
      const temporalDataResult = await Promise.all(
        AVAILABLE_DATES.map(async (date, index) => {
          const result = await fetchTemporalData(['Todos'], [date]);
          setTemporalProgress(((index + 1) / totalSteps) * 100);
          return result;
        })
      );
      setTemporalData(temporalDataResult.flat());
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos temporales de grupo');
    } finally {
      setIsLoadingTemporal(false);
      setTemporalProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        <Select 
          className='pb-5 w-56' 
          value={selectedDate} 
          onChange={handleDateChange}
          disabled={isLoadingDataTable || isLoadingSummaryCards}
        >
          {AVAILABLE_DATES.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </Select>
        {isLoadingCategories ? (
          <div className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
          </div>
        ) : (
          categories.length > 0 && (
            <ImageNavbar 
              onCategorySelect={handleCategorySelect} 
              activeCategory={activeCategory} 
              categories={categories} 
            />
          )
        )}

        <SummaryCards 
          data={summaryCardsData} 
          isAllCategory={activeCategory === 'Todos'} 
          isLoading={isLoadingSummaryCards}
        />

        {activeCategory === 'Todos' && summaryCardsData && (
          <Card className="mb-6">
            <GroupSummaryTable 
              summaryCardsData={summaryCardsData} 
              onTemporalAnalysis={handleGroupTemporalAnalysis}
              isLoading={isLoadingSummaryCards}
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
            onClick={handleTemporalAnalysis}
            disabled={isLoadingTemporal || (selectedInstitutions.length === 0 && !selectedInstitution)}
          >
            {isLoadingTemporal ? 'Analizando...' : 'Análisis Temporal'}
          </Button>
        </div>

        {isLoadingTemporal && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Analizando datos temporales...</h2>
            <ProgressBar progress={temporalProgress} />
          </Card>
        )}

        {isLoadingDataTable ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
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
                isLoading={isLoadingDataTable}
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