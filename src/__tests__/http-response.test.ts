jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { AppError } from "@/utils/app-error";
import { toErrorResponse, badRequest } from "@/utils/http-response";

describe("toErrorResponse", () => {

  it("retorna resposta correta para AppError", async () => {
    const error = new AppError("INVALID", "Erro de autenticação", 401);

    const response = toErrorResponse(error);

    expect(response.status).toBe(401);

    const json = await response.json();

    expect(json.code).toBe("INVALID");
    expect(json.message).toBe("Erro de autenticação");
  });

  it("retorna erro 500 para erro genérico", async () => {
    const error = new Error("Erro inesperado");

    const response = toErrorResponse(error);

    expect(response.status).toBe(500);

    const json = await response.json();

    expect(json.code).toBe("UNEXPECTED_ERROR");
  });

});

describe("badRequest", () => {

  it("lança AppError com status 400", () => {
    expect(() =>
      badRequest("Erro de validação", {
        email: "E-mail obrigatório"
      })
    ).toThrow(AppError);
  });

});