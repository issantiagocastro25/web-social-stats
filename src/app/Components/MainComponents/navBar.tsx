import React from 'react';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';

const DashboardNavbar = () => {
  return (
    <Navbar fluid rounded className="bg-white shadow-md">
      <Navbar.Brand href="#">
        <img
          src="/assets/imgs/Awindowschannellogo.C7p9k2-l_L99iE.png"
          className="mr-3 h-8 sm:h-16"
          alt="Awindows Channel Logo"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Nombre del Usuario</span>
            <span className="block truncate text-sm font-medium">usuario@ejemplo.com</span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Configuración</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Cerrar sesión</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default DashboardNavbar;