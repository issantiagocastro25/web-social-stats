import React, { useState, useMemo, useCallback } from 'react';
import { Table, Checkbox, Button } from 'flowbite-react';
import { FaFacebook, FaInstagram, FaYoutube, FaSort, FaSortUp, FaSortDown, FaTimes } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon';

interface InteractiveDataTableProps {
  data: any[];
  onInstitutionSelect: (institutions: any[]) => void;
  selectedType: string;
  selectedDate: string;
  selectedInstitutions: any[];
  isLoading: boolean;
}

const InteractiveDataTable: React.FC<InteractiveDataTableProps> = ({ 
  data, 
  onInstitutionSelect, 
  selectedType, 
  selectedDate, 
  selectedInstitutions,
  isLoading
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [visibleNetworks, setVisibleNetworks] = useState({
    basic: true,
    Facebook: true,
    X: true,
    Instagram: true,
    YouTube: true,
    TikTok: true
  });

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
    { key: 'social_networks.X.reactions', label: 'X Reacciones', network: 'X' },
    { key: 'social_networks.X.Average_views', label: 'X Vistas Medias', network: 'X' },
    { key: 'social_networks.Instagram.followers', label: 'Instagram Seguidores', network: 'Instagram' },
    { key: 'social_networks.Instagram.publications', label: 'Instagram Publicaciones', network: 'Instagram' },
    { key: 'social_networks.Instagram.reactions', label: 'Instagram Reacciones', network: 'Instagram' },
    { key: 'social_networks.Instagram.Average_views', label: 'Instagram Vistas Medias', network: 'Instagram' },
    { key: 'social_networks.YouTube.followers', label: 'YouTube Suscriptores', network: 'YouTube' },
    { key: 'social_networks.YouTube.publications', label: 'YouTube Publicaciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.reactions', label: 'YouTube Reacciones', network: 'YouTube' },
    { key: 'social_networks.YouTube.Average_views', label: 'YouTube Vistas Medias', network: 'YouTube' },
    { key: 'social_networks.Tiktok.followers', label: 'TikTok Seguidores', network: 'TikTok' },
    { key: 'social_networks.Tiktok.publications', label: 'TikTok Publicaciones', network: 'TikTok' },
    { key: 'social_networks.Tiktok.reactions', label: 'TikTok Reacciones', network: 'TikTok' },
    { key: 'social_networks.Tiktok.Average_views', label: 'TikTok Vistas Medias', network: 'TikTok' },
  ];

  const visibleColumns = columns.filter(column => visibleNetworks[column.network]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getValue = (obj: any, path: string) => {
          const value = path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
          return value !== null ? value : '';
        };

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

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

  const SortIcon: React.FC<{ column: string }> = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-blue-500" /> : <FaSortDown className="ml-1 text-blue-500" />;
  };

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
    return currentValue?.toLocaleString('es-ES', { maximumFractionDigits: 2 }) || 'N/A';
  }, []);

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
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-bold mb-2">Datos de Instituciones</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.entries(visibleNetworks).map(([network, isVisible]) => (
            network !== 'basic' && (
              <Button
                key={network}
                onClick={() => toggleNetwork(network as keyof typeof visibleNetworks)}
                size="xs"
                color={isVisible ? "blue" : "gray"}
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
          <h3 className="text-lg font-semibold mb-2">Instituciones Seleccionadas:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedInstitutions.map(institution => (
              <div key={institution.Institucion} className="flex items-center bg-white px-3 py-1 rounded-full">
                <span>{institution.Institucion}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowSelect(institution);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table hoverable className="w-full">
            <Table.Head className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <Table.HeadCell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-20">
                <Checkbox 
                  checked={selectedInstitutions.length === sortedData.length}
                  onChange={() => onInstitutionSelect(selectedInstitutions.length === sortedData.length ? [] : sortedData)}
                />
              </Table.HeadCell>
              {visibleColumns.map((column) => (
                <Table.HeadCell 
                  key={column.key} 
                  onClick={() => handleSort(column.key)} 
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    {column.label}
                    <SortIcon column={column.key} />
                  </div>
                </Table.HeadCell>
              ))}
            </Table.Head>
            <Table.Body className="divide-y">
              {sortedData.map((item) => (
                <Table.Row 
                  key={item.Institucion} 
                  className={`cursor-pointer ${isRowSelected(item) ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-800'} hover:bg-gray-50 dark:hover:bg-gray-700`}
                  onClick={() => handleRowSelect(item)}
                >
                  <Table.Cell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-10">
                    <Checkbox 
                      checked={isRowSelected(item)}
                      onChange={() => handleRowSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Table.Cell>
                  {visibleColumns.map(column => (
                    <Table.Cell key={column.key} className="max-w-xs break-words font-medium text-gray-900 dark:text-white">
                      {formatValue(
                        column.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : 'N/A'), item),
                        null // We don't have previous data in this context
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDataTable;