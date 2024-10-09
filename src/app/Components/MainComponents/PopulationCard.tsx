import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex } from '@tremor/react';
import axios from 'axios';

interface PopulationCardProps {
  selectedDate: string;
  category: string;
  availableDates: string[];
}

interface PopulationData {
  date_stat: number;
  poblation: number;
  unique_followers: number;
  percentage_penetration: number;
}

const PopulationCard: React.FC<PopulationCardProps> = ({
  selectedDate,
  category,
  availableDates
}) => {
  const [currentData, setCurrentData] = useState<PopulationData | null>(null);
  const [chartData, setChartData] = useState<PopulationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/social-metrics/followers`, {
          params: {
            category: category,
            stats_date: selectedDate
          }
        });
        setCurrentData(response.data);
      } catch (error) {
        console.error('Error fetching population data:', error);
      }
    };

    fetchData();
  }, [selectedDate, category]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const selectedYear = parseInt(selectedDate.split('-')[0]);
        
        const historicalDataPromises = availableDates
          .filter(date => parseInt(date.split('-')[0]) <= selectedYear)
          .map(date => 
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/social-metrics/followers`, {
              params: {
                category: category,
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
      }
    };

    fetchHistoricalData();
  }, [availableDates, selectedDate, category]);

  if (!currentData) {
    return <Card className="mt-6"><Text>Cargando datos...</Text></Card>;
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="mt-6 p-6">
      <Flex justifyContent="between" alignItems="center">
        <Title>Población Colombia</Title>
        <Text>{selectedDate}</Text>
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
          <Metric>{currentData.percentage_penetration.toFixed(2)}%</Metric>
        </Card>
      </Flex>
      
      <Text className="mt-6 mb-2">Evolución de la Tasa de Penetración</Text>
      <AreaChart
        className="h-64"
        data={chartData}
        index="date_stat"
        categories={["percentage_penetration"]}
        colors={["blue"]}
        showLegend={false}
        showYAxis={true}
        showGridLines={true}
        showAnimation={true}
        valueFormatter={(number) => `${number.toFixed(0)}%`}
        yAxisWidth={70}
        showTooltip={true}
        autoMinValue={true}
        minValue={0}
        maxValue={100}
        tickGap={10}
        customTooltip={({ payload }) => {
          if (payload && payload.length > 0) {
            const { date_stat, percentage_penetration } = payload[0].payload;
            return (
              <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
                <p className="font-semibold">{date_stat}</p>
                <p>{percentage_penetration.toFixed(2)}%</p>
              </div>
            );
          }
          return null;
        }}
      />
    </Card>
  );
};

export default PopulationCard;