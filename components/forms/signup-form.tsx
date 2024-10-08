import React, { useState } from "react";
import { lusitana } from "../ui/fonts";
import Cookies from "js-cookie";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  KeyIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { Button } from "../ui/servicios/button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import edificiosApi from "@/api/edificios.api";
import propiedadesApi from "@/api/propiedades.api";
import { toast } from "react-hot-toast";
import { Select } from "../ui/select";

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
  const [buildId, setBuildId] = useState<number>();
  const [piso, setPiso] = useState<number | null>(null);
  const [numero, setNumero] = useState<string | null>(null);
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
          if(response.status === 400 && errorData.email) {
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

  const { data: edificios, isLoading } = useQuery(
    ["edificios"],
    fetchEdificios,
    {
      onSuccess: (data) => {
        console.log("Edificios from useQuery: ", data);
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
    console.log("Data:", data);

    // Si las contraseñas coinciden, procede con el registro
    signupMutation.mutate(data);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Registrese aquí.
        </h1>
        {/* <div className="w-full space-y-4">
          <div className="w-full"> */}
        <div className="w-full">
          <div className="w-full">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                {...register("email", { required: "Email es requerido" })}
                placeholder="Ingrese su email"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Nombre - Apellido */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                Nombre
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  type="text"
                  {...register("nombre")}
                  placeholder="Ingrese su nombre"
                />
                <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="lastName"
              >
                Apellido
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="lastName"
                  type="text"
                  {...register("apellido")}
                  placeholder="Ingrese su apellido"
                />
                <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.apellido && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <label 
              className="mb-0 mt-4 block text-xs font-medium text-gray-900"
              htmlFor="build"
            >
              Edificio
            </label>
            <div className="relative">
              <select 
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 apparence-none"
                id="edificios"
                {...register("edificio", { required: "Seleccione un edificio" })}
                disabled={isLoading}
                onChange={(e) => setBuildId(parseInt(e.target.value))}
              >
                <option value="">Seleccione un edificio</option>
                {edificios && edificios.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="piso"
              >
                Piso
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="piso"
                  type="text"
                  {...register("piso", { required: "Ingrese su numero de piso" })}
                  placeholder="Ingrese su piso"
                />
                <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="numero"
              >
                Departamento
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="numero"
                  type="text"
                  {...register("numero", { required: "Ingrese su departamento" })}
                  placeholder="Ingrese su numero"
                />
                <FaceSmileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Contraseña"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <Controller
                defaultValue=""
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <div className="mt-4">
                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Repita su contraseña
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        id="repeat-password"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Contraseña"
                      />
                      <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          type="submit"
          disabled={signupMutation.isLoading}
        >
          {signupMutation.isLoading ? "Registrando..." : "Registrarse"}{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" onClick={onGoBack}>
          Volver atrás
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        {signupMutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            Ha ocurrido un error, por favor intente nuevamente.
            {/* {signupMutation.error.message} */}
          </p>
        )}
      </div>
    </form>
  );
};

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