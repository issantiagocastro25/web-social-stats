'use client';

import React, { useState } from 'react';
import { Button, Card, Label, Checkbox, TextInput, Modal } from "flowbite-react";
import { login, logout, signup } from '../../../api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ButtonGoogle from './google/ButtonGoogle';
import ButtonLinkedIn from './linkedin/ButtonLinkedIn';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import LoadingLogin from '../Loadings/LoadingLogin';

const LoginRegisterCard: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [identification, setIdentification] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const { isAuthenticated, isLoading } = useAuthCheck(false);

    if (isLoading) {
        return <><LoadingLogin/></>;
    }

    if (isAuthenticated) {
        return null; // El hook se encargará de la redirección al dashboard
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginView) {
                const response = await login(email, password1);
                console.log('Login exitoso:', response);
                router.push('/salud');
            } else {
                if (password1 !== password2) {
                    setError('Las contraseñas no coinciden');
                    return;
                }
                await signup(email, password1, password2, firstName, lastName, identification);
                router.push('/pricing');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error en la autenticación. Por favor, inténtalo de nuevo.');
        }
    };

    const handleAcceptTerms = () => {
        setAcceptTerms(true);
        setShowModal(false);
    };

    const handleDeclineTerms = () => {
        setAcceptTerms(false);
        setShowModal(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-4xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Sección de formularios */}
                    <div className="w-full md:w-1/2 p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{isLoginView ? 'Iniciar Sesión' : 'Registro'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoginView && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                autoComplete="given-name"
                                                placeholder="Nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                                required
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Apellido</label>
                                            <input
                                                type="text"
                                                name="last-name"
                                                id="last-name"
                                                autoComplete="family-name"
                                                placeholder="Apellido"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                                required
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="identification" className="block text-sm font-medium text-gray-700">Identificación</label>
                                        <input 
                                            type="number" 
                                            name="identification" 
                                            id="identification" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                            required
                                            value={identification}
                                            placeholder="Numero de Identificación"
                                            onChange={(e) => setIdentification(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Correo Electrónico"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    name="password1"
                                    id="password1"
                                    placeholder="Contraseña"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                    required
                                    value={password1}
                                    onChange={(e) => setPassword1(e.target.value)}
                                />
                            </div>
                            {isLoginView && (
                                <div className="text-sm">
                                    <Link href="/auth/forgot-password" className="text-secondary hover:text-secondary-dark">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            )}
                            {!isLoginView && (
                                <>
                                    <div>
                                        <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="password2"
                                            id="password2"
                                            placeholder="Confirmar Contraseña"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50"
                                            required
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                                            checked={acceptTerms}
                                            onChange={() => setShowModal(true)}
                                        />
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                            Acepto los <span className="text-secondary cursor-pointer" onClick={() => setShowModal(true)}>términos y condiciones</span>
                                        </label>
                                    </div>
                                </>
                            )}
                            <Button type="submit" className="w-full enabled:hover:bg-secondary-dark rounded-lg bg-secondary hover:bg-secondary-dark text-white">
                                {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
                            </Button>
                            <div className="bg-gray-300 w-full h-0.5 rounded-lg"></div>
                            <ButtonGoogle buttonText={isLoginView ? 'Continuar con Google' : 'Registrarse con Google'} className="border-gray-300 hover:bg-gray-100" />
                            <ButtonLinkedIn buttonText={isLoginView ? 'Continuar con LinkedIn' : 'Registrarse con LinkedIn'} className="border-gray-300 hover:bg-gray-100" />
                        </form>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Sección de información/publicidad */}
                    <div className="w-full md:w-1/2 bg-primary text-white p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Bienvenido a nuestra plataforma</h2>
                        <p className="mb-4 text-sm md:text-base">Disfruta de los siguientes beneficios:</p>
                        <ul className="list-disc list-inside mb-4 text-sm md:text-base">
                            <li>Acceso completo a todas las estadísticas</li>
                            <li>Más de 1,000,000 conjuntos de datos</li>
                            <li>Descarga en XLS, PDF y PNG</li>
                        </ul>
                        <Button onClick={() => setIsLoginView(!isLoginView)} className="mt-4 w-full md:w-auto bg-tertiary hover:bg-tertiary-dark text-primary text-2xl transition-colors duration-300">
                            {isLoginView ? 'Registrarse ahora' : 'Ya tengo una cuenta'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modal de Términos y Condiciones */}
            <Modal show={showModal} size="3xl" popup={true} onClose={handleDeclineTerms}>
                <Modal.Header />
                <Modal.Body>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Términos y Condiciones de Uso</h3>
                    {/* Aquí va el contenido de los términos y condiciones */}
                    <p>
                        [Inserta aquí el contenido completo de los términos y condiciones]
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-start w-full space-x-4">
                        <Button color="success" onClick={handleAcceptTerms} className="bg-secondary hover:bg-secondary-dark text-white">
                            Aceptar
                        </Button>
                        <Button color="gray" onClick={handleDeclineTerms}>
                            Declinar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginRegisterCard;