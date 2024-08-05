"use client";

import React, { useState } from "react";
import CardList from "@/app/Components/DashboardComponents/CardList";
import BarChartExampleWithGroups from "@/app/Components/DashboardComponents/BarChartGraphic";
import EntityTable from "@/app/Components/DashboardComponents/EntityTable";
import { EntityData } from '@/app/Principal/dashboard/types';


const entityData: Record<string, EntityData> = {
    "Escuela de Salud Sur Colombiana": {
        institucion: "Escuela de Salud Sur Colombiana",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 4074, videos: 1, visitas: 919, visitasPorVideo: 919 },
        twitter: { seguidores: 0 },
        instagram: { seguidores: 538, videos: 0, visitas: 0, visitasPorVideo: 0 },
        youtube: { seguidores: 0, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Asociación Colombiana de Facultades de Medicina (Ascofame)": {
        institucion: "Asociación Colombiana de Facultades de Medicina (Ascofame)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 12781, videos: 1, visitas: 2129, visitasPorVideo: 2129 },
        twitter: { seguidores: 4383 },
        instagram: { seguidores: 123, videos: 0, visitas: 0, visitasPorVideo: 0 },
        youtube: { seguidores: 3420, videos: 57031, visitas: 0, visitasPorVideo: 464 },
        tiktok: { seguidores: 0 },
    },
    "Centros de Educación en Salud (Cedes)": {
        institucion: "Centros de Educación en Salud (Cedes)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 3201, videos: 1, visitas: 131, visitasPorVideo: 131 },
        twitter: { seguidores: 0 },
        instagram: { seguidores: 3236, videos: 0, visitas: 0, visitasPorVideo: 0 },
        youtube: { seguidores: 0, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Consultor Salud": {
        institucion: "Consultor Salud",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 64416, videos: 22, visitas: 25285, visitasPorVideo: 1149 },
        twitter: { seguidores: 7305 },
        instagram: { seguidores: 4314, videos: 148, visitas: 147774, visitasPorVideo: 998 },
        youtube: { seguidores: 999, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Escuela Colombiana de Salud": {
        institucion: "Escuela Colombiana de Salud",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 2395, videos: 0, visitas: 0, visitasPorVideo: 0 },
        twitter: { seguidores: 0 },
        instagram: { seguidores: 28, videos: 1, visitas: 211, visitasPorVideo: 211 },
        youtube: { seguidores: 3, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Escuela de Salud del Cauca": {
        institucion: "Escuela de Salud del Cauca",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 9612, videos: 0, visitas: 0, visitasPorVideo: 0 },
        twitter: { seguidores: 0 },
        instagram: { seguidores: 1566, videos: 14, visitas: 16746, visitasPorVideo: 1196 },
        youtube: { seguidores: 139, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Escuela de Salud San Pedro Claver": {
        institucion: "Escuela de Salud San Pedro Claver",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 1675, videos: 0, visitas: 0, visitasPorVideo: 0 },
        twitter: { seguidores: 12 },
        instagram: { seguidores: 471, videos: 9, visitas: 7553, visitasPorVideo: 839 },
        youtube: { seguidores: 52, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Escuela para auxiliares de enfermería San Rafael": {
        institucion: "Escuela para auxiliares de enfermería San Rafael",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 3395, videos: 2, visitas: 883, visitasPorVideo: 442 },
        twitter: { seguidores: 1 },
        instagram: { seguidores: 0, videos: 0, visitas: 0, visitasPorVideo: 0 },
        youtube: { seguidores: 21, videos: 0, visitas: 8677, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Fundación Universitaria de Ciencias de la salud (FUCS)": {
        institucion: "Fundación Universitaria de Ciencias de la salud (FUCS)",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 59004, videos: 51, visitas: 65973, visitasPorVideo: 1294 },
        twitter: { seguidores: 4529 },
        instagram: { seguidores: 12468, videos: 513, visitas: 268962, visitasPorVideo: 524 },
        youtube: { seguidores: 743993, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
    "Uniandes - Facultad de medicina": {
        institucion: "Uniandes - Facultad de medicina",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 4471, videos: 9, visitas: 2173, visitasPorVideo: 241 },
        twitter: { seguidores: 3314 },
        instagram: { seguidores: 2022, videos: 0, visitas: 0, visitasPorVideo: 0 },
        youtube: { seguidores: 0, videos: 0, visitas: 0, visitasPorVideo: 0 },
        tiktok: { seguidores: 0 },
    },
};
const DashboardPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedEntity, setSelectedEntity] = useState<string>("");

    const handleEntitySelect = (entityName: string) => {
        setSelectedEntity(entityName);
        console.log("Entidad seleccionada:", entityName); // Para depuración
    };

    return (
        <div className="dashboard p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Busca un hospital..."
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                <CardList 
                    searchTerm={searchTerm} 
                    setSelectedEntity={handleEntitySelect}
                />
                {selectedEntity && (
                    <div className="mt-10">
                        <EntityTable entityData={entityData[selectedEntity]} />
                        <BarChartExampleWithGroups 
                            selectedEntity={selectedEntity} 
                            entityData={entityData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;