import React, { useMemo } from 'react';
import { Card, Text, Flex, Grid } from "@tremor/react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';
import XIcon from './XIcon';

interface GroupSummaryData {
  stats_date: string;
  stats: Array<{
    type_institution: string;
    social_network: string;
    total_followers: number;
    total_publications: number;
    total_reactions: number;
    average_views: number;
  }>;
}

interface SummaryCardsProps {
  data: GroupSummaryData | null;
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
    console.log('Processing summary data. Raw data:', data);
    console.log('Is All Category:', isAllCategory);

    if (!data || !data.stats) {
      console.log('No data available');
      return [];
    }
  
    if (!isAllCategory) {
      console.log('Returning specific category data');
      return data.stats;
    }
  
    const totals: Record<string, {
      total_followers: number;
      total_publications: number;
      total_reactions: number;
      average_views: number;
    }> = {};
  
    // Process the stats data
    data.stats.forEach(stat => {
      if (!totals[stat.social_network]) {
        totals[stat.social_network] = {
          total_followers: 0,
          total_publications: 0,
          total_reactions: 0,
          average_views: 0,
        };
      }
  
      totals[stat.social_network].total_followers += stat.total_followers;
      totals[stat.social_network].total_publications += stat.total_publications;
      totals[stat.social_network].total_reactions += stat.total_reactions;
      totals[stat.social_network].average_views += stat.average_views;
    });
  
    const result = Object.entries(totals).map(([social_network, stats]) => ({
      social_network,
      ...stats,
    }));

    console.log('Processed summary data:', result);
    return result;
  }, [data, isAllCategory]);

  console.log('Rendering SummaryCards. Summary data:', summaryData);

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="flex space-x-10 pb-4" style={{ minWidth: 'max-content' }}>
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

  if (!data || !data.stats || summaryData.length === 0) {
    console.log('No data available to display');
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-10 pb-4" style={{ minWidth: 'max-content' }}>
        {summaryData.map((stat, index) => (
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