import React from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';

const ComparisonTable = ({ selectedInstitutions }) => {
  const columns = [
    { key: 'Institucion', label: 'Institución' },
    { key: 'Tipo', label: 'Tipo' },
    { key: 'Ciudad', label: 'Ciudad' },
    { key: 'Facebook', label: 'Facebook Seguidores' },
    { key: 'X', label: 'X Seguidores' },
    { key: 'Instagram', label: 'Instagram Seguidores' },
    { key: 'YouTube', label: 'YouTube Seguidores' },
    { key: 'TikTok', label: 'TikTok Seguidores' },
  ];

  return (
    <Card>
      <Title>Comparación de Instituciones Seleccionadas</Title>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedInstitutions.map((institution) => (
            <TableRow key={institution.Institucion}>
              <TableCell>{institution.Institucion}</TableCell>
              <TableCell>{institution.Tipo}</TableCell>
              <TableCell>{institution.Ciudad}</TableCell>
              <TableCell>{institution.social_networks?.Facebook?.followers.toLocaleString() || '0'}</TableCell>
              <TableCell>{institution.social_networks?.X?.followers.toLocaleString() || '0'}</TableCell>
              <TableCell>{institution.social_networks?.Instagram?.followers.toLocaleString() || '0'}</TableCell>
              <TableCell>{institution.social_networks?.YouTube?.followers.toLocaleString() || '0'}</TableCell>
              <TableCell>{institution.social_networks?.TikTok?.followers.toLocaleString() || '0'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ComparisonTable;