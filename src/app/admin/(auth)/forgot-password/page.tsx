"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function AdminForgotPasswordPage() {
  return (
    <ForgotPasswordForm
      context="admin"
      title="Admin Password Reset"
      description="Enter your admin account email"
      successDescription="Check your email for a reset link"
      backHref="/admin/login"
      backLabel="Back to Admin Sign In"
      signInHref="/admin/login"
      signInLabel="Back to Admin Sign In"
    />
  );
}
