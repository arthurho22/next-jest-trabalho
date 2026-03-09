import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
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

});