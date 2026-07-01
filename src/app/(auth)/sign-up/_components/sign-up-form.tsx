"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signUp } from "aws-amplify/auth";

import { ControlledInput } from "@/components/reusable/controlled-input";
import { ButtonLoading } from "@/components/reusable/buttons/button-loading";

const signUpSchema = z
  .object({
    fullname: z.string().min(1, { message: "Please enter your full name." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setError(null);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.fullname,
          },
        },
      });

      if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        // Typically, redirect to a confirmation page with the email
        router.push(`/confirm-sign-up?email=${encodeURIComponent(data.email)}`);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during sign up.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <div className="flex flex-col gap-4">
        <ControlledInput
          name="fullname"
          control={control}
          label="Full Name"
          placeholder="Jane Doe"
          type="text"
        />
        <ControlledInput
          name="email"
          control={control}
          label="Email"
          placeholder="you@example.com"
          type="email"
        />
        <ControlledInput
          name="password"
          control={control}
          label="Password"
          placeholder="••••••••"
          type="password"
        />
        <ControlledInput
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          placeholder="••••••••"
          type="password"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <ButtonLoading
        type="submit"
        label="Sign Up"
        isLoading={isSubmitting}
        className="mt-2 w-full"
      />
    </form>
  );
}
