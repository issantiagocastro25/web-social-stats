import React, { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex, Select, SelectItem } from '@tremor/react';
import axios from 'axios';

interface PopulationCardProps {
  selectedDate: string;
  availableDates: string[];
}

interface SocialNetworkData {
  followers?: number;
  penetration_rate?: number;
}

interface PopulationData {
  date_stat: number;
  poblation: number;
  unique_followers: number;
  percentage_penetration: number;
  social_networks?: {
    Facebook?: SocialNetworkData;
    Instagram?: SocialNetworkData;
    X?: SocialNetworkData;
    Youtube?: SocialNetworkData;
    Tiktok?: SocialNetworkData;
  }
}

const socialNetworks = ['Facebook', 'X', 'Instagram', 'Youtube', 'Tiktok'];

const PopulationCard: React.FC<PopulationCardProps> = ({
  selectedDate,
  availableDates
}) => {
  const [currentData, setCurrentData] = useState<PopulationData | null>(null);
  const [chartData, setChartData] = useState<PopulationData[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | 'all'>('all');
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/social-metrics/followers`, {
          params: {
            category: 'salud',
            stats_date: selectedDate
          }
        });
        setCurrentData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching population data:', error);
        setError('Error al cargar los datos de población');
      }
    };

    fetchData();
  }, [selectedDate, API_URL]);


  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const selectedYear = parseInt(selectedDate.split('-')[0]);
        
        const historicalDataPromises = availableDates
          .filter(date => parseInt(date.split('-')[0]) <= selectedYear)
          .map(date => 
            axios.get(`${API_URL}/api/social-metrics/followers`, {
              params: {
                category: 'salud',
                stats_date: date
              }
            })
          );
        
        const results = await Promise.all(historicalDataPromises);
        const sortedData = results
          .map(result => result.data)
          .sort((a, b) => a.date_stat - b.date_stat);
        
        const filteredData = sortedData.reduce((acc, current) => {
          const year = current.date_stat.toString().slice(0, 4);
          if (!acc[year] || current.date_stat > acc[year].date_stat) {
            acc[year] = current;
          }
          return acc;
        }, {});
        
        setChartData(Object.values(filteredData));
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [availableDates, selectedDate, API_URL]);

  const formatLargeNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    const [year, month, day] = selectedDate.split('-');
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

  if (error) {
    return <Card className="mt-6"><Text color="red">{error}</Text></Card>;
  }

  if (!currentData) {
    return <Card className="mt-6"><Text>Cargando datos...</Text></Card>;
  }

  const renderSocialNetworkData = () => (
    <div className="mt-4">
      <Title>Datos de Redes Sociales</Title>
      <Select value={selectedNetwork} onValueChange={setSelectedNetwork as any}>
        <SelectItem value="all">Todas las redes</SelectItem>
        {socialNetworks.map(network => (
          <SelectItem key={network} value={network}>{network}</SelectItem>
        ))}
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {socialNetworks.map(network => {
          const networkData = currentData.social_networks?.[network] || {};
          return (
            <Card key={network} className="mt-2">
              <Title>{network}</Title>
              <Flex justifyContent="between" className="mt-2">
                <Text>Seguidores:</Text>
                <Metric>{formatLargeNumber(networkData.followers)}</Metric>
              </Flex>
              <Flex justifyContent="between" className="mt-2">
                <Text>Tasa Penetración:</Text>
                <Metric>{networkData.penetration_rate?.toFixed(2) || 'N/A'}%</Metric>
              </Flex>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderSocialNetworkChart = () => {
    const validChartData = chartData.filter(data => data.social_networks);
    const categories = selectedNetwork === 'all' ? socialNetworks : [selectedNetwork];
    
    return (
      <Card className="mt-6">
        <Title>Evolución de la Tasa de Penetración por Red Social</Title>
        {validChartData.length > 0 ? (
          <AreaChart
            className="h-80 mt-4"
            data={validChartData.map(data => ({
              date_stat: data.date_stat,
              ...socialNetworks.reduce((acc, network) => ({
                ...acc,
                [network]: data.social_networks?.[network]?.penetration_rate
              }), {})
            }))}
            index="date_stat"
            categories={categories}
            colors={["blue", "cyan", "pink", "red", "green"]}
            valueFormatter={(number) => `${number?.toFixed(2) || 'N/A'}%`}
            yAxisWidth={40}
          />
        ) : (
          <Text>No hay datos suficientes para mostrar la gráfica</Text>
        )}
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <Flex justifyContent="between" alignItems="center">
          <Title>Población Colombia</Title>
          <Text>{formattedDate}</Text>
        </Flex>
        
        <Flex justifyContent="start" alignItems="baseline" className="space-x-2 mt-4">
          <Metric>{formatLargeNumber(currentData.poblation)}</Metric>
          <Text>habitantes</Text>
        </Flex>

        <Flex justifyContent="between" className="mt-4">
          <Card decoration="top" decorationColor="blue" className="w-[48%]">
            <Text>Seguidores únicos en el sector salud</Text>
            <Metric>{formatLargeNumber(currentData.unique_followers)}</Metric>
          </Card>
          <Card decoration="top" decorationColor="green" className="w-[48%]">
            <Text>Tasa de penetración</Text>
            <Metric>{currentData.percentage_penetration?.toFixed(2) || 'N/A'}%</Metric>
          </Card>
        </Flex>
        
        <Text className="mt-6 mb-2">Evolución de la Tasa de Penetración General</Text>
        <AreaChart
          className="h-64"
          data={chartData}
          index="date_stat"
          categories={["percentage_penetration"]}
          colors={["blue"]}
          valueFormatter={(number) => `${number?.toFixed(2) || 'N/A'}%`}
          yAxisWidth={40}
        />
      </Card>

      <Card className="p-6">
        {renderSocialNetworkData()}
        {renderSocialNetworkChart()}
      </Card>
    </div>
  );
};

export default PopulationCard;