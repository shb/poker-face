import pokerface from "..";

describe("basic HTTP methods", () => {
  const testBaseMethod = (method: string) => async () => {
    const server = pokerface();
    (server as any)[method]("/foo", () => [200, {}, '{"test":true}']);

    const res = await fetch("/foo", { method });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ test: true });

    server.shutdown();
  };

  test("DELETE request", testBaseMethod("delete"));
  test("GET request", testBaseMethod("get"));
  test("PATCH request", testBaseMethod("patch"));
  test("POST request", testBaseMethod("post"));
  test("PUT request", testBaseMethod("put"));

  test("shutdown", async () => {
    const pretender = pokerface();
    pretender.shutdown();
    expect(() => fetch("/foo")).rejects.toBeDefined();
  });
});
