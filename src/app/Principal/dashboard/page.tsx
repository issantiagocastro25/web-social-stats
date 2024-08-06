"use client";

import React, { useState } from "react";
import CardList from "@/app/Components/DashboardComponents/CardList";
import BarChartExampleWithGroups from "@/app/Components/DashboardComponents/BarChartGraphic";
import EntityTable from "@/app/Components/DashboardComponents/EntityTable";
import { EntityData } from '@/app/Principal/dashboard/types';


const entityData2024: Record<string, EntityData> = {
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
const entityData2023: Record<string, EntityData> = {
    "Escuela de Salud Sur Colombiana": {
        institucion: "Escuela de Salud Sur Colombiana",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 5000, videos: 2, visitas: 1000, visitasPorVideo: 500 },
        twitter: { seguidores: 100 },
        instagram: { seguidores: 600, videos: 1, visitas: 200, visitasPorVideo: 200 },
        youtube: { seguidores: 50, videos: 5, visitas: 500, visitasPorVideo: 100 },
        tiktok: { seguidores: 20 },
    },
    "Asociación Colombiana de Facultades de Medicina (Ascofame)": {
        institucion: "Asociación Colombiana de Facultades de Medicina (Ascofame)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 13000, videos: 2, visitas: 2500, visitasPorVideo: 1250 },
        twitter: { seguidores: 4500 },
        instagram: { seguidores: 150, videos: 1, visitas: 50, visitasPorVideo: 50 },
        youtube: { seguidores: 3500, videos: 60000, visitas: 500, visitasPorVideo: 50 },
        tiktok: { seguidores: 10 },
    },
    "Centros de Educación en Salud (Cedes)": {
        institucion: "Centros de Educación en Salud (Cedes)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 3500, videos: 2, visitas: 200, visitasPorVideo: 100 },
        twitter: { seguidores: 50 },
        instagram: { seguidores: 3500, videos: 1, visitas: 100, visitasPorVideo: 100 },
        youtube: { seguidores: 100, videos: 10, visitas: 1000, visitasPorVideo: 100 },
        tiktok: { seguidores: 30 },
    },
    "Consultor Salud": {
        institucion: "Consultor Salud",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 65000, videos: 25, visitas: 30000, visitasPorVideo: 1200 },
        twitter: { seguidores: 7500 },
        instagram: { seguidores: 4500, videos: 160, visitas: 150000, visitasPorVideo: 937 },
        youtube: { seguidores: 1200, videos: 10, visitas: 1000, visitasPorVideo: 100 },
        tiktok: { seguidores: 50 },
    },
    "Escuela Colombiana de Salud": {
        institucion: "Escuela Colombiana de Salud",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 2500, videos: 1, visitas: 100, visitasPorVideo: 100 },
        twitter: { seguidores: 20 },
        instagram: { seguidores: 50, videos: 2, visitas: 300, visitasPorVideo: 150 },
        youtube: { seguidores: 10, videos: 2, visitas: 200, visitasPorVideo: 100 },
        tiktok: { seguidores: 5 },
    },
    "Escuela de Salud del Cauca": {
        institucion: "Escuela de Salud del Cauca",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 9800, videos: 2, visitas: 200, visitasPorVideo: 100 },
        twitter: { seguidores: 15 },
        instagram: { seguidores: 1700, videos: 15, visitas: 18000, visitasPorVideo: 1200 },
        youtube: { seguidores: 200, videos: 10, visitas: 1000, visitasPorVideo: 100 },
        tiktok: { seguidores: 30 },
    },
    "Escuela de Salud San Pedro Claver": {
        institucion: "Escuela de Salud San Pedro Claver",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 2000, videos: 1, visitas: 100, visitasPorVideo: 100 },
        twitter: { seguidores: 30 },
        instagram: { seguidores: 500, videos: 10, visitas: 8000, visitasPorVideo: 800 },
        youtube: { seguidores: 60, videos: 5, visitas: 500, visitasPorVideo: 100 },
        tiktok: { seguidores: 20 },
    },
    "Escuela para auxiliares de enfermería San Rafael": {
        institucion: "Escuela para auxiliares de enfermería San Rafael",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 3500, videos: 3, visitas: 1000, visitasPorVideo: 333 },
        twitter: { seguidores: 5 },
        instagram: { seguidores: 100, videos: 1, visitas: 100, visitasPorVideo: 100 },
        youtube: { seguidores: 30, videos: 1, visitas: 9000, visitasPorVideo: 9000 },
        tiktok: { seguidores: 10 },
    },
    "Fundación Universitaria de Ciencias de la salud (FUCS)": {
        institucion: "Fundación Universitaria de Ciencias de la salud (FUCS)",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 60000, videos: 55, visitas: 70000, visitasPorVideo: 1273 },
        twitter: { seguidores: 4600 },
        instagram: { seguidores: 13000, videos: 530, visitas: 275000, visitasPorVideo: 519 },
        youtube: { seguidores: 750000, videos: 5, visitas: 1000, visitasPorVideo: 200 },
        tiktok: { seguidores: 60 },
    },
    "Uniandes - Facultad de medicina": {
        institucion: "Uniandes - Facultad de medicina",
        ciudad: "Bogotá",
        tipo: "Educación",
        facebook: { seguidores: 4600, videos: 10, visitas: 2300, visitasPorVideo: 230 },
        twitter: { seguidores: 3500 },
        instagram: { seguidores: 2200, videos: 1, visitas: 100, visitasPorVideo: 100 },
        youtube: { seguidores: 50, videos: 1, visitas: 100, visitasPorVideo: 100 },
        tiktok: { seguidores: 15 },
    },
};
const entityData2022: Record<string, EntityData> = {
    "Escuela de Salud Sur Colombiana": {
        institucion: "Escuela de Salud Sur Colombiana",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 4200, videos: 3, visitas: 950, visitasPorVideo: 316 },
        twitter: { seguidores: 50 },
        instagram: { seguidores: 600, videos: 1, visitas: 150, visitasPorVideo: 150 },
        youtube: { seguidores: 40, videos: 6, visitas: 600, visitasPorVideo: 100 },
        tiktok: { seguidores: 25 },
    },
    "Asociación Colombiana de Facultades de Medicina (Ascofame)": {
        institucion: "Asociación Colombiana de Facultades de Medicina (Ascofame)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 14000, videos: 3, visitas: 2700, visitasPorVideo: 900 },
        twitter: { seguidores: 4600 },
        instagram: { seguidores: 160, videos: 2, visitas: 60, visitasPorVideo: 30 },
        youtube: { seguidores: 3600, videos: 58000, visitas: 800, visitasPorVideo: 100 },
        tiktok: { seguidores: 15 },
    },
    "Centros de Educación en Salud (Cedes)": {
        institucion: "Centros de Educación en Salud (Cedes)",
        ciudad: "",
        tipo: "Educación",
        facebook: { seguidores: 3300, videos: 2, visitas: 250, visitasPorVideo: 125 },
        twitter: { seguidores: 80 },
        instagram: { seguidores: 3100, videos: 2, visitas: 150, visitasPorVideo: 75 },
        youtube: { seguidores: 150, videos: 12, visitas: 1200, visitasPorVideo: 100 },
        tiktok: { seguidores: 40 },
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
    const [selectedYear, setSelectedYear] = useState<string>("2024");

    const handleEntitySelect = (entityName: string) => {
        setSelectedEntity(entityName);
        console.log("Entidad seleccionada:", entityName); // Para depuración
    };

    const getEntityData = (year: string) => {
        switch (year) {
            case "2024":
                return entityData2024;
            case "2023":
                return entityData2023;
            case "2022":
                return entityData2022;
            default:
                return entityData2024;
        }
    };

    const entityData = getEntityData(selectedYear);

    return (
        <div className="dashboard p-6 bg-[#f6f3fa] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Busca un hospital..."
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                <CardList searchTerm={searchTerm} setSelectedEntity={handleEntitySelect} />
                
                {selectedEntity && (
                    <div className="flex flex-col">
                        <div className="flex justify-end mb-2">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-gray-300 rounded-md"
                            >
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <EntityTable entityData={entityData[selectedEntity]} />
                            <BarChartExampleWithGroups 
                                selectedEntity={selectedEntity} 
                                entityData={entityData}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
    
};

export default DashboardPage;