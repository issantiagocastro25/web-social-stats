import React from 'react';
import { Card, Text, Flex, Grid } from "@tremor/react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';

interface SocialNetworkStats {
  social_network: string;
  total_followers: number;
  total_publications: number;
  total_reactions: number;
  average_views: number;
}

interface SummaryCardsProps {
  data: {
    stats_date: string;
    stats: SocialNetworkStats[];
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const getIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'facebook': return <FaFacebook className="text-blue-600 text-2xl" />;
      case 'instagram': return <FaInstagram className="text-pink-600 text-2xl" />;
      case 'x': return <FaTwitter className="text-blue-400 text-2xl" />;
      case 'youtube': return <FaYoutube className="text-red-600 text-2xl" />;
      case 'tiktok': return <FaTiktok className="text-black text-2xl" />;
      default: return null;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-10 pb-4" style={{ minWidth: 'max-content' }}>
        {data.stats.map((stat, index) => (
          <Card key={index} className="w-64 flex-shrink-0">
            <Flex alignItems="center" justifyContent="around" className="mb-4">
              {getIcon(stat.social_network)}
              <Text className="font-bold">{stat.social_network}</Text>
            </Flex>
            <Grid numCols={1} className="gap-4">
              <div>
                <Text className="text-sm text-gray-500">Seguidores</Text>
                <Text className="text-xl font-bold">{formatNumber(stat.total_followers)}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Publicaciones</Text>
                <Text className="text-xl font-bold">{formatNumber(stat.total_publications)}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Reacciones</Text>
                <Text className="text-xl font-bold">{formatNumber(stat.total_reactions)}</Text>
              </div>
              {stat.average_views > 0 && (
                <div>
                  <Text className="text-sm text-gray-500">Vistas promedio</Text>
                  <Text className="text-xl font-bold">{formatNumber(stat.average_views)}</Text>
                </div>
              )}
            </Grid>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;