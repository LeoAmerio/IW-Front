import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, ArrowLeftIcon, XIcon } from "lucide-react";
import axios from "axios";
import AuthService from "@/services/auth.service";

const PasswordResetPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/request-password-reset/`,
        {
          email: email,
        }
      );
      setSuccessMessage(
        "Se ha enviado un correo con instrucciones para restablecer su contraseña"
      );
      setIsLoading(false);
      setStep(2);
    } catch (error) {
      setErrorMessage("Ha ocurrido un error. Por favor, inténtelo de nuevo.");
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/reset-password/`,
      //   {
      //     email: email,
      //     token: token,
      //     new_password: newPassword,
      //   }
      // );
      const response = await AuthService.resetPassword({
        email,
        token,
        new_password: newPassword,
      });
      setSuccessMessage("Su contraseña ha sido restablecida correctamente");
      setIsLoading(false);
      setStep(3);
    } catch (error) {
      setErrorMessage(
        "Ha ocurrido un error. Por favor, verifique su token e inténtelo de nuevo."
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 1) {
      setSuccessMessage("");
    }
  }, [setStep]);

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Recuperar Contraseña"}
            {step === 2 && "Ingresar Código de Verificación"}
            {step === 3 && "Contraseña Restablecida"}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo electrónico"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Solicitud"}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Código de Verificación
              </label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Ingrese el código recibido por correo"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nueva Contraseña
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme su nueva contraseña"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setSuccessMessage("")
                }}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Procesando..." : "Restablecer Contraseña"}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-center">
              Su contraseña ha sido restablecida correctamente.
            </p>
            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Iniciar Sesión
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetPopup;
