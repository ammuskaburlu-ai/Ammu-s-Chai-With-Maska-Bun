/**
 * Server-side auth error logging — never expose details to clients.
 */
export function logPasswordResetError(
  requestType: "customer" | "admin" | "unknown",
  error: unknown
): void {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    console.error("[password-reset]", {
      timestamp,
      requestType,
      status: "status" in error ? (error as { status?: number }).status : undefined,
      message: error.message,
      stack: error.stack,
    });
    return;
  }

  if (error && typeof error === "object") {
    const record = error as { message?: string; status?: number; stack?: string };
    console.error("[password-reset]", {
      timestamp,
      requestType,
      status: record.status,
      message: record.message,
      stack: record.stack,
    });
    return;
  }

  console.error("[password-reset]", {
    timestamp,
    requestType,
    message: "Unknown error",
    error,
  });
}

export function logPasswordResetRateLimit(
  requestType: "customer" | "admin" | "unknown",
  ip: string
): void {
  console.error("[password-reset]", {
    timestamp: new Date().toISOString(),
    requestType,
    status: 429,
    message: "Application rate limit exceeded",
    ip,
  });
}
