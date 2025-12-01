'use client';   

import AuthForm from "@/components/AuthForm";
import { SignInSchema } from "@/lib/validations";


const SignInPage = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={() => {}}
    />
  );
};

export default SignInPage;
