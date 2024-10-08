'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPaymentUrl, getTokenDetail } from '../../api/api_suscription/data-suscription.api';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { getUserDetail } from '@/api/user';
import BackButton from '../Components/Buttons/BackButton';

const plansData = {
    salud: { title: "Salud Colombia", price: 250000, suscripName: "salud" },
    compensacion: { title: "Cajas de Compensación de Colombia", price: 200000, suscripName: "caja_compensacion" },
    hospitales: { title: "Hospitales internacionales de referencia", price: 100000, suscripName: "hospitales_internacionales" }
};

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
    const [discountToken, setDiscountToken] = useState(null);

    useEffect(() => {
        const plan = searchParams.get('plan');
        const token = searchParams.get('token');

        if (isAuthenticated) {
            fetchUserDetail();
        }

        if (token) {
            applyDiscountToken(token);
        }

        // if (plan && plansData[plan]) {
        //     addPlanToSelection(plansData[plan]);
        // }
    }, [searchParams, isAuthenticated, loading]);

    const applyDiscountToken = async (token) => {
        try {
            const tokenData = await getTokenDetail(token);
            setDiscountToken(tokenData);
            
            // Agregar planes del token si no están ya seleccionados y el usuario no los tiene
            tokenData.subscription_plans.forEach(planName => {
                const planData = Object.values(plansData).find(p => p.suscripName === planName);
                if (planData && !userHasPlan(planData.suscripName)) {
                    addPlanToSelection(planData);
                }
            });
        } catch (error) {
            console.error('Error al aplicar el descuento:', error);
        }
    };

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

    const userHasPlan = (planName) => {
        return userDetail?.subscriptions_info.some(sub => sub.plan === planName && sub.status === 'approved');
    };

    const addPlanToSelection = (planData) => {
        setSelectedPlans(prevPlans => {
            if (!prevPlans.find(p => p.suscripName === planData.suscripName) && !userHasPlan(planData.suscripName)) {
                return [...prevPlans, planData];
            }
            return prevPlans;
        });
    };

    const handleAddPlan = (planId) => {
        const planData = plansData[planId];
        if (!userHasPlan(planData.suscripName)) {
            addPlanToSelection(planData);
        }
    };

    const handleRemovePlan = (planSuscripName) => {
        setSelectedPlans(prevPlans => prevPlans.filter(plan => plan.suscripName !== planSuscripName));
    };

    const calculateDiscountedPrice = (plan) => {
        if (discountToken && discountToken.subscription_plans.includes(plan.suscripName)) {
            return plan.price - (plan.price * (discountToken.discount / 100));
        }
        return plan.price;
    };

    const calculateSemesterPrice = (price) => price * 6;


    const totalPrice = selectedPlans.reduce((total, plan) => total + plan.price, 0);
    const totalWithDiscounts = selectedPlans.reduce((total, plan) => total + calculateDiscountedPrice(plan), 0);

    const monthlyTotal = selectedPlans.reduce((total, plan) => total + calculateDiscountedPrice(plan), 0);
    const semesterTotal = calculateSemesterPrice(monthlyTotal);

    const handleProceedToPayment = async () => {
        if (selectedPlans.length === 0) {
            alert("No hay ningún producto seleccionado.");
            return;
        }
        if (!isAuthenticated || !userDetail?.id) {
            alert("Debes iniciar sesión para continuar.");
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
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className='w-full mb-4'>
                <BackButton/>
            </div>
            <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Pasarela de Pago</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Planes Seleccionados</h2>
                        {selectedPlans.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedPlans.map((plan) => (
                                    <li key={plan.suscripName} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <span className="font-medium">{plan.title}</span>
                                        <div className="flex items-center">
                                            <span className={`mr-4 ${calculateDiscountedPrice(plan) < plan.price ? 'line-through text-gray-400' : ''}`}>
                                                {formatPrice(plan.price)}
                                            </span>
                                            {calculateDiscountedPrice(plan) < plan.price && (
                                                <span className="mr-4 text-green-600 font-semibold">
                                                    {formatPrice(calculateDiscountedPrice(plan))}
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => handleRemovePlan(plan.suscripName)}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 text-center">No tienes planes seleccionados. Por favor, selecciona un plan para continuar.</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Planes Disponibles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.keys(plansData).map((planId) => {
                                const plan = plansData[planId];
                                const isSelected = selectedPlans.find(p => p.suscripName === plan.suscripName);
                                const userHasThisPlan = userHasPlan(plan.suscripName);
                                return (
                                    <div key={planId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                                        <p className="text-gray-600 mb-4">Precio: {formatPrice(plan.price)}</p>
                                        {userHasThisPlan ? (
                                            <p className="text-green-600 font-semibold">Ya tienes este plan</p>
                                        ) : (
                                            <button 
                                                onClick={() => handleAddPlan(planId)}
                                                disabled={isSelected}
                                                className={`w-full py-2 px-4 rounded-md transition ${
                                                    isSelected
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                            >
                                                {isSelected ? 'Agregado' : 'Agregar'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-80">
                    <h2 className="text-xl font-semibold mb-4">Resumen de Pago</h2>
                    <div>
                        <div className="flex justify-between font-semibold text-lg mb-2">
                            <span>Subtotal mensual:</span>
                            <span>{formatPrice(monthlyTotal)}</span>
                        </div>
                        {discountToken && (
                            <div className="flex justify-between font-semibold text-lg text-green-600">
                                <span>Descuento aplicado ({discountToken.discount}%)</span>
                                <span>-{formatPrice((totalPrice - monthlyTotal) / 6)}/mes</span>
                            </div>
                        )}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total mensual:</span>
                                <span>{formatPrice(monthlyTotal)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-xl mt-2 text-blue-600">
                                <span>Total a pagar (semestral):</span>
                                <span>{formatPrice(semesterTotal)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <p className="text-sm text-gray-600">
                            Los precios mostrados son mensuales. El pago se realizará por un período semestral (6 meses) 
                            a través de la plataforma segura de MercadoPago. Al hacer clic en "Proceder al Pago", 
                            serás redirigido a MercadoPago para completar tu transacción por el monto semestral.
                        </p>
                        <button 
                            onClick={handleProceedToPayment}
                            disabled={selectedPlans.length === 0}
                            className={`w-full py-2 px-4 rounded-md transition ${
                                selectedPlans.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            Proceder al Pago Semestral
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentGateway;