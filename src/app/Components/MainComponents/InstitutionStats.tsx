import React from 'react';
import { Card, Title, Text, Grid, Metric, BarChart, DonutChart, AreaChart } from '@tremor/react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon.tsx';

const InstitutionStats = ({ institution }) => {
  const socialMediaData = [
    { name: 'Facebook', value: institution.social_networks.Facebook?.followers || 0, color: 'blue', icon: FaFacebook },
    { name: 'X', value: institution.social_networks.X?.followers || 0, color: 'black', icon: XIcon },
    { name: 'Instagram', value: institution.social_networks.Instagram?.followers || 0, color: 'pink', icon: FaInstagram },
    { name: 'YouTube', value: institution.social_networks.YouTube?.followers || 0, color: 'red', icon: FaYoutube },
    { name: 'TikTok', value: institution.social_networks.Tiktok?.followers || 0, color: 'black', icon: SiTiktok },
  ];

  const youtubeData = [
    { name: 'Seguidores', value: institution.social_networks.YouTube?.followers || 0 },
    { name: 'Publicaciones', value: institution.social_networks.YouTube?.publications || 0 },
    { name: 'Reacciones', value: institution.social_networks.YouTube?.reactions || 0 },
  ];

  const annualGrowthData = [
    { year: '2020', Facebook: 5, X: 3, Instagram: 8, YouTube: 10, TikTok: 15 },
    { year: '2021', Facebook: 7, X: 4, Instagram: 10, YouTube: 12, TikTok: 20 },
    { year: '2022', Facebook: 6, X: 5, Instagram: 12, YouTube: 15, TikTok: 25 },
    { year: '2023', Facebook: 8, X: 6, Instagram: 15, YouTube: 18, TikTok: 30 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <Title className="mb-4 text-xl text-center">Datos de {institution.Institucion}</Title>
          <div className="space-y-4">
            <div>
              <Text className='text-xl text-center'><strong>Ciudad:</strong> {institution.Ciudad || 'N/A'}</Text>
              <Text className='text-xl text-center'><strong>Tipo:</strong> {institution.Tipo || 'Sin clasificar'}</Text>
            </div>
            <div>
              {Object.entries(institution.social_networks).map(([network, data]) => (
                <Text key={network} className='text-xl text-center'>
                  <strong>{network}:</strong> {data.followers || 0} seguidores
                </Text>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex-1">
          <Title className='text-xl text-center'>Estadísticas de YouTube</Title>
          <div className="mt-4">
            <DonutChart
              className="h-48"
              data={youtubeData}
              category="value"
              index="name"
              colors={["red", "orange", "yellow"]}
              showLabel={true}
            />
            <div className="mt-4">
              {youtubeData.map((item, index) => (
                <div key={index} className="flex justify-between items-center mt-2">
                  <Text>{item.name}</Text>
                  <Metric>{item.value.toLocaleString()}</Metric>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Title>Estadísticas de Redes Sociales</Title>
        <BarChart
          className="mt-4 h-80"
          data={socialMediaData}
          index="name"
          categories={["value"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          yAxisWidth={48}
          showLegend={false}
        />
      </Card>

      {/* <Card>
        <Title>Crecimiento Anual en Redes Sociales</Title>
        <AreaChart
          className="mt-4 h-80"
          data={annualGrowthData}
          index="year"
          categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
          colors={["blue", "cyan", "pink", "red", "black"]}
          valueFormatter={(number) => `${number}%`}
        />
        <div className="mt-4 flex justify-center space-x-4">
          {socialMediaData.map((network) => (
            <div key={network.name} className="flex items-center">
              <network.icon className={`text-${network.color}-500 mr-2`} />
              <Text>{network.name}</Text>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
};

export default InstitutionStats;