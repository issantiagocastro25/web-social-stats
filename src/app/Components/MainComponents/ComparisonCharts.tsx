import React from 'react';
import { Card, Title, Text, BarChart, LineChart, ScatterChart } from '@tremor/react';

const ComparisonCharts = ({ selectedInstitutions }) => {
  const prepareChartData = (metric) => {
    return selectedInstitutions.map(institution => ({
      name: institution.Institucion,
      Facebook: institution.social_networks?.Facebook?.[metric] || 0,
      X: institution.social_networks?.X?.[metric] || 0,
      Instagram: institution.social_networks?.Instagram?.[metric] || 0,
      YouTube: institution.social_networks?.YouTube?.[metric] || 0,
      TikTok: institution.social_networks?.TikTok?.[metric] || 0,
    }));
  };

  const followersData = prepareChartData('followers');
  const publicationsData = prepareChartData('publications');
  const reactionsData = prepareChartData('reactions');
  const engagementData = prepareChartData('engagement');

  return (
    <div className="space-y-6">
      <Card>
        <Title>Comparación de Seguidores por Red Social</Title>
        <BarChart
          className="mt-4 h-80"
          data={followersData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          stack={false}
        />
      </Card>


      <Card>
        <Title>Comparación de Publicaciones por Red Social</Title>
        <LineChart
          className="mt-4 h-80"
          data={publicationsData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          connectNulls={true}
        />
      </Card>

      <Card>
        <Title>Comparación de Reacciones por Red Social</Title>
        <BarChart
          className="mt-4 h-80"
          data={reactionsData}
          index="name"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          stack={true}
        />
      </Card>

      {/*<Card>
        <Title>Comparación de Engagement por Red Social</Title>
        <ScatterChart
          className="mt-4 h-80"
          data={engagementData}
          category="name"
          x="Facebook"
          y="Instagram"
          size="YouTube"
          color="TikTok"
          showLegend={false}
        >
          <Text>
            Tamaño del punto: YouTube engagement
            Color del punto: TikTok engagement
          </Text>
        </ScatterChart>
      </Card>*/}
    </div>
  );
};

export default ComparisonCharts;