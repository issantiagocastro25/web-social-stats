import React from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

export default function Login() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm p-4 shadow-lg rounded-lg bg-white">
                <h2 className="text-3xl font-bold text-center mb-6">Iniciar sesión</h2>
                <form className="flex flex-col gap-4">
                    <div>
                        <input id="email1" type="email" name="username" placeholder="Correo electrónico" className="block w-full rounded-lg border-gray-300 focus:border-[#7A4993] focus:ring-[#7A4993]" required />
                    </div>
                    <div>
                        <input type="password" id="password1" name="password" placeholder="Contraseña" className="block w-full rounded-lg border-gray-300 focus:border-[#7A4993] focus:ring-[#7A4993]" required />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Recuérdame</Label>
                    </div>
                    <button type="submit" className="relative flex items-stretch justify-center p-2 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none border border-transparent focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white">
                        Iniciar Sesión
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Label className="text-sm font-light">
                        ¿No tienes una cuenta todavía?{" "}
                        <a href="/Auth/register" className="text-cyan-500 hover:underline">
                            Registrarse
                        </a>
                    </Label>
                </div>
            </Card>
        </div>
    );
}
