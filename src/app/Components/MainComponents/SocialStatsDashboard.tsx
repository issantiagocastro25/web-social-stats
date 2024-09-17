import React, { useState, useEffect, useCallback } from 'react';
import { Card, Select, Button, TextInput } from 'flowbite-react';
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
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstitutions, setSelectedInstitutions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2021-06-01');
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState<boolean>(false);
  const [temporalData, setTemporalData] = useState<any[]>([]);
  const [isLoadingTemporal, setIsLoadingTemporal] = useState<boolean>(false);
  const [temporalProgress, setTemporalProgress] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summaryCardsData, setSummaryCardsData] = useState<any>(null);
  const [showGroupTemporalAnalysis, setShowGroupTemporalAnalysis] = useState<boolean>(false);

  const loadCategories = useCallback(async () => {
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
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchSocialStats({ 
        category: activeCategory.toLowerCase(), 
        date: selectedDate
      });
      
      if (response && response.data && Array.isArray(response.data.metrics)) {
        setData(response.data.metrics);
        setFilteredData(response.data.metrics);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }

      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'Todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
    }
  }, [loadData, categories, activeCategory, selectedDate]);

  const handleCategorySelect = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      setSelectedInstitutions([]);
      setShowTemporalAnalysis(false);
      setTemporalData([]);
      setShowGroupTemporalAnalysis(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    setShowTemporalAnalysis(false);
    setTemporalData([]);
    setShowGroupTemporalAnalysis(false);
  };

  const handleInstitutionSelect = useCallback((institutions: any[]) => {
    setSelectedInstitutions(institutions);
    setShowTemporalAnalysis(false);
    setTemporalData([]);
  }, []);

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
    if (selectedInstitutions.length === 0) return;

    setIsLoadingTemporal(true);
    setShowTemporalAnalysis(true);
    setTemporalProgress(0);
    try {
      const institutionNames = selectedInstitutions.map(inst => inst.Institucion);
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

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Dashboard de Estadísticas Sociales
        </h1>

        <Select 
          className='w-64 mb-6' 
          value={selectedDate} 
          onChange={handleDateChange}
        >
          {AVAILABLE_DATES.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </Select>

        {isLoading ? renderSkeleton() : (
          <>
            {categories.length > 0 && (
              <ImageNavbar 
                onCategorySelect={handleCategorySelect} 
                activeCategory={activeCategory} 
                categories={categories} 
              />
            )}

            <SummaryCards 
              data={summaryCardsData} 
              isAllCategory={activeCategory === 'Todos'} 
              isLoading={isLoading}
            />

            {activeCategory === 'Todos' && summaryCardsData && (
              <Card className="mb-6">
                <GroupSummaryTable 
                  summaryCardsData={summaryCardsData} 
                  onTemporalAnalysis={handleGroupTemporalAnalysis}
                  isLoading={isLoading}
                />
              </Card>
            )}

            <div className="mb-6 flex space-x-4 items-center">
              <TextInput
                icon={FaSearch}
                type="text"
                placeholder="Buscar por institución, ciudad o tipo..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button 
                color="success" 
                onClick={handleTemporalAnalysis}
                disabled={isLoadingTemporal || selectedInstitutions.length === 0}
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

            <Card>
              <h2 className="text-2xl font-bold mb-4">Datos para la categoría: {activeCategory}</h2>
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                selectedType={activeCategory}
                selectedDate={selectedDate}
                selectedInstitutions={selectedInstitutions}
                isLoading={isLoading}
              />
            </Card>

            {selectedInstitutions.length === 1 && (
              <Card className="mt-6">
                <InstitutionStats 
                  institution={selectedInstitutions[0]}
                  isLoading={isLoading}
                />
              </Card>
            )}

            {selectedInstitutions.length > 1 && (
              <Grid numColsLg={2} className="gap-6 mt-6">
                <ComparisonCharts 
                  selectedInstitutions={selectedInstitutions}
                  isLoading={isLoading}
                />
                <ComparisonTable 
                  selectedInstitutions={selectedInstitutions}
                  isLoading={isLoading}
                />
              </Grid>
            )}

{showTemporalAnalysis && temporalData.length > 0 && (
        <TemporalAnalysisTable 
          selectedInstitutions={selectedInstitutions}
          temporalData={temporalData}
          availableDates={AVAILABLE_DATES}
          isLoading={isLoadingTemporal}
        />
      )}

      {showGroupTemporalAnalysis && (
        <GroupTemporalAnalysisTable 
          temporalData={temporalData}
          availableDates={AVAILABLE_DATES}
          onClose={() => setShowGroupTemporalAnalysis(false)}
          isLoading={isLoadingTemporal}
        />
      )}

          </>
        )}

        {error && (
          <div className="text-center text-red-500 mt-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialStatsDashboard;