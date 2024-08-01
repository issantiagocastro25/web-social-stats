import React from "react";
import { Button, Card, Label, Checkbox, TextInput, Datepicker } from "flowbite-react";

export default function Register() {
    return (
        <>
            <Card className="max-w-lg mx-auto p-6 shadow-md bg-white">
                <form className="flex flex-col gap-4">
                    <div className="text-4xl font-semibold text-center">
                        ¡Regístrate!
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                            <div className="mt-2">
                                <input type="text" name="first-name" id="first-name" autoComplete="give-name" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required/>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Apellido</label>
                            <div className="mt-2">
                                <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required />
                            </div>
                        </div>
                    </div>
                    <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="type-identification" className="block text-sm font-medium leading-6 text-gray-900">Tipo de Identificación</label>
                            <div className="mt-2">
                                <select name="type-identification" id="type-identification" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required>
                                    <option value="" selected>seleccione...</option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="identification" className="block text-sm font-medium leading-6 text-gray-900">Identificación</label>
                            <div className="mt-2">
                                <input type="number" name="identification" id="identification" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required/>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">Correo Electrónico</label>
                        <div className="mt-2">
                            <input type="text" name="phone-number" id="phone-number" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required />
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Correo Electrónico</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required/>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required/>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-gray-900">Confirmar Contraseña</label>
                        <div className="mt-2">
                            <input type="password" name="password-confirm" id="password-confirm" className="block w-full rounded-md border-0 py-1.5 bg-gray-50 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-400 sm:text-sm sm:leading-6" required/>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="terms"/>
                        <Label htmlFor="terms" className="text-sm font-light">Acepta los términos y condiciones</Label>
                    </div>
                    <Button type="submit" className="bg-[#7A4993] hover:bg-[#6b3e7b] text-white rounded-lg">
                        Registrarme
                    </Button>
                    <div className="text-center mt-4">
                        <Label className="text-sm font-light">
                            ¿Ya tienes una cuenta? <a href="/Auth/login" className="text-cyan-500">Inicia sesión</a>
                        </Label>
                    </div>
                </form>
            </Card>
        </>
    )
  }