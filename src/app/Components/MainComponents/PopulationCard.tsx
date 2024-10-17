import React, { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex, Select, SelectItem } from '@tremor/react';
import axios from 'axios';

interface PopulationCardProps {
  selectedDate: string;
  availableDates: string[];
  category: 'salud' | 'compensacion';
}

interface GeneralPopulationData {
  date_stat: number;
  poblation: number;
  unique_followers: number;
  percentage_penetration: number;
}

interface DetailedPopulationData extends GeneralPopulationData {
  social_networks: {
    [key: string]: {
      unique_followers: number;
      percentage_penetration: number;
    }
  }
}

const socialNetworks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];

const PopulationCard: React.FC<PopulationCardProps> = ({
  selectedDate,
  availableDates,
  category
}) => {
  const [generalData, setGeneralData] = useState<GeneralPopulationData[]>([]);
  const [detailedData, setDetailedData] = useState<DetailedPopulationData[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const selectedYear = useMemo(() => parseInt(selectedDate.split('-')[0]), [selectedDate]);

  useEffect(() => {
    const fetchGeneralData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = availableDates.map(date => 
          axios.get<GeneralPopulationData>(`${API_URL}/api/social-metrics/followers`, {
            params: { category, stats_date: date }
          })
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);
        
        // Sort data by year and remove duplicates
        const uniqueSortedData = data
          .sort((a, b) => a.date_stat - b.date_stat)
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.date_stat === item.date_stat)
          );

        setGeneralData(uniqueSortedData);
      } catch (error) {
        console.error('Error fetching general data:', error);
        setError('Error al cargar los datos generales de población');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneralData();
  }, [availableDates, API_URL, category]);

  useEffect(() => {
    const fetchDetailedData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = availableDates.map(date => 
          axios.get<DetailedPopulationData>(`${API_URL}/api/social-metrics/followers/social-networks`, {
            params: { category, stats_date: date }
          })
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);

        // Sort data by year and remove duplicates
        const uniqueSortedData = data
          .sort((a, b) => a.date_stat - b.date_stat)
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.date_stat === item.date_stat)
          );

        setDetailedData(uniqueSortedData);
      } catch (error) {
        console.error('Error fetching detailed data:', error);
        setError('Error al cargar los datos detallados de población');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedData();
  }, [availableDates, API_URL, category]);

  const currentData = useMemo(() => {
    return generalData.find(data => data.date_stat === selectedYear) || generalData[generalData.length - 1];
  }, [generalData, selectedYear]);

  const formatLargeNumber = (num?: number) => {
    if (num === undefined) return 'N/A';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderGeneralChart = () => {
    const chartData = generalData.map(item => ({
      year: item.date_stat,
      "Tasa de Penetración": item.percentage_penetration
    }));

    const maxValue = Math.max(...chartData.map(item => item["Tasa de Penetración"]));
    const roundedMaxValue = Math.ceil(maxValue / 5) * 5;

    return (
      <Card className="mt-6">
        <Title>Evolución de la Tasa de Penetración General</Title>
        {chartData.length > 0 ? (
          <AreaChart
            className="h-64 mt-4"
            data={chartData}
            index="year"
            categories={["Tasa de Penetración"]}
            colors={["blue"]}
            valueFormatter={(number) => `${number?.toFixed(2) || 'N/A'}%`}
            yAxisWidth={56}
            showYAxis={true}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
            autoMinValue={true}
            minValue={0}
            maxValue={roundedMaxValue}
            curveType="monotone"
          />
        ) : (
          <Text>No hay datos suficientes para mostrar la gráfica</Text>
        )}
      </Card>
    );
  };

  const renderSocialNetworkChart = () => {
    if (detailedData.length === 0) return null;

    const processedData = detailedData.map(yearData => ({
      year: yearData.date_stat,
      ...socialNetworks.reduce((acc, network) => ({
        ...acc,
        [network]: yearData.social_networks?.[network]?.percentage_penetration || 0
      }), {})
    }));

    const categories = selectedNetwork === 'all' 
      ? socialNetworks 
      : [selectedNetwork];

    const maxValue = Math.max(
      ...processedData.flatMap(item => 
        categories.map(category => item[category] as number)
      )
    );
    const roundedMaxValue = Math.ceil(maxValue / 5) * 5;

    return (
      <Card className="mt-6">
        <Title>
          {selectedNetwork === 'all' 
            ? 'Comparación de Tasas de Penetración por Red Social' 
            : `Evolución de ${selectedNetwork}`}
        </Title>
        <AreaChart
          className="h-80 mt-4"
          data={processedData}
          index="year"
          categories={categories}
          colors={["blue", "cyan", "pink", "red", "green"]}
          valueFormatter={(number) => `${number?.toFixed(2) || 'N/A'}%`}
          yAxisWidth={70}
          showYAxis={true}
          showLegend={true}
          showGridLines={true}
          showAnimation={true}
          autoMinValue={true}
          minValue={0}
          maxValue={roundedMaxValue}
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

  if (!currentData) {
    return <Card className="mt-6"><Text>No hay datos disponibles</Text></Card>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 my-5">
      <Card className="mx-2">
        <div className='flex justify-between items-center'>
          <div className='grid basis-10/12'>
            <Title className='text-secondary-dark text-2xl font-semibold mb-3'>
              {category === 'compensacion' ? 'Tasa penetración Cajas de Compensación' : 'Tasa penetración total'}
            </Title>
            <p>
              {category === 'compensacion' 
                ? 'Porcentaje de la población Colombiana que sigue alguna página de cajas de compensación'
                : 'Porcentaje de la población Colombiana que sigue alguna página de salud institucional'}
            </p>
          </div>
          <Text>{currentData.date_stat}</Text>
        </div>
        
        <div className='grid justify-start align-baseline space-x-2 mt-4'>
          <div className='flex gap-x-3'>
            <Text className='pl-2'>Población Colombia: </Text>
            <Metric className='text-secondary-dark'>{formatLargeNumber(currentData.poblation)}</Metric>
          </div>
          <div className='flex gap-x-3'>
            <Text>Seguidores únicos en el sector {category === 'compensacion' ? 'de cajas de compensación' : 'salud'}</Text>
            <Metric className='text-secondary-dark'>{formatLargeNumber(currentData.unique_followers)}</Metric>
          </div>
          <div className='flex gap-x-3'>
            <Text>Tasa de penetración</Text>
            <Metric className='text-secondary-dark'>{currentData.percentage_penetration?.toFixed(2) || 'N/A'}%</Metric>
          </div>
        </div>
        
        {renderGeneralChart()}
      </Card>

      <Card className="px-4">
        <div className='pb-4'>
          <p className='text-secondary-dark font-semibold text-xl pb-3'>
            Comparación de Tasas de Penetración por Red Sociales
          </p>
          <span className='text-base'>
            Porcentaje de los usuarios de cada red social en Colombia que siguen alguna página 
            {category === 'compensacion' ? ' de cajas de compensación' : ' de salud institucional'}
          </span>
        </div>
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