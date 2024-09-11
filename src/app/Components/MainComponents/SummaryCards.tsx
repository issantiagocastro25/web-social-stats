import React, { useMemo } from 'react';
import { Card, Text, Flex, Grid, Metric } from "@tremor/react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';

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
  selectedInstitutions: any[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data, isAllCategory, selectedInstitutions }) => {
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

  const summaryData = useMemo(() => {
    if (!data || !data.stats) {
      return [];
    }

    const totals: Record<string, {
      total_followers: number;
      total_publications: number;
      total_reactions: number;
      average_views: number;
    }> = {};

    const hospitalesLatam: Record<string, {
      total_followers: number;
      total_publications: number;
      total_reactions: number;
      average_views: number;
    }> = {};

    data.stats.forEach(stat => {
      const targetObj = stat.type_institution === "Los 15 mejores Hospitales de Latinoamérica" 
        ? hospitalesLatam 
        : totals;

      if (!targetObj[stat.social_network]) {
        targetObj[stat.social_network] = {
          total_followers: 0,
          total_publications: 0,
          total_reactions: 0,
          average_views: 0,
        };
      }
      targetObj[stat.social_network].total_followers += stat.total_followers;
      targetObj[stat.social_network].total_publications += stat.total_publications;
      targetObj[stat.social_network].total_reactions += stat.total_reactions;
      targetObj[stat.social_network].average_views += stat.average_views;
    });

    if (isAllCategory) {
      // Restar los datos de "Los 15 mejores hospitales de latinoamérica"
      Object.keys(totals).forEach(network => {
        if (hospitalesLatam[network]) {
          totals[network].total_followers -= hospitalesLatam[network].total_followers;
          totals[network].total_publications -= hospitalesLatam[network].total_publications;
          totals[network].total_reactions -= hospitalesLatam[network].total_reactions;
          totals[network].average_views -= hospitalesLatam[network].average_views;
        }
      });
    }

    return Object.entries(totals).map(([social_network, stats]) => ({
      social_network,
      ...stats,
    }));
  }, [data, isAllCategory]);

  const selectedData = useMemo(() => {
    if (selectedInstitutions.length === 0) return null;

    const totals: Record<string, {
      total_followers: number;
      total_publications: number;
      total_reactions: number;
      average_views: number;
    }> = {};

    selectedInstitutions.forEach(institution => {
      Object.entries(institution.social_networks).forEach(([network, data]: [string, any]) => {
        if (!totals[network]) {
          totals[network] = {
            total_followers: 0,
            total_publications: 0,
            total_reactions: 0,
            average_views: 0,
          };
        }
        totals[network].total_followers += data.followers;
        totals[network].total_publications += data.publications;
        totals[network].total_reactions += data.reactions;
        totals[network].average_views += data.Average_views;
      });
    });

    return totals;
  }, [selectedInstitutions]);

  if (!data || !data.stats) {
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
                <Metric>{formatNumber(stat.total_followers)}</Metric>
                {selectedData && (
                  <Text className="text-xs text-gray-500">
                    {((selectedData[stat.social_network]?.total_followers / stat.total_followers) * 100).toFixed(2)}% del total
                  </Text>
                )}
              </div>
              <div>
                <Text className="text-sm text-gray-500">Publicaciones</Text>
                <Metric>{formatNumber(stat.total_publications)}</Metric>
                {selectedData && (
                  <Text className="text-xs text-gray-500">
                    {((selectedData[stat.social_network]?.total_publications / stat.total_publications) * 100).toFixed(2)}% del total
                  </Text>
                )}
              </div>
              <div>
                <Text className="text-sm text-gray-500">Reacciones</Text>
                <Metric>{formatNumber(stat.total_reactions)}</Metric>
                {selectedData && (
                  <Text className="text-xs text-gray-500">
                    {((selectedData[stat.social_network]?.total_reactions / stat.total_reactions) * 100).toFixed(2)}% del total
                  </Text>
                )}
              </div>
              {stat.average_views > 0 && (
                <div>
                  <Text className="text-sm text-gray-500">Vistas promedio</Text>
                  <Metric>{formatNumber(stat.average_views)}</Metric>
                  {selectedData && (
                    <Text className="text-xs text-gray-500">
                      {((selectedData[stat.social_network]?.average_views / stat.average_views) * 100).toFixed(2)}% del total
                    </Text>
                  )}
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