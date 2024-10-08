'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus, logout } from '@/api/auth';
import { getUserDetail } from '@/api/user';

const DashboardNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

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
        setIsAuthenticated(false);
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
        router.push('/');
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAdminDropdown = () => setIsAdminDropdownOpen(!isAdminDropdownOpen);

  const hasAdminRole = user && user.roles?.some(role =>
    role.identifier === '8np49Ab#' || role.identifier === 'Ca0-T17A'
  );

  if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-red-600 shadow-md z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://colombiaredessociales.com/wp-content/uploads/2024/08/RSCOLOMBIA_WHITE.png"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <NavLink href="/categories" currentPath={pathname}>
              Categorías
            </NavLink>
            {hasAdminRole && (
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={toggleAdminDropdown}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith('/administration')
                      ? 'border-b-2 border-yellow-400 text-white'
                      : 'text-white hover:border-yellow-300 hover:text-yellow-300'
                  }`}
                >
                  Administración
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {isAdminDropdownOpen && (
                  <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link href="/administration/panel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Panel
                    </Link>
                    <Link href="/administration/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Usuarios
                    </Link>
                    <Link href="/administration/youtube" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      YouTube
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="hidden sm:flex sm:items-center">
            {user && (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <img className="h-9 w-9 rounded-full" src={user.profile_picture || "/assets/imgs/profile_photo.png"} alt="User" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-700">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/profile/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              {!isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <Link href="/categories" className="block px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300">
            Categorías
          </Link>
          {hasAdminRole && (
            <div className="py-2">
              <Link href="/administration/panel" className="block px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300">
                Administración - Panel
              </Link>
              <Link href="/administration/users" className="block px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300">
                Administración - Usuarios
              </Link>
              <Link href="/administration/youtube" className="block px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300">
                Administración - YouTube
              </Link>
            </div>
          )}
          {user && (
            <div className="py-2 border-t border-red-700">
              <div className="flex items-center px-4 py-2">
                <img className="h-10 w-10 rounded-full" src={user.profile_picture || "/assets/imgs/profile_photo.png"} alt="User" />
                <div className="ml-3">
                  <p className="text-white">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-red-300">{user.email}</p>
                </div>
              </div>
              <Link href="/profile/user-profile" className="block px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-red-700 hover:text-yellow-300"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// Componente NavLink para manejar el estado activo de la ruta
const NavLink = ({ href, currentPath, children }) => (
  <Link href={href} className={`px-3 py-2 rounded-md text-sm font-medium ${
    currentPath === href ? 'text-yellow-300' : 'text-white hover:bg-red-700 hover:text-yellow-300'
  }`}>
    {children}
  </Link>
);

export default DashboardNavbar;
