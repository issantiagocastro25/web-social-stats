import React, { useState, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
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

  const getFollowers = (yearData, network) => {
    return yearData?.social_networks?.[network]?.followers ?? 'N/A';
  };

  return (
    <Card>
      <Title>Análisis Temporal de Instituciones Seleccionadas</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Año</TableHeaderCell>
            {selectedInstitutions.map(inst => (
              <TableHeaderCell key={inst.Institucion}>{inst.Institucion}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {years.map(year => (
            <TableRow key={year}>
              <TableCell>{year}</TableCell>
              {selectedInstitutions.map(inst => {
                const yearData = temporalData[year]?.find(item => item.Institucion === inst.Institucion);
                return (
                  <TableCell key={inst.Institucion}>
                    {yearData ? (
                      <>
                        <div>Facebook: {getFollowers(yearData, 'Facebook')}</div>
                        <div>X: {getFollowers(yearData, 'X')}</div>
                        <div>Instagram: {getFollowers(yearData, 'Instagram')}</div>
                        <div>YouTube: {getFollowers(yearData, 'YouTube')}</div>
                        <div>TikTok: {getFollowers(yearData, 'TikTok')}</div>
                      </>
                    ) : 'N/A'}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TemporalAnalysisTable;