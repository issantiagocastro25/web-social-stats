import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, Select, Button, TextInput, Alert } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { Grid } from '@tremor/react';
import { 
  fetchSummaryAndUniqueFollowers, 
  fetchPaginatedSocialStats,
  fetchAvailableDates,
  fetchCategories
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

type SectionType = 'salud' | 'compensacion' | 'hospitales' | 'usa';

interface SocialStatsDashboardProps {
  section: SectionType;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialStatsDashboard: React.FC<SocialStatsDashboardProps> = ({ 
  section, 
  isLoading, 
  setIsLoading 
}) => {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState<SectionType>(section);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTemporalAnalysis, setShowTemporalAnalysis] = useState<boolean>(false);
  const [temporalData, setTemporalData] = useState<any[]>([]);
  const [isLoadingTemporal, setIsLoadingTemporal] = useState<boolean>(false);
  const [temporalProgress, setTemporalProgress] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

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
      const apiCategory = section;
      const fetchedCategories = await fetchCategories(apiCategory, date);
      
      const allCategory = {
        id: 0,
        name: 'Todos',
        institution_count: fetchedCategories.reduce((sum, cat) => sum + (cat.institution_count || 0), 0),
        url: 'https://example.com/path/to/default/image.png',
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

  const loadData = useCallback(async (section: SectionType, category: string, date: string, page: number = 1, search: string = '') => {
    setIsLoading(true);
    clearErrors();
    try {
      console.log('Loading data for:', { section, category, date, page, search, itemsPerPage });
      
      const summaryResponse = await fetchSummaryAndUniqueFollowers({
        category: section,
        date: date
      });
      setSummaryCardsData(summaryResponse);
      setUniqueFollowers(summaryResponse.unique_followers);
      setPopulationData({
        population: summaryResponse.population || 0,
        uniqueFollowers: summaryResponse.unique_followers?.total || 0,
        penetrationRate: summaryResponse.penetration_rate || 0,
      });

      const socialStatsResponse = await fetchPaginatedSocialStats({ 
        category: section,
        type: category === 'Todos' ? 'todos' : category.toLowerCase(),
        date: date,
        page: page,
        pageSize: itemsPerPage,
        search: search
      });

      console.log('API Response:', socialStatsResponse);

      if (socialStatsResponse && socialStatsResponse.data) {
        const { metrics, total_pages, current_page, total_items } = socialStatsResponse.data;
        setData(metrics || []);
        setFilteredData(metrics || []);
        setTotalPages(Math.max(total_pages, 1));
        setCurrentPage(current_page);
        setTotalItems(total_items);
      } else {
        throw new Error('Respuesta de API inesperada para los datos paginados');
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      addError(`Error al cargar los datos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [addError, clearErrors, itemsPerPage]);

  useEffect(() => {
    console.log('SocialStatsDashboard effect - Loading initial data');
    const loadInitialData = async () => {
      try {
        const dates = await fetchAvailableDates();
        const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        setAvailableDates(sortedDates);
        if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]);
          await loadCategories(currentSection, sortedDates[0]);
          await loadData(currentSection, 'Todos', sortedDates[0]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        addError('Error al cargar los datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [currentSection, loadCategories, loadData, addError]);

  useEffect(() => {
    const newSection = pathname ? pathname.split('/')[1] as SectionType : 'salud';
    if (['salud', 'compensacion', 'hospitales'].includes(newSection) && selectedDate && !initialDataLoaded.current) {
      setCurrentSection(newSection);
      loadCategories(newSection, selectedDate);
      loadData(newSection, 'Todos', selectedDate);
      initialDataLoaded.current = true;
    }
  }, [pathname, loadCategories, loadData, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadCategories(currentSection, newDate);
    loadData(currentSection, activeCategory, newDate);
  };

  const handleCategorySelect = useCallback((categoryName: string) => {
    console.log('Category selected:', categoryName);
    const category = categories.find(cat => cat.name === categoryName) || { id: 0, name: 'Todos' };
    setActiveCategory(category.name);
    setActiveCategoryId(category.id);
    setSelectedInstitutions([]);
    setShowTemporalAnalysis(false);
    setTemporalData([]);
    setShowGroupTemporalAnalysis(false);
    setCurrentPage(1);
    loadData(currentSection, category.name, selectedDate, 1, searchTerm);
  }, [currentSection, categories, loadData, selectedDate, searchTerm]);

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

    const fetchDataForDate = async (date: string) => {
      const result = await fetchPaginatedSocialStats({
        category: currentSection,
        type: 'todos',
        date: date,
        page: 1,
        pageSize: 100,
        search: selectedInstitutions.map(inst => inst.Institucion).join(',')
      });
      return result.data.metrics.map(item => ({ ...item, date }));
    };

    try {
      const totalSteps = availableDates.length;
      let temporalDataResult = [];
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        temporalDataResult = await Promise.all(
          availableDates.map(async (date, index) => {
            const data = await fetchDataForDate(date);
            setTemporalProgress(((index + 1) / totalSteps) * 100);
            return data;
          })
        );

        const flattenedData = temporalDataResult.flat();
        
        const allZero = flattenedData.every(item => 
          Object.values(item.social_networks).every(network => 
            Object.values(network).every(value => value === 0)
          )
        );

        if (!allZero) {
          break;
        }

        console.log(`Attempt ${retryCount + 1}: All data is zero, retrying...`);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Final Temporal Data:', temporalDataResult.flat());
      setTemporalData(temporalDataResult.flat());

      if (retryCount === maxRetries) {
        console.warn('Max retries reached. Some data might still be zero.');
      }
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
          const result = await fetchPaginatedSocialStats({
            category: currentSection,
            type: 'todos',
            date: date,
            page: 1,
            pageSize: 100
          });
          setTemporalProgress(((index + 1) / totalSteps) * 100);
          return { category: currentSection, data: result.data.metrics.map(item => ({ ...item, date })) };
        })
      );
      setTemporalData(temporalDataResult);
    } catch (err: any) {
      console.error('Error in group temporal analysis:', err);
      addError(`Error en el análisis temporal de grupo: ${err.message}`);
    } finally {
      setIsLoadingTemporal(false);
      setTemporalProgress(0);
    }
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    loadData(currentSection, activeCategory, selectedDate, 1, term);
  }, [currentSection, activeCategory, selectedDate, loadData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(currentSection, activeCategory, selectedDate, page, searchTerm);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    loadData(currentSection, activeCategory, selectedDate, 1, searchTerm);
  };

  const showCategories = useMemo(() => 
    categories.length > 0 && !isLoadingCategories, 
    [categories, isLoadingCategories]
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-[#fffefb] flex flex-col">
      <div className="container mx-auto px-4 pt-6 pb-4 flex-grow">
        <h1 className="text-4xl font-bold text-center text-secondary-dark">
          {currentSection === 'salud' ? 'El sector salud de Colombia' : 
           currentSection === 'compensacion' ? 'Cajas de compensación de Colombia' : 
           currentSection === 'hospitales' ? 'Hospitales de referencia internacionales' :
           'Hospitales de Estados Unidos'}
        </h1>
        <div className='flex gap-x-3 justify-end items-center mt-5 mb-6 pr-10'>
          <p>Ver estadísticas de:</p>
          <Select 
            className="w-64 border-gray-300 focus:border-secondary focus:ring-secondary" 
            value={selectedDate} 
            onChange={handleDateChange} 
          >
            {availableDates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </Select>
        </div>
  
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
            ) : (
              showCategories && (
                <ImageNavbar 
                  onCategorySelect={handleCategorySelect} 
                  activeCategory={activeCategory} 
                  categories={categories}
                  currentSection={currentSection}
                />
              )
            )}
  
            <SummaryCards 
              data={summaryCardsData} 
              isAllCategory={activeCategory === 'Todos'}
              isLoading={isLoading}
              selectedInstitutionType={activeCategory}
              className="mb-6"
            />

            {(currentSection === 'salud' || currentSection === 'compensacion') && 
             !isLoading && 
             activeCategory === 'Todos' && (
              <PopulationCard 
                selectedDate={selectedDate}
                availableDates={availableDates}
                category={currentSection}
              />
            )}
  
            {currentSection === 'salud' && activeCategory === 'Todos' && summaryCardsData && (
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
                {`Datos para la categoría: ${activeCategory}`}
              </h2>
              <InteractiveDataTable 
                selectedType={activeCategory}
                selectedDate={selectedDate}
                selectedInstitutions={selectedInstitutions}
                onInstitutionSelect={handleInstitutionSelect}
                onClearSelection={handleClearSelection}
                searchTerm={searchTerm}
                category={currentSection}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                data={filteredData}
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

            {isLoadingTemporal ? (
              <Card>
                <p>Cargando análisis temporal... {temporalProgress.toFixed(0)}%</p>
              </Card>
            ) : (
              showTemporalAnalysis && temporalData.length > 0 && (
                <TemporalAnalysisTable 
                  selectedInstitutions={selectedInstitutions}
                  temporalData={temporalData}
                  availableDates={availableDates}
                  isLoading={isLoadingTemporal}
                />
              )
            )}
  
            {showGroupTemporalAnalysis && (
              <GroupTemporalAnalysisTable 
                temporalData={temporalData}
                availableDates={availableDates}
                onClose={() => setShowGroupTemporalAnalysis(false)}
                isLoading={isLoadingTemporal}
              />
            )}
  
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