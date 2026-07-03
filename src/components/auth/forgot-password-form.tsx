import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  submitPasswordResetRequest,
  type PasswordResetContext,
} from "@/lib/auth/request-password-reset";
import { toast } from "sonner";

const RESEND_COOLDOWN_SECONDS = 60;

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

interface ForgotPasswordFormProps {
  context: PasswordResetContext;
  title: string;
  description: string;
  successDescription: string;
  backHref: string;
  backLabel: string;
  signInHref: string;
  signInLabel: string;
  wrapperClassName?: string;
}

export function ForgotPasswordForm({
  context,
  title,
  description,
  successDescription,
  backHref,
  backLabel,
  signInHref,
  signInLabel,
  wrapperClassName,
}: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const submitLockRef = useRef(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: ForgotForm) => {
    if (submitLockRef.current || loading || countdown > 0) return;

    submitLockRef.current = true;
    setLoading(true);

    const result = await submitPasswordResetRequest(data.email, context);

    if (!result.ok) {
      toast.error(result.message ?? "Unable to send password reset email. Please try again.");
      setLoading(false);
      submitLockRef.current = false;
      return;
    }

    setSubmittedEmail(data.email);
    setSent(true);
    setCountdown(RESEND_COOLDOWN_SECONDS);
    setLoading(false);
    submitLockRef.current = false;
  };

  const buttonDisabled = loading || countdown > 0;

  const buttonLabel = loading
    ? "Sending..."
    : countdown > 0
      ? `Resend available in ${countdown}`
      : "Send Reset Email";

  const card = (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          {sent ? successDescription : description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm text-green-800">
            If an account exists for <strong>{submittedEmail}</strong>, you will receive a
            password reset email shortly.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={loading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" variant="brand" className="w-full" disabled={buttonDisabled}>
            {buttonLabel}
          </Button>
        </form>
        {sent && (
          <Button variant="outline" className="w-full mt-3" asChild>
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        )}
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link href={signInHref} className="text-brand hover:underline">
            {signInLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{card}</div>;
  }

  return card;
}
