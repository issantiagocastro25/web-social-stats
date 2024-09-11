import React, { useMemo, useState, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Button } from '@tremor/react';

interface Institution {
  Institucion: string;
  social_networks: {
    [key: string]: {
      followers: number;
      publications: number;
      reactions: number;
      engagement: number;
    };
  };
}

interface TemporalAnalysisTableProps {
  selectedInstitutions: Institution[];
  temporalData: any[];
  availableDates: string[];
}

const TemporalAnalysisTable: React.FC<TemporalAnalysisTableProps> = ({
  selectedInstitutions,
  temporalData,
  availableDates,
}) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'engagement'];

  const processedData = useMemo(() => {
    const data: { [key: string]: any } = {};
    selectedInstitutions.forEach(institution => {
      if (institution && institution.Institucion) {
        data[institution.Institucion] = {};
        availableDates.forEach(date => {
          const institutionData = temporalData.find(
            item => item.Institucion === institution.Institucion && item.date === date
          );
          data[institution.Institucion][date] = institutionData?.social_networks || {};
        });
      }
    });
    return data;
  }, [selectedInstitutions, temporalData, availableDates]);

  const calculatePercentageChange = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const formatValue = (value: number | null | undefined, previousValue: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    if (showPercentages && previousValue !== null && previousValue !== undefined) {
      const percentageChange = calculatePercentageChange(value, previousValue);
      return `${percentageChange.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  const togglePercentages = () => {
    setShowPercentages(!showPercentages);
  };

  useEffect(() => {
    // Resetear el estado cuando cambian las instituciones seleccionadas
    setShowPercentages(false);
  }, [selectedInstitutions]);

  if (selectedInstitutions.length === 0 || temporalData.length === 0) {
    return (
      <Card>
        <Title>Análisis Temporal de Instituciones Seleccionadas</Title>
        <Text>No hay datos disponibles para mostrar.</Text>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Análisis Temporal de Instituciones Seleccionadas</Title>
        <Button onClick={togglePercentages}>
          {showPercentages ? 'Mostrar Valores Reales' : 'Mostrar Porcentajes'}
        </Button>
      </div>
      {Object.entries(processedData).map(([institutionName, institutionData]) => (
        <div key={institutionName} className="mt-6">
          <Title className="text-lg">{institutionName}</Title>
          <Table className="mt-4">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Fecha</TableHeaderCell>
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
                  {networks.flatMap(network => 
                    metrics.map(metric => {
                      const currentValue = institutionData[date]?.[network]?.[metric];
                      const previousValue = index > 0 
                        ? institutionData[availableDates[index - 1]]?.[network]?.[metric]
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
        </div>
      ))}
    </Card>
  );
};

export default TemporalAnalysisTable;