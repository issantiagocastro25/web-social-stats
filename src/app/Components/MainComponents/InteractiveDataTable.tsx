import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Checkbox, Button, Pagination, Alert, TextInput } from 'flowbite-react';
import { FaFacebook, FaInstagram, FaYoutube, FaSort, FaSortUp, FaSortDown, FaTimes, FaTrash, FaSearch } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon';
import { fetchPaginatedSocialStats } from '@/api/list/listData';
import debounce from 'lodash/debounce';

interface InteractiveDataTableProps {
  selectedType: string;
  selectedDate: string;
  selectedInstitutions: any[];
  onInstitutionSelect: (institutions: any[]) => void;
  onClearSelection: () => void;
  searchTerm: string;
  category: string;
}

const InteractiveDataTable: React.FC<InteractiveDataTableProps> = ({ 
  selectedType, 
  selectedDate, 
  selectedInstitutions,
  onInstitutionSelect, 
  onClearSelection,
  searchTerm: externalSearchTerm,
  category
}) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' }>({ 
    key: 'social_networks.Facebook.followers', 
    direction: 'descending' 
  });
  const [visibleNetworks, setVisibleNetworks] = useState({
    basic: true,
    Facebook: true,
    X: true,
    Instagram: true,
    YouTube: true,
    Tiktok: true
  });
  const [internalSearchTerm, setInternalSearchTerm] = useState(externalSearchTerm);

  const itemsPerPage = 10;


  const columns = [
    { key: 'Institucion', label: 'Institución', network: 'basic' },
    { key: 'Tipo', label: 'Tipo', network: 'basic' },
    { key: 'Ciudad', label: 'Ciudad', network: 'basic' },
    { key: 'social_networks.Facebook.followers', label: 'Facebook Seguidores', network: 'Facebook' },
    { key: 'social_networks.Facebook.publications', label: 'Facebook Publicaciones', network: 'Facebook' },
    { key: 'social_networks.Facebook.reactions', label: 'Facebook Reacciones', network: 'Facebook' },
    { key: 'social_networks.Facebook.Average_views', label: 'Facebook Vistas Medias', network: 'Facebook' },
    { key: 'social_networks.X.followers', label: 'X Seguidores', network: 'X' },
    { key: 'social_networks.X.publications', label: 'X Publicaciones', network: 'X' },
    { key: 'social_networks.Instagram.followers', label: 'Instagram Seguidores', network: 'Instagram' },
    { key: 'social_networks.Instagram.publications', label: 'Instagram Publicaciones', network: 'Instagram' },
    { key: 'social_networks.YouTube.followers', label: 'YouTube Suscriptores', network: 'YouTube' },
    { key: 'social_networks.YouTube.publications', label: 'YouTube Publicaciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.reactions', label: 'YouTube Reacciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.Average_views', label: 'YouTube Vistas Medias', network: 'YouTube' },
    { key: 'social_networks.Tiktok.followers', label: 'TikTok Seguidores', network: 'Tiktok' },
    { key: 'social_networks.Tiktok.publications', label: 'TikTok Publicaciones', network: 'Tiktok' },
    { key: 'social_networks.Tiktok.reactions', label: 'TikTok Reacciones', network: 'Tiktok' },
    { key: 'social_networks.Tiktok.Average_views', label: 'TikTok Vistas Medias', network: 'Tiktok' },
  ];

  const visibleColumns = useMemo(() => columns.filter(column => visibleNetworks[column.network]), [visibleNetworks]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchPaginatedSocialStats({ 
        category,
        type: selectedType.toLowerCase(),
        date: selectedDate,
        page: 1,
        pageSize: 1000,
        search: ''
      });
      
      if (response && response.data && Array.isArray(response.data.metrics)) {
        const sortedData = response.data.metrics.sort((a, b) => {
          const aFollowers = a.social_networks?.Facebook?.followers || 0;
          const bFollowers = b.social_networks?.Facebook?.followers || 0;
          return bFollowers - aFollowers; // Descending order
        });
        setData(sortedData);
        setFilteredData(sortedData);
        setTotalItems(sortedData.length);
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      } else {
        throw new Error('Respuesta de API inesperada');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(`Error al cargar los datos: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [category, selectedType, selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleSearch = useCallback((searchTerm: string) => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (trimmedSearchTerm === '') {
      setFilteredData(data);
    } else {
      const searchTerms = trimmedSearchTerm.split(/\s+/);
      const filtered = data.filter(item => {
        return searchTerms.every(term => 
          Object.values(item).some(value => 
            value && value.toString().toLowerCase().includes(term)
          )
        );
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  }, [data]);


  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  useEffect(() => {
    debouncedHandleSearch(internalSearchTerm);
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [internalSearchTerm, debouncedHandleSearch]);

  useEffect(() => {
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData, itemsPerPage]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending' };
      }
      return { key, direction: 'ascending' };
    });
  }, []);

  const handleRowSelect = useCallback((institution: any) => {
    onInstitutionSelect(
      selectedInstitutions.some(i => i.Institucion === institution.Institucion)
        ? selectedInstitutions.filter(i => i.Institucion !== institution.Institucion)
        : [...selectedInstitutions, institution]
    );
  }, [selectedInstitutions, onInstitutionSelect]);

  const isRowSelected = useCallback((institution: any) => {
    return selectedInstitutions.some(i => i.Institucion === institution.Institucion);
  }, [selectedInstitutions]);

  const toggleNetwork = useCallback((network: keyof typeof visibleNetworks) => {
    setVisibleNetworks(prev => ({ ...prev, [network]: !prev[network] }));
  }, []);

  const formatValue = useCallback((currentValue: any, previousValue: any) => {
    if (typeof currentValue === 'number' && typeof previousValue === 'number' && previousValue !== 0) {
      const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
      const formattedValue = currentValue.toLocaleString('es-ES', { maximumFractionDigits: 2 });
      const formattedPercentage = percentageChange.toFixed(2);
      const color = percentageChange > 0 ? 'text-green-500' : percentageChange < 0 ? 'text-red-500' : 'text-gray-500';
      return (
        <div>
          <span>{formattedValue}</span>
          <span className={`ml-2 ${color}`}>
            ({formattedPercentage}%)
          </span>
        </div>
      );
    }
    return currentValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), a);
      const bValue = sortConfig.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), b);
      if (aValue === bValue) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const SortIcon: React.FC<{ column: string }> = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-blue-500" /> : <FaSortDown className="ml-1 text-blue-500" />;
  };

  const renderSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-16 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <div>
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-bold mb-2">Datos de Instituciones</h2>
        <TextInput
          icon={FaSearch}
          type="text"
          placeholder="Buscar por institución, ciudad o tipo..."
          value={internalSearchTerm}
          onChange={(e) => setInternalSearchTerm(e.target.value)}
          className="border-gray-300 focus:border-secondary focus:ring-secondary"
        />
        <div className="flex flex-wrap gap-2 mb-2 ">
          {Object.entries(visibleNetworks).map(([network, isVisible]) => (
            network !== 'basic' && (
              <Button
                key={network}
                onClick={() => toggleNetwork(network as keyof typeof visibleNetworks)}
                size="xs"
                color={isVisible ? "purple" : "gray"}
              >
                {network === 'Facebook' && <FaFacebook className="mr-2" />}
                {network === 'X' && <XIcon className="mr-2" />}
                {network === 'Instagram' && <FaInstagram className="mr-2" />}
                {network === 'YouTube' && <FaYoutube className="mr-2" />}
                {network === 'TikTok' && <SiTiktok className="mr-2" />}
                {network}
              </Button>
            )
          ))}
        </div>
      </div>

      {selectedInstitutions.length > 0 && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Instituciones Seleccionadas: {selectedInstitutions.length}</h3>
            <Button
              color="failure"
              size="xs"
              onClick={onClearSelection}
            >
              <FaTrash className="mr-2" />
              Limpiar selección
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedInstitutions.map(institution => (
              <div key={institution.Institucion} className="flex items-center bg-white px-3 py-1 rounded-full">
                <span>{institution.Institucion}</span>
                <button
                  onClick={() => handleRowSelect(institution)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

        <div className="relative overflow-hidden shadow-md sm:rounded-lg" style={{ height: '600px' }}>
        <div className="overflow-auto" style={{ height: '100%', width: '100%' }}>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-20">
              <tr>
                <th scope="col" className="p-4 sticky left-0 z-30 bg-gray-50 dark:bg-gray-700">
                  <Checkbox 
                    checked={selectedInstitutions.length === paginatedData.length}
                    onChange={() => onInstitutionSelect(selectedInstitutions.length === paginatedData.length ? [] : paginatedData)}
                  />
                </th>
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.key} 
                    scope="col"
                    className={`px-6 py-3 cursor-pointer ${
                      index === 0 ? 'sticky left-12 z-20 bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      <SortIcon column={column.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.Institucion}
                  className={`cursor-pointer ${
                    isRowSelected(item) ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'
                  } hover:bg-gray-50 dark:hover:bg-gray-700`}
                  onClick={() => handleRowSelect(item)}
                >
                  <td className="w-4 p-4 sticky left-0 z-10 bg-inherit">
                    <Checkbox
                      checked={isRowSelected(item)}
                      onChange={() => handleRowSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {visibleColumns.map((column, index) => (
                    <td
                      key={`${item.Institucion}-${column.key}`}
                      className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${
                        index === 0 ? 'sticky left-12 z-10 bg-inherit' : ''
                      } ${column.key === 'Institucion' ? 'whitespace-normal' : 'whitespace-nowrap'}`}
                    >
                      {formatValue(
                        column.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : 'N/A'), item),
                        null // We don't have previous data in this context
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredData.length > 0 ? (
        <div className="flex flex-col items-center justify-between mt-4 space-y-2 sm:flex-row sm:space-y-0">
          <p className="text-sm text-gray-700">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
          </p>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons={true}
            />
          )}
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-500">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default InteractiveDataTable;