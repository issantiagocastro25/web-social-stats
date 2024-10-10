import React, { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex, Select, SelectItem } from '@tremor/react';
import axios from 'axios';

interface PopulationCardProps {
  selectedDate: string;
  availableDates: string[];
}

interface SocialNetworkData {
  unique_followers: number;
  percentage_penetration: number;
}

interface PopulationData {
  date_stat: number;
  poblation: number;
  unique_followers: number;
  percentage_penetration: number;
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
        const historicalDataPromises = availableDates.map(date => 
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
        
        setChartData(sortedData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setError('Error al cargar los datos históricos');
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

  if (error) {
    return <Card className="mt-6"><Text color="red">{error}</Text></Card>;
  }

  if (!currentData) {
    return <Card className="mt-6"><Text>Cargando datos...</Text></Card>;
  }

  const renderSocialNetworkChart = () => {
    const processedData = chartData.map(data => {
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
        {processedData.length > 0 ? (
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
              return `${number?.toFixed() || 'N/A'}%`;
            }}
            yAxisWidth={56}
            showYAxis={true}
            showLegend={true}
            showGridLines={true}
            showAnimation={true}
            autoMinValue={true}
            minValue={0}
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
                      <span className="font-medium text-tremor-content-emphasis">
                        {entry.name === "Seguidores Únicos" 
                          ? formatLargeNumber(entry.value)
                          : `${entry.value?.toFixed()}%`}
                      </span>
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
          <Text>{currentData.date_stat}</Text>
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
            <div className='py-3'>
            <Text>Tasa de penetración</Text>
            <Metric>{currentData.percentage_penetration?.toFixed() || 'N/A'}%</Metric>
            </div>
          </Card>
        </Flex>
        
        <Text className="mt-6 mb-2">Evolución de la Tasa de Penetración General</Text>
        <AreaChart
          className="h-64"
          data={chartData.map(data => ({
            year: data.date_stat,
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
          maxValue={100}
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