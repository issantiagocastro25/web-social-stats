import React, { useMemo } from 'react';
import { Card, Text, Metric } from '@tremor/react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import XIcon from './XIcon';

const SummaryCards = ({ groupData = [], selectedData = [], allData = [], totalStats }) => {
  const calculateStats = (data) => {
    return data.reduce((acc, item) => ({
      facebook: acc.facebook + (item.social_networks?.Facebook?.followers || 0),
      twitter: acc.twitter + (item.social_networks?.X?.followers || 0),
      instagram: acc.instagram + (item.social_networks?.Instagram?.followers || 0),
      youtube: acc.youtube + (item.social_networks?.YouTube?.followers || 0),
      tiktok: acc.tiktok + (item.social_networks?.TikTok?.followers || 0),
      total: acc.total + 
        (item.social_networks?.Facebook?.followers || 0) +
        (item.social_networks?.X?.followers || 0) +
        (item.social_networks?.Instagram?.followers || 0) +
        (item.social_networks?.YouTube?.followers || 0) +
        (item.social_networks?.TikTok?.followers || 0),
    }), { facebook: 0, twitter: 0, instagram: 0, youtube: 0, tiktok: 0, total: 0 });
  };

  const groupStats = useMemo(() => calculateStats(groupData), [groupData]);
  const selectedStats = useMemo(() => calculateStats(selectedData), [selectedData]);

  const networkCards = [
    { icon: FaFacebook, color: 'text-blue-600', title: 'Facebook', totalValue: totalStats?.facebook || 0, groupValue: groupStats.facebook, selectedValue: selectedStats.facebook },
    { icon: XIcon, color: 'text-blue-400', title: 'X', totalValue: totalStats?.twitter || 0, groupValue: groupStats.twitter, selectedValue: selectedStats.twitter },
    { icon: FaInstagram, color: 'text-pink-600', title: 'Instagram', totalValue: totalStats?.instagram || 0, groupValue: groupStats.instagram, selectedValue: selectedStats.instagram },
    { icon: FaYoutube, color: 'text-red-600', title: 'YouTube', totalValue: totalStats?.youtube || 0, groupValue: groupStats.youtube, selectedValue: selectedStats.youtube },
    { icon: SiTiktok, color: 'text-black', title: 'TikTok', totalValue: totalStats?.tiktok || 0, groupValue: groupStats.tiktok, selectedValue: selectedStats.tiktok },
  ];

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex flex-col items-center">
          <Text className="text-sm">Total Seguidores</Text>
          <Metric>{totalStats?.total.toLocaleString()}</Metric>
          <Text className="text-xs text-gray-500">
            Seleccionados: {selectedStats.total.toLocaleString()} / {groupStats.total.toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500">
            ({calculatePercentage(selectedStats.total, groupStats.total)}% del grupo)
          </Text>
          <Text className="text-xs text-gray-500">
            Grupo: {calculatePercentage(groupStats.total, totalStats?.total)}% del total
          </Text>
        </div>
      </Card>
      {networkCards.map((card, index) => (
        <Card key={index} className="flex flex-col items-center p-4">
          <card.icon className={`${card.color} text-3xl mb-2`} />
          <Text className="text-sm">{card.title}</Text>
          <Metric>{card.totalValue.toLocaleString()}</Metric>
          <Text className="text-xs text-gray-500">
            Seleccionados: {card.selectedValue.toLocaleString()} / {card.groupValue.toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500">
            ({calculatePercentage(card.selectedValue, card.groupValue)}% del grupo)
          </Text>
          <Text className="text-xs text-gray-500">
            Grupo: {calculatePercentage(card.groupValue, card.totalValue)}% del total
          </Text>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;