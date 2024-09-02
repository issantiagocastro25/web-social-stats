'use client';

import React, { useState } from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requestPasswordReset } from '@/api/auth';

export default function ForgotPassword() {
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
            await requestPasswordReset(email);
            setMessage('Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.');
            setTimeout(() => router.push('/auth/access'), 5000);
        } catch (err) {
            console.error('Error al solicitar restablecimiento de contraseña:', err);
            setError('Ocurrió un error. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-3xl font-bold text-center mb-2">Olvidé mi Contraseña</h2>
            <h3 className="text-lg font-bold text-center text-slate-600 mb-3">Ingresa tu correo electrónico para recibir un enlace de restablecimiento</h3>
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
                <div className="mb-2">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                    </Label>
                    <TextInput
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white">
                    {isLoading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
                </Button>
            </form>
            <div className="mt-4 text-center">
                <Label className="text-sm font-light">
                    ¿Recordaste tu contraseña?{" "}
                    <Link href="/auth/access" className="text-cyan-500 hover:underline">
                        Iniciar sesión
                    </Link>
                </Label>
            </div>
        </Card>
    );
}