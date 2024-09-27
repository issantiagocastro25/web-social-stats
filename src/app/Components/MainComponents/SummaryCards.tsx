import React, { useMemo } from 'react';
import { Card, Text, Flex, Grid } from "@tremor/react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import XIcon from './XIcon';

interface SummaryCardsProps {
  data: {
    stats_date: string;
    unique_followers?: {
      facebook: number;
      X: number;
      Instagram: number;
      YouTube: number;
      Tiktok: number;
    };
    stats: Array<{
      type_institution: string;
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
  const getIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'facebook': return <FaFacebook className="text-blue-600 text-2xl" />;
      case 'instagram': return <FaInstagram className="text-pink-600 text-2xl" />;
      case 'x': return <XIcon className=" text-2xl" />;
      case 'youtube': return <FaYoutube className="text-red-600 text-2xl" />;
      case 'tiktok': return <FaTiktok className="text-black text-2xl" />;
      default: return null;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  const summaryData = useMemo(() => {
    if (!data || !data.stats) {
      console.log('No data available');
      return [];
    }

    if (isAllCategory && data.unique_followers) {
      return Object.entries(data.unique_followers).map(([network, uniqueFollowers]) => {
        const statsForNetwork = data.stats.filter(stat => stat.social_network.toLowerCase() === network.toLowerCase());
        const totalFollowers = statsForNetwork.reduce((sum, stat) => sum + stat.total_followers, 0);
        const totalPublications = statsForNetwork.reduce((sum, stat) => sum + stat.total_publications, 0);
        const totalReactions = statsForNetwork.reduce((sum, stat) => sum + stat.total_reactions, 0);
        const averageViews = statsForNetwork.reduce((sum, stat) => sum + stat.average_views, 0) / statsForNetwork.length || 0;

        return {
          social_network: network,
          total_followers: totalFollowers,
          unique_followers: uniqueFollowers,
          total_publications: totalPublications,
          total_reactions: totalReactions,
          average_views: averageViews,
        };
      });
    } else {
      // For specific categories or when unique_followers is not available, use the stats directly
      return data.stats.map(stat => ({
        ...stat,
        unique_followers: null // Set to null for specific categories or when not available
      }));
    }
  }, [data, isAllCategory]);

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="flex justify-center space-x-6 pb-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card key={index} className="w-64 flex-shrink-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data || summaryData.length === 0) {
    console.log('No data available to display');
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div className="overflow-x-auto pt-6">
      <div className="flex justify-center flex-wrap gap-6 pb-4">
        {summaryData.map((stat, index) => (
          <Card key={index} className="w-64 flex-shrink-0">
            <Flex alignItems="center" justifyContent="around" className="mb-4">
              <Text className="font-bold text-2xl">{stat.social_network}</Text>
              {getIcon(stat.social_network)}
            </Flex>
            <Grid numCols={1} className="gap-4">
              <div>
                <Text className="text-sm text-gray-500">Seguidores</Text>
                <Text className="text-xl font-bold">{formatNumber(stat.total_followers)}</Text>
                {isAllCategory && stat.unique_followers !== null && (
                  <Text className="text-sm text-gray-400">Únicos: {formatNumber(stat.unique_followers)}</Text>
                )}
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