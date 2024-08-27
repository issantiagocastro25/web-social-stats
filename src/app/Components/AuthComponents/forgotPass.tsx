'use client';

import React, { useState } from "react";
import { Button, Card, Checkbox, Label, TextInput, Alert } from "flowbite-react"; // Añadido Alert
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { forgotPassword } from '../../../api/auth'; // Asegúrate de que la ruta sea correcta
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

export default function ForgotPass() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthenticated } = useAuthCheck(false);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (isAuthenticated) {
        return null; // El hook se encargará de la redirección al dashboard
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setMessage(result.message);
                setEmail('');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'Ocurrió un error. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-white">
                    <h2 className="text-3xl font-bold text-center mb-2">¿Olvidaste tu contraseña?</h2>
                    <h3 className="text-lg font-bold text-center text-slate-600 mb-3">Te enviaremos un link para el restablecimiento de tu contraseña</h3>
                    {message && (
                        <Alert color="success" className="mb-4">
                            <span className="font-medium">{message}</span>
                        </Alert>
                    )}
                    {error && (
                        <Alert color="failure" className="mb-4">
                            <span className="font-medium">{error}</span>
                        </Alert>
                    )}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input 
                                id="email" 
                                type="email" 
                                name="email" 
                                placeholder="tu@email.com"
                                className="block w-full rounded-lg border-gray-300 focus:border-[#7A4993] focus:ring-[#7A4993]" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="relative flex items-stretch justify-center p-2 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none border border-transparent focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
                        </button>
                    </form>
                    <span className="text-xs text-slate-600 mt-4">Regresar al{" "}
                        <Link href="/auth/access" className="text-cyan-500 hover:underline">
                            inicio de sesión
                        </Link>
                    </span>
                    <div className="mt-4 text-center">
                        <Label className="text-sm font-light">
                            ¿No tienes una cuenta todavía?{" "}
                            <Link href="/auth/access" className="text-cyan-500 hover:underline">
                                Registrarse
                            </Link>
                        </Label>
                    </div>
                </Card>
            </div>
        </>
    )
}