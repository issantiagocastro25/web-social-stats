import React, { useState, useMemo } from 'react';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button } from '@tremor/react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { AreaChart } from '@tremor/react';

interface Institution {
  Institucion: string;
  social_networks: {
    [key: string]: {
      followers: number;
      publications: number;
      reactions: number;
      Average_views: number;
    };
  };
}

interface TemporalAnalysisTableProps {
  selectedInstitutions: Institution[];
  temporalData: any[];
  availableDates: string[];
}

const TemporalAnalysisTable: React.FC<TemporalAnalysisTableProps> = ({
  selectedInstitutions,
  temporalData,
  availableDates,
}) => {
  const [showCharts, setShowCharts] = useState(false);

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];

  const processedData = useMemo(() => {
    return selectedInstitutions.map(institution => {
      const institutionData = availableDates.map(date => {
        const dataForDate = temporalData.find(
          item => item.Institucion === institution.Institucion && item.date === date
        );
        return {
          date,
          ...networks.reduce((acc, network) => ({
            ...acc,
            [network]: dataForDate?.social_networks?.[network]?.followers || 0
          }), {})
        };
      });

      return {
        institution: institution.Institucion,
        data: institutionData
      };
    });
  }, [selectedInstitutions, temporalData, availableDates, networks]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? -100 : 0; // Invertimos el signo aquí
    return ((previous - current) / previous) * 100; // Cambiamos el orden de la resta
  };

  const renderTable = () => (
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Fecha</TableHeaderCell>
          {networks.map(network => (
            <TableHeaderCell key={network}>{network}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {processedData[0].data.map((row, index) => (
          <TableRow key={row.date}>
            <TableCell>{row.date}</TableCell>
            {networks.map(network => {
              const currentValue = row[network];
              const previousValue = index > 0 ? processedData[0].data[index - 1][network] : currentValue;
              const growth = calculateGrowth(currentValue, previousValue);
              // Invertimos la lógica de color aquí
              const color = growth < 0 ? 'green' : growth > 0 ? 'red' : 'gray';

              return (
                <TableCell key={network}>
                  <div className="flex items-center space-x-2">
                    <Text>{currentValue.toLocaleString()}</Text>
                    <Badge color={color} icon={growth < 0 ? ArrowUpIcon : ArrowDownIcon}>
                      {Math.abs(growth).toFixed(2)}%
                    </Badge>
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCharts = () => (
    <div className="mt-6 space-y-6">
      {networks.map(network => (
        <Card key={network}>
          <Title>{network} Followers Over Time</Title>
          <AreaChart
            className="h-72 mt-4"
            data={processedData[0].data.slice().reverse()} // Invertimos el orden de los datos para la gráfica
            index="date"
            categories={[network]}
            colors={["blue"]}
            valueFormatter={(number: number) => Intl.NumberFormat("us").format(number).toString()}
            yAxisWidth={60}
          />
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title>Análisis Temporal de {processedData[0].institution}</Title>
        <Button
          size="xs"
          variant="secondary"
          onClick={() => setShowCharts(!showCharts)}
        >
          {showCharts ? 'Ver Tabla' : 'Ver Gráficas'}
        </Button>
      </div>

      {showCharts ? renderCharts() : renderTable()}
    </Card>
  );
};

export default TemporalAnalysisTable;