import React from 'react';
import { Navbar, Dropdown, Avatar, Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

import { logout } from '../../../api/auth'; // Asegúrate de que la ruta sea correcta


const DashboardNavbar = () => {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Redirige al usuario a la página de login
        router.push('/Auth/login');
      } else {
        // Maneja el error, tal vez mostrando un mensaje al usuario
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };
  return (
    <Navbar fluid className="bg-white shadow-md">
      <Navbar.Brand href="#">
        <img
          src="/assets/imgs/Awindowschannellogo.C7p9k2-l_L99iE.png"
          className="mr-3 h-8 sm:h-10"
          alt="Awindows Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2 items-center">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Usuario</span>
            <span className="block truncate text-sm font-medium">usuario@ejemplo.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Configuración</Dropdown.Item>
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
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default DashboardNavbar;