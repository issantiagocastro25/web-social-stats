import React, { useState, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';

const TemporalAnalysisTable = ({ selectedInstitutions }) => {
  const [temporalData, setTemporalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemporalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data2020 = await fetchSocialStats({ category: 'todos', year: '2020' });
        const data2021 = await fetchSocialStats({ category: 'todos', year: '2021' });
        
        const combinedData = {
          2020: data2020.metrics,
          2021: data2021.metrics
        };
        
        setTemporalData(combinedData);
      } catch (err) {
        setError('Error fetching temporal data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemporalData();
  }, []);

  if (isLoading) return <div>Loading temporal data...</div>;
  if (error) return <div>Error: {error}</div>;

  const years = ['2020', '2021'];
  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];
  const metrics = ['followers', 'publications', 'reactions', 'engagement'];

  const getMetricValue = (yearData, network, metric) => {
    return yearData?.social_networks?.[network]?.[metric] ?? 'N/A';
  };

  const calculateGrowth = (currentValue, previousValue) => {
    if (previousValue === 'N/A' || currentValue === 'N/A') return 'N/A';
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    return growth.toFixed(2);
  };

  const formatNumber = (number) => {
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
                <TableHeaderCell>Red Social</TableHeaderCell>
                {years.map(year => (
                  <TableHeaderCell key={year}>{year}</TableHeaderCell>
                ))}
                <TableHeaderCell>Crecimiento</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {networks.map(network => (
                <TableRow key={network}>
                  <TableCell>{network}</TableCell>
                  {years.map(year => {
                    const yearData = temporalData[year]?.find(item => item.Institucion === institution.Institucion);
                    return (
                      <TableCell key={year}>
                        {metrics.map(metric => (
                          <div key={metric} className="mb-1">
                            <Text className="font-semibold">{metric}:</Text>
                            <Text>{formatNumber(getMetricValue(yearData, network, metric))}</Text>
                          </div>
                        ))}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {metrics.map(metric => {
                      const currentValue = getMetricValue(temporalData['2021']?.find(item => item.Institucion === institution.Institucion), network, metric);
                      const previousValue = getMetricValue(temporalData['2020']?.find(item => item.Institucion === institution.Institucion), network, metric);
                      const growth = calculateGrowth(currentValue, previousValue);
                      return (
                        <div key={metric} className="mb-1">
                          <Text className="font-semibold">{metric}:</Text>
                          <Badge color={growth > 0 ? 'green' : growth < 0 ? 'red' : 'gray'}>
                            {growth !== 'N/A' ? `${growth}% (${formatNumber(currentValue)})` : 'N/A'}
                          </Badge>
                        </div>
                      );
                    })}
                  </TableCell>
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