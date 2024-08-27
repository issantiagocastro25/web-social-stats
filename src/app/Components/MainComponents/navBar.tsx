'use client'
import React, { useState, useEffect } from 'react';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { useRouter, usePathname } from 'next/navigation';

import { checkAuthStatus, logout } from '@/api/auth';
import { getUserDetail } from '@/api/user';

import LoadingNavbar from '@/app/Components/Loadings/LoadingNavbar';

const DashboardNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        setIsAuthenticated(authStatus.is_authenticated);
        if (authStatus.is_authenticated) {
          const userDetail = await getUserDetail();
          setUser(userDetail);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/auth/access');
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  if (isLoading) {
    return <div className='my-4'><LoadingNavbar/></div>;
  }

  if (pathname !== '/stats' && !isAuthenticated) {
    return null;
  }

  return (
    <Navbar fluid className="bg-white shadow-md">
      <Navbar.Brand href="/">
        <img
          src="/assets/imgs/Awindowschannellogo.C7p9k2-l_L99iE.png"
          className="mr-3 h-8 sm:h-10"
          alt="Awindows Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2 items-center">
        {isAuthenticated && user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar 
                alt={user.first_name || "User"} 
                img={user.profile_picture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
                rounded 
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.first_name} {user.last_name}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => navigateTo('/profile/user-profile')}>
              Perfil
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigateTo('/stats')}>
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigateTo('/settings')}>
              Configuración
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <button 
                onClick={handleLogout}
                className="text-black py-1.5 px-2"
              >
                Cerrar Sesión
              </button>
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateTo('/Auth/login')} className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded">
              Entrar
            </button>
            <button onClick={() => navigateTo('/Auth/register')} className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded">
              Registrarse
            </button>
          </div>
        )}
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default DashboardNavbar;