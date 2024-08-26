import React, { useMemo } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from '@tremor/react';

const GroupSummaryTable = ({ allData }) => {
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

  return (
    <Card>
      <Title className="mb-4">Resumen por Grupos</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Grupo</TableHeaderCell>
            <TableHeaderCell>Total Seguidores</TableHeaderCell>
            <TableHeaderCell>% del Total</TableHeaderCell>
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
                <Text>{data.total.toLocaleString()}</Text>
              </TableCell>
              <TableCell>
                <Badge color="blue">
                  {((data.total / totalFollowers) * 100).toFixed(2)}%
                </Badge>
              </TableCell>
              <TableCell>{data.Facebook.toLocaleString()}</TableCell>
              <TableCell>{data.X.toLocaleString()}</TableCell>
              <TableCell>{data.Instagram.toLocaleString()}</TableCell>
              <TableCell>{data.YouTube.toLocaleString()}</TableCell>
              <TableCell>{data.TikTok.toLocaleString()}</TableCell>
              <TableCell>{data.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GroupSummaryTable;