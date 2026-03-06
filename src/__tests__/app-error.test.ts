import { AppError, isAppError } from "@/utils/app-error";

describe("AppError", () => {

  it("cria erro com código, mensagem e status", () => {
    const error = new AppError("INVALID", "Erro de teste", 400);

    expect(error.code).toBe("INVALID");
    expect(error.message).toBe("Erro de teste");
    expect(error.status).toBe(400);
  });

});

describe("isAppError", () => {

  it("retorna true para AppError", () => {
    const error = new AppError("INVALID", "Erro", 400);

    expect(isAppError(error)).toBe(true);
  });

  it("retorna false para Error comum", () => {
    const error = new Error("Erro comum");

    expect(isAppError(error)).toBe(false);
  });

  it("retorna false para null", () => {
    expect(isAppError(null)).toBe(false);
  });

});