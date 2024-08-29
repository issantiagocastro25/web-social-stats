import React, { useMemo } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text } from '@tremor/react';

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
  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'engagement'];

  const processedData = useMemo(() => {
    const data: { [key: string]: any } = {};
    selectedInstitutions.forEach(institution => {
      data[institution.Institucion] = {};
      availableDates.forEach(date => {
        const institutionData = temporalData.find(
          item => item.Institucion === institution.Institucion && item.date === date
        );
        data[institution.Institucion][date] = institutionData?.social_networks || {};
      });
    });
    return data;
  }, [selectedInstitutions, temporalData, availableDates]);

  const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toLocaleString();
  };

  console.log('Processed Data:', processedData);  // Para depuración

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
      <Title>Análisis Temporal de Instituciones Seleccionadas</Title>
      {selectedInstitutions.map(institution => (
        <div key={institution.Institucion} className="mt-6">
          <Title className="text-lg">{institution.Institucion}</Title>
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
              {availableDates.map(date => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  {networks.flatMap(network => 
                    metrics.map(metric => (
                      <TableCell key={`${network}-${metric}`}>
                        <Text>
                          {formatValue(processedData[institution.Institucion]?.[date]?.[network]?.[metric])}
                        </Text>
                      </TableCell>
                    ))
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