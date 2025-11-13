'use client';   


import AuthForm from "@/components/AuthForm";
import { SignUpSchema } from "@/lib/validations";

const SignUpPage = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ fullName: "", email: "", universityId: 0, universityCard: "", password: "" }}
      onSubmit={() => {}}
    />
  );
};

export default SignUpPage;
