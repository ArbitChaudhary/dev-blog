import { Suspense } from "react";

import { ConfirmSignUpForm } from "./_components/confirm-sign-up-form";

export default function ConfirmSignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Confirm your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the verification code we sent to your email
          </p>
        </div>
        <Suspense fallback={null}>
          <ConfirmSignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
