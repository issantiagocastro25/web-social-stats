'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPaymentUrl } from '../../api/api_suscription/data-suscription.api'
import { useAuth } from '@/app/contexts/AuthContext'; 
import { useAuthCheck } from '../hooks/useAuthCheck';
import { getUserDetail } from '@/api/user';

// Datos de planes
const plansData = {
    salud: { title: "Salud Colombia", price: 200000, suscripName: "salud" },
    compensacion: { title: "Cajas de Compensación de Colombia", price: 200000, suscripName: "caja_compensacion" },
    hospitales: { title: "Hospitales internacionales de referencia", price: 200000, suscripName: "hospitales_internacionales" }
};

// Función para formatear precios a pesos colombianos
const formatPrice = (price) => {
    return price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
};

function PaymentGateway() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPlans, setSelectedPlans] = useState([]);
    const { isAuthenticated, isLoading } = useAuthCheck();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const plan = searchParams.get('plan');
        
        if (isAuthenticated) {
            fetchUserDetail();
        }
        
        if (plan && plansData[plan]) {
            setSelectedPlans((prev) => {
                if (!prev.find(p => p.title === plansData[plan].title)) {
                    return [...prev, plansData[plan]];
                }
                return prev;
            });
        }
    }, [searchParams, isAuthenticated]);

    const fetchUserDetail = async () => {
        try {
            const data = await getUserDetail();
            setUserDetail(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch user details');
            setLoading(false);
        }
    };

    const handleAddPlan = (planId) => {
        if (!selectedPlans.find(plan => plan.title === plansData[planId].title)) {
            setSelectedPlans([...selectedPlans, plansData[planId]]);
        }
    };

    const handleRemovePlan = (planTitle) => {
        setSelectedPlans(selectedPlans.filter(plan => plan.title !== planTitle));
    };

    const totalPrice = selectedPlans.reduce((total, plan) => total + plan.price, 0);

    const handleProceedToPayment = async () => {
        if (selectedPlans.length === 0) {
            alert("No hay ningún producto seleccionado.");
            return;
        }
        if (!isAuthenticated || !userDetail.id) {
            alert("Debes iniciar sesión para continuar.");
            // Aquí podrías redirigir al usuario a la página de inicio de sesión
            return;
        }
        try {
            const planNames = selectedPlans.map(plan => plan.suscripName);
            const paymentData = await getPaymentUrl(userDetail.id, planNames);
            
            if (paymentData && paymentData.init_point) {
                window.location.href = paymentData.init_point;
            } else {
                throw new Error('No se recibió una URL de pago válida');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un error al procesar el pago. Por favor, inténtelo de nuevo.');
        }
        console.log("Redirigiendo a MercadoPago...");
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Pasarela de Pago</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Contenido principal */}
                <div className="flex-grow">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Planes Seleccionados</h2>
                        {selectedPlans.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedPlans.map((plan, index) => (
                                    <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <span className="font-medium">{plan.title}</span>
                                        <div className="flex items-center">
                                            <span className="mr-4">{formatPrice(plan.price)}</span>
                                            <button 
                                                onClick={() => handleRemovePlan(plan.title)}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 text-center">No tienes planes seleccionados.</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Planes Disponibles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.keys(plansData).map((planId) => (
                                <div key={planId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-lg font-semibold mb-2">{plansData[planId].title}</h3>
                                    <p className="text-gray-600 mb-4">Precio: {formatPrice(plansData[planId].price)}</p>
                                    <button 
                                        onClick={() => handleAddPlan(planId)}
                                        disabled={selectedPlans.find(plan => plan.title === plansData[planId].title)}
                                        className={`w-full py-2 px-4 rounded-md transition ${
                                            selectedPlans.find(plan => plan.title === plansData[planId].title)
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {selectedPlans.find(plan => plan.title === plansData[planId].title)
                                            ? 'Ya en el carrito'
                                            : 'Agregar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resumen de facturación */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Resumen de Facturación</h2>
                        <div className="space-y-4">
                            {selectedPlans.map((plan, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{plan.title}</span>
                                    <span>{formatPrice(plan.price)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total a pagar:</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                El pago se realizará a través de la plataforma segura de MercadoPago. 
                                Al hacer clic en "Proceder al Pago", serás redirigido a MercadoPago para completar tu transacción.
                            </p>
                            <button 
                                onClick={handleProceedToPayment} 
                                className={`w-full py-3 px-4 rounded-md transition ${
                                    selectedPlans.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                                disabled={selectedPlans.length === 0}
                            >
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentGateway;