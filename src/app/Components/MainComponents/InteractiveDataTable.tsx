import React, { useState, useMemo } from 'react';
import { Table, Checkbox, Button } from 'flowbite-react';
import { FaFacebook, FaInstagram, FaYoutube, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon';

interface InteractiveDataTableProps {
  data: any[];
  onInstitutionSelect: (institution: any) => void;
  selectedType: string;
  selectedDate: string;
  onInstitutionsSelect: (institutions: any[]) => void;
  selectedInstitution: any;
}

const InteractiveDataTable: React.FC<InteractiveDataTableProps> = ({ 
  data, 
  onInstitutionSelect, 
  selectedType, 
  selectedDate, 
  onInstitutionsSelect, 
  selectedInstitution
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (institution: any) => {
    setSelectedRows(prev => {
      const newSelection = prev.includes(institution)
        ? prev.filter(i => i !== institution)
        : [...prev, institution];
      onInstitutionsSelect(newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const newSelection = selectedRows.length === sortedData.length ? [] : sortedData;
    setSelectedRows(newSelection);
    onInstitutionsSelect(newSelection);
  };

  const toggleNetwork = (network: keyof typeof visibleNetworks) => {
    setVisibleNetworks(prev => ({ ...prev, [network]: !prev[network] }));
  };

  const SortIcon: React.FC<{ column: string }> = ({ column }) => {
    if (sortConfig.key !== column) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1 text-blue-500" /> : <FaSortDown className="ml-1 text-blue-500" />;
  };

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString('es-ES', { maximumFractionDigits: 2 });
    }
    return value || 'N/A';
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-bold mb-2">Datos de Instituciones</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button size="sm" color={visibleNetworks.Facebook ? "blue" : "gray"} onClick={() => toggleNetwork('Facebook')}>
            <FaFacebook className="mr-2" />Facebook
          </Button>
          <Button size="xs" color={visibleNetworks.X ? "blue" : "gray"} onClick={() => toggleNetwork('X')}>
            <XIcon className="mr-2" />
          </Button>
          <Button size="sm" color={visibleNetworks.Instagram ? "blue" : "gray"} onClick={() => toggleNetwork('Instagram')}>
            <FaInstagram className="mr-2" />Instagram
          </Button>
          <Button size="sm" color={visibleNetworks.YouTube ? "blue" : "gray"} onClick={() => toggleNetwork('YouTube')}>
            <FaYoutube className="mr-2" />YouTube
          </Button>
          <Button size="sm" color={visibleNetworks.TikTok ? "blue" : "gray"} onClick={() => toggleNetwork('TikTok')}>
            <SiTiktok className="mr-2" />TikTok
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={handleSelectAll}>
            {selectedRows.length === sortedData.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </Button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table hoverable className="w-full">
            <Table.Head className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <Table.HeadCell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-20">
                <Checkbox 
                  checked={selectedRows.length === sortedData.length}
                  onChange={handleSelectAll}
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
                  className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${selectedInstitution === item ? 'shadow-lg bg-blue-200' : ''}`}
                  onClick={() => onInstitutionSelect(item)}
                >
                  <Table.Cell className="w-4 sticky left-0 bg-white dark:bg-gray-800 z-10">
                    <Checkbox 
                      checked={selectedRows.includes(item)}
                      onChange={() => handleRowSelect(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Table.Cell>
                  {visibleColumns.map(column => (
                    <Table.Cell key={column.key} className="max-w-xs break-words font-medium text-gray-900 dark:text-white">
                      {formatValue(column.key.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : 'N/A'), item))}
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