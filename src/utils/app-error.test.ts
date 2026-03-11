import { AppError, isAppError } from "./app-error";

describe("AppError", () => {
  it("deve criar um erro com todas as propriedades", () => {
    const error = new AppError(
      "TEST_ERROR",
      "Mensagem de erro",
      400,
      { field: "name" }
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);

    expect(error.name).toBe("AppError");
    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("Mensagem de erro");
    expect(error.status).toBe(400);
    expect(error.details).toEqual({ field: "name" });
  });

  it("deve usar status 500 por padrão", () => {
    const error = new AppError("ERR", "Erro");

    expect(error.status).toBe(500);
  });
});

describe("isAppError", () => {
  it("retorna true para AppError", () => {
    const error = new AppError("ERR", "Erro");

    expect(isAppError(error)).toBe(true);
  });

  it("retorna false para erro comum", () => {
    const error = new Error("Erro normal");

    expect(isAppError(error)).toBe(false);
  });

  it("retorna false para valores desconhecidos", () => {
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});