"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AcmeLogo from "@/components/ui/acme-logo";
import SignupForm from "@/components/forms/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Building2, Hash, Loader2, Mail, MapPin, User, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import propiedadesApi from "@/api/propiedades.api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";

const fetchEdificios = async () => {
  const { data } = await propiedadesApi.getEdificios();
  return data;
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
  piso: yup
    .number()
    .typeError("El piso debe ser un número entero")
    .integer("El piso debe ser un número entero")
    .moreThan(0, "El piso debe ser mayor a 0")
    .required("El piso es obligatorio"),
  numero: yup
    .string()
    .matches(/^[A-Za-z]$/, "El departamento debe ser una sola letra")
    .required("El departamento es obligatorio"),
});

const SignupClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(false);

  const returnUrl = searchParams?.get('returnUrl') || searchParams?.get('nextUrl') || '/dashboard';

  const handleLoginSuccess = () => {
    const decodedUrl = decodeURIComponent(returnUrl);
    (`Login exitoso. Redirigiendo a: ${decodedUrl}`);
    // router.push(decodedUrl);
    router.push("/dashboard");
    // window.location.href = decodedUrl;
  };

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
  };

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
        handleLoginSuccess();
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

  const handleSignupSuccess = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.push('/');
  }

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
    <main className="flex items-center justify-center md:h-screen dark:bg-gray-900">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 dark:bg-gray-900">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>

        {/* <SignupForm onSignupSuccess={handleSignupSuccess} onGoBack={handleGoBack} /> */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
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
                      className="bg-blue-600 text-white w-full hover:bg-blue-700 transition-colors"
                      onClick={() => router.push("/")}
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
    </main>
  );
};

export default SignupClient;