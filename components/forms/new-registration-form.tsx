"use client"

import { useState } from "react"
import { Building2, Mail, User, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation, useQuery } from "react-query"
import { toast } from "react-hot-toast"
import propiedadesApi from "@/api/propiedades.api"

interface RegistrationFormProps {
  onBack: () => void
  onRegistrationSuccess: () => void
}

interface SignupFormData {
  email: string
  nombre: string
  apellido: string
  password: string
  confirmPassword: string
  edificio: number
  piso: number
  numero: string
}

const schema = yup.object().shape({
  email: yup.string().email("Email no válido").required("Email es obligatorio"),
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
  edificio: yup.number().required("Se debe seleccionar un edificio"),
  piso: yup.number().required("El piso es obligatorio"),
  numero: yup.string().required("El número de departamento es obligatorio")
})

const fetchEdificios = async () => {
  const { data } = await propiedadesApi.getEdificios()
  return data
}

export function RegistrationForm({ onBack, onRegistrationSuccess }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  })

  const { data: buildings, isLoading: buildingsLoading } = useQuery("edificios", fetchEdificios)

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
          const errorData = await response.json()
          if (response.status === 400 && errorData.email) {
            toast.error(errorData.email[0])
            throw new Error(errorData.email[0])
          }
          throw new Error("Ha ocurrido un error en el registro.")
        }
        return response.json()
      }),
    {
      onSuccess: (data) => {
        toast.success(`${data.message}`, { duration: 5000 })
        onRegistrationSuccess()
      },
      onError: (error: Error) => {
        console.error("Error:", error)
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data)
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
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-card-foreground">
            Crear cuenta
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete sus datos para registrarse
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="pl-10 bg-input border-border"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm text-muted-foreground">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan"
                  className="pl-10 bg-input border-border"
                  {...register("nombre")}
                />
              </div>
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-sm text-muted-foreground">Apellido</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Pérez"
                  className="pl-10 bg-input border-border"
                  {...register("apellido")}
                />
              </div>
              {errors.apellido && (
                <p className="text-sm text-destructive">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-muted-foreground">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10 bg-input border-border"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirmar Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10 bg-input border-border"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edificio" className="text-sm text-muted-foreground">Edificio</Label>
            <Controller
              name="edificio"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  disabled={buildingsLoading}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Seleccione un edificio" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings?.map((building: any) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.edificio && (
              <p className="text-sm text-destructive">{errors.edificio.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="piso" className="text-sm text-muted-foreground">Piso</Label>
              <Input
                id="piso"
                type="number"
                placeholder="5"
                className="bg-input border-border"
                {...register("piso", { valueAsNumber: true })}
              />
              {errors.piso && (
                <p className="text-sm text-destructive">{errors.piso.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero" className="text-sm text-muted-foreground">Departamento</Label>
              <Input
                id="numero"
                type="text"
                placeholder="A"
                className="bg-input border-border"
                {...register("numero")}
              />
              {errors.numero && (
                <p className="text-sm text-destructive">{errors.numero.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={signupMutation.isLoading}
            >
              {signupMutation.isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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
              type="button"
              variant="secondary"
              className="w-full"
              onClick={onBack}
            >
              <span className="flex items-center justify-between w-full">
                <ArrowLeft className="h-4 w-4" />
                Volver atrás
              </span>
            </Button>
          </div>
        </form>

        {/* Trust Signal */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Conexión segura</span>
        </div>
      </div>
    </div>
  )
}