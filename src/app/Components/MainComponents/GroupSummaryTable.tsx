import React, { useMemo, useState } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Button } from '@tremor/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface SummaryCardData {
  stats_date: string;
  stats: Array<{
    type_institution: string;
    social_network: string;
    total_followers: number;
    total_publications: number;
    total_reactions: number;
    average_views: number;
  }>; 
}

interface GroupSummaryTableProps {
  summaryCardsData: SummaryCardData | null | undefined;
}

const GroupSummaryTable: React.FC<GroupSummaryTableProps> = ({ summaryCardsData }) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ key: 'total', direction: 'descending' });

  const groupSummary = useMemo(() => {
    const groups: Record<string, Record<string, number>> = {};
    let totalFollowers = 0;

    if (summaryCardsData && Array.isArray(summaryCardsData.stats)) {
      summaryCardsData.stats.forEach(item => {
        if (!groups[item.type_institution]) {
          groups[item.type_institution] = {
            total: 0,
            Facebook: 0,
            X: 0,
            Instagram: 0,
            YouTube: 0,
            TikTok: 0,
          };
        }

        groups[item.type_institution][item.social_network] = item.total_followers;
        groups[item.type_institution].total += item.total_followers;
        totalFollowers += item.total_followers;
      });
    }

    return { groups, totalFollowers };
  }, [summaryCardsData]);

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

  const togglePercentages = () => {
    setShowPercentages(!showPercentages);
  };

  const formatValue = (value: number, total: number) => {
    if (showPercentages) {
      const percentage = (value / total) * 100;
      return `${percentage.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon: React.FC<{ columnKey: string }> = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ml-1" />;
    }
    return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  if (!summaryCardsData || !Array.isArray(summaryCardsData.stats) || summaryCardsData.stats.length === 0) {
    return (
      <Card>
        <Title>Resumen por Grupos</Title>
        <Text>No hay datos disponibles para mostrar.</Text>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Resumen por Grupos ({summaryCardsData.stats_date})</Title>
        <Button onClick={togglePercentages}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupSummaryTable;