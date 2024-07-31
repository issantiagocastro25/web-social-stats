import React from "react";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";

export default function Login() {
    return <Card className="max-w-lg">
    <form className="flex flex-col gap-4">
      <div className="text-2xl font-semibold">
        Iniciar sesión
      </div>
      <div>
        <TextInput id="email1" type="email" placeholder="Correo electrónico" required />
      </div>
      <div>
        <TextInput id="password1" placeholder="Contraseña" type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Recuérdame</Label>
      </div>
      <Button color="purple" type="submit">Iniciar sesión</Button>
    </form>
    <div className="mt-1">
      <Label className="text-sm font-extralight"> ¿No tienes una cuenta todavía? </Label>
      <Button color="warning" href="/Auth/register">Registrarme</Button>
    </div>
  </Card>
  }