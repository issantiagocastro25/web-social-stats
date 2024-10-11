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
  availableDates
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
            params: { category: 'salud', stats_date: date }
          })
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);
        
        const uniqueData = data.reduce((acc, current) => {
          const x = acc.find(item => item.date_stat === current.date_stat);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as GeneralPopulationData[]).sort((a, b) => a.date_stat - b.date_stat);

        setGeneralData(uniqueData);
      } catch (error) {
        console.error('Error fetching general data:', error);
        setError('Error al cargar los datos generales de población');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneralData();
  }, [availableDates, API_URL]);

  useEffect(() => {
    const fetchDetailedData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = availableDates.map(date => 
          axios.get<DetailedPopulationData>(`${API_URL}/api/social-metrics/followers/social-networks`, {
            params: { category: 'salud', stats_date: date }
          })
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data);
        
        const uniqueData = data.reduce((acc, current) => {
          const x = acc.find(item => item.date_stat === current.date_stat);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as DetailedPopulationData[]).sort((a, b) => a.date_stat - b.date_stat);

        setDetailedData(uniqueData);
      } catch (error) {
        console.error('Error fetching detailed data:', error);
        setError('Error al cargar los datos detallados de población');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedData();
  }, [availableDates, API_URL]);

  const filteredGeneralData = useMemo(() => {
    return generalData.filter(data => data.date_stat <= selectedYear);
  }, [generalData, selectedYear]);

  const filteredDetailedData = useMemo(() => {
    return detailedData.filter(data => data.date_stat <= selectedYear);
  }, [detailedData, selectedYear]);

  const currentData = useMemo(() => {
    return filteredGeneralData[filteredGeneralData.length - 1];
  }, [filteredGeneralData]);

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
    const chartData = filteredGeneralData.map(item => ({
      year: item.date_stat,
      "Tasa de Penetración": item.percentage_penetration
    }));

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
            valueFormatter={(number) => `${number?.toFixed() || 'N/A'}%`}
            yAxisWidth={56}
            showYAxis={true}
            showLegend={false}
            showGridLines={true}
            showAnimation={true}
            autoMinValue={true}
            minValue={0}
            maxValue={30}
            curveType="monotone"
          />
        ) : (
          <Text>No hay datos suficientes para mostrar la gráfica</Text>
        )}
      </Card>
    );
  };

  const renderSocialNetworkChart = () => {
    if (filteredDetailedData.length === 0) return null;

    const processedData = filteredDetailedData.map(yearData => ({
      year: yearData.date_stat,
      ...socialNetworks.reduce((acc, network) => ({
        ...acc,
        [network]: yearData.social_networks[network]?.percentage_penetration || 0
      }), {})
    }));

    const categories = selectedNetwork === 'all' 
      ? socialNetworks 
      : [selectedNetwork];

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
          valueFormatter={(number) => `${number?.toFixed(1) || 'N/A'}%`}
          yAxisWidth={70}
          showYAxis={true}
          showLegend={true}
          showGridLines={true}
          showAnimation={true}
          autoMinValue={true}
          minValue={0}
          maxValue={100}
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
      <Card className="p-6">
        
        <div className='flex justify-between items-center'>
          <div className='grid basis-10/12'>
            <Title className=' text-[#4A00A5] text-2xl font-semibold mb-2 '> Tasa penetración total</Title>
            <p> Porcentaje de la poblacion Colombiana que sigue alguna pagina de salud institucional</p>
          </div>
          <Text>{currentData.date_stat}</Text>
        </div>
          
        
        <div className=' grid justify-start align-baseline space-x-2 mt-4'>
          <div className='flex gap-x-3'>
            <Text className=' pl-2'>Población Colombia: </Text>
            <Metric className=' text-[#4A00A5]'>{formatLargeNumber(currentData.poblation)}</Metric>
          </div>
          <div className=' flex gap-x-3'>
            <Text>Seguidores únicos en el sector salud</Text>
            <Metric className=' text-[#4A00A5]'>{formatLargeNumber(currentData.unique_followers)}</Metric>
          </div>
          <div className=' flex gap-x-3'>
            <Text>Tasa de penetración</Text>
            <Metric className=' text-[#4A00A5]' >{currentData.percentage_penetration?.toFixed(0) || 'N/A'}%</Metric>
          </div>
        </div>

        {/* <Flex justifyContent="between" className="mt-4">
          <Card decoration="top" decorationColor="blue" className="w-[48%]">
            <Text>Seguidores únicos en el sector salud</Text>
            <Metric>{formatLargeNumber(currentData.unique_followers)}</Metric>
          </Card>
          <Card decoration="top" decorationColor="green" className="w-[48%]">
            <Text>Tasa de penetración</Text>
            <Metric>{currentData.percentage_penetration?.toFixed(0) || 'N/A'}%</Metric>
          </Card>
        </Flex> */}
        
        {renderGeneralChart()}
      </Card>

      <Card className="">
        <div className='pb-4'>
          <p className='text-[#4A00A5] font-semibold text-xl '>
            Comparación de Tasas de Penetración por Red Sociales
          </p>
          <span className=' text-base'> Porcentaje de los usuarios de cada red social en Colombia que siguen alguna paginá de salud 
            institucional</span>
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