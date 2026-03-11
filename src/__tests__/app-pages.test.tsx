/**
 * Tests for simple Next.js app pages and provider wrapper
 */
import { render, screen } from "@testing-library/react";

// Home page is a simple component
import Home from "@/app/page";

// Login page is async and uses navigation + session helper
// next/navigation is used by the pages; redirect should throw to abort the server function
jest.mock("next/navigation", () => {
  const push = jest.fn();
  const refresh = jest.fn();
  const redirect = jest.fn((url: string) => { throw new Error(`redirect:${url}`); });
  return {
    useRouter: () => ({ push, refresh }),
    redirect,
  };
});

// after mock is hoisted, import the mocked helpers
const { redirect: mockRedirect, useRouter } = require("next/navigation");
const { push: pushMock, refresh: refreshMock } = useRouter();


jest.mock("@/services/auth/session.service", () => ({
  getSessionUserFromCookies: jest.fn(),
}));
const { getSessionUserFromCookies } = require("@/services/auth/session.service");

// we stub the login form to avoid heavy rendering; its own tests already cover it
jest.mock("@/components/auth/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">mock-form</div>,
}));



describe("Home page", () => {
  it("renders title and links", () => {
    // call component function directly to ensure body executes
    const jsx = Home();
    render(jsx as React.ReactElement);
    expect(screen.getByText(/TRABALHO 01/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Entrar no sistema/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ir para dashboard/ })).toBeInTheDocument();
  });
});

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to dashboard if user exists", async () => {
    (getSessionUserFromCookies as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test",
      email: "t@t.com",
    });

    // call the server component function and catch redirect
    await expect(async () => {
      const mod = await import("@/app/login/page");
      await mod.default();
    }).rejects.toThrow(/redirect:.*dashboard/);

    expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
  });

  it("renders login form when there is no session user", async () => {
    (getSessionUserFromCookies as jest.Mock).mockResolvedValue(null);

    const { default: LoginPage } = await import("@/app/login/page");
    const element = await LoginPage();
    render(element as React.ReactElement);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});

// additional pages: dashboard and root layout
describe("Dashboard page & layout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("redirects to login when no user", async () => {
    (getSessionUserFromCookies as jest.Mock).mockResolvedValue(null);

    const { default: DashboardPage } = await import("@/app/dashboard/page");
    await expect(DashboardPage()).rejects.toThrow(/redirect:.*login/);
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("renders dashboard markup when user exists", async () => {
    (getSessionUserFromCookies as jest.Mock).mockResolvedValue({
      id: "u1",
      name: "User",
      email: "u@u.com",
    });

    const { default: DashboardPage } = await import("@/app/dashboard/page");
    const element = await DashboardPage();
    // inspect serialized element for expected text
    expect(JSON.stringify(element)).toContain("Dashboard protegido");
  });

  it("RootLayout returns element containing children", async () => {
    (getSessionUserFromCookies as jest.Mock).mockResolvedValue({
      id: "u2",
      name: "Another",
      email: "a@a.com",
    });

    const { default: RootLayout } = await import("@/app/layout");
    const element = await RootLayout({ children: <div>child</div> });
    expect(JSON.stringify(element)).toContain("child");
  });
});


