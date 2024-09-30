import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, Select, Button, TextInput, Alert } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid } from '@tremor/react';
import { 
  fetchSocialStats, 
  fetchTemporalData, 
  fetchCategories, 
  fetchSummaryAndUniqueFollowers, 
  fetchAvailableDates 
} from '@/api/list/listData';
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

interface Category {
  id: number;
  name: string;
  institution_count: number;
  url: string;
  ordering: number;
  category: string;
  date_collection: string;
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
  const [errors, setErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstitutions, setSelectedInstitutions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
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
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const initialDataLoaded = useRef(false);

  const addError = useCallback((error: string) => {
    setErrors(prevErrors => [...prevErrors, error]);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const loadCategories = useCallback(async (section: SectionType, date: string) => {
    setIsLoadingCategories(true);
    clearErrors();
    try {
      const apiCategory = section === 'hospitales' ? 'latinoamerica' : section;
      const fetchedCategories = await fetchCategories(apiCategory, date);
      
      const allCategory: Category = {
        id: 0,
        name: 'Todos',
        institution_count: fetchedCategories.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
        url: 'https://cdn-icons-png.flaticon.com/512/4320/4320350.png',
        ordering: -1,
        category: apiCategory,
        date_collection: date
      };
      setCategories([allCategory, ...fetchedCategories]);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      addError(`Error al cargar las categorías: ${err.message}`);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [addError, clearErrors]);

  const loadData = useCallback(async (section: SectionType, category: string, categoryId: number | null, date: string) => {
    setIsLoading(true);
    clearErrors();
    try {
      const apiCategory = section === 'hospitales' ? 'latinoamerica' : section;
      const apiType = category === 'Todos' ? 'todos' : category.toLowerCase();
      
      console.log('Loading data for:', { section, category, categoryId, date });
      
      const [socialStatsResponse, summaryAndUniqueFollowersResponse] = await Promise.all([
        fetchSocialStats({ 
          category: apiCategory,
          type: apiType,
          date: date
        }),
        fetchSummaryAndUniqueFollowers({
          category: apiCategory,
          institutionId: category === 'Todos' ? null : categoryId,
          date: date
        })
      ]);
      
      if (socialStatsResponse && socialStatsResponse.data && Array.isArray(socialStatsResponse.data.metrics)) {
        setData(socialStatsResponse.data.metrics);
        setFilteredData(socialStatsResponse.data.metrics);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }

      setSummaryCardsData(summaryAndUniqueFollowersResponse);
      setUniqueFollowers(summaryAndUniqueFollowersResponse.unique_followers);
      setPopulationData({
        population: summaryAndUniqueFollowersResponse.population || 0,
        uniqueFollowers: summaryAndUniqueFollowersResponse.unique_followers?.total || 0,
        penetrationRate: summaryAndUniqueFollowersResponse.penetration_rate || 0,
      });
    } catch (err: any) {
      console.error('Error loading data:', err);
      addError(`Error al cargar los datos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [addError, clearErrors]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await fetchAvailableDates();
        console.log('Fechas recibidas del backend:', dates);
        
        const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        console.log('Fechas ordenadas:', sortedDates);
        
        setAvailableDates(sortedDates);
        if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]);
        }
      } catch (error) {
        console.error('Error fetching available dates:', error);
        addError('Error al cargar las fechas disponibles');
      }
    };

    fetchDates();
  }, [addError]);

  useEffect(() => {
    if (selectedDate && currentSection) {
      loadCategories(currentSection, selectedDate);
      loadData(currentSection, 'Todos', null, selectedDate);
    }
  }, [selectedDate, currentSection, loadCategories, loadData]);

  useEffect(() => {
    const newSection = pathname ? pathname.split('/')[1] as SectionType : 'salud';
    if (['salud', 'compensacion', 'hospitales'].includes(newSection) && selectedDate && !initialDataLoaded.current) {
      setCurrentSection(newSection);
      loadCategories(newSection, selectedDate);
      loadData(newSection, 'Todos', null, selectedDate);
      initialDataLoaded.current = true;
    }
  }, [pathname, loadCategories, loadData, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadCategories(currentSection, newDate);
    loadData(currentSection, activeCategory, activeCategoryId, newDate);
  };

  const handleCategorySelect = useCallback((categoryName: string) => {
    if (currentSection !== 'hospitales') {
      console.log('Category selected:', categoryName);
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        setActiveCategory(category.name);
        setActiveCategoryId(category.id);
        setSelectedInstitutions([]);
        setShowTemporalAnalysis(false);
        setTemporalData([]);
        setShowGroupTemporalAnalysis(false);
        loadData(currentSection, category.name, category.id, selectedDate);
      }
    }
  }, [currentSection, categories, loadData, selectedDate]);

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
    clearErrors();
    try {
      const institutionNames = selectedInstitutions.map(inst => inst.Institucion);
      const totalSteps = availableDates.length;

      const temporalDataResult = await Promise.all(
        availableDates.map(async (date, index) => {
          const result = await fetchTemporalData(institutionNames, [date], currentSection === 'hospitales' ? 'latinoamerica' : currentSection);
          setTemporalProgress(((index + 1) / totalSteps) * 100);
          return result;
        })
      );

      setTemporalData(temporalDataResult.flat());
    } catch (err: any) {
      console.error('Error in temporal analysis:', err);
      addError(`Error en el análisis temporal: ${err.message}`);
    } finally {
      setIsLoadingTemporal(false);
      setTemporalProgress(0);
    }
  };

  const handleGroupTemporalAnalysis = async () => {
    setIsLoadingTemporal(true);
    setShowGroupTemporalAnalysis(true);
    setTemporalProgress(0);
    clearErrors();
    try {
      const totalSteps = availableDates.length;
      const temporalDataResult = await Promise.all(
        availableDates.map(async (date, index) => {
          const result = await fetchTemporalData(['Todos'], [date], currentSection === 'hospitales' ? 'latinoamerica' : currentSection);
          setTemporalProgress(((index + 1) / totalSteps) * 100);
          return result;
        })
      );
      setTemporalData(temporalDataResult.flat());
    } catch (err: any) {
      console.error('Error in group temporal analysis:', err);
      addError(`Error en el análisis temporal de grupo: ${err.message}`);
    } finally {
      setIsLoadingTemporal(false);
      setTemporalProgress(0);
    }
  };

  const showCategories = useMemo(() => 
    currentSection !== 'hospitales' && categories.length > 0 && !isLoadingCategories, 
    [currentSection, categories, isLoadingCategories]
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  console.log('Categories:', categories);
  console.log('Show Categories:', showCategories);
  console.log('Current Section:', currentSection);
  console.log('Is Loading Categories:', isLoadingCategories);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-5xl font-bold text-center mb-8 text-secondary-dark">
          {currentSection === 'salud' ? 'El sector salud de Colombia' : 
           currentSection === 'compensacion' ? 'Cajas de compensación de Colombia' : 
           'Hospitales de referencia internacionales'}
        </h1>
  
        <Select 
          className="w-64 mb-6 border-gray-300 focus:border-secondary focus:ring-secondary" 
          value={selectedDate} 
          onChange={handleDateChange} 
        >
          {availableDates.map(date => (
            <option key={date} value={date}>{formatDate(date)}</option>
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
            {isLoadingCategories ? (
              <div className="animate-pulse space-y-4">
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            ) : showCategories && (
              <ImageNavbar 
                onCategorySelect={handleCategorySelect} 
                activeCategory={activeCategory} 
                categories={categories}
                currentSection={currentSection}
              />
            )}
  
            {/* <PopulationCard 
              selectedDate={selectedDate}
              population={populationData.population}
              uniqueFollowers={populationData.uniqueFollowers}
              penetrationRate={populationData.penetrationRate}
              className="mb-6 bg-white shadow-lg border-l-4 border-primary"
            /> */}
  
            <SummaryCards 
              data={summaryCardsData} 
              uniqueFollowers={uniqueFollowers}
              isAllCategory={activeCategory === 'Todos' || currentSection === 'hospitales'} 
              isLoading={isLoading}
              className="mb-6"
            />
  
            {(activeCategory === 'Todos' || currentSection === 'hospitales') && summaryCardsData && (
              <Card className="mb-6 bg-white shadow-md">
                <GroupSummaryTable 
                  summaryCardsData={summaryCardsData} 
                  onTemporalAnalysis={handleGroupTemporalAnalysis}
                  isLoading={isLoading}
                />
              </Card>
            )}
  
            
  
            
  
            <Card className="mb-6 bg-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {currentSection === 'hospitales' 
                  ? 'Hospitales de Latinoamérica' 
                  : `Datos para la categoría: ${activeCategory}`}
              </h2>
              <TextInput
                icon={FaSearch}
                type="text"
                placeholder="Buscar por institución, ciudad o tipo..."
                value={searchTerm}
                onChange={handleSearch}
                className="border-gray-300 focus:border-secondary focus:ring-secondary"
              />
              <InteractiveDataTable 
                data={filteredData}
                onInstitutionSelect={handleInstitutionSelect}
                onClearSelection={handleClearSelection}
                selectedType={currentSection === 'hospitales' ? 'Hospitales' : activeCategory}
                selectedDate={selectedDate}
                selectedInstitutions={selectedInstitutions}
                isLoading={isLoading}
              />

                  
              <div className="mb-6 flex space-x-4 items-center justify-end pt-3">
              
                      <Button 
                        color="#5C00CE" 
                        onClick={handleTemporalAnalysis}
                        disabled={isLoadingTemporal || selectedInstitutions.length === 0}
                        className="bg-secondary hover:bg-secondary-dark text-white transition-colors duration-200"
                      >
                        {isLoadingTemporal ? 'Analizando...' : 'Análisis Temporal'}
                      </Button>
              </div>
                      {isLoadingTemporal && (
                          <Card className="mb-6 bg-white shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Analizando datos temporales...</h2>
                            <ProgressBar progress={temporalProgress} color="secondary" />
                          </Card>
                      )}
            </Card>
  
            {selectedInstitutions.length === 1 && (
              <Card className="mt-6 bg-white shadow-md">
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
                availableDates={availableDates}
                isLoading={isLoadingTemporal}
              />
            )}
  
            {showGroupTemporalAnalysis && (
              <GroupTemporalAnalysisTable 
                temporalData={temporalData}
                availableDates={availableDates}
                onClose={() => setShowGroupTemporalAnalysis(false)}
                isLoading={isLoadingTemporal}
              />
            )}
          </>
        )}
  
        {errors.length > 0 && (
          <div className="mt-4">
            {errors.map((error, index) => (
              <Alert key={index} color="failure" className="mb-2 bg-primary bg-opacity-10 border-l-4 border-primary text-gray-900">
                {error}
              </Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SocialStatsDashboard;