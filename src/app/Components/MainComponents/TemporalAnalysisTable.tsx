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

  const getFollowers = (yearData, network) => {
    return yearData?.social_networks?.[network]?.followers ?? 'N/A';
  };

  const getGrowthRate = (institution, network) => {
    const followers2020 = getFollowers(temporalData['2020']?.find(item => item.Institucion === institution.Institucion), network);
    const followers2021 = getFollowers(temporalData['2021']?.find(item => item.Institucion === institution.Institucion), network);
    
    if (followers2020 === 'N/A' || followers2021 === 'N/A') return 'N/A';
    
    const growthRate = ((followers2021 - followers2020) / followers2020) * 100;
    return growthRate.toFixed(2);
  };

  return (
    <Card>
      <Title className="mb-4">Análisis Temporal de Instituciones Seleccionadas</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Red Social</TableHeaderCell>
            {selectedInstitutions.map(inst => (
              <TableHeaderCell key={inst.Institucion}>{inst.Institucion}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {networks.map(network => (
            <TableRow key={network}>
              <TableCell>{network}</TableCell>
              {selectedInstitutions.map(inst => {
                const growthRate = getGrowthRate(inst, network);
                return (
                  <TableCell key={inst.Institucion}>
                    <Text><strong>2020:</strong> {getFollowers(temporalData['2020']?.find(item => item.Institucion === inst.Institucion), network)}</Text>
                    <Text><strong>2021:</strong> {getFollowers(temporalData['2021']?.find(item => item.Institucion === inst.Institucion), network)}</Text>
                    <Badge color={growthRate > 0 ? 'green' : growthRate < 0 ? 'red' : 'gray'}>
                      {growthRate !== 'N/A' ? `${growthRate}%` : 'N/A'}
                    </Badge>
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