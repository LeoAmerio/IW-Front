import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Housinger - Gestion de Edificios",
  description: "Plataforma de gestion para edificios y condominios",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
