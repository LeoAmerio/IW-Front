"use client"

import { useState, useEffect } from "react"
import { SessionLoader } from "@/components/forms/session-loader"
import { LoginForm } from "@/components/forms/new-login-form"
import { RegistrationForm } from "@/components/forms/new-registration-form"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth/auth.store"
import { toast } from "react-hot-toast"

type AuthView = "loading" | "login" | "register" | "forgot-password"

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("loading")
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get authentication state from store
  const { isAuthenticated, token, isLoading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    isLoading: state.isLoading
  }))

  // Get return URL from query params
  const returnUrl = searchParams?.get('returnUrl') || searchParams?.get('nextUrl') || '/dashboard'

  useEffect(() => {
    const img = document.createElement("img")
    img.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    img.onload = () => setImageLoaded(true)
  }, [])

  // Check authentication and redirect if already logged in
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && token) {
        const decodedUrl = decodeURIComponent(returnUrl)
        console.log(`Usuario ya autenticado. Redirigiendo a: ${decodedUrl}`)
        router.push(decodedUrl)
      } else {
        setView("login")
      }
    }
  }, [isAuthenticated, router, returnUrl, token, isLoading])

  // Handle successful login
  const handleLoginSuccess = () => {
    const decodedUrl = decodeURIComponent(returnUrl)
    console.log(`Login exitoso. Redirigiendo a: ${decodedUrl}`)
    toast.success("¡Bienvenido de vuelta!")
    router.push(decodedUrl)
  }

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    toast.success("¡Cuenta creada exitosamente!")
    setView("login")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern building architecture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {view === "loading" && (
          <SessionLoader onComplete={() => setView("login")} />
        )}

        {view === "login" && (
          <LoginForm
            onRegister={() => setView("register")}
            onForgotPassword={() => setView("forgot-password")}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {view === "register" && (
          <RegistrationForm
            onBack={() => setView("login")}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}

        {view === "forgot-password" && (
          <ForgotPasswordForm onBack={() => setView("login")} />
        )}
      </div>
    </div>
  )
}
        
//         {view === "register" && (
//           <RegistrationForm onBack={() => setView("login")} />
//         )}
        
//         {view === "forgot-password" && (
//           <ForgotPasswordForm onBack={() => setView("login")} />
//         )}
//       </div>
//     </div>
//   )
// }

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 rounded-xl bg-primary p-6">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-2xl font-semibold text-primary-foreground">Housinger</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {submitted ? (
          <div className="text-center py-4">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Correo enviado</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Si existe una cuenta con ese email, recibira instrucciones para recuperar su contrasena.
            </p>
            <button
              onClick={onBack}
              className="text-sm text-primary hover:underline"
            >
              Volver al inicio de sesion
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Recuperar Contrasena</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ingrese su email y le enviaremos instrucciones.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recover-email" className="text-sm text-muted-foreground">
                  Email
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="recover-email"
                    type="email"
                    placeholder="Ingrese su email"
                    className="w-full rounded-lg border border-border bg-input px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar instrucciones"
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver atras
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Conexion segura</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
