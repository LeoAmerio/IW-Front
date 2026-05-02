"use client"

import { useState } from "react"
import { Building2, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuthStore } from "@/store/auth/auth.store"

interface LoginFormProps {
  onRegister: () => void
  onForgotPassword: () => void
  onLoginSuccess: () => void
}

interface LoginRequest {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().email("Debe ser un correo válido.").required("Ingrese un mail válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria"),
})

export function LoginForm({ onRegister, onForgotPassword, onLoginSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data.email, data.password)
      onLoginSuccess()
    } catch (error) {
      console.error("Login error:", error)
      // Show generic error message to avoid leaking password policy
      setError("password", { message: "Credenciales inválidas" })
    }
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Logo Header */}
      <div className="mb-6 rounded-xl bg-primary p-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary-foreground" />
          <span className="text-2xl font-semibold text-primary-foreground">Housinger</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            Por favor inicie sesión para continuar.
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su email"
                className="pl-10 bg-input border-border focus:border-primary focus:ring-primary"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                className="pl-10 pr-10 bg-input border-border focus:border-primary focus:ring-primary"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              Recordarme
            </Label>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-between w-full">
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <span className="flex items-center justify-between w-full">
                <ArrowLeft className="h-4 w-4" />
                Volver atrás
              </span>
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onRegister}
            className="text-sm text-primary hover:underline transition-colors"
          >
            No tiene cuenta? Cree una aquí
          </button>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline transition-colors"
          >
            Recuperar Contraseña
          </button>
        </div>

        {/* Trust Signal */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Conexión segura</span>
        </div>
      </div>
    </div>
  )
}
