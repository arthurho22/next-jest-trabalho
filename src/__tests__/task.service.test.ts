import { buildTaskService, validateTaskTitle } from "@/services/tasks/task.service";
import { AppError } from "@/utils/app-error";

const mockRepository = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const service = buildTaskService({ repository: mockRepository });

describe("validateTaskTitle", () => {

  it("lança erro quando título é vazio", () => {
    expect(() => validateTaskTitle("")).toThrow(AppError);
  });

  it("lança erro quando título é muito curto", () => {
    expect(() => validateTaskTitle("ab")).toThrow(AppError);
  });

  it("lança erro quando título é muito longo", () => {
    expect(() => validateTaskTitle("a".repeat(121))).toThrow(AppError);
  });

  it("retorna título válido com trim", () => {
    const result = validateTaskTitle(" Fazer exercícios ");
    expect(result).toBe("Fazer exercícios");
  });

});

describe("taskService", () => {

  it("chama listByUser ao listar tarefas", async () => {
    await service.listTasks("user1");

    expect(mockRepository.listByUser).toHaveBeenCalledWith("user1");
  });

  it("chama createForUser ao criar tarefa", async () => {
await service.createTask({
  userId: "user1",
  title: "Estudar",
});

    expect(mockRepository.createForUser).toHaveBeenCalledWith(
      "user1",
      "Estudar"
    );
  });

  it("chama deleteForUser ao deletar tarefa", async () => {
    await service.deleteTask({
      userId: "user1",
      taskId: "task1",
    });

    expect(mockRepository.deleteForUser).toHaveBeenCalledWith("user1", "task1");
  });

});