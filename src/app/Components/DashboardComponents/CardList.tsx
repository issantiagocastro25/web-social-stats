"use client";
import React from "react";

export default function CardList({ searchTerm }) {
    const entities = ["Entidad 1", "Entidad 2", "Entidad 3"];
    const filteredEntities = entities.filter((entity) =>
        entity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex space-x-4 overflow-x-auto p-4">
            {filteredEntities.map((entity, index) => (
                <div key={index} className="card bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium">{entity}</h3>
                </div>
            ))}
        </div>
    );
}
