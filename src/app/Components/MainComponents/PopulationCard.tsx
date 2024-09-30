import React from 'react';
import { Card, Title, Text, Metric, AreaChart, Flex, Badge, Select, SelectItem } from '@tremor/react';

interface PopulationCardProps {
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  population: number;
  uniqueFollowers: number;
  penetrationRate: number;
}

const PopulationCard: React.FC<PopulationCardProps> = ({
  dates,
  selectedDate,
  onDateChange,
  population,
  uniqueFollowers,
  penetrationRate,
}) => {
  const year = selectedDate.split('-')[0];

  // Datos para el gráfico
  const chartdata = [
    {
      year: (parseInt(year) - 2).toString(),
      "Tasa de Penetración": Math.max(0, penetrationRate - 2),
    },
    {
      year: (parseInt(year) - 1).toString(),
      "Tasa de Penetración": Math.max(0, penetrationRate - 1),
    },
    {
      year,
      "Tasa de Penetración": penetrationRate,
    },
  ];

  return (
    <Card className="mt-6">
      <Flex justifyContent="between" alignItems="center">
        <Title>Población Colombia</Title>
        <Select value={selectedDate} onValueChange={onDateChange}>
          {dates.map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
        </Select>
      </Flex>
      
      <Flex justifyContent="start" alignItems="baseline" className="space-x-2 mt-4">
        <Metric>{population.toLocaleString()}</Metric>
        <Text>habitantes</Text>
      </Flex>

      <Flex justifyContent="between" className="mt-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Seguidores únicos en el sector salud</Text>
          <Metric>{uniqueFollowers.toLocaleString()}</Metric>
        </Card>
        <Card decoration="top" decorationColor="green">
          <Text>Tasa de penetración</Text>
          <Metric>{penetrationRate.toFixed(2)}%</Metric>
        </Card>
      </Flex>
      
      <Text className="mt-4">Evolución de la Tasa de Penetración</Text>
      <AreaChart
        className="mt-2 h-40"
        data={chartdata}
        index="year"
        categories={["Tasa de Penetración"]}
        colors={["blue"]}
        showLegend={false}
        showYAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showAnimation={true}
        valueFormatter={(number) => `${number.toFixed(2)}%`}
      />
    </Card>
  );
};

export default PopulationCard;