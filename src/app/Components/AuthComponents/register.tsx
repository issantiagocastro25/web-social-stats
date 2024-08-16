'use client';

import React, { useState } from "react";
import { Button, Card, Label, Checkbox, TextInput } from "flowbite-react";
import { signup } from '../../../api/auth';
import Link from 'next/link';

export default function Register() {
    const [type_identification, setTypeIdentification] = useState('');
    const [identification, setIdentification] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password1 !== password2) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            await signup(email, password1, password2, firstName, lastName, type_identification, identification, phone);
        } catch (error) {
            setError('Error en el registro. Por favor, inténtalo de nuevo.');
            console.error('Error de registro:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Card className="max-w-lg mx-auto p-6 shadow-md bg-white">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="text-4xl font-semibold text-center">
                    ¡Regístrate!
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Apellido</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="type-identification" className="block text-sm font-medium leading-6 text-gray-900">Tipo de Identificación</label>
                        <div className="mt-2">
                            <select name="type-identification" id="type-identification" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                            required
                            value={type_identification}
                            onChange={(e) => setTypeIdentification(e.target.value)}
                            >
                                <option value="">seleccione...</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="PA">Pasaporte</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="identification" className="block text-sm font-medium leading-6 text-gray-900">Identificación</label>
                        <div className="mt-2">
                            <input type="number" name="identification" id="identification" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                            required
                            value={identification}
                            onChange={(e) => setIdentification(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Correo Electrónico</label>
                    <div className="mt-2">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Numero de teléfono</label>
                    <div className="mt-2">
                        <input type="text" name="phone" id="phone" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="password1" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
                    <div className="mt-2">
                        <input
                            type="password"
                            name="password1"
                            id="password1"
                            className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                            required
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">Confirmar Contraseña</label>
                    <div className="mt-2">
                        <input
                            type="password"
                            name="password2"
                            id="password2"
                            className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6"
                            required
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="terms"/>
                    <Label htmlFor="terms" className="text-sm font-light">Acepta los términos y condiciones</Label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="bg-[#7A4993] hover:bg-[#6b3e7b] text-white rounded-lg">
                    Registrarme
                </Button>
                <div className="text-center mt-4">
                    <Label className="text-sm font-light">
                        ¿Ya tienes una cuenta? <Link href="/accounts/login" className="text-cyan-500">Inicia sesión</Link>
                    </Label>
                </div>
            </form>
        </Card>
    );
}