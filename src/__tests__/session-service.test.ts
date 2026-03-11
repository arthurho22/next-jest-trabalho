import { createSessionToken, verifySessionToken, getSessionCookieOptions, getSessionUserFromCookies, requireSessionUserFromCookies } from "@/services/auth/session.service";
import { AppError } from "@/utils/app-error";

// mock cookies helper for next/headers
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: jest.fn().mockReturnValue(undefined),
  }),
}));

const { cookies } = require("next/headers");

describe("session.service helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AUTH_SESSION_SECRET = "test-secret";
  });

  it("creates and verifies a token", () => {
    const user = { id: "1", name: "A", email: "a@a" };
    const token = createSessionToken(user);
    expect(typeof token).toBe("string");

    const payload = verifySessionToken(token);
    expect(payload?.user).toEqual(user);
  });

  it("verifySessionToken returns null for invalid token", () => {
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("foo.bar.baz")).toBeNull();
  });

  it("getSessionCookieOptions returns structure", () => {
    const opts = getSessionCookieOptions({ maxAge: 123 });
    expect(opts.name).toBeDefined();
    expect(opts.cookieOptions.maxAge).toBe(123);
  });

  it("requireSessionUserFromCookies throws when no user", async () => {
    (cookies() as any).get.mockReturnValue(undefined);
    await expect(requireSessionUserFromCookies()).rejects.toBeInstanceOf(AppError);
  });

  it("getSessionUserFromCookies returns null when no cookie", async () => {
    (cookies() as any).get.mockReturnValue(undefined);
    const u = await getSessionUserFromCookies();
    expect(u).toBeNull();
  });
});

// session.edge tests
import { readUnverifiedSessionToken as edgeRead } from "@/services/auth/session.edge";

describe("session.edge utilities", () => {
  it("returns null for empty token or malformed", () => {
    expect(edgeRead(undefined)).toBeNull();
    expect(edgeRead("abc")).toBeNull();
  });

  it("rejects expired payload", () => {
    const payload = { user: { id: "1", name: "x", email: "x@x" }, exp: 0 };
    const enc = Buffer.from(JSON.stringify(payload)).toString("base64");
    expect(edgeRead(enc + ".sig")).toBeNull();
  });

  it("parses valid token", () => {
    const payload = { user: { id: "2", name: "y", email: "y@y" }, exp: Math.floor(Date.now()/1000) + 100 };
    const enc = Buffer.from(JSON.stringify(payload)).toString("base64");
    expect(edgeRead(enc + ".anything")).toEqual(payload);
  });
});
