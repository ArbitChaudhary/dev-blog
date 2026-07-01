"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

import { ControlledInput } from "@/components/reusable/controlled-input";
import { ButtonLoading } from "@/components/reusable/buttons/button-loading";

const confirmSignUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  code: z.string().min(1, { message: "Please enter the verification code." }),
});

type ConfirmSignUpFormValues = z.infer<typeof confirmSignUpSchema>;

export function ConfirmSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<ConfirmSignUpFormValues>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: {
      email: emailFromQuery,
      code: "",
    },
  });

  const onSubmit = async (data: ConfirmSignUpFormValues) => {
    setError(null);
    setMessage(null);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: data.email,
        confirmationCode: data.code,
      });

      if (isSignUpComplete) {
        router.push(`/sign-in?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while confirming your account.");
      }
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setMessage(null);

    const email = getValues("email");
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setIsResending(true);
    try {
      await resendSignUpCode({ username: email });
      setMessage("A new verification code has been sent to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while resending the code.");
      }
    } finally {
      setIsResending(false);
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
          name="code"
          control={control}
          label="Verification Code"
          placeholder="123456"
          type="text"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {message && (
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      )}

      <ButtonLoading
        type="submit"
        label="Confirm Account"
        isLoading={isSubmitting}
        className="mt-2 w-full"
      />

      <button
        type="button"
        onClick={handleResendCode}
        disabled={isResending}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isResending ? "Resending..." : "Resend verification code"}
      </button>
    </form>
  );
}
