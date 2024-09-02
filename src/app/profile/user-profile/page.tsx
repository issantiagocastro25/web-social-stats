'use client'
import React, { useState, useEffect } from 'react';
import { getUserDetail, updateUserProfile, changePassword } from '@/api/user';
import { Button, TextInput, Label, Alert } from 'flowbite-react';

import {useAuthCheck} from '@/app/hooks/useAuthCheck';
import LoadingProfile from '@/app/Components/Loadings/LoadingProfile';

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
      
      {message && <Alert color="success" className="mb-4">{message}</Alert>}
      
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
              <Label htmlFor="first_name">Nombre</Label>
              <TextInput id="first_name" name="first_name" value={updatedUser.first_name} onChange={handleInputChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="last_name">Apellido</Label>
              <TextInput id="last_name" name="last_name" value={updatedUser.last_name} onChange={handleInputChange} />
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Correo Electrónico</Label>
              <TextInput id="email" name="email" value={updatedUser.email} onChange={handleInputChange} type="email" />
            </div>
            <Button type="submit">Guardar Cambios</Button>
            <Button color="light" onClick={() => setEditMode(false)} className="ml-2 my-2">Cancelar</Button>
          </form>
        ) : (
          <div>
            <p className="mb-2"><strong>Primer Ingreso:</strong> {new Date(userDetail.date_joined).toLocaleDateString()}</p>
            <p className="mb-2"><strong>Ultimo Ingreso:</strong> {userDetail.last_login ? new Date(userDetail.last_login).toLocaleString() : 'Never'}</p>
            <Button onClick={() => setEditMode(true)} className="mt-4">Editar Perfil</Button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <Label htmlFor="old_password">Contraseña Actual</Label>
            <TextInput id="old_password" name="old_password" type="password" value={passwordData.old_password} onChange={handlePasswordChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="new_password1">Nueva Contraseña</Label>
            <TextInput id="new_password1" name="new_password1" type="password" value={passwordData.new_password1} onChange={handlePasswordChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="new_password2">Confirma Nueva Contraseña</Label>
            <TextInput id="new_password2" name="new_password2" type="password" value={passwordData.new_password2} onChange={handlePasswordChange} required />
          </div>
          <Button type="submit">Cambiar Contraseña</Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;