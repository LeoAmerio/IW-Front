import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AtSymbolIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../ui/servicios/button";
import { lusitana } from "../ui/fonts";
import Cookies from "js-cookie";
import { Link, LinearProgress } from "@mui/material";
import { useMutation } from "react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/services/auth.service";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onGoBack: () => void;
}

interface LoginRequest {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Ingrese el mail"),
  password: yup.string().required().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoBack }) => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useMutation(
    ({ email, password }: LoginRequest) =>
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ email, password }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400 && errorData.email) {
            // type TypeErrorMessage = ReturnType<typeof errorMessage>
            const errorMessage = errorData.email[0];
            toast.error(errorMessage, { duration: 5000 });
          }
        }

        if (response.ok) {
          const data = await response.json();
          // Cookies.set("token", data.token, { expires: 1 });
          Cookies.set("token", data.token);
          setAuth(data.token, data.user_id, data.email);
          onLoginSuccess();
        }
        return response.json
      }),
      {
        onSuccess: (data) => {
        toast.success(`${data.arguments}`, { duration: 5000 })
        setIsLoading(false);
        onLoginSuccess();
      },
      onError: (error: Error) => {
        setIsLoading(false);
        // toast.error(`${error.message}`, { duration: 5000 })
      }
    }
  )

  const onSubmit = async (data: LoginRequest) => {
    if (!data.email) {
      setError("email", { message: "Ingrese el mail" });
    }
    if (!data.password) {
      setError("password", { message: "Ingrese la contraseña" });
    }
    console.log('data on submit: ', data)
    setIsLoading(true);
    loginMutation.mutate(data);
    // try {
    //   const response = await 

    //   if (response.ok) {
    //     const data = await response.json();
    //     Cookies.set("token", data.token, { expires: 1 }); // Set the token in a cookie for 1 day
    //     onLoginSuccess();
    //   } else {
    //     console.error("Login failed");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate={true}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Por favor inicie sesion para continuar.
        </h1>
        <div className="w-full">
          <div>
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
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                // name="email"
                placeholder="Ingrese su email"
                required
                {...register('email', { required: 'Email es requerido' })}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
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
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                // name="password"
                placeholder="Ingrese su contraseña"
                required
                minLength={6}
                {...register('password', { required: 'Contraseña es requerida', minLength: 6 })}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* <Link component={<Landing} to={} sx={{ color: "#ffff" }}>
          ¿Olvidó su contraseña?
          </Link> */}
        <Button className="mt-4 w-full" type="submit">
          Iniciar Sesion <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button
          className="mt-4 w-full"
          onClick={onGoBack}
        >
          Volver atrás
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
          <div className="mt-3 text-center">
            <Link href="/signup" className="text-blue-600 hover:underline">
              ¿No tiene cuenta? Cree una aquí
            </Link>
          </div>
        {isLoading && <LinearProgress />}
      </div>
    </form>
  );
};

export default LoginForm;
