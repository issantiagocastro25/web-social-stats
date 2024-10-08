'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function TablePricing() {
    const router = useRouter();
    
    const handleSelectPlan = (plan: string) => {
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
            price: 75000,
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
        <section className="bg-white text-gray-800 ">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#8A2BE2]">
                        Datos y Estadísticas del Sector Salud
                    </h2>
                    <p className="mb-5 font-light text-gray-600 sm:text-xl">
                        Accede a información detallada y actualizada sobre el sector salud.
                    </p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 ">
                    {plans.map((plan, index) => (
                        <div key={index} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-200 shadow-lg dark:border-gray-600 xl:p-8 hover:border-secondary transition-all duration-300">
                            <h3 className="mb-4 text-2xl font-semibold text-[#8A2BE2]">{plan.title}</h3>
                            <p className="font-light text-gray-500 sm:text-lg">{plan.description}</p>
                            
                            <div className="flex justify-center items-baseline mt-8">
                                <span className="mr-2 text-5xl font-extrabold text-[#8A2BE2]">{`$${plan.price.toLocaleString('es-CO')}`}</span>
                                <span className="text-gray-500">/mes</span>
                            </div>
                            <div className="flex justify-center mb-6">
                                <span className="text-gray-800">Facturación semestral</span>
                            </div>
                            <ul className="list-disc list-inside mx-4 text-left">
                                {plan.features.map((feature, idx) => (
                                    // <li className="flex items-center space-x-3">
                                    //     <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    //     <span>Posibilidad de hacer comparativas y cruces.</span>
                                    // </li>
                                    <li key={idx} className=" flex items-center space-x-3 gap-x-3 text-gray-600 my-4">
                                        <svg className="flex-shrink-0 w-5 h-5 text-[#FFCD25]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-[#FFCD25] hover:text-purple-600 transition-all duration-500"
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
