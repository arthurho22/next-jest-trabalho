import {
  getFirestoreSettings,
  buildCollectionUrl,
  buildDocumentUrl,
  toFirestoreTaskFields,
  toFirestoreCompletionFields,
  parseInteger,
  fromFirestoreDocument,
  parseJsonSafe,
  throwIfNotOk,
  firestoreTaskRepository,
} from "@/services/tasks/task.repository";
import { AppError } from "@/utils/app-error";

// helper to create fake response objects
function makeResponse(body: any, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as any as Response;
}

describe("task.repository helpers", () => {
  beforeEach(() => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_WEB_API_KEY;
  });

  it("throws if settings missing", () => {
    expect(() => getFirestoreSettings()).toThrow(AppError);
    process.env.FIREBASE_PROJECT_ID = "p";
    expect(() => getFirestoreSettings()).toThrow(AppError);
    process.env.FIREBASE_WEB_API_KEY = "k";
    expect(getFirestoreSettings()).toEqual({ projectId: "p", apiKey: "k" });
  });

  it("build collection and document urls", () => {
    process.env.FIREBASE_PROJECT_ID = "proj";
    process.env.FIREBASE_WEB_API_KEY = "key";
    expect(buildCollectionUrl("user"))
      .toContain("projects/proj");
    expect(buildDocumentUrl("user","t"))
      .toContain("tasks/t");
  });

  it("converts fields and integers and documents", () => {
    const fields = toFirestoreTaskFields("hi", true);
    expect(fields.title.stringValue).toBe("hi");
    expect(fields.completed.booleanValue).toBe(true);
    expect(parseInteger(undefined)).toBe(0);
    expect(parseInteger({integerValue: "5"})).toBe(5);
    const doc = { name: "users/u/tasks/123", fields: { title: { stringValue: "x" } } };
    const task = fromFirestoreDocument(doc as any);
    expect(task.id).toBe("123");
  });

  it("parseJsonSafe handles bad json", async () => {
    const bad: any = { json: async () => { throw new Error("oops"); } };
    expect(await parseJsonSafe(bad)).toBeNull();
  });

  it("throwIfNotOk throws when not ok", () => {
    expect(() => throwIfNotOk({ ok: false, status: 400 } as any, "msg")).toThrow(AppError);
    expect(() => throwIfNotOk({ ok: true } as any, "msg")).not.toThrow();
  });
});

// minimal network-level testing of repository methods using global.fetch mock
describe("firestoreTaskRepository", () => {
  beforeEach(() => {
    process.env.FIREBASE_PROJECT_ID = "p";
    process.env.FIREBASE_WEB_API_KEY = "k";
    global.fetch = jest.fn();
  });

  it("listByUser returns tasks when 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(makeResponse({}, true, 404));
    const tasks = await firestoreTaskRepository.listByUser("u");
    expect(tasks).toEqual([]);
  });

  it("createForUser calls fetch and returns task", async () => {
    const doc = { name: "users/u/tasks/1", fields: { title: { stringValue: "t" } } };
    (global.fetch as jest.Mock).mockResolvedValue(makeResponse(doc, true));
    const t = await firestoreTaskRepository.createForUser("u", "t");
    expect(t.id).toBe("1");
  });

  it("updateCompletion returns task and handles error response", async () => {
    const doc = { name: "users/u/tasks/1", fields: { title: { stringValue: "t" } } };
    (global.fetch as jest.Mock).mockResolvedValueOnce(makeResponse(doc, true));
    const t = await firestoreTaskRepository.updateCompletion("u", "1", false);
    expect(t.id).toBe("1");

    (global.fetch as jest.Mock).mockResolvedValueOnce(makeResponse({}, false, 500));
    await expect(firestoreTaskRepository.updateCompletion("u","1",true)).rejects.toThrow(AppError);
  });

  it("deleteForUser handles error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(makeResponse({}, false, 500));
    await expect(firestoreTaskRepository.deleteForUser("u","1")).rejects.toThrow(AppError);
  });
});