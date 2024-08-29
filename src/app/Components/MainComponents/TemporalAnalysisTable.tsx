import React, { useState, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';

const TemporalAnalysisTable = ({ selectedInstitutions, activeCategory, selectedDate }) => {
  const [temporalData, setTemporalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemporalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchSocialStats({ 
          category: activeCategory, 
          date: selectedDate 
        });
        setTemporalData(response.metrics);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching temporal data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemporalData();
  }, [activeCategory, selectedDate]);

  if (isLoading) return <div>Loading temporal data...</div>;
  if (error) return <div>Error: {error}</div>;

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'engagement'];

  const getMetricValue = (institution, network, metric) => {
    const institutionData = temporalData?.find(item => item.Institucion === institution.Institucion);
    return institutionData?.social_networks?.[network]?.[metric] ?? 'N/A';
  };

  const formatNumber = (number) => {
    return typeof number === 'number' ? number.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : number;
  };

  return (
    <Card>
      <Title className="mb-4">Análisis Temporal de Instituciones Seleccionadas ({selectedDate})</Title>
      {selectedInstitutions.map(institution => (
        <div key={institution.Institucion} className="mb-8">
          <Title className="text-lg mb-2">{institution.Institucion}</Title>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Red Social</TableHeaderCell>
                {metrics.map(metric => (
                  <TableHeaderCell key={metric}>{metric}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {networks.map(network => (
                <TableRow key={network}>
                  <TableCell>{network}</TableCell>
                  {metrics.map(metric => (
                    <TableCell key={metric}>
                      <Text>{formatNumber(getMetricValue(institution, network, metric))}</Text>
                    </TableCell>
                  ))}
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