import { render, screen } from "@testing-library/react";
import { ServerTaskSummary } from "@/components/dashboard/ServerTaskSummary";
import { taskService } from "@/services/tasks/task.service";

jest.mock("@/services/tasks/task.service", () => ({
  taskService: {
    getSummary: jest.fn(),
  },
}));

describe("ServerTaskSummary", () => {
  it("mostra total de tarefas", async () => {
    (taskService.getSummary as jest.Mock).mockResolvedValue({
      total: 2,
      completed: 1,
      pending: 1,
    });

    const component = await ServerTaskSummary({ userId: "user-1" });
    render(component);

    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it("mostra 0 quando não há tarefas", async () => {
    (taskService.getSummary as jest.Mock).mockResolvedValue({
      total: 0,
      completed: 0,
      pending: 0,
    });

    const component = await ServerTaskSummary({ userId: "user-1" });
    render(component);

expect(screen.getAllByText("0")).toHaveLength(3);
    });
});