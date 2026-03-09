import { AppError } from "@/utils/app-error";

describe("Advanced mocks", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("simula erro 500 da API", async () => {

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Erro interno" }),
    }) as jest.Mock;

    const response = await fetch("/api/login");

    expect(fetch).toHaveBeenCalled();
    expect(response.status).toBe(500);

  });

  it("mocka authenticateUser com sucesso e erro", async () => {

    const authenticateUser = jest
      .fn()
      .mockResolvedValueOnce({
        id: "1",
        name: "User",
        email: "u@u.com",
      })
      .mockRejectedValueOnce(new AppError("INVALID", "Inválido", 401));

    const success = await authenticateUser({
      email: "u@u.com",
      password: "123456",
    });

    expect(success.email).toBe("u@u.com");

    await expect(
      authenticateUser({
        email: "u@u.com",
        password: "errada",
      })
    ).rejects.toThrow(AppError);

    expect(authenticateUser).toHaveBeenCalledTimes(2);
  });

  it("simula timeout na requisição", async () => {

    global.fetch = jest.fn(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 50)
        )
    ) as jest.Mock;

    await expect(fetch("/api/tasks")).rejects.toThrow("Timeout");

  });

});