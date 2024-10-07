import React, { useMemo } from 'react';
import { Card, Text, Flex, Grid } from "@tremor/react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import XIcon from './XIcon';

interface UniqueFollowers {
  facebook: number;
  X: number;
  Instagram: number;
  YouTube: number;
  TikTok: number;
}

interface Stat {
  type_institution: string;
  social_network: string;
  total_followers: number;
  total_publications: number;
  total_reactions: number;
  average_views: number;
}

interface SummaryCardsProps {
  data: {
    stats_date: string;
    unique_followers?: UniqueFollowers;
    stats: Stat[];
  } | null;
  isAllCategory: boolean;
  isLoading: boolean;
  selectedInstitutionType?: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  data,
  isAllCategory,
  isLoading,
  selectedInstitutionType
}) => {
  
  const getIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'facebook': return <FaFacebook className="text-blue-600 text-2xl" />;
      case 'instagram': return <FaInstagram className="text-pink-600 text-2xl" />;
      case 'x': return <XIcon className="text-2xl" />;
      case 'youtube': return <FaYoutube className="text-red-600 text-2xl" />;
      case 'tiktok': return <FaTiktok className="text-black text-2xl" />;
      default: return null;
    }
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return '0';
    return num.toLocaleString('es-ES');
  };

  const summaryData = useMemo(() => {
    if (!data || !data.stats) {
      console.log('No data available');
      return [];
    }

    console.log('Datos recibidos:', data.stats);
    console.log('Categoría seleccionada:', selectedInstitutionType);

    if (!isAllCategory && selectedInstitutionType) {
      const filteredStats = data.stats.filter(
        stat => stat.type_institution.toLowerCase() === selectedInstitutionType.toLowerCase()
      );
      console.log('Datos filtrados por categoría:', filteredStats);

      return filteredStats;
    }

    if (isAllCategory && data.unique_followers) {
      const groupedData = Object.entries(data.unique_followers).map(([network, uniqueFollowers]) => {
        const statsForNetwork = data.stats.filter(stat => stat.social_network.toLowerCase() === network.toLowerCase());
        const totalPublications = statsForNetwork.reduce((sum, stat) => sum + stat.total_publications, 0);
        const totalReactions = statsForNetwork.reduce((sum, stat) => sum + stat.total_reactions, 0);
        const averageViews = statsForNetwork.reduce((sum, stat) => sum + stat.average_views, 0) / (statsForNetwork.length || 1);

        return {
          social_network: network,
          unique_followers: uniqueFollowers,
          total_publications: totalPublications,
          total_reactions: totalReactions,
          average_views: averageViews,
        };
      });

      console.log('Datos agrupados por red social:', groupedData);
      return groupedData;
    } else {
      console.log('Datos mapeados para categorías específicas:', data.stats);
      return data.stats;
    }
  }, [data, isAllCategory, selectedInstitutionType]);

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
    console.log('No hay datos disponibles');
    return <div className="text-center text-gray-500">No hay datos disponibles</div>;
  }

  return (
    <div className="overflow-x-auto pt-6">
      <div className="flex justify-center flex-wrap gap-6 pb-4">
        {summaryData.map((stat, index) => (
          <Card key={index} className="w-64 flex-shrink-0">
            <Flex alignItems="center" justifyContent="between" className="mb-4">
              <Text className="font-bold text-2xl">{stat.social_network}</Text>
              {getIcon(stat.social_network)}
            </Flex>
            <Grid numCols={1} className="gap-4">
              <div>
                <Text className="text-sm text-gray-500">
                  {isAllCategory ? "Seguidores únicos" : "Seguidores totales"}
                </Text>
                <Text className="text-xl font-bold">
                  {isAllCategory
                    ? formatNumber(stat.unique_followers)
                    : formatNumber(stat.total_followers)}
                </Text>
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