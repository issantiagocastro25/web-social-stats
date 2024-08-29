import React, { useMemo } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';

const AnnualGrowthChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedData = data.reduce((acc, item) => {
      const year = new Date(item.date).getFullYear();
      if (!acc[year]) {
        acc[year] = {
          year: year.toString(),
          Facebook: 0,
          X: 0,
          Instagram: 0,
          YouTube: 0,
          TikTok: 0
        };
      }
      Object.entries(item.social_networks).forEach(([network, stats]) => {
        acc[year][network] += stats.followers;
      });
      return acc;
    }, {});

    return Object.values(groupedData);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <Title>Crecimiento Anual de Seguidores por Red Social</Title>
        <p className="text-center mt-4">No hay datos disponibles para mostrar el crecimiento anual.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Title>Crecimiento Anual de Seguidores por Red Social</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="year"
        categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
        colors={["blue", "gray", "pink", "red", "black"]}
        valueFormatter={(number) => `${number.toLocaleString()} seguidores`}
      />
    </Card>
  );
};

export default AnnualGrowthChart;