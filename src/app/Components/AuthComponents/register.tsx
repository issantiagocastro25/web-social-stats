import React from "react";
import { Button, Card, Label, Checkbox, TextInput, Datepicker } from "flowbite-react";

export default function Register() {
    return <Card className="max-w-lg">
    <form className="flex flex-col gap-4">
      <div className="text-4xl pb-2 font-semibold">
        Registrate!
      </div>
      <div>
        <TextInput id="firstNameUser" type="name" placeholder="Nombres" required />
      </div>
      <div>
        <TextInput id="lastNameUser" type="name" placeholder="Apellidos" required />
      </div>
      <div>
        <TextInput id="Identification" type="number" placeholder="Identificación" required />
      </div>
      <div>
        <TextInput id="email1" type="email" placeholder="Correo electrónico" required />
      </div>
      <div>
        <TextInput id="numeroTelefono" type="number" placeholder="Número de telefono" required />
      </div>
      <div>
        <TextInput id="password" placeholder="Contraseña" type="password" required />
      </div>
      <div>
        <TextInput id="passwordConfirmation" placeholder="Confirmar contraseña" type="password" required />
      </div>
      <div>
      <Checkbox/><Label className="pl-2 text-sm font-extralight">Acepta terminos y condiciones?</Label>  
      </div>

      <Button color="purple" href="/Auth/login" type="submit">Registrarme</Button>

    </form>
  </Card>
  }