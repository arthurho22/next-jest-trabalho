import "@testing-library/jest-dom";

class MockResponse {
  body: any;
  status: number;

  constructor(body: any, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status ?? 200;
  }

  async json() {
    return JSON.parse(this.body);
  }

  static json(data: any, init?: { status?: number }) {
    return new MockResponse(JSON.stringify(data), init);
  }
}

(global as any).Response = MockResponse;
(global as any).Request = class {
  body: any;

  constructor(_url: string, options: any) {
    this.body = options?.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};