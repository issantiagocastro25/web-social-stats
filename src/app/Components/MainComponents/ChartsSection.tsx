import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart, BarChart, LineChart, Grid } from '@tremor/react';
import { fetchSocialStats } from '@/api/list/listData';

interface Institution {
  Institucion: string;
  social_networks: {
    [key: string]: {
      followers: number;
      publications: number;
      reactions: number;
      engagement: number;
    };
  };
}

interface ChartsSectionProps {
  selectedInstitutions: Institution[];
  activeCategory: string;
  availableDates: string[];
  allData: Institution[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ 
  selectedInstitutions, 
  activeCategory, 
  availableDates,
  allData 
}) => {
  const [chartData, setChartData] = useState<{ [key: string]: Institution[] }>({});

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const dataPromises = availableDates.map(date => 
          fetchSocialStats({ category: activeCategory, date })
        );
        const results = await Promise.all(dataPromises);
        const newChartData = Object.fromEntries(availableDates.map((date, index) => [date, results[index].metrics]));
        setChartData(newChartData);
      } catch (err) {
        console.error('Error loading chart data:', err);
      }
    };

    if (selectedInstitutions.length > 0) {
      loadChartData();
    }
  }, [activeCategory, availableDates, selectedInstitutions]);

  const prepareChartData = (institution: Institution, metric: string) => {
    return availableDates.map(date => ({
      date,
      Facebook: chartData[date]?.find(item => item.Institucion === institution.Institucion)?.social_networks?.Facebook?.[metric] || 0,
      X: chartData[date]?.find(item => item.Institucion === institution.Institucion)?.social_networks?.X?.[metric] || 0,
      Instagram: chartData[date]?.find(item => item.Institucion === institution.Institucion)?.social_networks?.Instagram?.[metric] || 0,
      YouTube: chartData[date]?.find(item => item.Institucion === institution.Institucion)?.social_networks?.YouTube?.[metric] || 0,
      TikTok: chartData[date]?.find(item => item.Institucion === institution.Institucion)?.social_networks?.TikTok?.[metric] || 0,
    }));
  };

  if (selectedInstitutions.length === 0) {
    return (
      <Card>
        <Title>Análisis Detallado</Title>
        <p className="text-center mt-4">Seleccione una o más instituciones para ver el análisis detallado.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {selectedInstitutions.map((institution) => (
        institution && (
          <Card key={institution.Institucion}>
            <Title>{institution.Institucion} - Análisis Detallado</Title>
            <Grid numColsLg={2} className="gap-6 mt-6">
              <Card>
                <Title>Evolución de Seguidores</Title>
                <AreaChart
                  className="mt-4 h-80"
                  data={prepareChartData(institution, 'followers')}
                  index="date"
                  categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
                  colors={["blue", "gray", "pink", "red", "black"]}
                />
              </Card>
              <Card>
                <Title>Publicaciones por Red Social</Title>
                <BarChart
                  className="mt-4 h-80"
                  data={prepareChartData(institution, 'publications')}
                  index="date"
                  categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
                  colors={["blue", "gray", "pink", "red", "black"]}
                />
              </Card>
              <Card>
                <Title>Evolución de Reacciones</Title>
                <LineChart
                  className="mt-4 h-80"
                  data={prepareChartData(institution, 'reactions')}
                  index="date"
                  categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
                  colors={["blue", "gray", "pink", "red", "black"]}
                />
              </Card>
              <Card>
                <Title>Tasa de Engagement</Title>
                <LineChart
                  className="mt-4 h-80"
                  data={prepareChartData(institution, 'engagement')}
                  index="date"
                  categories={["Facebook", "X", "Instagram", "YouTube", "TikTok"]}
                  colors={["blue", "gray", "pink", "red", "black"]}
                />
              </Card>
            </Grid>
          </Card>
        )
      ))}
    </div>
  );
};

export default ChartsSection;