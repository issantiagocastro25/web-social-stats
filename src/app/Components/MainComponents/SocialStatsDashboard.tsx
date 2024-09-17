import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Footer, Spinner, Card, Select, Button, TextInput } from 'flowbite-react';
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
  const [summaryCardsData, setSummaryCardsData] = useState(null);
  const [isLoadingGroupSummary, setIsLoadingGroupSummary] = useState(true);
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
  const [categories, setCategories] = useState<Category[]>([]);
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
    setError(null);
    try {
      console.log('Fetching data for category:', activeCategory);
      const response = await fetchSocialStats({ 
        category: activeCategory.toLowerCase(), 
        date: selectedDate
      });
      
      console.log('API response:', response);

      if (response && response.data && Array.isArray(response.data.metrics)) {
        setData(response.data.metrics);
        setFilteredData(response.data.metrics);
        console.log('Data loaded successfully:', response.data.metrics);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Ocurrió un error al cargar los datos');
    } finally {
      setIsLoadingDataTable(false);
    }
  }, [activeCategory, selectedDate]);

  const loadGroupSummary = useCallback(async () => {
    setIsLoadingGroupSummary(true);
    try {
      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'Todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      console.error('Error loading group summary:', err);
      setError(err.message || 'Ocurrió un error al cargar el resumen de grupo');
    } finally {
      setIsLoadingGroupSummary(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
      loadGroupSummary();
    }
  }, [loadData, loadGroupSummary, categories, activeCategory]);

  const handleCategorySelect = (categoryName: string) => {
    console.log('Category selected:', categoryName);
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

  const loadSummaryCardsData = useCallback(async () => {
    setIsLoadingSummaryCards(true);
    try {
      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'Todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      console.error('Error loading summary cards data:', err);
      setError(err.message || 'Ocurrió un error al cargar los datos de resumen');
    } finally {
      setIsLoadingSummaryCards(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
      loadSummaryCardsData();
    }
  }, [loadData, loadSummaryCardsData, categories, activeCategory, selectedDate]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Dashboard de Estadísticas Sociales
        </h1>

        {/* Selector de Fecha */}
        <div className="flex justify-center mb-6">
          <Select 
            className='w-64' 
            value={selectedDate} 
            onChange={handleDateChange}
            disabled={isLoadingDataTable || isLoadingSummaryCards}
          >
            {AVAILABLE_DATES.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </Select>
        </div>

        {/* Barra de Categorías */}
        {isLoadingCategories ? (
          <div className="flex justify-center mb-6">
            <Spinner size="xl" aria-label="Cargando categorías" />
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

        {/* Tarjetas Resumen */}
        <SummaryCards 
          data={summaryCardsData} 
          isAllCategory={activeCategory === 'Todos'} 
          isLoading={isLoadingSummaryCards}
        />

        {/* Tabla de Resumen de Grupo */}
        {activeCategory === 'Todos' && (
          <Card className="mb-6">
            <GroupSummaryTable 
              summaryCardsData={summaryCardsData} 
              onTemporalAnalysis={handleGroupTemporalAnalysis}
              isLoading={isLoadingGroupSummary}
            />
          </Card>
        )}

        {/* Búsqueda y Acciones */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4 items-center">
          <TextInput
            icon={FaSearch}
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow mb-4 md:mb-0"
          />
          <Button 
            color="success" 
            onClick={handleTemporalAnalysis}
            disabled={isLoadingTemporal || (selectedInstitutions.length === 0 && !selectedInstitution)}
          >
            {isLoadingTemporal ? 'Analizando...' : 'Análisis Temporal'}
          </Button>
        </div>

        {/* Cargando Análisis Temporal */}
        {isLoadingTemporal && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Analizando datos temporales...</h2>
            <ProgressBar progress={temporalProgress} />
          </Card>
        )}

        {/* Tabla de Datos */}
        {isLoadingDataTable ? (
          <div className="flex justify-center">
            <Spinner size="xl" aria-label="Cargando datos" />
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Datos para la categoría: {activeCategory}</h2>
            <InteractiveDataTable 
              data={filteredData}
              onInstitutionSelect={handleInstitutionSelect}
              selectedType={activeCategory}
              selectedDate={selectedDate}
              onInstitutionsSelect={handleInstitutionsSelect}
              selectedInstitution={selectedInstitution}
            />
          </Card>
        ) : (
          <Card>
            <p className="text-center text-gray-600">No se encontraron datos para la categoría: {activeCategory}</p>
          </Card>
        )}

        {/* Estadísticas de la Institución 
        {selectedInstitution && (
          <Card className="mt-6">
            <InstitutionStats institution={selectedInstitution} />
          </Card>
        )}

        {/* Gráficas y Tabla Comparativas 
        {selectedInstitutions.length > 1 && (
          <Grid numColsLg={2} className="gap-6 mt-6">
            <Card>
              <ComparisonCharts selectedInstitutions={selectedInstitutions} />
            </Card>
            <Card>
              <ComparisonTable selectedInstitutions={selectedInstitutions} />
            </Card>
          </Grid>
        )}

        {/* Tabla de Análisis Temporal */}
        {showTemporalAnalysis && (
          <Card className="mt-6">
            <TemporalAnalysisTable 
              selectedInstitutions={selectedInstitutions.length > 0 ? selectedInstitutions : [selectedInstitution]}
              temporalData={temporalData}
              availableDates={AVAILABLE_DATES}
            />
          </Card>
        )}

        {/* Tabla de Análisis Temporal de Grupo */}
        {showGroupTemporalAnalysis && (
          <Card className="mt-6">
            <GroupTemporalAnalysisTable 
              temporalData={temporalData}
              availableDates={AVAILABLE_DATES}
              onClose={() => setShowGroupTemporalAnalysis(false)}
            />
          </Card>
        )}
      </div>

      {/* Footer */}
      <Footer container={true} className="bg-white">
        <div className="w-full text-center">
          <Footer.Divider />
          <Footer.Copyright
            href="#"
            by="SocialStats™"
            year={new Date().getFullYear()}
          />
        </div>
      </Footer>
    </div>
  );
};

export default SocialStatsDashboard;