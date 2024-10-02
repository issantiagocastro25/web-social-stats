"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllUsers, updateUser } from '@/api/users/users.api'; // Asume que existe updateUser

export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef(null);

    const UserStatus = ({ isActive }) => (
        <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className={`text-sm ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                {isActive ? 'Activo' : 'Inactivo'}
            </span>
        </div>
    );

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

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setTimeout(() => {
            modalRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(selectedUser.id, selectedUser);
            alert('Usuario actualizado correctamente');
            loadUsers();
            setSelectedUser(null); // Cerrar el modal después de la actualización
        } catch (err) {
            console.error('Error actualizando usuario:', err);
            alert('Error al actualizar el usuario');
        }
    };

    return (
        <>
            <div className='content'>
                <div className='container-table overflow-x-auto shadow-md sm:rounded-lg'>
                    <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th className='px-4 py-3'>Id</th>
                                <th className='px-4 py-3'>Nombre</th>
                                {/* <th className='px-4 py-3'>Identificación</th> */}
                                <th className='px-4 py-3'>Organización</th>
                                <th className='px-4 py-3'>Rol</th>
                                <th className='px-4 py-3'>Estado</th>
                                <th className='px-4 py-3'>Email</th>
                                <th className='px-4 py-3'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                    <td className="px-4 py-4">{user.id}</td>
                                    <td className="px-4 py-4">{`${user.first_name} ${user.last_name}`}</td>
                                    {/* <td className="px-4 py-4">{user.identification || 'N/A'}</td> */}
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
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
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
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={selectedUser.email}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                            {/* <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identificación</label>
                                                <input
                                                    type="text"
                                                    name="identification"
                                                    value={selectedUser.identification || ''}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div> */}
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
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                                                <input
                                                    type="text"
                                                    name="user_roles"
                                                    value={selectedUser.user_roles.map(userRole => userRole.role.title).join(", ")}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                                                <select
                                                    name="is_active"
                                                    value={selectedUser.is_active}
                                                    onChange={handleChange}
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                >
                                                    <option value={true}>Activo</option>
                                                    <option value={false}>Inactivo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="p-6 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            type="submit"
                                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Guardar cambios
                                        </button>
                                    </div> */}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
