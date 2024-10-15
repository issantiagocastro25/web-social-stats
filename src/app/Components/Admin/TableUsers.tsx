"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllUsers, updateUser } from '@/api/users/users.api';
import { getPricing } from '@/api/api_suscription/data-suscription.api';
import { format } from 'date-fns';

export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const modalRef = useRef(null);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);

    const UserStatus = ({ isActive }) => (
        <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className={`text-sm ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                {isActive ? 'Activo' : 'Inactivo'}
            </span>
        </div>
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [users, plans] = await Promise.all([
                    getAllUsers(),
                    getPricing()
                ]);
                setUsers(users);
                setSubscriptionPlans(plans);
            } catch (err) {
                setError(err.message || 'Error loading initial data');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setTimeout(() => {
            modalRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'is_active') {
            setSelectedUser(prev => ({ ...prev, [name]: value === 'true' }));
        } else if (name === 'role') {
            setSelectedUser(prev => ({
                ...prev,
                user_roles: [{ role: { identifier: value }}]
            }));
        } else {
            setSelectedUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const addSubscription = (planId) => {
        const newSubscription = {
            id: Date.now(), // Temporary ID
            plan: planId,
            active: true,
            start_date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            end_date: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        };
        setSelectedUser(prev => ({
            ...prev,
            subscriptions: [...prev.subscriptions, newSubscription]
        }));
    };

    const removeSubscription = (planId) => {
        setSelectedUser(prev => ({
            ...prev,
            subscriptions: prev.subscriptions.filter(sub => sub.plan !== planId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(selectedUser.id, selectedUser);
            alert('Usuario actualizado correctamente');
            loadUsers();
            setSelectedUser(null);
        } catch (err) {
            console.error('Error actualizando usuario:', err);
            alert('Error al actualizar el usuario');
        }
    };

    const handleSubscriptionChange = (planId, field, value) => {
        setSelectedUser(prevUser => ({
            ...prevUser,
            subscriptions: prevUser.subscriptions.map(sub => 
                sub.plan === planId ? { ...sub, [field]: value } : sub
            )
        }));
    };

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    // Calcular usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    // Filtrar usuarios por el término de búsqueda
    const filteredUsers = users.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <>
            <div className='content'>
                <div className='container-table overflow-x-auto shadow-md sm:rounded-lg'>
                    {/* Campo de búsqueda */}
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o apellido"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-300 focus:border-red-300 block w-full p-2.5"
                        />
                    </div>
                    <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th className='px-4 py-3'>Id</th>
                                <th className='px-4 py-3'>Nombre</th>
                                <th className='px-4 py-3'>Organización</th>
                                <th className='px-4 py-3'>Rol</th>
                                <th className='px-4 py-3'>Estado</th>
                                <th className='px-4 py-3'>Email</th>
                                <th className='px-4 py-3'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                    <td className="px-4 py-4">{user.id}</td>
                                    <td className="px-4 py-4">{`${user.first_name} ${user.last_name}`}</td>
                                    <td className="px-4 py-4">{user.organization || 'N/A'}</td>
                                    <td className="px-4 py-4">
                                        {user.user_roles && user.user_roles.length > 0
                                            ? user.user_roles.map(userRole => userRole.role.title).join(", ")
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-4"><UserStatus isActive={user.is_active} /></td>
                                    <td className="px-4 py-4">{user.email}</td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-900">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedUser && (
                        <div ref={modalRef} id="editUserModal" className="mt-8">
                            <div className="relative w-full max-w-2xl max-h-full">
                                <form onSubmit={handleSubmit} className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Editar Usuario
                                        </h3>
                                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setSelectedUser(null)}>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Cerrar modal</span>
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={selectedUser.first_name}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={selectedUser.last_name}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organización</label>
                                                <input
                                                    type="text"
                                                    name="organization"
                                                    value={selectedUser.organization || ''}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                                                <select
                                                    name="is_active"
                                                    value={selectedUser.is_active ? 'true' : 'false'}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                >
                                                    <option value="true">Activo</option>
                                                    <option value="false">No Activo</option>
                                                </select>
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                                                <select
                                                    name="role"
                                                    value={selectedUser.user_roles.length > 0 ? selectedUser.user_roles[0].role.identifier : ''}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                >
                                                    <option value="">Selecciona un rol</option>
                                                    <option value="=805MHj0">Usuario General</option>
                                                    <option value="8np49Ab#">Administrador</option>
                                                    {/* Agrega más roles según sea necesario */}
                                                </select>
                                            </div>
                                            <div className="col-span-6">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Suscripciones</label>
                                                {subscriptionPlans.map(plan => {
                                                    const userSubscription = selectedUser.subscriptions.find(sub => sub.plan === plan.id);
                                                    return (
                                                        <div key={plan.id} className="mb-4 p-4 border rounded">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium">{plan.title}</span>
                                                                {userSubscription ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSubscription(plan.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addSubscription(plan.id)}
                                                                        className="text-green-600 hover:text-green-800"
                                                                    >
                                                                        Agregar
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {userSubscription && (
                                                                <>
                                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                                        <div>
                                                                            <label className="block text-xs mb-1">Fecha de inicio</label>
                                                                            <input
                                                                                type="date"
                                                                                value={userSubscription.start_date.split('T')[0]}
                                                                                onChange={(e) => handleSubscriptionChange(plan.id, 'start_date', e.target.value)}
                                                                                className="w-full p-2 text-sm border rounded"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs mb-1">Fecha de vencimiento</label>
                                                                            <input
                                                                                type="date"
                                                                                value={userSubscription.end_date.split('T')[0]}
                                                                                onChange={(e) => handleSubscriptionChange(plan.id, 'end_date', e.target.value)}
                                                                                className="w-full p-2 text-sm border rounded"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <label className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={userSubscription.active}
                                                                                onChange={(e) => handleSubscriptionChange(plan.id, 'active', e.target.checked)}
                                                                                className="mr-2"
                                                                            />
                                                                            <span className="text-sm">Aprobado</span>
                                                                        </label>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button type="button" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm px-5 py-2.5 mr-2" onClick={() => setSelectedUser(null)}>Cancelar</button>
                                        <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5">Actualizar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {loading && <p>Cargando usuarios...</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </div>
                
                {/* Paginación */}
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className={`px-4 py-2 mx-1 bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 mx-1 bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md rounded ${currentPage === index + 1 ? 'bg-blue-700' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 mx-1 bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </>
    );
}
