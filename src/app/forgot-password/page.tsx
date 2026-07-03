"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordForm
      context="customer"
      title="Forgot Password"
      description="Enter your email and we'll send you a reset link"
      successDescription="Check your email for a reset link"
      backHref="/login"
      backLabel="Back to Sign In"
      signInHref="/login"
      signInLabel="Remember your password? Sign In"
      wrapperClassName="container mx-auto px-4 py-16 flex justify-center"
    />
  );
}
