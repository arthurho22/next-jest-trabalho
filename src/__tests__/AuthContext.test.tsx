import { render, screen, waitFor, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// keep router mocks in outer scope so tests can inspect them
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

import { AuthProvider, useAuth } from "@/context/AuthContext";

function TestComponent() {
  const { user, login } = useAuth();

  return (
    <div>
      <span data-testid="user-email">{user?.email ?? "null"}</span>
      <button onClick={() => login("test@test.com", "123456")}>
        Login
      </button>
    </div>
  );
}

describe("AuthContext", () => {

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: "1",
          name: "Test",
          email: "test@test.com",
        },
      }),
    }) as jest.Mock;
  });

  it("fornece estado inicial do usuário", () => {
    render(
      <AuthProvider initialUser={null}>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user-email")).toHaveTextContent("null");
  });

  it("atualiza usuário após login", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider initialUser={null}>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("user-email"))
        .toHaveTextContent("test@test.com");
    });
  });

  it("returns error when login fails", async () => {
    // simulate bad response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "bad" }),
    });

    const { result, waitFor } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialUser={null}>{children}</AuthProvider>
      ),
    });

    const res = await act(() => result.current.login("a", "b"));
    expect(res.ok).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("logout clears user and calls router methods", async () => {
    // render hook to obtain context
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider
          initialUser={{ id: "1", name: "x", email: "x@x" }}
        >
          {children}
        </AuthProvider>
      ),
    });

    await act(() => result.current.logout());
    expect(result.current.user).toBeNull();
    expect(pushMock).toHaveBeenCalledWith("/login");
    expect(refreshMock).toHaveBeenCalled();
  });

});