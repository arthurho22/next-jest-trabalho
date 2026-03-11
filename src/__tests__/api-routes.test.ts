// API route handler tests

// mock NextResponse to capture json and cookies
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      const resp: any = { status: init?.status ?? 200, json: async () => body, cookies: { set: jest.fn() } };
      return resp;
    },
  },
}));

import { NextResponse } from "next/server";

// mocks for session and tasks
jest.mock("@/services/auth/session.service", () => ({
  requireSessionUserFromCookies: jest.fn(),
  getSessionCookieOptions: jest.fn(() => ({ name: "sess", cookieOptions: {path:"/"} })),
}));

jest.mock("@/services/tasks/task.service", () => ({
  taskService: {
    listTasks: jest.fn(),
    createTask: jest.fn(),
    toggleTaskCompletion: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

jest.mock("@/utils/http-response", () => ({
  toErrorResponse: jest.fn((err: any) => ({ status: 500, json: async () => ({ error: err.message || "error" }) })),
}));

const {
  requireSessionUserFromCookies,
  getSessionCookieOptions,
} = require("@/services/auth/session.service");
const { taskService } = require("@/services/tasks/task.service");
const { toErrorResponse } = require("@/utils/http-response");

// import route handlers lazily so mocks are applied
let logoutRoute: typeof import("@/app/api/logout/route");
let tasksRoute: typeof import("@/app/api/tasks/route");
let taskIdRoute: typeof import("@/app/api/tasks/[taskId]/route");

beforeAll(async () => {
  logoutRoute = await import("@/app/api/logout/route");
  tasksRoute = await import("@/app/api/tasks/route");
  taskIdRoute = await import("@/app/api/tasks/[taskId]/route");
});

describe("logout route", () => {
  it("returns success and clears cookie", async () => {
    const resp = await logoutRoute.POST();
    expect(resp.status).toBe(200);
    expect(resp.cookies.set).toHaveBeenCalled();
    // cookie options used
    expect(getSessionCookieOptions).toHaveBeenCalledWith({ maxAge: 0 });
  });
});

describe("tasks route", () => {
  beforeEach(() => jest.clearAllMocks());

  it("GET returns tasks when session valid", async () => {
    (requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "u1" });
    (taskService.listTasks as jest.Mock).mockResolvedValue([{ id: "t1" }]);

    const resp = await tasksRoute.GET();
    expect(resp.status).toBe(200);
    const data = await resp.json();
    expect(data.tasks).toEqual([{ id: "t1" }]);
  });

  it("GET returns error response when session fails", async () => {
    const err = new Error("nope");
    (requireSessionUserFromCookies as jest.Mock).mockRejectedValue(err);
    const resp = await tasksRoute.GET();
    expect(toErrorResponse).toHaveBeenCalledWith(err);
  });

  it("POST creates a task", async () => {
    (requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "u2" });
    (taskService.createTask as jest.Mock).mockResolvedValue({ id: "t2" });
    const request = new Request("/", { method: "POST", body: JSON.stringify({ title: "hey" }) });

    const resp = await tasksRoute.POST(request);
    expect(resp.status).toBe(201);
    const data = await resp.json();
    expect(data.task).toEqual({ id: "t2" });
  });
});

describe("taskId/[taskId] route", () => {
  beforeEach(() => jest.clearAllMocks());

  const context = { params: Promise.resolve({ taskId: "abc" }) };

  it("PATCH toggles completion when payload valid", async () => {
    (requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "u" });
    (taskService.toggleTaskCompletion as jest.Mock).mockResolvedValue({ id: "abc" });
    const req = new Request("/", { method: "PATCH", body: JSON.stringify({ completed: true }) });

    const resp = await taskIdRoute.PATCH(req, context);
    expect(resp.status).toBe(200);
    const data = await resp.json();
    expect(data.task).toEqual({ id: "abc" });
  });

  it("PATCH throws bad request for missing completed", async () => {
    (requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "u" });
    const req = new Request("/", { method: "PATCH", body: JSON.stringify({}) });
    const resp = await taskIdRoute.PATCH(req, context);
    expect(toErrorResponse).toHaveBeenCalled();
  });

  it("DELETE removes task", async () => {
    (requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "u" });
    (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
    const req = new Request("/", { method: "DELETE" });
    const resp = await taskIdRoute.DELETE(req, context);
    expect(resp.status).toBe(200);
    const data = await resp.json();
    expect(data.message).toMatch(/sucesso/);
  });
});
