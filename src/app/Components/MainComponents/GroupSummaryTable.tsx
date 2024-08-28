import React, { useMemo, useState } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge, Button } from '@tremor/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const GroupSummaryTable = ({ allData }) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });

  const groupSummary = useMemo(() => {
    const groups = {};
    let totalFollowers = 0;

    allData.forEach(item => {
      if (!groups[item.Tipo]) {
        groups[item.Tipo] = {
          total: 0,
          Facebook: 0,
          X: 0,
          Instagram: 0,
          YouTube: 0,
          TikTok: 0,
          count: 0
        };
      }

      groups[item.Tipo].count++;
      Object.entries(item.social_networks).forEach(([network, data]) => {
        groups[item.Tipo][network] += data.followers || 0;
        groups[item.Tipo].total += data.followers || 0;
        totalFollowers += data.followers || 0;
      });
    });

    return { groups, totalFollowers };
  }, [allData]);

  const { groups, totalFollowers } = groupSummary;

  const sortedGroups = useMemo(() => {
    const groupsArray = Object.entries(groups);
    if (sortConfig.key) {
      groupsArray.sort((a, b) => {
        if (a[1][sortConfig.key] < b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[1][sortConfig.key] > b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return groupsArray;
  }, [groups, sortConfig]);

  const toggleView = () => {
    setShowPercentages(!showPercentages);
  };

  const formatValue = (value, total) => {
    if (showPercentages) {
      const percentage = (value / total) * 100;
      return `${percentage.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ml-1" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Resumen por Grupos</Title>
        <Button onClick={toggleView}>
          {showPercentages ? 'Mostrar Números' : 'Mostrar Porcentajes'}
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell onClick={() => requestSort('Tipo')} className="cursor-pointer">
              Grupo <SortIcon columnKey="Tipo" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('total')} className="cursor-pointer">
              Total Seguidores <SortIcon columnKey="total" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('Facebook')} className="cursor-pointer">
              Facebook <SortIcon columnKey="Facebook" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('X')} className="cursor-pointer">
              X <SortIcon columnKey="X" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('Instagram')} className="cursor-pointer">
              Instagram <SortIcon columnKey="Instagram" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('YouTube')} className="cursor-pointer">
              YouTube <SortIcon columnKey="YouTube" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('TikTok')} className="cursor-pointer">
              TikTok <SortIcon columnKey="TikTok" />
            </TableHeaderCell>
            <TableHeaderCell onClick={() => requestSort('count')} className="cursor-pointer">
              Cantidad de Instituciones <SortIcon columnKey="count" />
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedGroups.map(([groupName, data]) => (
            <TableRow key={groupName}>
              <TableCell>{groupName}</TableCell>
              <TableCell>
                <Text>{formatValue(data.total, totalFollowers)}</Text>
              </TableCell>
              <TableCell>{formatValue(data.Facebook, data.total)}</TableCell>
              <TableCell>{formatValue(data.X, data.total)}</TableCell>
              <TableCell>{formatValue(data.Instagram, data.total)}</TableCell>
              <TableCell>{formatValue(data.YouTube, data.total)}</TableCell>
              <TableCell>{formatValue(data.TikTok, data.total)}</TableCell>
              <TableCell>{data.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupSummaryTable;