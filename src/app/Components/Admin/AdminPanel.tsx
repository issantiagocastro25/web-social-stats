'use client';
import React, { useState, useEffect } from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { getAllTokens, createToken, updateToken, deleteToken } from '@/api/api_suscription/data-suscription.api';
import { getAllSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, getAllAccessTokens, updateAccessToken, createAccessToken, deleteAccessToken } from '@/api/api_suscription/tokens';
import DeleteConfirmation from '../Alert/DialogConfirmDelete';
import EditButton from '../Buttons/EditButton';
import TokenCopyComponent from '../Buttons/CopyTokenButton';

export default function AdminPanel() {
    const [tokens, setTokens] = useState([]);
    const [plans, setPlans] = useState([]);
    const [accessTokens, setAccessTokens] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isTokenModal, setIsTokenModal] = useState(true);
    const [isAccessTokenModal, setIsAccessTokenModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchTokens();
        fetchPlans();
        fetchAccessTokens();
    }, []);

    const fetchAccessTokens = async () => {
        try {
            const fetchedAccessTokens = await getAllAccessTokens();
            setAccessTokens(fetchedAccessTokens);
        } catch (error) {
            console.error('Error fetching access tokens:', error);
        }
    };

    const fetchTokens = async () => {
        try {
            const fetchedTokens = await getAllTokens();
            setTokens(fetchedTokens);
        } catch (error) {
            console.error('Error fetching tokens:', error);
        }
    };

    const fetchPlans = async () => {
        try {
            const fetchedPlans = await getAllSubscriptionPlans();
            setPlans(fetchedPlans);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isTokenModal) {
                const tokenData = {
                    ...currentItem,
                    plan_ids: currentItem.plan_ids || []
                };
                if (currentItem?.id) {
                    await updateToken(currentItem.id, tokenData);
                } else {
                    await createToken(tokenData);
                }
                await fetchTokens();
            } else if (isAccessTokenModal) {
                const accessTokenData = {
                    ...currentItem,
                    subscription_plans: currentItem.subscription_plans || []
                };
                if (currentItem?.id) {
                    await updateAccessToken(currentItem.id, accessTokenData);
                } else {
                    await createAccessToken(accessTokenData);
                }
                await fetchAccessTokens();
            } else {
                if (currentItem?.id) {
                    await updateSubscriptionPlan(currentItem.id, currentItem);
                } else {
                    await createSubscriptionPlan(currentItem);
                }
                await fetchPlans();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleDelete = async (id, isToken, isAccessToken) => {
        try {
            if (isToken) {
                await deleteToken(id);
                showAlert('Se ha eliminado el token', 'success');
                await fetchTokens();
            } else if (isAccessToken) {
                await deleteAccessToken(id);
                showAlert('Se ha eliminado el token de acceso', 'success');
                await fetchAccessTokens();
            } else {
                await deleteSubscriptionPlan(id);
                showAlert('Se ha eliminado el plan', 'success');
                await fetchPlans();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showAlert('Ups, Error al eliminar el item', 'error');
        }
    };

    const handlePlanSelection = (planId) => {
        setCurrentItem((prevState) => {
            const selectedPlans = isTokenModal
                ? prevState.plan_ids || []
                : prevState.subscription_plans || [];
            if (selectedPlans.includes(planId)) {
                return {
                    ...prevState,
                    [isTokenModal ? 'plan_ids' : 'subscription_plans']: selectedPlans.filter(id => id !== planId)
                };
            } else {
                return {
                    ...prevState,
                    [isTokenModal ? 'plan_ids' : 'subscription_plans']: [...selectedPlans, planId]
                };
            }
        });
    };

    const openModal = (item, isToken, isAccessToken) => {
        let initialItem;
        if (isToken) {
            initialItem = item || { title: '', token: '', discount: '', start_date: '', end_date: '', plan_ids: [] };
            if (item) {
                const selectedPlans = plans
                    .filter(plan => item.subscription_plans.includes(plan.name))
                    .map(plan => plan.id);
                const formattedStartDate = item.start_date.split('T')[0];
                const formattedEndDate = item.end_date.split('T')[0];
                initialItem = {
                    ...item,
                    plan_ids: selectedPlans,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                };
            }
        } else if (isAccessToken) {
            initialItem = item || { title: '', token: '', start_date: '', end_date: '', is_active: true, subscription_plans: [] };
            if (item) {
                const selectedPlans = plans
                    .filter(plan => item.subscription_plans.includes(plan.name))
                    .map(plan => plan.id);
                const formattedStartDate = item.start_date.split('T')[0];
                const formattedEndDate = item.end_date.split('T')[0];
                initialItem = {
                    ...item,
                    subscription_plans: selectedPlans,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                };
            }
        } else {
            initialItem = item || { name: '', title: '', imageCover: '', description: '', price: '', duration_days: '' };
        }
        
        setCurrentItem(initialItem);
        setIsTokenModal(isToken);
        setIsAccessTokenModal(isAccessToken);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const filteredTokens = tokens.filter(token =>
        token.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-light mb-8 text-center">Admin Panel</h2>

            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-light">Tokens de Descuento</h3>
                    <button 
                        onClick={() => openModal(null, true)}
                        className='mt-4 px-5 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md'
                    >
                        Crear Nuevo Token
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por token..."
                    className="mb-4 w-full p-2 border border-gray-300 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Token</th>
                                <th className="px-6 py-3">Descuento</th>
                                <th className="px-6 py-3">Fecha de Inicio</th>
                                <th className="px-6 py-3">Fecha de Fin</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTokens.map((token) => (
                                <tr key={token.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{token.title}</td>
                                    <td className="px-6 py-4"><TokenCopyComponent token={token.token} /></td>
                                    <td className="px-6 py-4">{token.discount}%</td>
                                    <td className="px-6 py-4">{formatDate(token.start_date)}</td>
                                    <td className="px-6 py-4">{formatDate(token.end_date)}</td>
                                    <td className="px-6 py-4 w-52 flex">
                                        {/* <button 
                                            onClick={() => openModal(token, true)} 
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Editar
                                        </button> */}
                                        {/* <button 
                                            onClick={() => handleDelete(token.id, true)} 
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button> */}
                                        <EditButton onClick={() => openModal(token, true)} />
                                        <DeleteConfirmation 
                                            onDelete={() => handleDelete(token.id, true)} 
                                            itemName={'token'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-light">Tokens de Acceso</h3>
                    <button 
                        onClick={() => openModal(null, false, true)}
                        className='mt-4 px-5 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md'
                    >
                        Crear Nuevo Token de Acceso
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Título</th>
                                <th className="px-6 py-3">Token</th>
                                <th className="px-6 py-3">Fecha de Inicio</th>
                                <th className="px-6 py-3">Fecha de Fin</th>
                                <th className="px-6 py-3">Activo</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessTokens.map((token) => (
                                <tr key={token.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{token.title}</td>
                                    <td className="px-6 py-4"><TokenCopyComponent token={token.token} /></td>
                                    <td className="px-6 py-4">{formatDate(token.start_date)}</td>
                                    <td className="px-6 py-4">{formatDate(token.end_date)}</td>
                                    <td className="px-6 py-4">{token.is_active ? 'Sí' : 'No'}</td>
                                    <td className="px-6 py-4 w-52 flex">
                                        <EditButton onClick={() => openModal(token, false, true)} />
                                        <DeleteConfirmation 
                                            onDelete={() => handleDelete(token.id, false, true)} 
                                            itemName={'token de acceso'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-light">Planes de Suscripción</h3>
                    <button 
                        onClick={() => openModal(null, false)}
                        className='mt-4 px-5 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md'
                    >
                        Crear Nuevo Plan
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Título</th>
                                <th className="px-6 py-3">Precio</th>
                                <th className="px-6 py-3">Duración</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map((plan) => (
                                <tr key={plan.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{plan.name}</td>
                                    <td className="px-6 py-4">{plan.title}</td>
                                    <td className="px-6 py-4">${plan.price} año</td>
                                    <td className="px-6 py-4">{plan.duration_days} días</td>
                                    <td className="px-6 py-4 w-52 flex">
                                        {/* <button 
                                            onClick={() => openModal(plan, false)} 
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(plan.id, false)} 
                                            className="text-red-500 hover:underline"
                                        >
                                            Eliminar
                                        </button> */}

                                        <EditButton onClick={() => openModal(plan, false)} />
                                        <DeleteConfirmation 
                                            onDelete={() => handleDelete(plan.id, false)} 
                                            itemName={'plan'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                        <h2 className="text-xl mb-4">{currentItem?.id ? 'Editar' : 'Crear'} {isTokenModal ? 'Token de Descuento' : isAccessTokenModal ? 'Token de Acceso' : 'Plan'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isTokenModal ? (
                                <>
                                    <div>
                                        <label className="block mb-1">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Nombre del Token" 
                                            value={currentItem?.title || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Descuento (%)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Descuento (%)" 
                                            value={currentItem?.discount || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, discount: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Fecha de Inicio</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            value={currentItem?.start_date || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, start_date: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Fecha de Fin</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            value={currentItem?.end_date || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, end_date: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Selecciona los Planes</label>
                                        {plans.map(plan => (
                                            <div key={plan.id} className="flex items-center mb-2">
                                                <input 
                                                    type="checkbox" 
                                                    id={`plan-${plan.id}`} 
                                                    checked={currentItem?.plan_ids?.includes(plan.id)} 
                                                    onChange={() => handlePlanSelection(plan.id)} 
                                                />
                                                <label htmlFor={`plan-${plan.id}`} className="ml-2">{plan.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : isAccessTokenModal ? (
                                <>
                                    <div>
                                        <label className="block mb-1">Título</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Título del Token de Acceso" 
                                            value={currentItem?.title || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Fecha de Inicio</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            value={currentItem?.start_date || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, start_date: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Fecha de Fin</label>
                                        <input 
                                            type="date" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            value={currentItem?.end_date || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, end_date: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Activo</label>
                                        <input 
                                            type="checkbox" 
                                            checked={currentItem?.is_active || false}
                                            onChange={(e) => setCurrentItem({...currentItem, is_active: e.target.checked})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Selecciona los Planes</label>
                                        {plans.map(plan => (
                                            <div key={plan.id} className="flex items-center mb-2">
                                                <input 
                                                    type="checkbox" 
                                                    id={`plan-${plan.id}`} 
                                                    checked={currentItem?.subscription_plans?.includes(plan.id)} 
                                                    onChange={() => handlePlanSelection(plan.id)} 
                                                />
                                                <label htmlFor={`plan-${plan.id}`} className="ml-2">{plan.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block mb-1">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Nombre del Plan" 
                                            value={currentItem?.name || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Título</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Título del Plan" 
                                            value={currentItem?.title || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Precio</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Precio" 
                                            value={currentItem?.price || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Duración (días)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2 border border-gray-300 rounded" 
                                            placeholder="Duración en días" 
                                            value={currentItem?.duration_days || ''}
                                            onChange={(e) => setCurrentItem({...currentItem, duration_days: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button 
                                    type="button" 
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
