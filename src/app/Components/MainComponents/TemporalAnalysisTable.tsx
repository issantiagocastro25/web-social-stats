import React, { useState, useMemo, useEffect } from 'react';
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button , AreaChart} from '@tremor/react';
import { Select } from 'flowbite-react';

interface TemporalAnalysisTableProps {
  selectedInstitutions: any[];
  temporalData: any[];
  availableDates: string[];
  isLoading: boolean;
}

const TemporalAnalysisTable: React.FC<TemporalAnalysisTableProps> = ({
  selectedInstitutions,
  temporalData,
  availableDates,
  isLoading
}) => {
  const [showCharts, setShowCharts] = useState(false);
  const [selectedInstitutionIndex, setSelectedInstitutionIndex] = useState(0);

  const networks = ['Facebook', 'X', 'Instagram', 'YouTube', 'TikTok'];

  // Ordenar availableDates de más antigua a más reciente
  const sortedDates = useMemo(() => [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()), [availableDates]);

  const processedData = useMemo(() => {
    return selectedInstitutions.map(institution => {
      const institutionData = sortedDates.map(date => {
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
  }, [selectedInstitutions, temporalData, sortedDates, networks]);

  // Asegurarse de que selectedInstitutionIndex sea válido
  useEffect(() => {
    if (selectedInstitutionIndex >= selectedInstitutions.length) {
      setSelectedInstitutionIndex(0);
    }
  }, [selectedInstitutions, selectedInstitutionIndex]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const renderTable = () => {
    if (!processedData[selectedInstitutionIndex]) {
      return <Text>No hay datos disponibles para la institución seleccionada.</Text>;
    }

    return (
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
          {processedData[selectedInstitutionIndex].data.map((row, index) => (
            <TableRow key={row.date}>
              <TableCell>{row.date}</TableCell>
              {networks.map(network => {
                const currentValue = row[network];
                const previousValue = index > 0 ? processedData[selectedInstitutionIndex].data[index - 1][network] : currentValue;
                const growth = calculateGrowth(currentValue, previousValue);
                const color = growth > 0 ? 'green' : growth < 0 ? 'red' : 'gray';

                return (
                  <TableCell key={network}>
                    <div className="flex items-center space-x-2">
                      <Text>{currentValue.toLocaleString()}</Text>
                      <Badge color={color}>
                        {growth > 0 ? '▲' : '▼'} {Math.abs(growth).toFixed(2)}%
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
  };

  const renderCharts = () => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {networks.map(network => (
        <Card key={network}>
          <Title>{network} Followers Over Time</Title>
          <AreaChart
            className="h-72 mt-4"
            data={processedData[selectedInstitutionIndex]?.data || []}
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

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Title>Análisis Temporal</Title>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedInstitutionIndex.toString()}
            onChange={(e) => setSelectedInstitutionIndex(Number(e.target.value))}
          >
            {selectedInstitutions.map((inst, index) => (
              <option key={inst.Institucion} value={index.toString()}>
                {inst.Institucion}
              </option>
            ))}
          </Select>
          <Button
            size="xs"
            variant="secondary"
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Ver Tabla' : 'Ver Gráficas'}
          </Button>
        </div>
      </div>

      {showCharts ? renderCharts() : renderTable()}
    </Card>
  );
};

export default TemporalAnalysisTable;