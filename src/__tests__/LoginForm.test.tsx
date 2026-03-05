import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/auth/LoginForm";

describe("LoginForm", () => {

  test("deve renderizar o título Login", () => {
    render(<LoginForm />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("deve renderizar o campo de email", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
  });

  test("deve renderizar o campo de senha", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
  });

  test("deve renderizar o botão entrar", () => {
    render(<LoginForm />);
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

});