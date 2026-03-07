/**
 * Result type for explicit error handling without exceptions.
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Branded type for validated email addresses.
 */
export type Email = string & { readonly __brand: "Email" };

export function parseEmail(raw: string): Result<Email> {
  const trimmed = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return err(new Error(`Invalid email: ${raw}`));
  }
  return ok(trimmed as Email);
}

/**
 * Assert a condition is true, narrowing the type.
 * Throws at runtime if the condition is false.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

export * from "./schemas";
