import React, { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex, Select, SelectItem } from '@tremor/react';
import axios from 'axios';

interface PopulationCardProps {
  selectedDate: string;
  availableDates: string[];
}

interface GeneralPopulationData {
  date_stat: number;
  poblation: number;
  unique_followers: number;
  percentage_penetration: number;
}

interface SocialNetworkData {
  unique_followers: number;
  percentage_penetration: number;
}

interface DetailedPopulationData extends GeneralPopulationData {
  social_networks: {
    Facebook: SocialNetworkData;
    X: SocialNetworkData;
    Instagram: SocialNetworkData;
    YouTube: SocialNetworkData;
    TikTok: SocialNetworkData;
  }
}

const socialNetworks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];

const PopulationCard: React.FC<PopulationCardProps> = ({
  selectedDate,
  availableDates
}) => {
  const [generalData, setGeneralData] = useState<GeneralPopulationData | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedPopulationData | null>(null);
  const [generalChartData, setGeneralChartData] = useState<GeneralPopulationData[]>([]);
  const [detailedChartData, setDetailedChartData] = useState<DetailedPopulationData[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchGeneralData = async (date: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/social-metrics/followers`, {
        params: { category: 'salud', stats_date: date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching general population data:', error);
      throw error;
    }
  };

  const fetchDetailedData = async (date: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/social-metrics/followers/social-networks`, {
        params: { category: 'salud', stats_date: date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed population data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [generalResult, detailedResult] = await Promise.all([
          fetchGeneralData(selectedDate),
          fetchDetailedData(selectedDate)
        ]);
        setGeneralData(generalResult);
        setDetailedData(detailedResult);
      } catch (error) {
        setError('Error al cargar los datos de población');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, API_URL]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const generalPromises = availableDates.map(date => fetchGeneralData(date));
        const detailedPromises = availableDates.map(date => fetchDetailedData(date));
        
        const [generalResults, detailedResults] = await Promise.all([
          Promise.all(generalPromises),
          Promise.all(detailedPromises)
        ]);

        setGeneralChartData(generalResults.sort((a, b) => a.date_stat - b.date_stat));
        setDetailedChartData(detailedResults.sort((a, b) => a.date_stat - b.date_stat));
      } catch (error) {
        setError('Error al cargar los datos históricos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [availableDates, API_URL]);

  const formatLargeNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderGeneralChart = () => (
    <Card className="mt-6">
      <Title>Evolución de la Tasa de Penetración General</Title>
      <AreaChart
        className="h-64"
        data={generalChartData}
        index="date_stat"
        categories={["percentage_penetration"]}
        colors={["blue"]}
        valueFormatter={(number) => `${number?.toFixed() || 'N/A'}%`}
        yAxisWidth={56}
        showYAxis={true}
        showLegend={false}
        showGridLines={true}
        showAnimation={true}
        autoMinValue={true}
        minValue={0}
        maxValue={25}
        curveType="monotone"
      />
    </Card>
  );

  const renderSocialNetworkChart = () => {
    const processedData = detailedChartData.map(data => {
      const baseObject = {
        year: data.date_stat,
      };

      if (selectedNetwork === 'all') {
        socialNetworks.forEach(network => {
          baseObject[network] = data.social_networks[network].percentage_penetration;
        });
      } else {
        baseObject["Tasa de Penetración"] = data.social_networks[selectedNetwork].percentage_penetration;
        baseObject["Seguidores Únicos"] = data.social_networks[selectedNetwork].unique_followers;
      }

      return baseObject;
    });

    const categories = selectedNetwork === 'all' 
      ? socialNetworks 
      : ["Tasa de Penetración", "Seguidores Únicos"];

    return (
      <Card className="mt-6">
        <Title>
          {selectedNetwork === 'all' 
            ? 'Comparación de Tasas de Penetración por Red Social' 
            : `Datos de ${selectedNetwork}`}
        </Title>
        <AreaChart
          className="h-80 mt-4"
          data={processedData}
          index="year"
          categories={categories}
          colors={selectedNetwork === 'all' 
            ? ["blue", "cyan", "pink", "red", "green"] 
            : ["blue", "green"]}
          valueFormatter={(number, category) => {
            if (category === "Seguidores Únicos") {
              return formatLargeNumber(number);
            }
            return `${number?.toFixed(1) || 'N/A'}%`;
          }}
          yAxisWidth={56}
          showYAxis={true}
          showLegend={true}
          showGridLines={true}
          showAnimation={true}
          autoMinValue={true}
          minValue={0}
          curveType="monotone"
        />
      </Card>
    );
  };

  if (isLoading) {
    return <Card className="mt-6"><Text>Cargando datos...</Text></Card>;
  }

  if (error) {
    return <Card className="mt-6"><Text color="red">{error}</Text></Card>;
  }

  if (!generalData || !detailedData) {
    return <Card className="mt-6"><Text>No hay datos disponibles</Text></Card>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <Flex justifyContent="between" alignItems="center">
          <Title>Población Colombia</Title>
          <Text>{generalData.date_stat}</Text>
        </Flex>
        
        <Flex justifyContent="start" alignItems="baseline" className="space-x-2 mt-4">
          <Metric>{formatLargeNumber(generalData.poblation)}</Metric>
          <Text>habitantes</Text>
        </Flex>

        <Flex justifyContent="between" className="mt-4">
          <Card decoration="top" decorationColor="blue" className="w-[48%]">
            <Text>Seguidores únicos en el sector salud</Text>
            <Metric>{formatLargeNumber(generalData.unique_followers)}</Metric>
          </Card>
          <Card decoration="top" decorationColor="green" className="w-[48%]">
            <Text>Tasa de penetración</Text>
            <Metric>{generalData.percentage_penetration?.toFixed(1) || 'N/A'}%</Metric>
          </Card>
        </Flex>
        
        {renderGeneralChart()}
      </Card>

      <Card className="p-6">
        <Select value={selectedNetwork} onValueChange={setSelectedNetwork as any}>
          <SelectItem value="all">Todas las redes</SelectItem>
          {socialNetworks.map(network => (
            <SelectItem key={network} value={network}>{network}</SelectItem>
          ))}
        </Select>
        {renderSocialNetworkChart()}
      </Card>
    </div>
  );
};

export default PopulationCard;