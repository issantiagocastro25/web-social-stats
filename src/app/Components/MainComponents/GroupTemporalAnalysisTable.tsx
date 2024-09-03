import React, { useMemo, useState } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Button } from '@tremor/react';

interface GroupTemporalAnalysisTableProps {
  temporalData: any[];
  availableDates: string[];
  onClose: () => void;
}

const GroupTemporalAnalysisTable: React.FC<GroupTemporalAnalysisTableProps> = ({ temporalData, availableDates, onClose }) => {
  const [showPercentages, setShowPercentages] = useState(false);

  const processedData = useMemo(() => {
    const groupedData: { [key: string]: any } = {};
    
    temporalData.forEach(item => {
      if (!groupedData[item.Tipo]) {
        groupedData[item.Tipo] = {};
      }
      if (!groupedData[item.Tipo][item.date]) {
        groupedData[item.Tipo][item.date] = {
          total: 0,
          Facebook: 0,
          X: 0,
          Instagram: 0,
          YouTube: 0,
          TikTok: 0
        };
      }
      
      Object.entries(item.social_networks).forEach(([network, data]: [string, any]) => {
        groupedData[item.Tipo][item.date][network] += data.followers || 0;
        groupedData[item.Tipo][item.date].total += data.followers || 0;
      });
    });

    return groupedData;
  }, [temporalData]);

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

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok', 'total'];

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
      {Object.entries(processedData).map(([groupName, groupData]) => (
        <div key={groupName} className="mt-6">
          <Title className="text-lg">{groupName}</Title>
          <Table className="mt-4">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Fecha</TableHeaderCell>
                {networks.map(network => (
                  <TableHeaderCell key={network}>{network}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {availableDates.map((date, index) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  {networks.map(network => {
                    const currentValue = groupData[date]?.[network] || 0;
                    const previousValue = index > 0 ? groupData[availableDates[index - 1]]?.[network] : undefined;
                    return (
                      <TableCell key={network}>
                        <Text>{formatValue(currentValue, previousValue)}</Text>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </Card>
  );
};

export default GroupTemporalAnalysisTable;