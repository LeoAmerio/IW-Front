import React from "react";
import {
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import propiedadesApi from "@/api/propiedades.api";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";
import { ArrowLeft, ArrowRight, Building2, Hash, Loader2, Mail, MapPin, User, Lock } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const fetchEdificios = async () => {
  const { data } = await propiedadesApi.getEdificios();
  return data;
}

interface SignupFormProps {
  onSignupSuccess: () => void;
  onGoBack: () => void;
}

interface SignupFormData {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  confirmPassword: string;
  edificio: number;
  piso: number;
  numero: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Email no valido").required("Email es obligatorio"),
  nombre: yup.string().required("El nombre es obligatorio"),
  apellido: yup.string().required("El apellido es obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres.")
    .required("La contraseña es obligatoria"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Las contraseñas deben coincidir")
    .required("Debes confirmar la nueva contraseña."),
  // .min(8, "La contraseña debe tener mínimo 8 caracteres."),
  edificio: yup.number().required("Se debe seleccionar un edificio"),
  piso: yup.number().required(),
  numero: yup.string().required()
});

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onGoBack }) => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  const signupMutation = useMutation(
    ({ email, nombre, apellido, password, edificio, piso, numero }: SignupFormData) =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/registro/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nombre, apellido, password, rol: 3, edificio, piso, numero }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400 && errorData.email) {
            // throw new Error(errorData.email[0]);
            toast.error(errorData.email[0]);
          }
          // throw new Error("Ha ocurrido un error en el registro.");
        }
        return response.json();
      }),
    {
      onSuccess: (data) => {
        // Cookies.set("token", data.token, { expires: 1 });
        toast.success(`${data.message}`, { duration: 5000 })
        onSignupSuccess();
      },
      onError: (error: Error) => {
        console.error("Error:", error);
        toast.error(error.message);
      },
    }
  );

  const { data: edificios, isLoading, error } = useQuery(
    ["edificios"],
    fetchEdificios,
    {
      onSuccess: (data) => {
      },
    }
  )

  const onSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    // Validación condicional para piso y numero
    if ((data.piso && !data.numero) || (!data.piso && data.numero)) {
      if (!data.piso) {
        setError("piso", {
          type: "manual",
          message: "Debe completar el piso si ha ingresado el número",
        });
      }
      if (!data.numero) {
        setError("numero", {
          type: "manual",
          message: "Debe completar el número si ha ingresado el piso",
        });
      }
      return;
    }

    // Si las contraseñas coinciden, procede con el registro
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Background Image - Hidden on mobile */}
      {/* <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/building-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-slate-900/40" />
        <div className="relative z-10 flex items-end p-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">Gestión Inteligente</h2>
            <p className="text-lg opacity-90">
              Administra tu edificio de manera eficiente y mantén una comunicación fluida con todos los residentes.
            </p>
          </div>
        </div>
      </div> */}

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-gray-900 dark:bg-gray-900">
            {/* Botón Volver atrás */}
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver atrás
              </Button>
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ¿Ya tienes cuenta?
              </Link>
            </div>
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Housinger</CardTitle>
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                Regístrese para gestionar su edificio
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )} */}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="pl-10"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                {/* Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium">
                      Nombre
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="nombre" placeholder="Juan" className="pl-10" {...register("nombre")} />
                    </div>
                    {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-sm font-medium">
                      Apellido
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="apellido" placeholder="Pérez" className="pl-10" {...register("apellido")} />
                    </div>
                    {errors.apellido && <p className="text-sm text-red-500">{errors.apellido.message}</p>}
                  </div>
                </div>

                {/* Building */}
                <div className="space-y-2">
                  <Label htmlFor="edificio" className="text-sm font-medium">
                    Edificio
                  </Label>
                  <Controller
                    name="edificio"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un edificio" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* //               <select 
