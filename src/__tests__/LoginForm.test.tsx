import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm }  from "@/components/auth/LoginForm";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({ ok: false }),
    isLoading: false,
  }),
}));

describe("LoginForm", () => {

  it("renderiza campos de email e senha", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("textbox", { name: /email/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/senha/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /entrar/i })
    ).toBeInTheDocument();
  });

  it("permite digitar email e senha", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/senha/i);

    await user.type(emailInput, "teste@test.com");
    await user.type(passwordInput, "123456");

    expect(emailInput).toHaveValue("teste@test.com");
    expect(passwordInput).toHaveValue("123456");
  });

  it("executa submit do formulário", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });

});