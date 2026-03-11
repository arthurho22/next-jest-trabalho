// mock Next.js response helpers to avoid edge-runtime errors
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { NextResponse } from "next/server";
import { AppError, isAppError } from "./app-error";
import {
  toErrorResponse,
  buildErrorResponse,
  badRequest,
} from "./http-response";

describe("AppError utility", () => {

  it("applies constructor values and name", () => {
    const err = new AppError("TEST", "mensagem", 418, { foo: "bar" });
    expect(err.name).toBe("AppError");
    expect(err.code).toBe("TEST");
    expect(err.message).toBe("mensagem");
    expect(err.status).toBe(418);
    expect(err.details).toEqual({ foo: "bar" });
  });

  it("isAppError returns true only for instances", () => {
    expect(isAppError(new AppError("C", "msg"))).toBe(true);
    expect(isAppError(new Error("no"))).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});

describe("toErrorResponse", () => {

  it("retorna resposta correta para AppError", async () => {
    const error = new AppError(
      "NOT_FOUND",
      "Recurso não encontrado",
      404,
      { id: 1 }
    );

    const response = toErrorResponse(error);

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      message: "Recurso não encontrado",
      code: "NOT_FOUND",
      details: { id: 1 },
    });
  });

  it("retorna erro inesperado para erro comum", async () => {
    const error = new Error("erro qualquer");

    const response = toErrorResponse(error);

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      message: "Erro inesperado no servidor.",
      code: "UNEXPECTED_ERROR",
    });
  });

});

describe("buildErrorResponse", () => {

  it("retorna erro 400 com lista de erros", async () => {
    const errors = {
      name: "Nome é obrigatório",
      email: "Email inválido",
    };

    const response = buildErrorResponse(errors);

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ errors });
  });

});

describe("badRequest", () => {

  it("lança AppError com status 400", () => {
    expect(() => {
      badRequest("Dados inválidos", { field: "email" });
    }).toThrow(AppError);

    try {
      badRequest("Dados inválidos", { field: "email" });
    } catch (error) {
      if (error instanceof AppError) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.status).toBe(400);
        expect(error.message).toBe("Dados inválidos");
        expect(error.details).toEqual({ field: "email" });
      }
    }
  });

});