"use client";

import React from "react";
import { BarChart, Card, Title } from "@tremor/react";
import { EntityData } from '@/app/Principal/dashboard/types';

interface BarChartExampleWithGroupsProps {
    selectedEntity: string;
    entityData: Record<string, EntityData>;
}

const BarChartExampleWithGroups: React.FC<BarChartExampleWithGroupsProps> = ({ selectedEntity, entityData }) => {
    const selectedEntityData = entityData[selectedEntity];

    if (!selectedEntityData) {
        return null; // No renderizar nada si no hay una entidad seleccionada
    }

    const chartData = [{
        name: selectedEntityData.institucion,
        Facebook: selectedEntityData.facebook.seguidores || 0,
        YouTube: selectedEntityData.youtube.seguidores || 0,
        Twitter: selectedEntityData.twitter.seguidores || 0,
        Instagram: selectedEntityData.instagram.seguidores || 0,
        TikTok: selectedEntityData.tiktok.seguidores || 0,
    }];

    const dataFormatter = (number: number) => 
        Intl.NumberFormat("us").format(number).toString();

    return (
        <Card className="mt-8">
            <Title>Estadísticas de Redes Sociales para {selectedEntityData.institucion}</Title>
            <BarChart
                className="mt-6"
                data={chartData}
                index="name"
                categories={["Facebook", "YouTube", "Twitter", "Instagram", "TikTok"]}
                colors={["blue", "red", "cyan", "violet", "pink"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
            />
        </Card>
    );
};

export default BarChartExampleWithGroups;