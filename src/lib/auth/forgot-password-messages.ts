export const PASSWORD_RESET_RATE_LIMIT_MESSAGE =
  "Too many reset requests were made recently. Please wait a few minutes before requesting another password reset email.";

export const PASSWORD_RESET_GENERIC_MESSAGE =
  "Unable to send password reset email. Please try again.";

export const PASSWORD_RESET_NETWORK_MESSAGE =
  "Network error. Please try again.";

export function isPasswordResetRateLimited(error: {
  message?: string;
  status?: number;
}): boolean {
  if (error.status === 429) return true;
  const message = error.message ?? "";
  return /rate limit/i.test(message);
}

export function getPasswordResetUserMessage(error: {
  message?: string;
  status?: number;
}): string {
  if (isPasswordResetRateLimited(error)) {
    return PASSWORD_RESET_RATE_LIMIT_MESSAGE;
  }
  return PASSWORD_RESET_GENERIC_MESSAGE;
}
