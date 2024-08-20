'use client';

import React, { useState } from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { login, logout } from '../../../api/auth'; // Asegúrate de que la ruta sea correcta




export default function ForgotPass() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(data.message);
            setEmail('');
        } else {
            setError(data.error || 'Ocurrió un error. Por favor, intenta de nuevo.');
        }
        } catch (err) {
            setError('Ocurrió un error al conectar con el servidor. Por favor, intenta de nuevo.');
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <span className="text-xs text-slate-600">Regresar al{" "}
                    <Link href="/Auth/login" className="text-cyan-500 hover:underline">
                        inicio de sesión
                    </Link>
                </span>
                <div className="mt-4 text-center">
                    <Label className="text-sm font-light">
                        ¿No tienes una cuenta todavía?{" "}
                        <Link href="/Auth/register" className="text-cyan-500 hover:underline">
                            Registrarse
                        </Link>
                    </Label>
                </div>
            </Card>
        </div>
    </>
  )
}
