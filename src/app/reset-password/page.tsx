"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

function getResetErrorMessage(searchParams: URLSearchParams): string | null {
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  if (errorCode === "otp_expired" || error === "access_denied") {
    return "This reset link has expired. Please request a new one.";
  }
  if (error === "invalid_token") {
    return errorDescription || "This reset link is invalid. Please request a new one.";
  }
  if (error) {
    return errorDescription || "Unable to verify reset link. Please try again.";
  }
  return null;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    const urlError = getResetErrorMessage(searchParams);
    if (urlError) {
      setLinkError(urlError);
      setCheckingSession(false);
      return;
    }

    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error || !session) {
          setLinkError("This reset link is invalid or has expired. Please request a new one.");
        }
      })
      .catch(() => {
        setLinkError("Network error. Please try again.");
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, [searchParams]);

  const onSubmit = async (data: ResetForm) => {
    if (linkError) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("session")) {
          setLinkError("This reset link is invalid or has expired. Please request a new one.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      await supabase.auth.signOut();
      toast.success("Password updated successfully!");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Verifying reset link...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {linkError ? "Unable to reset password" : "Choose a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkError ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-destructive">{linkError}</p>
              <Button variant="brand" className="w-full" asChild>
                <Link href="/forgot-password">Request New Reset Link</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Back to Sign In</Link>
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                <Link href="/login" className="text-brand hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
