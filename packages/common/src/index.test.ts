import { describe, expect, it } from "bun:test";
import { assert, err, ok, parseEmail } from "./index";

describe("ok", () => {
  it("wraps a value", () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(42);
  });
});

describe("err", () => {
  it("wraps an error", () => {
    const result = err(new Error("fail"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe("fail");
  });
});

describe("parseEmail", () => {
  it("accepts a valid email", () => {
    const result = parseEmail("user@example.com");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value as string).toBe("user@example.com");
  });

  it("lowercases the email", () => {
    const result = parseEmail("User@Example.COM");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value as string).toBe("user@example.com");
  });

  it("rejects a missing @", () => {
    const result = parseEmail("notanemail");
    expect(result.ok).toBe(false);
  });

  it("rejects an empty string", () => {
    const result = parseEmail("");
    expect(result.ok).toBe(false);
  });
});

describe("assert", () => {
  it("does not throw when condition is true", () => {
    expect(() => assert(true, "should pass")).not.toThrow();
  });

  it("throws when condition is false", () => {
    expect(() => assert(false, "boom")).toThrow("Assertion failed: boom");
  });
});
