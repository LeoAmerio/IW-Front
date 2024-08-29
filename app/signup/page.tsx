"use client";

import { useRouter } from "next/navigation";
import AcmeLogo from "@/components/ui/acme-logo";
import SignupForm from "@/components/forms/signup-form";
import { useAuthStore } from "@/store/auth/auth.store";
import { Snackbar } from "@mui/material";

const SignupPage = () => {
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  if (authStatus === "Pending") {
    checkAuthStatus();
    return <div>Loading...</div>;
  }

  if (authStatus === "Authorized") router.push("/dashboard");

  const handleSignupSuccess = () => {
    router.push('/dashboard');
  };
  
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </div>
    </main>
  );
};

export default SignupPage;