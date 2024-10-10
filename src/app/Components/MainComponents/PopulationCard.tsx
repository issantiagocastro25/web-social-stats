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

  const renderSocialNetworkChart = () => {
    const validChartData = chartData.filter(data => data.social_networks);
    const categories = selectedNetwork === 'all' ? socialNetworks : [selectedNetwork];
    
    const processedData = validChartData.map(data => ({
      year: data.date_stat.toString().slice(0, 4), // Extraer solo el año
      "Tasa de Penetración": data.percentage_penetration,
      ...socialNetworks.reduce((acc, network) => ({
        ...acc,
        [network]: data.social_networks?.[network]?.penetration_rate
      }), {})
    }));

    return (
      <Card className="mt-6">
        <Title>Evolución de la Tasa de Penetración por Red Social</Title>
        {processedData.length > 0 ? (
          <AreaChart
            className="h-80 mt-4"
            data={processedData}
            index="year"
            categories={selectedNetwork === 'all' ? ["Tasa de Penetración", ...categories] : categories}
            colors={["blue", "cyan", "pink", "red", "green", "orange"]}
            valueFormatter={(number) => `${number?.toFixed() || 'N/A'}%`}
            yAxisWidth={56}
            showYAxis={true}
            showLegend={true}
            showGridLines={true}
            showAnimation={true}
            autoMinValue={true}
            minValue={0}
            maxValue={100}
            curveType="monotone"
            customTooltip={({ payload, active }) => {
              if (!active || !payload) return null;
              return (
                <div className="w-64 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
                  <div className="font-medium text-tremor-content-emphasis">{`Año: ${payload[0].payload.year}`}</div>
                  {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-tremor-full`} style={{backgroundColor: entry.color}} />
                        <span className="text-tremor-content">{entry.name}:</span>
                      </div>
                      <span className="font-medium text-tremor-content-emphasis">{entry.value?.toFixed()}%</span>
                    </div>
                  ))}
                </div>
              );
            }}
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
            <Metric>{currentData.percentage_penetration?.toFixed() || 'N/A'}%</Metric>
          </Card>
        </Flex>
        
        <Text className="mt-6 mb-2">Evolución de la Tasa de Penetración General</Text>
        <AreaChart
          className="h-64"
          data={chartData.map(data => ({
            year: data.date_stat.toString().slice(0, 4), // Extraer solo el año
            "Tasa de Penetración": data.percentage_penetration
          }))}
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
          maxValue={25}
          curveType="monotone"
        />
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