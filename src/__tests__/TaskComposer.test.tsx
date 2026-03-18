import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskComposer } from "@/components/dashboard/TaskComposer";

describe("TaskComposer", () => {

  it("renderiza input e botão adicionar", () => {
    render(<TaskComposer onCreate={jest.fn()} />);

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /adicionar/i })
    ).toBeInTheDocument();
  });

  it("permite digitar no input", async () => {
    const user = userEvent.setup();

    render(<TaskComposer onCreate={jest.fn()} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "Estudar Jest");

    expect(input).toHaveValue("Estudar Jest");
  });

  it("chama onCreate ao enviar tarefa", async () => {
    const user = userEvent.setup();

    const mockCreate = jest.fn();

    render(<TaskComposer onCreate={mockCreate} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /adicionar/i });

    await user.type(input, "Nova tarefa");
    await user.click(button);

    expect(mockCreate).toHaveBeenCalled();
  });

});