'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function TablePricing() {
    const router = useRouter();
    
    const handleSelectPlan = (plan) => {
        // Redirige a la página de pago con el plan seleccionado
        router.push(`/payment?plan=${plan}`);
    };

    const plans = [
        {
            title: "Salud Colombia",
            description: "Estadísticas del sector salud nacional.",
            price: 200000,
            features: [
                "399 organizaciones de salud agrupadas en 6 submercados:",
                "IPS privadas, IPS públicas, EPS y seguros, Organizaciones administrativas, públicas y de interés general, Organizaciones profesionales, Farmacias, Instituciones educativas, Datos históricos con gráficas de evolución.",
                "Posibilidad de hacer comparativas y cruces.",
                "Actualización de datos: cuatrimestral."
            ],
            id: "salud",
        },
        {
            title: "Cajas de Compensación de Colombia",
            description: "Estadísticas sobre cajas de compensación.",
            price: 200000,
            features: [
                "53 Cajas de compensación colombianas.",
                "Datos históricos con gráficas de evolución.",
                "Posibilidad de hacer comparativas y cruces.",
                "Actualización de datos: cuatrimestral."
            ],
            id: "compensacion",
        },
        {
            title: "Hospitales internacionales de referencia",
            description: "Datos de los 15 mejores hospitales internacionales.",
            price: 200000,
            features: [
                "15 hospitales de referencia de Latinoamérica de 10 países: México, Argentina, Chile, Brasil, Perú, Panamá, Costa Rica.",
                "6 principales hospitales de Estados Unidos.",
                "Datos históricos con gráficas de evolución.",
                "Actualización de datos: cuatrimestral."
            ],
            id: "hospitales",
        }
    ];

    return (
        <section className="bg-white text-gray-800">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#8A2BE2]">
                        Datos y Estadísticas del Sector Salud
                    </h2>
                    <p className="mb-5 font-light text-gray-600 sm:text-xl">
                        Accede a información detallada y actualizada sobre el sector salud.
                    </p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {plans.map((plan, index) => (
                        <div key={index} className="flex flex-col p-6 mx-auto max-w-lg text-center bg-white rounded-lg border shadow-lg">
                            <h3 className="mb-4 text-2xl font-semibold text-[#8A2BE2]">{plan.title}</h3>
                            <p className="font-light text-gray-500 sm:text-lg">{plan.description}</p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold text-[#8A2BE2]">{`$${plan.price.toLocaleString('es-CO')}`}</span>
                                <span className="text-gray-500">/mes</span>
                            </div>
                            <ul className="list-disc list-inside mx-4 mb-4 text-left">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="text-gray-600">{feature}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                            >
                                Elegir plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TablePricing;