//                 className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 apparence-none"
//                 id="edificios"
//                 {...register("edificio", { required: "Seleccione un edificio" })}
//                 disabled={isLoading}
//                 onChange={(e) => setBuildId(parseInt(e.target.value))}
//               >
//                 <option value="">Seleccione un edificio</option>
//                 {edificios && edificios.map((building) => (
//                   <option key={building.id} value={building.id}>
//                     {building.nombre}
//                   </option>
//                 ))}
//               </select> */}
                          {edificios && edificios.map((building) => (
                            <SelectItem key={building.id} value={building.id.toString()}>
                              {building.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.edificio && <p className="text-sm text-red-500">{errors.edificio.message}</p>}
                </div>

                {/* Floor and Apartment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="piso" className="text-sm font-medium">
                      Piso
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="piso"
                        placeholder="5"
                        className="pl-10"
                        {...register("piso")}
                        onKeyPress={(e) => {
                          // Solo permitir números
                          if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
                            e.preventDefault()
                          }
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                    {errors.piso && <p className="text-sm text-red-500">{errors.piso.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-sm font-medium">
                      Departamento
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="numero"
                        placeholder="A"
                        className="pl-10"
                        {...register("numero")}
                        maxLength={1}
                        onKeyPress={(e) => {
                          // Solo permitir letras
                          if (
                            !/[A-Za-z]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault()
                          }
                        }}
                        onInput={(e) => {
                          // Convertir a mayúscula automáticamente
                          const target = e.target as HTMLInputElement
                          target.value = target.value.toUpperCase()
                        }}
                      />
                    </div>
                    {errors.numero && <p className="text-sm text-red-500">{errors.numero.message}</p>}
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...register("password")}
                      />
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmar
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...register("confirmPassword")}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        Registrarse
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="default"
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Volver atrás
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

//   return (
//     <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate={true}>
//       <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-4 pt-8">
//         <h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900 dark:text-gray-100`}>
//           Registrese aquí.
//         </h1>
//         {/* <div className="w-full space-y-4">
//           <div className="w-full"> */}
//         <div className="w-full">
//           <div className="w-full">
//             <label
//               className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <div className="relative">
//               <input
//                 className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                 id="email"
//                 type="email"
//                 {...register("email", { required: "Email es requerido" })}
//                 placeholder="Ingrese su email"
//               />
//               <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>
//           {/* Nombre - Apellido */}
//           <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="w-full sm:w-1/2">
//               <label
//                 className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                 htmlFor="name"
//               >
//                 Nombre
//               </label>
//               <div className="relative">
//                 <input
//                   className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   id="name"
//                   type="text"
//                   {...register("nombre")}
//                   placeholder="Ingrese su nombre"
//                 />
//                 <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//               </div>
//               {errors.nombre && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.nombre.message}
//                 </p>
//               )}
//             </div>
//             <div className="w-full sm:w-1/2">
//               <label
//                 className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                 htmlFor="lastName"
//               >
//                 Apellido
//               </label>
//               <div className="relative">
//                 <input
//                   className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   id="lastName"
//                   type="text"
//                   {...register("apellido")}
//                   placeholder="Ingrese su apellido"
//                 />
//                 <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//               </div>
//               {errors.apellido && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.apellido.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="w-full">
//             <label 
//               className="mb-0 mt-4 block text-xs font-medium text-gray-900 dark:text-gray-300"
//               htmlFor="build"
//             >
//               Edificio
//             </label>
//             <div className="relative">
//               <select 
//                 className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 apparence-none"
//                 id="edificios"
//                 {...register("edificio", { required: "Seleccione un edificio" })}
//                 disabled={isLoading}
//                 onChange={(e) => setBuildId(parseInt(e.target.value))}
//               >
//                 <option value="">Seleccione un edificio</option>
//                 {edificios && edificios.map((building) => (
//                   <option key={building.id} value={building.id}>
//                     {building.nombre}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="w-full sm:w-1/2">
//               <label
//                 className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                 htmlFor="piso"
//               >
//                 Piso
//               </label>
//               <div className="relative">
//                 <input
//                   className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   id="piso"
//                   type="text"
//                   {...register("piso", { required: "Ingrese su numero de piso" })}
//                   placeholder="Ingrese su piso"
//                 />
//                 <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//               </div>
//             </div>
//             <div className="w-full sm:w-1/2">
//               <label
//                 className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                 htmlFor="numero"
//               >
//                 Departamento
//               </label>
//               <div className="relative">
//                 <input
//                   className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   id="numero"
//                   type="text"
//                   {...register("numero", { required: "Ingrese su departamento" })}
//                   placeholder="Ingrese su numero"
//                 />
//                 <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//             <div className="w-full sm:w-1/2">
//               <label
//                 className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                 htmlFor="password"
//               >
//                 Contraseña
//               </label>
//               <div className="relative">
//                 <input
//                   className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                   id="password"
//                   type="password"
//                   {...register("password")}
//                   placeholder="Contraseña"
//                 />
//                 <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//             <div className="w-full sm:w-1/2">
//               <Controller
//                 defaultValue=""
//                 name="confirmPassword"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="mt-4">
//                     <label
//                       className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
//                       htmlFor="password"
//                     >
//                       Repita su contraseña
//                     </label>
//                     <div className="relative">
//                       <input
//                         className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
//                         id="repeat-password"
//                         type="password"
//                         {...register("confirmPassword")}
//                         placeholder="Contraseña"
//                       />
//                       <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
//                     </div>
//                     {errors.confirmPassword && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.confirmPassword.message}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               />
//             </div>
//           </div>
//         </div>
//         <Button
//           className="mt-4 w-full"
//           type="submit"
//           disabled={signupMutation.isLoading}
//         >
//           {signupMutation.isLoading ? "Registrando..." : "Registrarse"}{" "}
//           <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
//         </Button>
//         <Button className="mt-4 w-full" onClick={onGoBack}>
//           Volver atrás
//           <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
//         </Button>
//         {signupMutation.isError && (
//           <p className="text-red-500 text-sm mt-2">
//             Ha ocurrido un error, por favor intente nuevamente.
//             {/* {signupMutation.error.message} */}
//           </p>
//         )}
//       </div>
//     </form>
//   );
// };

export default SignupForm;


{/* <div className="mt-4">
            <Controller
              name="edificio"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <select {...field}>
                  <option value="">Seleccione un edificio</option>
                  {edificios && edificios.map((edificio) => (
                    <option key={edificio.id} value={edificio.id}>
                      {edificio.nombre}
                    </option>
                  ))}
                </select>
              )}
            />
          </div> */}