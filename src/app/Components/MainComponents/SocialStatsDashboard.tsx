import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Card, Pagination } from 'flowbite-react';
import { fetchSocialStats, fetchSummaryCardsData, fetchCategories } from '@/api/list/listData';
import ImageNavbar from './ImageNavBar';
import SummaryCards from './SummaryCards';
import InteractiveDataTable from './InteractiveDataTable';
import InstitutionStats from './InstitutionStats';
import ComparisonCharts from './ComparisonCharts';
import ComparisonTable from './ComparisonTable';
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
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
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

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (activeCategory === 'Todos') {
        response = await fetchSocialStats({ 
          date: selectedDate,
          category: 'todos'
        });
      } else {
        response = await fetchSocialStats({ 
          category: activeCategory, 
          date: selectedDate, 
          page: currentPage 
        });
      }
      setData(response.data.metrics);
      setFilteredData(response.data.metrics);
      setTotalPages(response.total_pages || 1);
      
      const summaryCardsResponse = await fetchSummaryCardsData(
        activeCategory === 'Todos' ? null : activeCategoryId, 
        selectedDate
      );
      setSummaryCardsData(summaryCardsResponse);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeCategoryId, selectedDate, currentPage]);

  useEffect(() => {
    if (categories.length > 0) {
      loadData();
    }
  }, [loadData, categories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setActiveCategory(category.name);
      setActiveCategoryId(category.id);
      setSelectedInstitution(null);
      setSelectedInstitutions([]);
      setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Dashboard de Estadísticas Sociales
        </h1>
        <select 
          className="mb-5 w-56 p-2 border rounded" 
          value={selectedDate} 
          onChange={handleDateChange}
        >
          {AVAILABLE_DATES.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
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
        />

        {activeCategory === 'Todos' && summaryCardsData && (
          <GroupSummaryTable summaryCardsData={summaryCardsData} />
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por institución, ciudad o tipo..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded w-full"
          />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ComparisonCharts selectedInstitutions={selectedInstitutions} />
                <ComparisonTable selectedInstitutions={selectedInstitutions} />
              </div>
            )}

            {showTemporalAnalysis && (
              <TemporalAnalysisTable 
                selectedInstitutions={selectedInstitutions.length > 0 ? selectedInstitutions : [selectedInstitution]}
                temporalData={temporalData}
                availableDates={AVAILABLE_DATES}
              />
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