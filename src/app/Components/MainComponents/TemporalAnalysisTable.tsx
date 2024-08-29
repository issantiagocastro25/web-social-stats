import React, { useState, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';

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
  activeCategory: string;
  availableDates: string[];
}

const TemporalAnalysisTable: React.FC<TemporalAnalysisTableProps> = ({ 
  selectedInstitutions, 
  activeCategory, 
  availableDates 
}) => {
  const [temporalData, setTemporalData] = useState<{ [key: string]: Institution[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemporalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataPromises = availableDates.map(date => 
          fetchSocialStats({ 
            category: activeCategory, 
            date,
            institutions: selectedInstitutions.map(inst => inst.Institucion)
          })
        );
        const results = await Promise.all(dataPromises);
        const newTemporalData = Object.fromEntries(availableDates.map((date, index) => [date, results[index].metrics]));
        setTemporalData(newTemporalData);
      } catch (err) {
        setError('An error occurred while fetching temporal data');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedInstitutions.length > 0) {
      loadTemporalData();
    }
  }, [selectedInstitutions, activeCategory, availableDates]);

  if (isLoading) return <div>Loading temporal data...</div>;
  if (error) return <div>Error: {error}</div>;

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'engagement'];

  const getMetricValue = (institution: string, date: string, network: string, metric: string) => {
    const institutionData = temporalData[date]?.find(item => item.Institucion === institution);
    return institutionData?.social_networks?.[network]?.[metric] ?? 'N/A';
  };

  const formatNumber = (number: number | string) => {
    return typeof number === 'number' ? number.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : number;
  };

  return (
    <Card>
      <Title className="mb-4">Análisis Temporal de Instituciones Seleccionadas</Title>
      {selectedInstitutions.map(institution => (
        <div key={institution.Institucion} className="mb-8">
          <Title className="text-lg mb-2">{institution.Institucion}</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Fecha</TableHeaderCell>
                {networks.flatMap(network => 
                  metrics.map(metric => (
                    <TableHeaderCell key={`${network}-${metric}`}>{`${network} ${metric}`}</TableHeaderCell>
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
                        <Text>{formatNumber(getMetricValue(institution.Institucion, date, network, metric))}</Text>
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