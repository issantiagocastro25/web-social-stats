'use client'

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
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasAdminRole = user && user.roles?.some(role =>
    role.identifier === '8np49Ab#' || role.identifier === 'Ca0-T17A'
  );

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

  if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-red-600 shadow-md z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://colombiaredessociales.com/wp-content/uploads/2024/08/RSCOLOMBIA_WHITE.png"
                alt="Awindows Logo"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/categories" currentPath={pathname}>
                Categorías
              </NavLink>
              {hasAdminRole && (
                <div className="relative" ref={adminDropdownRef}>
                  <button
                    onClick={toggleAdminDropdown}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname.startsWith('/administration')
                        ? 'border-yellow-400 text-white'
                        : 'border-transparent text-white hover:border-yellow-300 hover:text-yellow-300'
                    }`}
                    aria-expanded={isAdminDropdownOpen}
                  >
                    Administración
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <a href="/administration/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Usuarios
                      </a>
                      <a href="/administration/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Youtube
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <div className="ml-3 relative" ref={userMenuRef}>
                <button
                  onClick={toggleMenu}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  id="user-menu"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-9 w-9 rounded-full"
                    src={user.profile_picture || "/assets/imgs/profile_photo.png"}
                    alt=""
                  />
                </button>
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className='my-2 px-4'>
                      <div className="text-sm font-medium text-slate-700">{user.first_name} {user.last_name}</div>
                      <div className="text-sm font-medium text-slate-700/60">{user.email}</div>
                    </div>
                    <UserMenuItem href="/profile/user-profile">Perfil</UserMenuItem>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <a href="/categories"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname.startsWith('/categories')
                ? 'bg-red-700 border-yellow-400 text-white'
                : 'border-transparent text-white hover:bg-red-700 hover:border-yellow-300 hover:text-yellow-300'
            }`}>Categorías</a>
          {hasAdminRole && (
          <div className="pt-2 pb-3 space-y-1">
            <a href="/administration/users"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname.startsWith('/administration/users')
                  ? 'bg-red-700 border-yellow-400 text-white'
                  : 'border-transparent text-white hover:bg-red-700 hover:border-yellow-300 hover:text-yellow-300'
              }`}>Administración - Usuarios</a>
              <a href="/administration/youtube"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname.startsWith('/administration/youtube')
                  ? 'bg-red-700 border-yellow-400 text-white'
                  : 'border-transparent text-white hover:bg-red-700 hover:border-yellow-300 hover:text-yellow-300'
              }`}>Administración - YouTube</a>
          </div>
          )}
          {user && (
            <div className="pt-4 pb-3 border-t border-red-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.profile_picture || "/assets/imgs/profile_photo.png"}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user.first_name} {user.last_name}</div>
                  <div className="text-sm font-medium text-red-300">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <MobileUserMenuItem href="/profile/user-profile">Perfil</MobileUserMenuItem>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:text-yellow-300 hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, currentPath, children }) => (
  <a href={href}
  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
    currentPath === href
      ? 'border-yellow-400 text-white'
      : 'border-transparent text-white hover:border-yellow-300 hover:text-yellow-300'
  }`}>{children}</a>
);

const MobileNavLink = ({ href, currentPath, children }) => (
  <a href={href}
  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
    currentPath === href
      ? 'bg-red-700 border-yellow-400 text-white'
      : 'border-transparent text-white hover:bg-red-700 hover:border-yellow-300 hover:text-yellow-300'
  }`}>{children}</a>
);

const UserMenuItem = ({ href, children }) => (
  <a href={href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" aria-current="page">{children}</a>
);

const MobileUserMenuItem = ({ href, children }) => (
  <a href={href} className="block px-4 py-2 text-base font-medium text-gray-200 hover:text-yellow-300 hover:bg-red-700" aria-current="page">{children}</a>
);

export default DashboardNavbar;