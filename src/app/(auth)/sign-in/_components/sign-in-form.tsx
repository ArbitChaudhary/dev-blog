"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "aws-amplify/auth";

import { ControlledInput } from "@/components/reusable/controlled-input";
import { ButtonLoading } from "@/components/reusable/buttons/button-loading";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Please enter your password." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setError(null);
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data.email,
        password: data.password,
      });

      if (isSignedIn) {
        router.push("/");
        router.refresh();
        return;
      }

      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`/confirm-sign-up?email=${encodeURIComponent(data.email)}`);
        return;
      }

      setError("Additional sign-in steps are required.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during sign in.");
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
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <ButtonLoading
        type="submit"
        label="Sign In"
        isLoading={isSubmitting}
        className="mt-2 w-full"
      />
    </form>
  );
}
