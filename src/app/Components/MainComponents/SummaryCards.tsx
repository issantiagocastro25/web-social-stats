import React from 'react';
import { Card, Text, Flex, Grid } from "@tremor/react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaUsers } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

interface SummaryCardsProps {
  data: {
    stats_date: string;
    unique_followers: {
      facebook: number;
      X: number;
      Instagram: number;
      YouTube: number;
      Tiktok: number;
    };
    stats?: Array<{
      social_network: string;
      total_followers: number;
      total_publications: number;
      total_reactions: number;
      average_views: number;
    }>;
  } | null;
  isAllCategory: boolean;
  isLoading: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data, isAllCategory, isLoading }) => {
  if (isLoading) {
    return <div>Loading summary data...</div>;
  }

  if (!data) {
    return <div>No summary data available</div>;
  }

  const getIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'facebook': return <FaFacebook className="text-blue-600 text-2xl" />;
      case 'instagram': return <FaInstagram className="text-pink-600 text-2xl" />;
      case 'x': return <FaXTwitter className="text-black text-2xl" />;
      case 'youtube': return <FaYoutube className="text-red-600 text-2xl" />;
      case 'tiktok': return <FaTiktok className="text-black text-2xl" />;
      default: return null;
    }
  };

  const totalUniqueFollowers = Object.values(data.unique_followers).reduce((sum, count) => sum + count, 0);

  const networkCards = Object.entries(data.unique_followers).map(([network, followers]) => {
    const statsForNetwork = data.stats?.find(stat => stat.social_network.toLowerCase() === network.toLowerCase());
    
    return (
      <Card key={network} className="w-64 flex-shrink-0">
        <Flex alignItems="center" justifyContent="around" className="mb-4">
          {getIcon(network)}
          <Text className="font-bold">{network}</Text>
        </Flex>
        <Grid numCols={1} className="gap-4">
          <div>
            <Text className="text-sm text-gray-500">Seguidores Únicos</Text>
            <Text className="text-xl font-bold">{followers.toLocaleString()}</Text>
          </div>
          {statsForNetwork && (
            <>
              <div>
                <Text className="text-sm text-gray-500">Total Seguidores</Text>
                <Text className="text-xl font-bold">{statsForNetwork.total_followers.toLocaleString()}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Publicaciones</Text>
                <Text className="text-xl font-bold">{statsForNetwork.total_publications.toLocaleString()}</Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Reacciones</Text>
                <Text className="text-xl font-bold">{statsForNetwork.total_reactions.toLocaleString()}</Text>
              </div>
              {statsForNetwork.average_views > 0 && (
                <div>
                  <Text className="text-sm text-gray-500">Vistas promedio</Text>
                  <Text className="text-xl font-bold">{statsForNetwork.average_views.toLocaleString()}</Text>
                </div>
              )}
            </>
          )}
        </Grid>
      </Card>
    );
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
        <Card className="w-64 flex-shrink-0">
          <Flex alignItems="center" justifyContent="around" className="mb-4">
            <FaUsers className="text-green-600 text-2xl" />
            <Text className="font-bold">Total Seguidores Únicos</Text>
          </Flex>
          <Text className="text-xl font-bold">{totalUniqueFollowers.toLocaleString()}</Text>
        </Card>
        {networkCards}
      </div>
    </div>
  );
};

export default SummaryCards;