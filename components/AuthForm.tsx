"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ZodObject, ZodRawShape } from "zod"
import Link from "next/link"

import { FIELD_NAMES, FIELD_TYPES } from "@/constants"
import ImageUpload from "./ImageUpload"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP"
  schema: ZodObject<ZodRawShape>
  defaultValues: T
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter()
  const isSignIn = type === "SIGN_IN"

 const form = useForm<T>({
  resolver: zodResolver(schema) as any,
  defaultValues: defaultValues as DefaultValues<T>,
})


  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data)

    if (result.success) {
      toast.success(isSignIn ? "Signed in successfully!" : "Account created!", {
        description: isSignIn
          ? "Welcome back to BookWise."
          : "Your account has been created successfully.",
      })

      router.push("/")
    } else {
      toast.error(result.error, {
        description: isSignIn
          ? "Invalid login credentials."
          : "Please verify your details and try again.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 ">
      {/* Heading */}
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome Back to BookWise" : "Create Your BookWise Account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access thousands of books and resources instantly."
          : "Enter your university ID details to create an account."}
      </p>

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          {Object.keys(defaultValues).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>

                  <FormControl>
                    {field.name === "universityCard" ? (
                      <ImageUpload value={field.value} onChange={field.onChange} />
                    ) : (
                      <Input
                        placeholder={field.name.replace(/([A-Z])/g, " $1")}
                        type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          ))}

          {/* SUBMIT BUTTON */}
          <Button type="submit" className="form-btn w-full">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* SWITCH AUTH LINK */}
      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-primary font-bold hover:underline"
        >
          {isSignIn ? "Create an account" : "Sign In"}
        </Link>
      </p>
    </div>
  )
}

export default AuthForm
