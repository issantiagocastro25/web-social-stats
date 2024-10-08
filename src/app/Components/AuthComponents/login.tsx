'use client';

import React, { useState } from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { login } from '../../../api/auth'; // Asegúrate de que la ruta sea correcta
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ButtonGoogle from "./google/ButtonGoogle";
import { getGoogleLoginUrl } from '../../../api/auth';
import ButtonLinkedIn from "./linkedin/ButtonLinkedIn";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(email, password, remember);
            console.log('Login exitoso:', response.user);
            router.push('/Principal/main');
        } catch (err) {
                console.error('Error en el login:', err);
                if (err.response) {
                // El servidor respondió con un estado fuera del rango de 2xx
                setError(err.response.data.detail || 'Error en el inicio de sesión. Inténtalo de nuevo.');
                } else if (err.request) {
                // La petición fue hecha pero no se recibió respuesta
                setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
                } else {
                // Algo sucedió al configurar la petición que provocó un error
                setError('Error al procesar la solicitud. Inténtalo de nuevo.');
                }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-white">
                <h2 className="text-3xl font-bold text-center mb-6">Iniciar sesión</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <input 
                            id="email" 
                            type="email" 
                            name="email" 
                            placeholder="Correo electrónico" 
                            className="block w-full rounded-lg border-gray-300 focus:border-[#7A4993] focus:ring-[#7A4993]" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Contraseña" 
                            className="block w-full rounded-lg border-gray-300 focus:border-[#7A4993] focus:ring-[#7A4993]" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Label className="text-sm font-light">
                        <Link href="/Auth/forgot-password" className="text-cyan-500 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="remember" 
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <Label htmlFor="remember">Recuérdame</Label>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button 
                        type="submit" 
                        className="relative flex items-stretch justify-center p-2 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none border border-transparent focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white"
                    >
                        Iniciar Sesión
                    </button>
                    <div className="bg-slate-600 w-full h-0.5 rounded-lg opacity-20"></div>
                    <ButtonGoogle/>
                    <ButtonLinkedIn/>
                </form>
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
    );
}