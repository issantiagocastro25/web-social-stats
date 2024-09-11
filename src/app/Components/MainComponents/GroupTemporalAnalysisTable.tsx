import React, { useMemo, useState } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Button, Select } from '@tremor/react';

interface GroupTemporalAnalysisTableProps {
  temporalData: Array<{ category: string; data: any[] }>;
  availableDates: string[];
  onClose: () => void;
}

const GroupTemporalAnalysisTable: React.FC<GroupTemporalAnalysisTableProps> = ({ temporalData, availableDates, onClose }) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'average_views'];

  const processedData = useMemo(() => {
    const categoryData = temporalData.find(item => item.category === selectedCategory);
    if (!categoryData) return {};

    const groupedData: { [key: string]: any } = {};
    
    categoryData.data.forEach(item => {
      if (!groupedData[item.date]) {
        groupedData[item.date] = {
          total: 0,
          Facebook: { followers: 0, publications: 0, reactions: 0, average_views: 0 },
          X: { followers: 0, publications: 0, reactions: 0, average_views: 0 },
          Instagram: { followers: 0, publications: 0, reactions: 0, average_views: 0 },
          YouTube: { followers: 0, publications: 0, reactions: 0, average_views: 0 },
          TikTok: { followers: 0, publications: 0, reactions: 0, average_views: 0 }
        };
      }
      
      Object.entries(item.social_networks).forEach(([network, data]: [string, any]) => {
        groupedData[item.date][network].followers += data.followers || 0;
        groupedData[item.date][network].publications += data.publications || 0;
        groupedData[item.date][network].reactions += data.reactions || 0;
        groupedData[item.date][network].average_views += data.average_views || 0;
        groupedData[item.date].total += data.followers || 0;
      });
    });

    return groupedData;
  }, [temporalData, selectedCategory]);

  const calculatePercentageChange = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const formatValue = (value: number, previousValue: number | undefined) => {
    if (showPercentages && previousValue !== undefined) {
      const percentageChange = calculatePercentageChange(value, previousValue);
      return `${percentageChange.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const togglePercentages = () => {
    setShowPercentages(!showPercentages);
  };

  return (
    <Card className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <Title>Análisis Temporal por Grupo</Title>
        <div className="space-x-2">
          <Button onClick={togglePercentages}>
            {showPercentages ? 'Mostrar Valores' : 'Mostrar Porcentajes'}
          </Button>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
      <div className="mb-4">
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {temporalData.map(item => (
            <option key={item.category} value={item.category}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </option>
          ))}
        </Select>
      </div>
      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Total Seguidores</TableHeaderCell>
            {networks.flatMap(network => 
              metrics.map(metric => (
                <TableHeaderCell key={`${network}-${metric}`}>
                  {`${network} ${metric}`}
                </TableHeaderCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {availableDates.map((date, index) => (
            <TableRow key={date}>
              <TableCell>{date}</TableCell>
              <TableCell>
                <Text>
                  {formatValue(
                    processedData[date]?.total || 0,
                    index > 0 ? processedData[availableDates[index - 1]]?.total : undefined
                  )}
                </Text>
              </TableCell>
              {networks.flatMap(network => 
                metrics.map(metric => {
                  const currentValue = processedData[date]?.[network]?.[metric] || 0;
                  const previousValue = index > 0 
                    ? processedData[availableDates[index - 1]]?.[network]?.[metric]
                    : undefined;
                  return (
                    <TableCell key={`${network}-${metric}`}>
                      <Text>
                        {formatValue(currentValue, previousValue)}
                      </Text>
                    </TableCell>
                  );
                })
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupTemporalAnalysisTable;