import React from 'react';
import { Grid, Col } from '@tremor/react';
import InstitutionStats from './InstitutionStats';
import ComparisonCharts from './ComparisonCharts';
import AnnualGrowthChart from './AnnualGrowthChart';

const ChartsSection = ({ selectedInstitution, selectedInstitutions }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Análisis Detallado</h2>
      <Grid numColsLg={2} className="gap-6">
        <Col>
          <h3 className="text-xl font-semibold mb-4">Institución Seleccionada</h3>
          {selectedInstitution ? (
            <>
              <InstitutionStats institution={selectedInstitution} />
              <AnnualGrowthChart data={selectedInstitution.annualData || []} />
            </>
          ) : (
            <p>Selecciona una institución para ver sus estadísticas detalladas</p>
          )}
        </Col>
        <Col>
          <h3 className="text-xl font-semibold mb-4">Comparación de Instituciones</h3>
          {selectedInstitutions.length > 1 ? (
            <ComparisonCharts selectedInstitutions={selectedInstitutions} />
          ) : (
            <p>Selecciona múltiples instituciones para comparar</p>
          )}
        </Col>
      </Grid>
    </div>
  );
};

export default ChartsSection;