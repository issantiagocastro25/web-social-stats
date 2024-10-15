import React, { useState, useMemo, useEffect } from 'react';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Button, AreaChart } from '@tremor/react';
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

  const sortedDates = useMemo(() => [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()), [availableDates]);

  const processedData = useMemo(() => {
    console.log('Processing temporal data:', temporalData);
    if (!Array.isArray(temporalData) || temporalData.length === 0) {
      console.log('Temporal data is empty or not an array');
      return [];
    }

    return selectedInstitutions.map(institution => {
      const institutionData = sortedDates.map(date => {
        const dataForDate = temporalData.find(
          item => item.Institucion === institution.Institucion && item.date === date
        );
        console.log(`Data for ${institution.Institucion} on ${date}:`, dataForDate);
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

  const processedChartData = useMemo(() => {
    return processedData.map(institution => {
      let lastNonZeroValues = {};
      const chartData = institution.data.map(row => {
        const processedRow = { ...row };
        networks.forEach(network => {
          if (processedRow[network] === 0 && lastNonZeroValues[network]) {
            processedRow[network] = lastNonZeroValues[network];
          } else if (processedRow[network] !== 0) {
            lastNonZeroValues[network] = processedRow[network];
          }
        });
        return processedRow;
      });
      return { ...institution, chartData };
    });
  }, [processedData, networks]);

  useEffect(() => {
    if (selectedInstitutionIndex >= selectedInstitutions.length) {
      setSelectedInstitutionIndex(0);
    }
  }, [selectedInstitutions, selectedInstitutionIndex]);

  const calculateGrowth = (current: number, previous: number) => {
    if (current === 0 && previous === 0) return 0;
    if (current === 0) return 0;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const renderTable = () => {
    if (!processedData[selectedInstitutionIndex]) {
      return <p>No hay datos disponibles para la institución seleccionada.</p>;
    }

    const allZero = processedData[selectedInstitutionIndex].data.every(row =>
      networks.every(network => row[network] === 0)
    );

    if (allZero) {
      return <p>Todos los datos para esta institución son cero. Puede que los datos aún no estén disponibles.</p>;
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
                      <span>{currentValue.toLocaleString()}</span>
                      <Badge color={color}>
                        {growth > 0 ? '▲' : growth < 0 ? '▼' : '−'} {Math.abs(growth).toFixed(2)}%
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

  const renderCharts = () => {
    const allZero = processedChartData[selectedInstitutionIndex]?.chartData.every(row =>
      networks.every(network => row[network] === 0)
    );

    if (allZero) {
      return <p>Todos los datos para esta institución son cero. No se pueden generar gráficas.</p>;
    }

    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {networks.map(network => (
          <Card key={network}>
            <Title>{`Seguidores en ${network} a lo largo del tiempo`}</Title>
            <AreaChart
              className="h-72 mt-4"
              data={processedChartData[selectedInstitutionIndex]?.chartData || []}
              index="date"
              categories={[network]}
              colors={["blue"]}
              valueFormatter={(number: number) => number.toLocaleString()}
              yAxisWidth={60}
            />
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <Card><p>Cargando datos temporales...</p></Card>;
  }

  if (!Array.isArray(temporalData) || temporalData.length === 0) {
    return <Card><p>No hay datos temporales disponibles. Por favor, intente realizar el análisis nuevamente.</p></Card>;
  }

  if (processedData.length === 0) {
    return <Card><p>No se pudo procesar los datos temporales. Por favor, intente realizar el análisis nuevamente.</p></Card>;
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
            className='bg-[#5521B5] rounded-md text-white hover:text-gray-800 px-2'
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