import SignupClient from "@/components/forms/signup-client";
import { Suspense } from "react";

const SignupPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupClient />
    </Suspense>
  );
};

export default SignupPage;