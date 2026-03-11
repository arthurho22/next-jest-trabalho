import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "@/components/dashboard/TaskList";

const mockTasks = [
  { id: "1", title: "Estudar Jest", completed: false },
  { id: "2", title: "Fazer exercícios", completed: true },
] as any;

render(
  <TaskList
    tasks={mockTasks}
    onToggle={jest.fn().mockResolvedValue(undefined)}
    onDelete={jest.fn().mockResolvedValue(undefined)}
  />
);

describe("TaskList", () => {

  it("exibe mensagem quando lista está vazia", () => {
    render(
      <TaskList
        tasks={[]}
        onToggle={jest.fn().mockResolvedValue(undefined)}
        onDelete={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(
      screen.getByText(/nenhuma tarefa/i)
    ).toBeInTheDocument();
  });

  it("renderiza tarefas na lista", () => {
    render(
      <TaskList
        tasks={mockTasks}
        onToggle={jest.fn().mockResolvedValue(undefined)}
        onDelete={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText("Estudar Jest")).toBeInTheDocument();
    expect(screen.getByText("Fazer exercícios")).toBeInTheDocument();
  });

  it("permite marcar tarefa como concluída", async () => {
    const user = userEvent.setup();

    const mockToggle = jest.fn().mockResolvedValue(undefined);

    render(
      <TaskList
        tasks={mockTasks}
        onToggle={mockToggle}
        onDelete={jest.fn().mockResolvedValue(undefined)}
      />
    );

    const checkbox = screen.getAllByRole("checkbox")[0];

    await user.click(checkbox);

    expect(mockToggle).toHaveBeenCalled();
  });

  it("permite deletar tarefa", async () => {
    const user = userEvent.setup();

    const mockDelete = jest.fn().mockResolvedValue(undefined);

    render(
      <TaskList
        tasks={mockTasks}
        onToggle={jest.fn().mockResolvedValue(undefined)}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getAllByRole("button", { name: /deletar/i })[0];

    await user.click(deleteButton);

    expect(mockDelete).toHaveBeenCalled();
  });

});