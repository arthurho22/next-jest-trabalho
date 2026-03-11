import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

// Mock do AuthContext
const mockLogout = jest.fn();

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      name: "Test User",
      email: "test@test.com",
    },
    logout: mockLogout,
    login: jest.fn(),
    isLoading: false,
    setUser: jest.fn(),
  }),
}));

describe("DashboardClient", () => {
  it("renderiza o nome do usuário no cabeçalho", () => {
    render(<DashboardClient />);

expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
  });

  it("exibe botão de logout", () => {
    render(<DashboardClient />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    expect(logoutButton).toBeInTheDocument();
  });

  it("chama logout quando botão é clicado", async () => {
    const user = userEvent.setup();

    render(<DashboardClient />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});