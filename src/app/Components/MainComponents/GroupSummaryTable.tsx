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
  isLoading: boolean;
}

const GroupSummaryTable: React.FC<GroupSummaryTableProps> = ({ summaryCardsData, isLoading }) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ key: 'Facebook', direction: 'descending' });

  const groupSummary = useMemo(() => {
    const groups: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {
      Facebook: 0,
      X: 0,
      Instagram: 0,
      YouTube: 0,
      TikTok: 0,
    };

    if (summaryCardsData && Array.isArray(summaryCardsData.stats)) {
      summaryCardsData.stats.forEach(item => {
        if (!groups[item.type_institution]) {
          groups[item.type_institution] = {
            Facebook: 0,
            X: 0,
            Instagram: 0,
            YouTube: 0,
            TikTok: 0,
          };
        }

        // Normalizar el nombre de la red social
        const normalizedNetwork = item.social_network === 'Tiktok' ? 'TikTok' : item.social_network;

        groups[item.type_institution][normalizedNetwork] = item.total_followers;
        totals[normalizedNetwork] += item.total_followers;
      });
    }

    return { groups, totals };
  }, [summaryCardsData]);

  const { groups, totals } = groupSummary;

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

  const formatValue = (value: number, total: number) => {
    if (showPercentages) {
      if (total === 0) return '0%';
      const percentage = (value / total) * 100;
      return isNaN(percentage) ? '0%' : `${percentage.toFixed(2)}%`;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

  const calculateTotalPercentage = () => {
    if (!showPercentages) return null;

    const percentageSums = Object.keys(totals).reduce((sums, network) => {
      sums[network] = sortedGroups.reduce((sum, [, data]) => {
        const percentage = (data[network] / totals[network]) * 100;
        return sum + (isNaN(percentage) ? 0 : percentage);
      }, 0);
      return sums;
    }, {} as Record<string, number>);

    return (
      <TableRow>
        <TableCell>Total</TableCell>
        {Object.entries(percentageSums).map(([network, sum]) => (
          <TableCell key={network}>
            {`${sum.toFixed(2)}%`}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

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
        <Button onClick={toggleView} className='bg-[#5C00CE] rounded-md hover:bg-purple-800'>
          {showPercentages ? 'Mostrar Números' : 'Mostrar Porcentajes'}
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Grupo</TableHeaderCell>
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
              <TableCell>{formatValue(data.Facebook, totals.Facebook)}</TableCell>
              <TableCell>{formatValue(data.X, totals.X)}</TableCell>
              <TableCell>{formatValue(data.Instagram, totals.Instagram)}</TableCell>
              <TableCell>{formatValue(data.YouTube, totals.YouTube)}</TableCell>
              <TableCell>{formatValue(data.TikTok, totals.TikTok)}</TableCell>
            </TableRow>
          ))}
          {calculateTotalPercentage()}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupSummaryTable;