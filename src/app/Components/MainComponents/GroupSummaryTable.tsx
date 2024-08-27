import React, { useMemo, useState } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge, Button } from '@tremor/react';

const GroupSummaryTable = ({ allData }) => {
  const [showPercentages, setShowPercentages] = useState(false);

  const groupSummary = useMemo(() => {
    const groups = {};
    let totalFollowers = 0;

    allData.forEach(item => {
      if (!groups[item.Tipo]) {
        groups[item.Tipo] = {
          total: 0,
          Facebook: 0,
          X: 0,
          Instagram: 0,
          YouTube: 0,
          TikTok: 0,
          count: 0
        };
      }

      groups[item.Tipo].count++;
      Object.entries(item.social_networks).forEach(([network, data]) => {
        groups[item.Tipo][network] += data.followers || 0;
        groups[item.Tipo].total += data.followers || 0;
        totalFollowers += data.followers || 0;
      });
    });

    return { groups, totalFollowers };
  }, [allData]);

  const { groups, totalFollowers } = groupSummary;

  const toggleView = () => {
    setShowPercentages(!showPercentages);
  };

  const formatValue = (value, total) => {
    if (showPercentages) {
      const percentage = (value / total) * 100;
      return `${percentage.toFixed(2)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Resumen por Grupos</Title>
        <Button onClick={toggleView}>
          {showPercentages ? 'Tabla de Números' : 'Tabla de Porcentajes'}
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Grupo</TableHeaderCell>
            <TableHeaderCell>Total Seguidores</TableHeaderCell>
            {/*<TableHeaderCell>% del Total</TableHeaderCell>*/}
            <TableHeaderCell>Facebook</TableHeaderCell>
            <TableHeaderCell>X</TableHeaderCell>
            <TableHeaderCell>Instagram</TableHeaderCell>
            <TableHeaderCell>YouTube</TableHeaderCell>
            <TableHeaderCell>TikTok</TableHeaderCell>
            <TableHeaderCell>Cantidad de Instituciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groups).map(([groupName, data]) => (
            <TableRow key={groupName}>
              <TableCell>{groupName}</TableCell>
              <TableCell>
                <Text>{formatValue(data.total, totalFollowers)}</Text>
              </TableCell>
              {/*<TableCell>
                <Badge color="blue">
                  {((data.total / totalFollowers) * 100).toFixed(2)}%
                </Badge>
              </TableCell>*/}
              <TableCell>{formatValue(data.Facebook, data.total)}</TableCell>
              <TableCell>{formatValue(data.X, data.total)}</TableCell>
              <TableCell>{formatValue(data.Instagram, data.total)}</TableCell>
              <TableCell>{formatValue(data.YouTube, data.total)}</TableCell>
              <TableCell>{formatValue(data.TikTok, data.total)}</TableCell>
              <TableCell>{data.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupSummaryTable;