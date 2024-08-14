"use client";
import { Card } from "flowbite-react";
import React from "react";
import Image from 'next/image';

interface CardListProps {
    searchTerm: string;
    setSelectedEntity: (entityName: string) => void;
}

const CardList: React.FC<CardListProps> = ({ searchTerm, setSelectedEntity }) => {
    const entities = [
        { name: "Escuela de Salud Sur Colombiana" },
        { name: "Asociación Colombiana de Facultades de Medicina (Ascofame)" },
        { name: "Centros de Educación en Salud (Cedes)" },
        { name: "Consultor Salud" },
        { name: "Escuela Colombiana de Salud" },
        { name: "Escuela de Salud del Cauca" },
        { name: "Escuela de Salud San Pedro Claver" },
        { name: "Escuela para auxiliares de enfermería San Rafael" },
        { name: "Fundación Universitaria de Ciencias de la salud (FUCS)" },
        { name: "Uniandes - Facultad de medicina" },
    ];

    const filteredEntities = entities
        .filter((entity) =>
            entity.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 4);

    return (
        <div className="flex justify-center space-x-14 overflow-x-auto pb-6">
            {filteredEntities.map((entity, index) => (
                <div className="flex-shrink-0 w-60" key={index}>
                    <Card
                        imgSrc={`/assets/imgs/images.png`}
                        className="h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out m-0 p-0" // Reduce padding around the card
                        onClick={() => {
                            setSelectedEntity(entity.name);
                            console.log("Entidad seleccionada en CardList:", entity.name); // Para depuración
                        }}
                    >
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white m-0 p-0"> {/* Remove margin and reduce padding */}
                            {entity.name}
                        </h5>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default CardList;
