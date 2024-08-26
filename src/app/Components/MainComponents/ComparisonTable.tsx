import React from 'react';
import { Card, Title, Table } from '@tremor/react';

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
        <Table.Head>
          {columns.map((column) => (
            <Table.HeadCell key={column.key}>{column.label}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {selectedInstitutions.map((institution) => (
            <Table.Row key={institution.Institucion}>
              <Table.Cell>{institution.Institucion}</Table.Cell>
              <Table.Cell>{institution.Tipo}</Table.Cell>
              <Table.Cell>{institution.Ciudad}</Table.Cell>
              <Table.Cell>{institution.social_networks?.Facebook?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.X?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.Instagram?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.YouTube?.followers || 0}</Table.Cell>
              <Table.Cell>{institution.social_networks?.TikTok?.followers || 0}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default ComparisonTable;