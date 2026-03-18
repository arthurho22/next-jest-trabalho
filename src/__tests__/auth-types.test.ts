// this test exists only to import the type definitions and ensure they compile
// at runtime there is nothing to execute, but importing the module marks it as
// covered insofar as possible. TypeScript will erase the types in emitted JS.

import type { AuthUser, LoginPayload } from "@/services/auth/auth.types";

describe("auth.types file", () => {
  it("allows defining variables with AuthUser", () => {
    const u: AuthUser = { id: "1", name: "A", email: "a@a" };
    expect(u.email).toBe("a@a");
  });

  it("allows defining LoginPayload objects", () => {
    const p: LoginPayload = { email: "x@x", password: "pwd" };
    expect(p.password).toBe("pwd");
  });
});