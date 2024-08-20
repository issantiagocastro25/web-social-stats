import React from 'react';
import { Navbar, Dropdown, Avatar, Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

import { logout } from '../../../api/auth'; // Asegúrate de que la ruta sea correcta


const DashboardNavbar = () => {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Opcional: limpiar cualquier estado local o token almacenado
      // localStorage.removeItem('token');
      router.push('/Auth/login');  // O a donde quieras redirigir después del logout
    } catch (error) {
      console.error('Error during logout:', error);
      // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
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
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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