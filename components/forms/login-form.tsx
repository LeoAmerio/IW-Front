import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AtSymbolIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Button } from "../ui/servicios/button";
import { lusitana } from "../ui/fonts";
import {
  Link,
  LinearProgress,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth/auth.store";
import PasswordResetPopup from "./PasswordResetPopup";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onGoBack: () => void;
}

interface LoginRequest {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Debe ser un correo valido.").required("Ingrese un mail valido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onGoBack }) => {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  // Usar el store de autenticación
  const { login, isLoading, error } = useAuthStore(state => ({
    login: state.login,
    isLoading: state.isLoading,
    error: state.error
  }));
  
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  
  // Manejar errores del store
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 5000 });
      
      // Configurar errores de formulario si aplica
      if (error.includes('email') || error.includes('correo')) {
        setError("email", { message: error });
      }
      
      if (error.includes('contraseña') || error.includes('password')) {
        setError("password", { message: error });
      }
    }
  }, [error, setError]);

  const handleOpenResetPopup = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsResetPopupOpen(true);
  };

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data.email, data.password);
      
      toast.success("Inicio de sesión exitoso", { duration: 5000 });
      setTimeout(() => {
        
        router.push("/dashboard");
        onLoginSuccess();
      }, 300);
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
    }
  };

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(onSubmit)}
      noValidate={true}
    >
      <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900 dark:text-gray-100`}>
          Por favor inicie sesion para continuar.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                id="email"
                type="email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                // name="email"
                placeholder="Ingrese su email"
                required
                {...register("email", { required: "Email es requerido" })}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-300"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                id="password"
                type="password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                // name="password"
                placeholder="Ingrese su contraseña"
                required
                minLength={6}
                {...register("password", {
                  required: "Contraseña es requerida",
                  minLength: 6,
                })}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-gray-900 dark:peer-focus:text-gray-100" />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>
        {/* <Link component={<Landing} to={} sx={{ color: "#ffff" }}>
          ¿Olvidó su contraseña?
          </Link> */}
        <Button className="mt-4 w-full" type="submit">
          Iniciar Sesion{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" onClick={onGoBack}>
          Volver atrás
          <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="mt-3 text-center">
          <Link href="/signup" className="text-blue-600 hover:underline">
            ¿No tiene cuenta? Cree una aquí
          </Link>
        </div>
        <div className="mt-3 text-center">
        <a
          href="#"
          className="text-blue-600 hover:underline"
          onClick={handleOpenResetPopup}
        >
          Recuperar Contraseña
        </a>
      </div>
        {isLoading && <LinearProgress color="primary" />}
      </div>

      <PasswordResetPopup 
        isOpen={isResetPopupOpen} 
        onClose={() => setIsResetPopupOpen(false)} 
      />
    </form>
  );
};

export default LoginForm;
