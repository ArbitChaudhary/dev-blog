"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, CheckCircle2 } from "lucide-react";

import { ControlledInput } from "@/components/reusable/controlled-input";
import { ButtonLoading } from "@/components/reusable/buttons/button-loading";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterCta() {
  const [subscribed, setSubscribed] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    // TODO: wire to NewsletterSubscription model (guest create) in Phase 2.
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Newsletter signup:", data.email);
    setSubscribed(true);
    reset();
  };

  return (
    <section className="rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="text-2xl font-bold sm:text-3xl">
          Never miss a new post
        </h2>
        <p className="mt-3 text-primary-foreground/80">
          Join our newsletter for weekly deep dives on web development,
          delivered straight to your inbox. No spam, unsubscribe anytime.
        </p>

        {subscribed ? (
          <p className="mt-8 flex items-center justify-center gap-2 text-base font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Thanks for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <ControlledInput<NewsletterFormValues>
              name="email"
              control={control}
              errors={errors}
              type="email"
              placeholder="you@example.com"
              className="flex-1 text-left [&_input]:bg-primary-foreground [&_input]:text-foreground"
            />
            <ButtonLoading
              type="submit"
              label="Subscribe"
              isLoading={isSubmitting}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            />
          </form>
        )}
      </div>
    </section>
  );
}
