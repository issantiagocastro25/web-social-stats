'use client';

import React, { useState } from 'react';
import { Button, Card, Label, Checkbox, TextInput, Modal } from "flowbite-react";
import { login, signup } from '../../../api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ButtonGoogle from './google/ButtonGoogle';
import ButtonLinkedIn from './linkedin/ButtonLinkedIn';
import { useAuthCheck } from '@/app/hooks/useAuthCheck';
import LoadingLogin from '../Loadings/LoadingLogin';

const LoginRegisterCard: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [identification, setIdentification] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const { isAuthenticated, isLoading } = useAuthCheck(false);

    if (isLoading) {
        return <><LoadingLogin/></>;
    }

    if (isAuthenticated) {
        return null; // El hook se encargará de la redirección al dashboard
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginView) {
                const response = await login(email, password1);
                console.log('Login exitoso:', response);
                router.push('/stats');
            } else {
                if (password1 !== password2) {
                    setError('Las contraseñas no coinciden');
                    return;
                }
                await signup(email, password1, firstName, lastName, identification);
                setIsLoginView(true);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error en la autenticación. Por favor, inténtalo de nuevo.');
        }
    };

    const handleAcceptTerms = () => {
        setAcceptTerms(true);
        setShowModal(false);
    };

    const handleDeclineTerms = () => {
        setAcceptTerms(false);
        setShowModal(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-4xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Sección de formularios */}
                    <div className="w-full md:w-1/2 p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-4">{isLoginView ? 'Iniciar Sesión' : 'Registro'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoginView && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                autoComplete="given-name"
                                                placeholder="Nombre"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                required
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Apellido</label>
                                            <input
                                                type="text"
                                                name="last-name"
                                                id="last-name"
                                                autoComplete="family-name"
                                                placeholder="Apellido"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                required
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="identification" className="block text-sm font-medium text-gray-700">Identificación</label>
                                        <input 
                                            type="number" 
                                            name="identification" 
                                            id="identification" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                            value={identification}
                                            placeholder="Numero de Identificación"
                                            onChange={(e) => setIdentification(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Correo Electrónico"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password1" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    name="password1"
                                    id="password1"
                                    placeholder="Contraseña"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                    value={password1}
                                    onChange={(e) => setPassword1(e.target.value)}
                                />
                            </div>
                            {isLoginView && (
                                <div className="text-sm">
                                    <Link href="/auth/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            )}
                            {!isLoginView && (
                                <>
                                    <div>
                                        <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="password2"
                                            id="password2"
                                            placeholder="Confirmar Contraseña"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            checked={acceptTerms}
                                            onChange={() => setShowModal(true)}
                                        />
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                            Acepto los <span className="text-indigo-600 cursor-pointer" onClick={() => setShowModal(true)}>términos y condiciones</span>
                                        </label>
                                    </div>
                                </>
                            )}
                            <Button type="submit" className="w-full enabled:hover:bg-[#6b3e7b] rounded-lg bg-[#7A4993] hover:bg-[#6b3e7b] text-white">
                                {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
                            </Button>
                            {isLoginView &&(
                                <>
                                    <div className="bg-slate-600 w-full h-0.5 rounded-lg opacity-20"></div>
                                    <ButtonGoogle/>
                                    <ButtonLinkedIn/>
                                </>
                            )}
                        </form>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {/* Sección de información/publicidad */}
                    <div className="w-full md:w-1/2 bg-blue-600 text-white p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Bienvenido a nuestra plataforma</h2>
                        <p className="mb-4 text-sm md:text-base">Disfruta de los siguientes beneficios:</p>
                        <ul className="list-disc list-inside mb-4 text-sm md:text-base">
                            <li>Acceso completo a todas las estadísticas</li>
                            <li>Más de 1,000,000 conjuntos de datos</li>
                            <li>Descarga en XLS, PDF y PNG</li>
                        </ul>
                        <Button color="light" onClick={() => setIsLoginView(!isLoginView)} className="mt-4 w-full md:w-auto">
                            {isLoginView ? 'Registrarse ahora' : 'Ya tengo una cuenta'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modal de Términos y Condiciones */}
            <Modal show={showModal} size="3xl" popup={true} onClose={handleDeclineTerms}>
                <Modal.Header />
                <Modal.Body>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Términos y Condiciones de Uso</h3>
                    {/* Aquí va el contenido de los términos y condiciones */}
                    <h2 className="text-base font-medium text-gray-900 mb-2">AVISO LEGAL</h2>
                    <p>
                    El acceso, navegación y utilización del Sitio Web <a href="http://www.datosmacro.com">www.datosmacro.com</a> implican la aceptación expresa y sin reservas de todos los términos del presente
                    Aviso Legal <br /> <br />

                    Su observancia y cumplimiento serán exigibles para cualquier persona que acceda, navegue o utilice el Sitio Web. Si usted no está de acuerdo con los
                    términos expuestos, no acceda, navegue o utilice este sitio web. <br /> <br />

                    El titular de este Sitio Web Windows Channel Colombia SA. (en adelante, “Windows Channel”), con NIT 900248321, e-mail: <a href="mailto:info@windowschannel.com">info@windowschannel.com</a>. <br /> <br />

                    Este Aviso Legal regula el acceso, la navegación y utilización del este Sitio Web. Windows Channel se reserva el derecho a modificar tanto la presentación,
                    como la configuración y contenido del mismo, al igual que las condiciones requeridas para su acceso y utilización <br /> <br />

                    El acceso y navegación del Sitio Web requieren registro y supone que el usuario acepta en su totalidad y se obliga a cumplir por completo el presente Aviso
                    Legal. <br /> <br />
                    </p>

                    <h2 className="text-base font-medium text-gray-900 mb-2">Responsabilidades y Garantías</h2>
                    <p>El equipo que hace RedesSocialesColombia.com se esfuerza por conseguir que los datos publicados en nuestra web sean fiables y estén actualizados. No obstante, no podemos garantizar que no existan errores o que la información esté actualizada. No nos hacemos responsables de los daños y perjuicios que se deriven de:</p>
                    <ul className="list-disc list-inside ml-5">
                        <li>Errores.</li>
                        <li>Información incompleta.</li>
                        <li>Problemas causados por la divulgación de información por Internet.</li>
                        <li>Fallos técnicos.</li>
                    </ul> <br />

                    <p>Si usted toma la decisión de contraer obligaciones basándose en la información de esta página web, será usted el responsable de las consecuencias que ello conlleve.</p> <br />
                    <p>En consecuencia, RedesSocialesColombia.com no puede garantizar la fiabilidad, utilidad o veracidad de absolutamente toda la información y/o de los servicios del Sitio Web.</p> <br />
                    <p>RedesSocialesColombia.com ha adoptado todas las medidas necesarias, dentro de sus posibilidades, para garantizar el funcionamiento del Sitio Web y reducir al mínimo los errores técnicos y de los contenidos que publicamos.</p> <br />
                    <p>Windows Channel se reserva el derecho a suspender, modificar, restringir o interrumpir el acceso, navegación y uso de servicios del Sitio Web, con o sin previa notificación, a los usuarios que contravengan cualquiera de las disposiciones detalladas en el presente Aviso Legal, sin que exista la posibilidad de que el usuario exija indemnización alguna por esta causa.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Confidencialidad y Protección de Datos</h2>
                    <p>De conformidad con lo dispuesto en el Reglamento General de Protección de Datos, todos los datos de carácter personal facilitados durante la utilización del Sitio Web serán tratados de conformidad con lo dispuesto en la <a href="#politica-privacidad">Política de Privacidad</a>.</p> <br />
                    <p>Windows Channel podrá modificar los términos y condiciones legales del presente Aviso Legal o a través de cualquier tipo de comunicación dirigida a los usuarios.</p> <br />
                    <p>El presente Aviso Legal se entenderá vigente mientras no sea modificado o eliminado, momento en el que tendrá vigencia el nuevo el Aviso Legal publicado.</p> <br />
                    <p><strong>Última actualización:</strong> Septiembre 2024</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2" id="politica-privacidad">Política de Privacidad</h2>
                    <p>Los datos personales facilitados a través del Sitio Web serán tratados por Windows Channel con la finalidad de enviarle una newsletter con información sobre las
                    actualizaciones de datos que vamos realizando en el Sitio Web.</p> <br />
                    <p>Los datos del Usuario serán tratados por Windows Channel hasta que el Usuario se oponga o revoque su consentimiento. Trataremos sus datos de forma absolutamente
                    confidencial y no los cederemos a terceros. Usted tendrá el poder para cambiarlos, actualizarlos o borrarlos en el instante que desee.</p> <br />
                    <p>Le rogamos que compruebe regularmente la política de privacidad de Windows Channel . Nos reservamos el derecho de revisarla si lo consideramos necesario</p> <br />
                    <p><strong>Actualizada:</strong> Septiembre 2024</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Política de Cookies</h2>
                    <p>El acceso y la navegación en el Sitio Web, o el uso de los servicios del mismo, implican la aceptación de los términos y condiciones recogidos en el <a href="#aviso-legal">Aviso Legal</a> y en la <a href="#politica-privacidad">Política de Privacidad</a>.</p> <br />
                    <p>RedesSocialesColombia.com utiliza cookies Cookies u otros archivos de funcionalidad similar (en adelante, las “Cookies”) con el fin de facilitar su navegación por el Sitio
                    Web.</p> <br />
                    <p>Las Cookies son esenciales para el funcionamiento de Internet; no pueden dañar el equipo/dispositivo del usuario y, si se encuentran activadas en la configuración de su
                    navegador, ayudan a identificar y resolver posibles errores de funcionamiento del Sitio Web.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Tipos de Cookies Utilizadas</h2>
                    <ul className="list-disc list-inside ml-5">
                        <li><strong>Cookies estrictamente necesarias:</strong> Para la prestación de determinados servicios integrados en el propio sitio.</li>
                        <li><strong>Cookies analíticas:</strong> Para el seguimiento y análisis estadístico del comportamiento del conjunto de los usuarios.</li>
                    </ul> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Cookies Propias</h2>
                    <p>Permiten la optimización y adaptación de nuestros contenidos a nuestros usuarios.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Cookies de Terceros</h2>
                    <ul>
                        <li>
                            <strong>Analíticas:</strong> Permitir la identificación anónima de los Usuarios navegantes a través de la "Cookie" (identifica navegadores y dispositivos, no personas) y por lo
                            tanto la contabilización aproximada del número de visitantes y su tendencia en el tiempo. Identificar de forma anónima los contenidos más visitados y más
                            atractivos para los Usuarios. Saber si el Usuario que está accediendo es nuevo o repite visita. Dichas Cookies sólo serán utilizadas con propósitos estadísticos que
                            ayuden a la optimización y mejora de la experiencia de los Usuarios en el sitio. <strong>Google Analytics</strong>.
                        </li>
                    </ul> <br />
                    <p><strong>Publicidad:</strong> RedesSocialesColombia.com no incluye publicidad por lo que no integra cookies a ta efecto.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Renuncia de Responsabilidad</h2>
                    <p>
                        El equipo que hace RedesSocialesColombia.com se esfuerza por conseguir que los datos publicados en nuestra web sean fiables y estén
                        actualizados. No obstante, no podemos garantizar que no existan errores o que la información esté actualizada. No nos hacemos responsables de los
                        daños y perjuicios que se deriven de:</p> <br />
                    <ul className="list-disc list-inside ml-5">
                        <li>Errores.</li>
                        <li>Información incompleta.</li>
                        <li>Problemas causados por la divulgación de información por Internet.</li>
                        <li>Fallos técnicos.</li>
                        <li>Si Ud. toma la decisión de contraer obligaciones basándose en la información de esta página web, será Ud. el responsable de las consecuencias
                        que ello conlleve.</li>
                    </ul> <br />
                    <p>Si desea ponerse en contacto con nosotros, puede hacerlo a través del correo: <a href="mailto:info@windowschannel.com">info@windowschannel.com</a>.</p> <br />

                    <h3 className="text-lg font-medium text-gray-900 mb-4">TÉRMINOS Y CONDICIONES GENERALES DE PARA LA ADQUISICIÓN Y USO DE PRODUCTOS IMPRESOS Y CONTENIDOS DIGITALES OFRECIDOS POR REDESSOCIALESCOLOMBIA.COM </h3>

                    <h2 className="text-base font-medium text-gray-900 mb-2">1. CONDICIONES GENERALES REDES SOCIALES COLOMBIA.COM</h2>
                    <p>(en adelante, RSC) establece los términos y condiciones de la suscripción, aplicables de
                        manera general a la adquisición y uso de los contenidos digitales ofrecidos por RSC en el sitio web https://www.redessocialescolombia.com. Por favor, léalos
                        cuidadosamente. El contrato de suscripción se regirá bajo las condiciones que aquí se describen, y usted acuerda vincularse jurídicamente por estas condiciones.
                        Estas condiciones sustituyen expresamente los acuerdos o compromisos previos con usted, ya sean verbales o escritos. RSC podrá modificar estos términos y
                        condiciones en cualquier momento, lo cual le será informado por alguno de los canales de contacto. Por tanto, usted deberá leer el contenido de este instrumento
                        legal periódicamente para revisar las normativas aquí establecidas y los cambios efectuados debido a que estas disposiciones son las que le aplican al contrato de
                        suscripción. Al aceptar estos términos y condiciones, usted reconoce y declara que es mayor de edad y está en plena capacidad de aceptar y quedar sujeto a lo
                        descrito en el presente documento.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">2. CONDICIONES GENERALES DEL CONTRATO DE SUSCRIPCIÓN</h2>
                    <p>Con la suscripción a RSC, el suscriptor obtiene acceso a información cuantitativa relevante
                    sobre la presencia de organizaciones en las redes sociales.</p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">3. REGISTRO</h2>
                    <p>Para registrarse en los servicios digitales de RSC, el SUSCRIPTOR deberá contar con acceso y conexión a internet, y crear una identificación de
                        acceso a través de las siguientes opciones:
                    </p>
                    <ul className="list-disc list-inside ml-5">
                        <li>
                            Proporcionando a RSC. una dirección de correo electrónico y seleccionando un nombre del SUSCRIPTOR y una contraseña.
                        </li>
                        <li>
                            Mediante su cuenta de Google. Cuando el proceso se realiza con esta opción, el SUSCRIPTOR autoriza que su dirección de correo electrónico sea utilizada por
                            RSC para brindar acceso y registrar su suscripción, dado que, por medio de la configuración de Google usted lo permite.
                        </li>
                    </ul>
                    <p>
                        Para acceder a los servicios digitales de RSC es necesario realizar previamente el registro de los datos del SUSCRIPTOR en el sitio web y contar con una
                        identificación que le permitirá acceder a través de los diferentes dispositivos desde los que tenga acceso a los servicios. El SUSCRIPTOR es el único responsable
                        de la confidencialidad de su identificación y contraseña de acceso. El SUSCRIPTOR será responsable de todo el uso y la actividad de su cuenta, incluido el uso por
                        parte de cualquier tercero autorizado para utilizar su identificación de acceso y de inicio de sesión, y de todos los cargos por cualquier bien o servicio que se adquiera
                        desde su cuenta. También es responsable de todas las declaraciones realizadas o los materiales publicados en su cuenta, incluida la responsabilidad por los daños
                        causados por dichas declaraciones o materiales. Brindar información fraudulenta o cualquier actividad abusiva o ilegal hecha desde su cuenta puede ser motivo para
                        la cancelación de esta, a la entera discreción de REDESSOCIALESCOLOMBIA.
                    </p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">4. CANCELACIÓN DE LA RENOVACIÓN AUTOMÁTICA El SUSCRIPTOR</h2>
                    <p>
                        podrá solicitar la cancelación de su renovación automática en cualquier momento. Una
                        vez recibida la solicitud no se seguirá cobrando automáticamente el valor de la suscripción del PLAN AUTOMÁTICO contratado. Al cancelar la renovación
                        automática, no está finalizando la suscripción y esta permanecerá activa hasta que el tiempo de suscripción contratado culmine.
                    </p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">5. DERECHO DE RETRACTO</h2>
                    <p>
                    Conforme al artículo 47 del Estatuto del Consumidor, Ley 1480 de 2011, el SUSCRIPTOR podrá ejercer el derecho de retracto
                    respecto del producto adquirido, dentro de los cinco (5) días hábiles posteriores a la suscripción del presente contrato. La devolución del dinero pagado se realizará
                    dentro de los treinta (30) días siguientes al ejercicio del derecho por parte del SUSCRIPTOR. Pasados los cinco (5) días, se da por entendido que el SUSCRIPTOR
                    indica conformidad del estado adecuado del producto entregado. En el evento en que se haga uso del derecho de retracto, se resolverá el contrato y se procederá
                    con el reintegro del dinero que el SUSCRIPTOR hubiese pagado.
                    </p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">6. CONDUCTAS PROHIBIDAS A LOS SUSCRIPTORES El SUSCRIPTOR</h2>
                    <p>
                        no puede acceder o utilizar, o intentar acceder o utilizar, los servicios digitales para llevar a
                        cabo cualquier acción que pueda perjudicar a RSC o a cualquier tercero, interferir con el funcionamiento de los mismos servicios, o utilizarlos de una manera que violen
                        cualquier ley.
                    </p>
                    <ul className="list-disc list-inside ml-5">
                        <li>
                            Hacer uso de los contenidos de los servicios digitales de cualquier manera que constituya una infracción de nuestros derechos o de los derechos de otros
                            SUSCRIPTORES o terceros, incluidos los derechos de autor.
                        </li>
                        <li>
                            El SUSCRIPTOR no podrá divulgar, usar, reproducir, comercializar, distribuir, sincronizar, modificar, alterar, deformar o, de cualquier forma, cambiar el contenido de
                            RSC, puesto que cualquier uso no autorizado por parte del SUSCRIPTOR sobre dichos contenidos se entenderá como una vulneración a los derechos morales, derechos
                            patrimoniales de autor, derecho a la imagen, derecho a la intimidad de las personas, derecho al habeas data y hará al SUSCRIPTOR responsable ante RSC. por cualquier
                            sanción (pena privativa de la libertad, multas, demandas, denuncias y entre otras sanciones legales aplicables), daño y/o perjuicio que se cause como consecuencia del
                            uso del contenido.
                        </li>
                        <li>
                            Acceder a los servicios digitales a las que no esté autorizado, o intentar eludir cualquier restricción impuesta al uso o acceso de los servicios.
                        </li>
                        <li>
                            Copiar, reproducir, distribuir, publicar, introducir en una base de datos, mostrar, ejecutar, modificar, crear obras derivadas, transmitir o explotar de cualquier manera los
                            servicios digitales de RSC, excepto si el contenido publicado por RSC esté expresamente autorizado.
                        </li>
                        <li>
                            Distribuir los servicios digitales a través de cualquier red, incluyendo una red de área local, ni venderla u ofrecerla para su venta. Los archivos ofrecidos a través de los
                            servicios digitales de RSC. no pueden utilizarse para construir ningún tipo de base de datos.
                        </li>
                        <li>
                            Utilizar cualquier dispositivo, software o rutina para interferir o intentar interferir en el correcto funcionamiento de los servicios digitales de RRSC. o en cualquier actividad
                            realizada que se realice en estos.
                        </li>
                        <li>
                            Utilizar o intentar utilizar cualquier motor, software, herramienta, agente u otro dispositivo o mecanismo (incluidos, entre otros, navegadores, arañas, robots, avatares o
                            agentes inteligentes) para navegar o realizar búsquedas en los servicios que no sean el motor de búsqueda y los agentes de búsqueda disponibles en los servicios y que
                            no sean los navegadores web de terceros generalmente disponibles.
                        </li>
                        <li>
                            Intentar descifrar, descompilar, desensamblar o aplicar ingeniería inversa a cualquiera de los programas informáticos que componen o forman parte de los servicios
                            digitales de RSC
                        </li>
                        <li>
                            Participar en cualquier otra conducta que restrinja o impida a cualquier otra persona el uso o disfrute de los servicios digitales de RSC.
                        </li>
                        <li>
                            Realizar cualquier acción que viole o amenace la seguridad del sistema o red de RSC. El Usuario/Consumidor se obliga a mantener indemne a RSC., ante cualquier
                            hecho que cause daño a terceros o al mismo resultante del uso no autorizado de la plataforma de RSC, o de cualquier incumplimiento de los presentes términos y
                            condiciones.
                        </li>
                    </ul> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">7. PROCESAMIENTO DE PAGO Y RECOBRO</h2>
                    <p>
                        RSC., suministrará el producto una vez se verifiquen los detalles de pago. Si por algún motivo la entidad financiera o
                        pasarela de pago de su preferencia informa, inclusive de forma posterior al suministro del producto por parte de RSC. sobre la revocatoria de la autorización de pago o no
                        procesamiento del pago respecto al producto solicitado, se finalizará la suscripción y suministro del producto digital o físico sin que se requiera notificar al suscriptor. En
                        todo caso, si el producto es finalizado, podrá comunicarse con nuestro canal de servicio al cliente, del mismo modo, autoriza a RSC. para contactarse con usted a fin de
                        convenir el procedimiento para el recobro y activación de la suscripción solicitada.
                    </p> <br />

                    <h2 className="text-base font-medium text-gray-900 mb-2">Contacto</h2>
                    <p>Si tiene alguna duda sobre este Aviso Legal, puede contactar con nosotros en el correo electrónico: <br /> <a href="mailto:info@windowschannel.com">info@windowschannel.com</a>.</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-start w-full space-x-4">
                        <Button color="success" onClick={handleAcceptTerms}>
                            Aceptar
                        </Button>
                        <Button color="gray" onClick={handleDeclineTerms}>
                            Declinar
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginRegisterCard;