'use client';

import React from 'react'
import { useRouter } from 'next/navigation';

function TablePricing() {
    const RedirectButton = ({ url, text }) => {
        const router = useRouter();
        const handleClick = () => {
            router.push(url);
        };
        
        return (
            <button
            type="button"
            onClick={handleClick}
            className="text-white bg-[#8A2BE2] hover:bg-[#FFD700] hover:text-[#8A2BE2] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300"
            >
            {text}
            </button>
        );
    };

    return (
        <>
        <section className="bg-white text-gray-800">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#8A2BE2]">Datos y Estadísticas del Sector Salud</h2>
                    <p className="mb-5 font-light text-gray-600 sm:text-xl">Accede a información detallada y actualizada sobre el sector salud, cajas de compensación y hospitales de referencia internacional.</p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    
                    {[
                        {
                            title: "Salud Colombia",
                            description: "Estadísticas del sector salud nacional.",
                            price: "200.000",
                            features: [
                                "399 organizaciones de salud agrupadas en 6 submercados:",
                                "IPS privadas, IPS publicas, EPS y seguros, Organizaciones administrativas, públicas y de interés general, Organizaciones profesionales, Farmacias, Instituciones educativas, Datos históricos con graficas de evolución.",
                                "Posibilidad de hacer comparativas y cruces.",
                                "Actualización de datos: cuatrimestral."
                            ],
                            url: "/salud"
                        },
                        {
                            title: "Cajas de Compensación de Colombia",
                            description: "Estadísticas sobre cajas de compensación.",
                            price: "200.000",
                            features: [
                                "53 Cajas de compensación colombianas.",
                                "Datos históricos con graficas de evolución.",
                                "Posibilidad de hacer comparativas y cruces.",
                                "Actualización de datos: cuatrimestral."
                            ],
                            url: "/compensacion"
                        },
                        {
                            title: "Hospitales internacionales de referencia",
                            description: "Datos de los 15 mejores hospitales internacionales.",
                            price: "200.000",
                            features: [
                                "15 hospitales de referencia de Latinoamérica de 10 países: México, Argentina, Chile, Brasil, Peru, Panama, Costa Rica.",
                                "6 principales hospitales de Estados Unidos.",
                                "Datos históricos con graficas de evolución.",
                                "Actualización de datos: cuatrimestral."
                            ],
                            url: "/hospitales"
                        }
                    ].map((card, index) => (
                        <div key={index} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-purple-200 shadow-lg xl:p-8 hover:border-[#8A2BE2] hover:shadow-[#8A2BE2]/50 transition-all duration-300">
                            <h3 className="mb-4 text-2xl font-semibold text-[#8A2BE2]">{card.title}</h3>
                            <p className="font-light text-gray-500 sm:text-lg">{card.description}</p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold text-[#8A2BE2]">${card.price}</span>
                                <span className="text-gray-500">/mes</span>
                            </div>
                            <ul role="list" className="mb-8 space-y-4 text-left">
                                {card.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center space-x-3">
                                        <svg className="flex-shrink-0 w-5 h-5 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <RedirectButton url={card.url} text="Elegir plan" />
                        </div>
                    ))}
                    
                </div>
            </div>
        </section>        
        </>
    )
}

export default TablePricing;