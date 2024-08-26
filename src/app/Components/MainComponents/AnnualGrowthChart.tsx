import React from 'react';
import { Card, Title, AreaChart } from '@tremor/react';

const AnnualGrowthChart = ({ data }) => {
  // Verificar si data es undefined o no es un array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <Title>Crecimiento Anual de Seguidores por Red Social</Title>
        <p className="text-center mt-4">No hay datos disponibles para mostrar el crecimiento anual.</p>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    year: item.year,
    ...item.social_networks
  }));

  return (
    <Card>
      <Title>Crecimiento Anual de Seguidores por Red Social</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="year"
        categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
        colors={["blue", "gray", "pink", "red", "black"]}
        valueFormatter={(number) => `${number.toLocaleString()}`}
      />
    </Card>
  );
};

export default AnnualGrowthChart;