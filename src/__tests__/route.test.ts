import { POST } from "@/app/api/login/route";

// Mock mínimo do NextResponse para não quebrar no Jest
jest.mock("next/server", () => {
  const original = jest.requireActual("next/server");
  return {
    ...original,
    NextResponse: {
      json: (body: any, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

// Função auxiliar para criar Request real
function createRequest(body: object): Request {
  return new Request("http://localhost/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/login", () => {
  beforeEach(() => {
    process.env.AUTH_DEMO_EMAIL = "aluno@authtask.dev";
    process.env.AUTH_DEMO_PASSWORD = "123456";
    process.env.AUTH_SESSION_SECRET = "test-secret";
  });

  it("retorna 200 quando credenciais são válidas", async () => {
    const response = await POST(
      createRequest({
        email: "aluno@authtask.dev",
        password: "123456",
      })
    );

    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.user).toBeDefined();
    expect(json.user.email).toBe("aluno@authtask.dev");
    expect(json.user.name).toBe("Aluno Demo");
  });

  it("retorna 400 quando dados são incompletos", async () => {
    const response = await POST(
      createRequest({
        email: "",
      })
    );

    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.errors).toBeDefined();
    expect(json.errors.email).toBe("E-mail é obrigatório.");
  });

  it("retorna 401 quando credenciais são inválidas", async () => {
  const response = await POST(
    createRequest({
      email: "wrong@test.com",
      password: "123456",
    })
  );

  expect(response.status).toBe(401);

  const json = await response.json();
  expect(json.error || json.message).toBeDefined();
  expect(json.error || json.message).toContain("Credenciais inválidas");
  });
});