'use client'
import React, { useState, useEffect } from 'react';
import { getUserDetail, updateUserProfile, changePassword } from '@/api/user';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import LoadingProfile from '@/app/Components/Loadings/LoadingProfile';
import BackButton from '@/app/Components/Buttons/BackButton';

const UserProfile = () => {
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password1: '', new_password2: '' });
    const [message, setMessage] = useState(null);

    const { isAuthenticated, isLoading } = useAuthCheck();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserDetail();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    const fetchUserDetail = async () => {
        try {
            const data = await getUserDetail();
            setUserDetail(data);
            setUpdatedUser(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch user details');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(updatedUser);
            setUserDetail(updatedUser);
            setEditMode(false);
            setMessage('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordData.old_password, passwordData.new_password1, passwordData.new_password2);
            setPasswordData({ old_password: '', new_password1: '', new_password2: '' });
            setMessage('Password changed successfully');
        } catch (err) {
            setError('Failed to change password');
        }
    };

    if (loading) return <div className="text-center p-4"><LoadingProfile/></div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    if (!userDetail) return <div className="text-center p-4">No user data available</div>;

    return (
        <>
        <title>Profile</title>
        <div className="container mx-auto p-4">
            <div className='w-full mb-4'>
                <BackButton></BackButton>
            </div>
            <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
            
            {message && <div className="alert alert-success mb-4">{message}</div>}
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4 flex items-center">
                    {userDetail.profile_picture && (
                        <img src={userDetail.profile_picture} alt="Profile" className="rounded-full w-32 h-32 mr-4" />
                    )}
                    <div>
                        <h2 className="text-2xl font-semibold">{userDetail.first_name} {userDetail.last_name}</h2>
                        <p className="text-gray-600">{userDetail.email}</p>
                    </div>
                </div>

                {editMode ? (
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-4">
                            <label htmlFor="first_name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                            <input 
                                id="first_name" 
                                name="first_name" 
                                value={updatedUser.first_name} 
                                onChange={handleInputChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
                            <input 
                                id="last_name" 
                                name="last_name" 
                                value={updatedUser.last_name} 
                                onChange={handleInputChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="organization" className="block text-gray-700 text-sm font-bold mb-2">Organización</label>
                            <input 
                                id="organization" 
                                name="organization" 
                                value={updatedUser.organization} 
                                onChange={handleInputChange} 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={updatedUser.email} 
                                disabled 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="mt-4 px-5 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90 focus:ring-4 focus:ring-red-300 transition-shadow shadow-md">
                            Guardar Cambios
                        </button>
                        <button 
                            onClick={() => setEditMode(false)} 
                            className="mt-4 ml-4 px-5 py-2 rounded-md bg-gray-100 text-gray-900 border-2 border-gray-300 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-shadow shadow-md">
                            Cancelar
                        </button>
                    </form>
                ) : (
                    <div>
                        <p className="mb-2"><strong>Primer Ingreso:</strong> {new Date(userDetail.date_joined).toLocaleDateString()}</p>
                        <p className="mb-2"><strong>Último Ingreso:</strong> {userDetail.last_login ? new Date(userDetail.last_login).toLocaleString() : 'Never'}</p>
                        <button onClick={() => setEditMode(true)} className="mt-4 px-4 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90">Editar Perfil</button>
                    </div>
                )}
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label htmlFor="old_password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña Actual</label>
                        <input 
                            id="old_password" 
                            name="old_password" 
                            type="password" 
                            value={passwordData.old_password} 
                            onChange={handlePasswordChange} 
                            required 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new_password1" className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
                        <input 
                            id="new_password1" 
                            name="new_password1" 
                            type="password" 
                            value={passwordData.new_password1} 
                            onChange={handlePasswordChange} 
                            required 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new_password2" className="block text-gray-700 text-sm font-bold mb-2">Confirma Nueva Contraseña</label>
                        <input 
                            id="new_password2" 
                            name="new_password2" 
                            type="password" 
                            value={passwordData.new_password2} 
                            onChange={handlePasswordChange} 
                            required 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        />
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 rounded-md bg-red-600/90 text-white hover:bg-red-700/90">Cambiar Contraseña</button>
                </form>
            </div>
        </div>
        </>
    );
};

export default UserProfile;