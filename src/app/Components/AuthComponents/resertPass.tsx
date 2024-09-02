'use client';

import React, { useState, useEffect } from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/api/auth';
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

interface ResetPasswordFormProps {
  resetKey: string;
}

export default function ResetPasswordForm({ resetKey }: ResetPasswordFormProps) {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uidb64, setUidb64] = useState('');
    const [token, setToken] = useState('');
    const router = useRouter();
    const { isAuthenticated } = useAuthCheck(false);

    useEffect(() => {
        const parts = resetKey.split('-');
        if (parts.length >= 2) {
            setUidb64(parts[0]);
            setToken(parts.slice(1).join('-')); // Unir todas las partes restantes como token
        } else {
            setError('Link de restablecimiento inválido');
        }
    }, [resetKey]);

    if (isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (password1 !== password2) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        if (!uidb64 || !token) {
            setError('Link de restablecimiento inválido');
            setIsLoading(false);
            return;
        }

        try {
            const response = await resetPassword(uidb64, token, password1);
            setMessage('Tu contraseña ha sido restablecida exitosamente');
            setTimeout(() => router.push('/auth/access'), 2500);
        } catch (error: any) {
            console.error('Error durante el restablecimiento de contraseña:', error);
            setError(error.response?.data?.error || 'Ocurrió un error al restablecer la contraseña. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-3xl font-bold text-center mb-2">Nueva Contraseña</h2>
            <h3 className="text-lg font-bold text-center text-slate-600 mb-3">Ingresa una nueva contraseña que no hayas utilizado en otro sitio</h3>
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
                    <Label htmlFor="password1" className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Contraseña
                    </Label>
                    <TextInput
                        id="password1"
                        type="password"
                        required
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Contraseña
                    </Label>
                    <TextInput
                        id="password2"
                        type="password"
                        required
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white">
                    {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
                </Button>
            </form>
            <div className="mt-4 text-center">
                <Label className="text-sm font-light">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/auth/access" className="text-cyan-500 hover:underline">
                        Iniciar sesión
                    </Link>
                </Label>
            </div>
        </Card>
    );
}