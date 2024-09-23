import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Select, Button, TextInput } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid } from '@tremor/react';
import { fetchSocialStats, fetchTemporalData, fetchSummaryCardsData, fetchCategories, fetchUniqueFollowers } from '@/api/list/listData';
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
import PopulationCard from './PopulationCard';

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

type SectionType = 'salud' | 'compensacion' | 'hospitales';

const SocialStatsDashboard: React.FC = () => {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState<SectionType>('salud');
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
  const [uniqueFollowers, setUniqueFollowers] = useState<any>(null);
  const [populationData, setPopulationData] = useState({
    population: 0,
    uniqueFollowers: 0,
    penetrationRate: 0,
  });

  const loadCategories = useCallback(async (section: SectionType) => {
    try {
      const apiCategory = section === 'hospitales' ? 'latinoamerica' : section;
      const fetchedCategories = await fetchCategories(apiCategory);
      
      const allCategory: Category = {
        id: 0,
        name: 'Todos',
        institution_count: fetchedCategories.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
        url: 'https://cdn-icons-png.flaticon.com/512/4320/4320350.png',
        ordering: -1
      };
      setCategories([allCategory, ...fetchedCategories]);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Error al cargar las categorías');
    }
  }, []);

  const loadData = useCallback(async (section: SectionType, category: string, categoryId: number | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiCategory = section === 'hospitales' ? 'latinoamerica' : section;
      const apiType = category === 'Todos' ? 'todos' : category.toLowerCase();
      
      console.log('Loading data for:', { section, category, categoryId, date: selectedDate });

      const [socialStatsResponse, summaryCardsResponse, uniqueFollowersResponse] = await Promise.all([
        fetchSocialStats({ 
          category: apiCategory,
          type: apiType,
          date: selectedDate
        }),
        fetchSummaryCardsData(
          category === 'Todos' ? null : categoryId, 
          selectedDate,
          apiCategory
        ),
        fetchUniqueFollowers({
          category: apiCategory,
          date: selectedDate
        })
      ]);
      
      if (socialStatsResponse && socialStatsResponse.data && Array.isArray(socialStatsResponse.data.metrics)) {
        console.log('Data loaded successfully:', socialStatsResponse.data.metrics.length, 'items');
        setData(socialStatsResponse.data.metrics);
        setFilteredData(socialStatsResponse.data.metrics);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }

      setSummaryCardsData(summaryCardsResponse);
      
      if (uniqueFollowersResponse && uniqueFollowersResponse.unique_followers) {
        setUniqueFollowers(uniqueFollowersResponse.unique_followers);
        setPopulationData({
          population: uniqueFollowersResponse.population || 0,
          uniqueFollowers: uniqueFollowersResponse.unique_followers.total || 0,
          penetrationRate: uniqueFollowersResponse.penetration_rate || 0,
        });
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Ocurrió un error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const handleCategorySelect = useCallback((categoryName: string) => {
    console.log('Category selected:', categoryName);
    if (currentSection !== 'hospitales') {
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        setActiveCategory(category.name);
        setActiveCategoryId(category.id);
        setSelectedInstitutions([]);
        setShowTemporalAnalysis(false);
        setTemporalData([]);
        setShowGroupTemporalAnalysis(false);
        loadData(currentSection, category.name, category.id);
      }
    }
  }, [currentSection, categories, loadData]);

  useEffect(() => {
    const section = pathname?.split('/')[1] as SectionType;
    if (['salud', 'compensacion', 'hospitales'].includes(section)) {
      console.log('URL changed, new section:', section);
      setCurrentSection(section);
      setActiveCategory('Todos');
      setActiveCategoryId(null);
      loadCategories(section);
      loadData(section, 'Todos', null);
    }
  }, [pathname, loadCategories, loadData]);


  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    loadData(currentSection);
  }, [currentSection, loadData]);

  const handleInstitutionSelect = useCallback((institutions: any[]) => {
    setSelectedInstitutions(institutions);
    setShowTemporalAnalysis(false);
    setTemporalData([]);
    setShowGroupTemporalAnalysis(false);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedInstitutions([]);
    setShowTemporalAnalysis(false);
    setTemporalData([]);
    setShowGroupTemporalAnalysis(false);
  }, []);

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
          const result = await fetchTemporalData(institutionNames, [date], currentSection === 'hospitales' ? 'latinoamerica' : currentSection);
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
          const result = await fetchTemporalData(['Todos'], [date], currentSection === 'hospitales' ? 'latinoamerica' : currentSection);
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

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((item: any) =>
      item.Institucion.toLowerCase().includes(term) ||
      (item.Ciudad && item.Ciudad.toLowerCase().includes(term)) ||
      (item.Tipo && item.Tipo.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
  }, [data]);

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  const showCategories = useMemo(() => currentSection !== 'hospitales' && categories.length > 0, [currentSection, categories]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          {currentSection === 'salud' ? 'Salud Colombia' : 
           currentSection === 'compensacion' ? 'Compensación' : 
           'Hospitales Latinoamérica'}
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

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
             {showCategories && (
          <ImageNavbar 
            onCategorySelect={handleCategorySelect} 
            activeCategory={activeCategory} 
            categories={categories}
            currentSection={currentSection}
          />
        )}

            <PopulationCard 
              selectedDate={selectedDate}
              population={populationData.population}
              uniqueFollowers={populationData.uniqueFollowers}
              penetrationRate={populationData.penetrationRate}
            />

            <SummaryCards 
              data={summaryCardsData} 
              uniqueFollowers={uniqueFollowers}
              isAllCategory={activeCategory === 'Todos' || currentSection === 'hospitales'} 
              isLoading={isLoading}
            />

            {(activeCategory === 'Todos' || currentSection === 'hospitales') && summaryCardsData && (
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
              <h2 className="text-2xl font-bold mb-4">
                {currentSection === 'hospitales' 
                  ? 'Hospitales de Latinoamérica' 
                  : `Datos para la categoría: ${activeCategory}`}
              </h2>
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                onClearSelection={handleClearSelection}
                selectedType={currentSection === 'hospitales' ? 'Hospitales' : activeCategory}
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