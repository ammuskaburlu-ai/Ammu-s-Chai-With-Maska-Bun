"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { APP_URL } from "@/lib/constants";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function AdminForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${APP_URL}/auth/callback?next=/admin/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmittedEmail(data.email);
      setSent(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Admin Password Reset</CardTitle>
        <CardDescription>
          {sent
            ? "Check your email for a reset link"
            : "Enter your admin account email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              If an admin account exists for <strong>{submittedEmail}</strong>, you will receive a
              password reset email shortly.
            </p>
            <Button variant="brand" className="w-full" asChild>
              <Link href="/admin/login">Back to Admin Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link href="/admin/login" className="text-brand hover:underline">
                Back to Admin Sign In
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
